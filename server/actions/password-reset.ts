'use server'

import { ResetSchema } from "@/types/reset-schemaw"
import { eq } from "drizzle-orm"
import { createSafeActionClient } from "next-safe-action"
import { users } from "@/server/schema"
import { db } from "@/server/"
import { generatePasswordResetToken } from "@/server/actions/tokens"
import { sendPasswordResetEmail } from "@/server/actions/email"

const actionClient = createSafeActionClient()

export const reset = actionClient
    .inputSchema(ResetSchema)
    .action(async ({parsedInput:  {email} }) => {
        const existingUser = await db.query.users.findFirst({
            where: eq(users.email, email)
        })

        if (!existingUser) {
            return { error: "User not found" }
        }

        const passwordResetToken = await generatePasswordResetToken(email) 
        if (!passwordResetToken) {
            return { error: "Token not found"}
        }

        await sendPasswordResetEmail(passwordResetToken[0].email, passwordResetToken[0].token)

        return { success: "Password Reset Email sent!"}
    })