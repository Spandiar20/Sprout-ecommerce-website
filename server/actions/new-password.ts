'use server'

import { createSafeActionClient } from "next-safe-action";
import { ResetSchema } from "@/types/reset-schema";
import { getPasswordResetToken } from "@/server/actions/tokens";
import { db } from "..";
import { eq } from "drizzle-orm";
import { passwordResetTokens, users } from "@/server/schema";
import { hashPassword } from "../auth";

const action = createSafeActionClient()

export const newPassword = action.inputSchema(ResetSchema).action(async ({parsedInput: { password, token } }) => {
    try {
        if (!token) {
            return { error: "Token is required" }
        }

        const existingToken = await getPasswordResetToken(token);
        if (!existingToken) {
            return { error: "Token not found" }
        }

        const hasExpired = new Date(existingToken.expires) < new Date();
        if (hasExpired) {
            return { error: "Token has expired" }
        }

        const existingUser = await db.query.users.findFirst({
            where: eq(users.email, passwordResetTokens.email)
        })
        if (!existingUser) {
            return { error: "User not found" }
        }

        const hashedPassword = hashPassword(password)

        await db.transaction(async (tx) => {
            await tx
                .update(users)
                .set({
                    password: hashedPassword,
                })
                .where(eq(users.id, existingUser.id))
            await tx.delete(passwordResetTokens).where(eq(passwordResetTokens.id, existingToken.id))
        })
        return { success: "Password updated"}

    } catch (error) {

    }
})