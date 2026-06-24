'use client'

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useSearchParams } from "next/navigation"
import { reviewSchema } from "@/types/reviews-schema"
import { Star } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAction } from "next-safe-action/hooks"
import { addReview } from "@/server/actions/add-review"
import { toast } from "sonner"

export default function ReviewsForm() {
    const params = useSearchParams()
    const productID = Number(params.get("productID"))

    const form = useForm<z.infer<typeof reviewSchema>>({
        resolver: zodResolver(reviewSchema),
        defaultValues: {
            rating: 0,
            comment: '',
            productID,
        }
    })

    const rating = form.watch("rating")

    const {execute, status} = useAction(addReview, {
        onSuccess({data}){
            if(data.error) toast.error(data.error)
            if(data.success) {
                toast.success("Review Added!")
                form.reset()
            }

        }
    })

    function onSubmit(values: z.infer<typeof reviewSchema>) {
        execute({
            comment: values.comment,
            rating: values.rating,
            productID,
        })
    }

    return(
        <Popover>
            <PopoverTrigger asChild>
                <Button className="font-medium w-full" variant={"secondary"}>
                    Leave a review
                </Button>
            </PopoverTrigger>
            <PopoverContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField control={form.control} name="comment" render={({field}) => (
                            <FormItem>
                                <FormLabel>Leave your review</FormLabel>
                                <FormControl>
                                    <Textarea placeholder="How would you describe this product" {...field}>

                                    </Textarea>
                                </FormControl>
                                <FormMessage></FormMessage>
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="rating" render={({field}) => (
                            <FormItem>
                                <FormLabel>Leave your rating</FormLabel>
                                <FormControl>
                                    <Input type="hidden" placeholder="Star Rating" {...field}/>
                                </FormControl>
                                <div className="flex">
                                    {[1,2,3,4,5].map((value) => {
                                        return(
                                            <motion.div key={value} className="relative cursor-pointer" whileTap={{ scale: 0.9}} whileHover={{ scale: 1.1 }}>
                                                <Star 
                                                    key={value} 
                                                    onClick={() => {
                                                        form.setValue("rating", value, {
                                                            shouldValidate: true,
                                                        })
                                                    }} 
                                                    className={cn("text-primary bg-transparent transition-all duration-300 ease-in-out", rating >= value ? "fill-primary" : "fill-muted")}
                                                    />
                                            </motion.div>
                                        )
                                    })}
                                </div>
                            </FormItem>
                        )} />

                        <Button className="w-full" type="submit" disabled={status === "executing"}>
                            {status === 'executing' ? "Adding Review...": 'Add Review'}
                        </Button>
                    </form>
                </Form>
            </PopoverContent>
        </Popover>
    )
}