import path from "path"
import z from "zod"

export const SettingsSchema = z.object({
    name: z.optional(z.string()),
    image: z.optional(z.string()),
    isTwoFactorEnabled: z.optional(z.boolean()),
    email: z.optional(z.string().email()),
    password: z.optional(z.string().min(8, {message: "Password must be at least 8 characters long"})),
    newPassword: z.optional(z.string().min(8, {message: "Password must be at least 8 characters long"}))
  }).refine( data => {
    if ( data.password && data.newPassword ){
      return false
    }
    return true
  }, { message: "This password has been used before! Try a new one", path: ["newPassword"]})