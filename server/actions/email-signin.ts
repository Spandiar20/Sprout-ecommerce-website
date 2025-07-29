'use server'
import { createSafeActionClient } from "next-safe-action";
import { LoginSchema } from "@/types/login-schema";
import { eq } from "drizzle-orm";
import { db } from "@/server"
import { twoFactorTokens, users } from "@/server/schema";
import { generateEmailVerificationToken, GenerateTwoFactorToken, getTwoFactorTokenByEmail } from "./tokens";
import { sendTwoFactorTokenByEmail, sendVerificationEmail } from "./email";
import { signIn } from '../auth'
import { AuthError } from "next-auth";

// export const emailSignIn = actionClient.action( async ({email, password, code}) => {
    //     console.log("Email Sign In Action", {email, password, code});
    // })
    
const actionClient = createSafeActionClient();
export const emailSignIn = actionClient
      .inputSchema(LoginSchema).action(async ({ parsedInput: { email, password, code } }) => {
          try {
            const existingUser = await db.query.users.findFirst({
                where: eq(users.email, email)
            })
        
            if (existingUser?.email !== email){
                return { error: "Email not found"}
            }
        
            if (!existingUser?.emailVerified) {
                const verificationToken = await generateEmailVerificationToken(existingUser.email)
                await sendVerificationEmail(verificationToken[0].email, verificationToken[0].token)
                return {success: 'Confirmation Email sent'}
            }

            if (existingUser.emailVerified && existingUser.twoFactorEnabled) {
                if (code) {
                    const twoFactorToken = await getTwoFactorTokenByEmail(existingUser.email)
                    if(!twoFactorToken) return { error: "Invalid Token"}

                    if(twoFactorToken.token != code) return { error: "Invalid Token"}

                    const hasExpired = new Date(twoFactorToken.expires) < new Date()
                    if(hasExpired) return {error: "Token has expired"}

                    await db.delete(twoFactorTokens).where(eq(twoFactorTokens.id, twoFactorToken.id))

                    const existingConfirmation = await getTwoFactorTokenByEmail(existingUser.email)
                    if(existingConfirmation) await db.delete(twoFactorTokens).where(eq(twoFactorTokens.email, existingUser.email))
                        
                        
                } else {
                    const token = await GenerateTwoFactorToken(existingUser.email)
                    if(!token) {return {error: "Token not generated!"}}
                    await sendTwoFactorTokenByEmail(token[0].email , token[0].token)
                    return {twoFactor: "Two Factor Token Sent!"}
                        
                }
            }
        
            await signIn('credentials', {
                email,
                password,
                redirectTo: '/',
            })
        
            return {success: email}
          } catch (error) {
              if (error instanceof AuthError) {
                  switch (error.type) {
                    case 'CredentialsSignin':
                        return { error: 'Email or password is not entered correctly' }
                    case 'AccessDenied':
                          return { error: error.message }
                    case 'OAuthSignInError':
                        return { error: error.message }
                    default: 
                        return { error: "Something went wrong"}
                  }
          
              }
              throw error
          }
          
    })