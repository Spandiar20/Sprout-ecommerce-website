'use server'

import { SettingsSchema } from "@/types/settings-schema"
import { createSafeActionClient } from 'next-safe-action'
import { db } from ".."
import { eq } from "drizzle-orm"
import { users } from "../schema"
import { auth, hashPassword, verifyPassword } from "../auth"
import bcrypt from "bcrypt"
import { revalidatePath } from "next/cache"

const safeAction = createSafeActionClient()

export const settings = safeAction.inputSchema(SettingsSchema).action(async (values) => {
    const user = await auth();

    if(!user) {
        return { error: "User not found"}
    }

    //checking if the session user is also in the database
    const dbUser = await db.query.users.findFirst({
        where: eq(users.id, user.user.id),
    })

    if(!dbUser) {
        return { error: "User not found"}
    }

    if (user.user.isOAuth) {
        values.parsedInput.email = undefined
        values.parsedInput.password = undefined
        values.parsedInput.newPassword = undefined
        values.parsedInput.isTwoFactorEnabled = undefined
    }

    if(values.parsedInput.password && values.parsedInput.newPassword && dbUser.password){
        const passwordMatch = verifyPassword(values.parsedInput.password, dbUser.password)
        if (!passwordMatch) {
            return { error: "Password does not match"}
        }

        const samePassword = verifyPassword(values.parsedInput.newPassword, dbUser.password)
        if (samePassword) {
            return { error: "This password is your current password"}
        }

        const hashedPassword = hashPassword(values.parsedInput.newPassword)
        values.parsedInput.password = hashedPassword
        values.parsedInput.newPassword = undefined
    }

    const updatedUser = await db.update(users).set({
        twoFactorEnabled: !values.parsedInput.isTwoFactorEnabled,
        name: values.parsedInput.name,
        email: values.parsedInput.email,
        password: values.parsedInput.password,
        image: values.parsedInput.image
    }).where(eq(users.id, dbUser.id))
    revalidatePath("/dashboard/settings")
    return { success: "Settings Updated"}
})