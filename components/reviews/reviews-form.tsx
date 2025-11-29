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

export default function ReviewsForm() {
    const params = useSearchParams()
    const productID = Number(params.get("productID"))

    const form = useForm<z.infer<typeof reviewSchema>>({
        resolver: zodResolver(reviewSchema),
        defaultValues: {
            rating: 0,
            comment: '',
        }
    })

    function onSubmit(values: z.infer<typeof reviewSchema>) {
        console.log(values)
    }

    return(
        <Popover>
            <PopoverTrigger>
                <div className="w-full">
                    <Button className="font-medium w-full" variant={"secondary"}>
                        Leave a review
                    </Button>
                </div>
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
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="comment" render={({field}) => (
                            <FormItem>
                                <FormLabel>Leave your rating</FormLabel>
                                <FormControl>
                                    <Input type="hidden" placeholder="Star Rating" {...field}/>
                                </FormControl>
                                <div className="flex">
                                    {[1,2,3,4,5].map((value) => {
                                        return(
                                            <motion.div key={value} className="relative cursor-pointer" whileTap={{ scale: 0.8}} whileHover={{ scale: 1.2 }}>
                                                <Star 
                                                    key={value} 
                                                    onClick={() => {
                                                        form.setValue("rating", value)
                                                    }} 
                                                    className={cn("text-primary bg-transparent transition-all duration-300 ease-in-out", form.getValues("rating") >= value ? "text-primary" : "text-muted")}
                                                    />
                                            </motion.div>
                                        )
                                    })}
                                </div>
                            </FormItem>
                        )} />

                        

                        <Button className="w-full" type="submit">
                            Add Review
                        </Button>
                    </form>
                </Form>
            </PopoverContent>
        </Popover>
    )
}