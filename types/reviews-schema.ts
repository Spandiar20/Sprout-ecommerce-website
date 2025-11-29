import * as z from "zod";


export const reviewSchema = z.object({
    rating: z.number().min(1, {message: "Please at least add 1 star."}).max(5, {message: "You can't add more than 5 starts"}),
    comment: z.string().min(10, {message: "Please add at least 10 characters."})
})