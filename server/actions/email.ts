'use server'

import getBaseURL from "@/lib/base-url";
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
const domain = getBaseURL()

export const sendVerificationEmail = async (email: string, token: string) => {
    const confirmLink = `${domain}/auth/new-verification?token=${token}`

    const { data, error } = await resend.emails.send({
        from: "Acme <onboarding@resend.dev>",
        to: email,
        subject: "Sprout & Scrobble - Confirmation Email",
        html: `<p>Click the link below to confirm your email address:</p>
               <a href="${confirmLink}">Confirm Email</a>
               <p>If you did not request this, please ignore this email.</p>`,
    })
    if (error) return error
    if (data) return data
}

export const sendPasswordResetEmail = async (email: string, token: string) => {
    const confirmLink = `${domain}/auth/new-password?token=${token}`

    const { data, error } = await resend.emails.send({
        from: "Acme <onboarding@resend.dev>",
        to: email,
        subject: "Sprout & Scrobble - Reset you password",
        html: `<p>Click the link below to confirm your email address:</p>
               <a href="${confirmLink}">Confirm Email</a>
               <p>If you did not request this, please ignore this email.</p>`,
    })
    if (error) return error
    if (data) return data
}