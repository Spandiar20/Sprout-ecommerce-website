'use client'
import * as z from "zod"
import { VariantsWithImagesTags } from "@/lib/infer-type"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { VariantSchema } from "@/types/variant-schema"
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
import { InputTags } from "./input-tags"


function onSubmit(values: z.infer<typeof VariantSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values)
}

export default function ProductVariant({editMode, productID, variant, children}: {editMode: boolean, productID?: number, variant?: VariantsWithImagesTags, children: React.ReactNode}) {
    const form = useForm<z.infer<typeof VariantSchema>>({
        resolver: zodResolver(VariantSchema),
        defaultValues: {
            tags: [],
            variantImages: [],
            color: "#000000",
            id: undefined,
            productType: "Black Notebook",
        },
        
    })
    return (
        <Dialog>
            <DialogTrigger>{children}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                <DialogTitle>{editMode ? 'Edit' : 'Create'} your variant</DialogTitle>
                <DialogDescription>
                    Manage your product variants here. you can add tags images and more.
                </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <FormField
                        control={form.control}
                        name="productType"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Variant Title</FormLabel>
                            <FormControl>
                                <Input placeholder="title" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        <FormField
                        control={form.control}
                        name="color"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Variant Color</FormLabel>
                            <FormControl>
                                <Input type="color" placeholder="color" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        <FormField
                        control={form.control}
                        name="tags"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Variant Tags</FormLabel>
                            <FormControl>
                                <InputTags {...field} onChange={(e) => field.onChange(e)}></InputTags>
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        {/* <VariantImages></VariantImages> */}

                        {editMode && variant && (
                            <Button type="button" onClick={(e) => {e.preventDefault()}}>
                                Delete Variant
                            </Button>
                        )}
                        <Button type="submit">{editMode ? "Update Variant" : "Create Variant"}</Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}