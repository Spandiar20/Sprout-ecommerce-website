'use client'

import { useForm } from "react-hook-form";
import { ProductSchema, zProductSchema } from "@/types/product-schema";
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
import Tiptap from "./tiptap";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateProduct } from "@/server/actions/create-product";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner"
import { getProduct } from "@/server/actions/get-product";
import { useEffect } from "react";

export default function ProductForm() {

    const form = useForm<zProductSchema>({
        resolver: zodResolver(ProductSchema),
        defaultValues: {
            title: '',
            description: '',
            price: 0
        },
        mode: 'onChange'
    })

    const router = useRouter();
    const searchParams = useSearchParams()
    const editMode = searchParams.get('id')

    const checkProduct = async (id: number) => {
        if (editMode) {
            const data = await getProduct(id)
            if(data.error) {
                toast.error(data.error)
                router.push('/dashboard/products') 
                return
            }
            if(data.success) {
                const id = parseInt(editMode)
                form.setValue("title", data.success.title)
                form.setValue("description", data.success.description)
                form.setValue("price", data.success.price)
                form.setValue("id", id)
            }
        }
    }

    useEffect(() => {
        if (editMode) {
            checkProduct(parseInt(editMode))
        }
    }, [])

    const { execute, status } = useAction(CreateProduct, {
        onSuccess: (data) => {
            if(data.data?.success) router.push('/dashboard/products')
            toast.success(data.data?.success || 'Product created successfully!')
            toast.dismiss()
        },
        onExecute: (data) => {
            if(editMode) {
                toast.loading("Updating product")
            }
            if(!editMode) {
                toast.loading("Creating product")
            }
        },
        onError: (error) => {
            console.log(error)
        }
    })

    async function onSubmit(values: zProductSchema) {
        execute(values)
    }

    return (
        <div className="">
            <Card>
                <CardHeader>
                    <CardTitle>{editMode ? <span>Edit Product</span> : <span>Create Product</span>}</CardTitle>
                    <CardDescription>{editMode ? 'Edit an existing product' : 'Add a new product'}</CardDescription>
                </CardHeader>
                <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel className="mb-1">Product Title</FormLabel>
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
                                <Tiptap val={field.value} />
                            </FormControl>
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
                        <Button disabled={status === 'executing' || !form.formState.isValid || !form.formState.isDirty} type="submit" className="font-bold w-full mt-4">{editMode ? 'Save changes' : 'Add product'}</Button>
                    </form>
                </Form>
                </CardContent>
            </Card>
        </div>
    )
}