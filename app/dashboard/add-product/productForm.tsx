'use client'

import { useForm } from "react-hook-form";
import { zProductSchema } from "@/types/product-schema";
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
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
import { useAction } from "next-safe-action/hooks";
import { DollarSign } from "lucide-react";

export default function ProductForm() {

    const form = useForm<zProductSchema>({
        defaultValues: {
            title: '',
            description: '',
            price: 0
        }
    })

    // const onSubmit = useAction<(async (data))

    return (
        <div className="">
            <Card>
                <CardHeader>
                    <CardTitle>Card Title</CardTitle>
                    <CardDescription>Card Description</CardDescription>
                    {/* <CardAction>Card Action</CardAction> */}
                </CardHeader>
                <CardContent>
                <Form {...form}>
                    <form onSubmit={() => {console.log("Hello bitches")}} className="space-y-4">
                        <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Product Title</FormLabel>
                            <FormControl>
                                <Input placeholder="Darth Vader's light saber" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />

                        <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g This is the rarest item in the universe" {...field} />
                            </FormControl>
                            <FormDescription>
                                Explain your product details.
                            </FormDescription>
                            <FormMessage />
                            </FormItem>
                        )}
                        />

                        <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Price</FormLabel>
                            <FormControl>
                                <div className="flex items-center gap-2">
                                    <DollarSign
                                    size={36}
                                    className="p-2 bg-muted rounded-md" />
                                <Input {...field} type="number" placeholder="Your price in USD" step={"0.1"} min={0}/>

                                </div>
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        <Button type="submit" className="font-bold w-full mt-4">Add Product</Button>
                    </form>
                </Form>
                </CardContent>
                {/* <CardFooter>
                    <p>Card Footer</p>
                </CardFooter> */}
            </Card>
        </div>
    )
}