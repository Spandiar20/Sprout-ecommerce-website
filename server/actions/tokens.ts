'use server'
import { emailTokens, users } from "@/server/schema";
import { db } from "@/server";
import { eq } from "drizzle-orm";


export const getVerificationTokenByEmail = async (email: string) => {
    try {
        const verificationToken = await db.query.emailTokens.findFirst({
            where: eq(emailTokens.email, email)
        })
        return verificationToken
    } catch (error) {
        return null
    }
}

export const getVerificationToken = async (token: string) => {
    try {
        const verificationToken = await db.query.emailTokens.findFirst({
            where: eq(emailTokens.token, token)
        })
        return verificationToken
    } catch (error) {
        return null
    }
}

export const generateEmailVerificationToken = async (email: string) => {
    const token = crypto.randomUUID()
    const expires = new Date(Date.now() + 60 * 60 * 1000) // 1 hour from now

    const existingToken = await getVerificationTokenByEmail(email)

    if (existingToken) {
        await db.delete(emailTokens).where(eq(emailTokens.token, existingToken.token))
    }

    const verificationToken = await db.insert(emailTokens).values({
        token,
        email,
        expires,
    })
    .returning()
    return verificationToken;

}

export const newVerification = async (token: string) => {
    const existingToken = await getVerificationToken(token)
    if(!existingToken) return { error: "Token not found" }

    const hasExpired = new Date(existingToken.expires) < new Date()
    if (hasExpired) return { error: "Token has expired" }

    const existingUser = await db.query.users.findFirst({
        where: eq(users.email, existingToken.email)
    })

    if (!existingUser) return { error: "Email does not exist"}
    await db.update(users).set({
        emailVerified: new Date(),
        email: existingToken.email,
    }).where(eq(users.email, existingToken.email))

    console.log("Email verified for user:", existingUser.email)

    await db.delete(emailTokens).where(eq(emailTokens.id, existingToken.id))
    return { success: "Email verified"}
}