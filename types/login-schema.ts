import * as z from "zod";



export const LoginSchema = z.object({
    email: z.string().email({
        message: "Invalid email address",
    }),
    password: z.string().min(5, {
        message: "Password is invalid my guy"
    }),
    code: z.optional(z.string()),
})