'use server'
import { createSafeActionClient } from "next-safe-action";
import { LoginSchema } from "@/types/login-schema";
import { eq } from "drizzle-orm";
import { db } from "@/server"
import { users } from "@/server/schema";

// export const emailSignIn = actionClient.action( async ({email, password, code}) => {
    //     console.log("Email Sign In Action", {email, password, code});
    // })
    
const actionClient = createSafeActionClient();
export const emailSignIn = actionClient
  .inputSchema(LoginSchema)
  .action(async ({ parsedInput: { email, password, code } }) => {
    const existingUser = await db.query.users.findFirst({
        where: eq(users.email, email)
    })

    if (existingUser?.email !== email){
        return { error: "Email not found"}
    }

    if (existingUser?.emailVerified) {
        
    }

    console.log("Email Sign In Action", { success: email });
      
})