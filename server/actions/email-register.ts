'use server'

import { RegisterSchema } from "@/types/register-schema";
import { createSafeActionClient } from "next-safe-action";
import { db } from "@/server";
import bcrypt from "bcrypt";
import { users } from "../schema";
import { eq } from "drizzle-orm";
import { generateEmailVerificationToken } from "./tokens";
import { sendVerificationEmail } from "@/server/actions/email";
import { hashPassword } from "../auth";

const actionClient = createSafeActionClient()

export const emailRegister = actionClient
    .inputSchema(RegisterSchema)
    .action(async ({parsedInput : {email, password, name}}) => {
        const hashedPassword = hashPassword(password)
        const existingUser = await db.query.users.findFirst({
            where: eq(users.email, email)
        })

        if (existingUser) {
            if (!existingUser.emailVerified) {
                const verificationToken = await generateEmailVerificationToken(email)
                await sendVerificationEmail(verificationToken[0].email, verificationToken[0].token); // Implement your email sending login here

                return { success: 'Email confirmation resent'}
            }
            return {error: "Email already in use"}
        }
        

        await db.insert(users).values({
            email,
            name,
            password: hashedPassword,
        })

        const verificationToken = await generateEmailVerificationToken(email)

        await sendVerificationEmail(verificationToken[0].email, verificationToken[0].token)
        return { success: "Confirmation Email sent"}
    })