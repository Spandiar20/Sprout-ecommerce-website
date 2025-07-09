// import bcrypt from 'bcrypt';/
import { scryptSync, randomBytes } from "crypto";
import NextAuth from "next-auth"
import { DrizzleAdapter } from "@auth/drizzle-adapter"
import { db } from "@/server"
import Google from "next-auth/providers/google"
import GitHub from "next-auth/providers/github"
import Credentials from "next-auth/providers/credentials"
import { LoginSchema } from "@/types/login-schema"
import { eq } from "drizzle-orm"
import { users } from "./schema"

export function hashPassword(password: string): string {
  const salt = randomBytes(10).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, storedHash: string): boolean {
  const [salt, originalHash] = storedHash.split(":");
  if (!salt || !originalHash) return false;
  const hash = scryptSync(password, salt, 64).toString("hex");
  return hash === originalHash;
}
 
export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(db),
  secret: process.env.AUTH_SECRET,
  session: { strategy: "jwt", },
  providers: [
    // Google({
    //     clientId: process.env.GOOGLE_CLIENT_ID!,
    //     clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    // }),
    GitHub({
        clientId: process.env.GITHUB_CLIENT_ID!,
        clientSecret: process.env.GITHUB_CLIENT_SECRET!,
        allowDangerousEmailAccountLinking: true,
    }),
    Credentials({
      authorize: async (credentials) => {
        const validationFields = LoginSchema.safeParse(credentials)

        if(validationFields.success) {

          const { email, password } = validationFields.data

          const user = await db.query.users.findFirst({
            where: eq(users.email, email)
          })
          if (!user || !user.password) return null
          const passwordsMatch = verifyPassword(password, user.password)
          if (passwordsMatch) return user
        }

        return null
      }
    })
  ],
})