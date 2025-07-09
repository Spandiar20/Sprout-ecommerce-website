import { z } from 'zod'

export const ResetSchema = z.object({
    password: z.string().min(8, "Password must be at least 8 characters long"),
    token: z.string().nullable().optional(),
})