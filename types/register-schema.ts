import * as z from 'zod';

export const RegisterSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8, { message: "Password must be at least 8 characters long" }),
    confirmPassword: z.string().min(8, { message: "Confirm Password must be at least 8 characters long" }),
    name: z.string().min(4, { message: "Name must be at least 4 characters long" }),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",});