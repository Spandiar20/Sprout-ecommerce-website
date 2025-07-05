'use server'

import { RegisterSchema } from "@/types/register-schema";
import { createSafeActionClient } from "next-safe-action";
import { db } from "@/server";
import bcrypt from "bcrypt";
import { users } from "../schema";
import { eq } from "drizzle-orm";

const actionClient = createSafeActionClient()

export const emailRegister = actionClient
    .inputSchema(RegisterSchema)
    .action(async ({parsedInput : {email, password, name}}) => {
        const hashPassword = await bcrypt.hash(password, 10)
        console.log("Here's your fucking hashed password", hashPassword)
        const existingUser = await db.query.users.findFirst({
            where: eq(users.email, email)
        })

        if (existingUser) {
            return { error: "Email already exists" }
        }
        return {success: 'Hooray!'}
    })