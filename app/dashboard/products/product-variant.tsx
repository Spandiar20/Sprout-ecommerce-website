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
import VariantImages from "./variant-images"
import { useAction } from "next-safe-action/hooks"
import { toast } from "sonner"
import { createVariant } from "@/server/actions/create-variant"
import { useEffect, useState } from "react"
import { deleteVariant } from "@/server/actions/delete-variant"

export default function ProductVariant({editMode, productID, variant, children}: {editMode: boolean, productID?: number, variant?: VariantsWithImagesTags, children: React.ReactNode}) {
    
    const [open, setOpen] = useState(false);

    const setEdit = () => {
        if(!editMode){
            form.reset()
            return
        }
        if(editMode && variant) {
            form.setValue('editMode', true)
            form.setValue('id', variant.id)
            form.setValue('color', variant.color)
            form.setValue('productID', variant.productID)
            form.setValue('productType', variant.productType)
            form.setValue("tags", variant.variantTags.map((tag) => tag.tag))
            form.setValue('variantImages', variant.variantImages.map((img) => ({
                name: img.name,
                size: img.size,
                url: img.url,
            })))
        }
    }

    useEffect(() => {
        setEdit()
    }, [])

    const {execute, status} = useAction(createVariant, {
        onExecute(){
            toast.loading("Applying changes...", {duration: 500})
            setOpen(false)
        },
        onSuccess(data){
            if(data?.data?.error) {
                toast.error(data.data.error)
            }
            if(data?.data?.success) {
                toast.success(data.data.success)
            }
        }
    })

    const variantAction = useAction(deleteVariant, {
        onExecute(){
            toast.loading("Deleting variant...", {duration: 500})
            setOpen(false)
        },
        onSuccess(data) {
            if(data?.data?.error) {
                toast.error(data.data.error)
            }
            if(data?.data?.success) {
                toast.success(data.data.success)
            }
        }
    })
    
    function onSubmit(values: z.infer<typeof VariantSchema>) {
        execute(values)
    }

    const form = useForm<z.infer<typeof VariantSchema>>({
        resolver: zodResolver(VariantSchema),
        defaultValues: {
            productID: productID,
            tags: [],
            variantImages: [],
            color: "#000000",
            id: undefined,
            productType: "Black Notebook",
        },
        
    })
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger>{children}</DialogTrigger>
            <DialogContent className="lg:max-w-screen-lg overflow-y-scroll max-h-[640px] rounded-md">
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
                        <VariantImages></VariantImages>

                        <div className="flex gap-4 align-center justify-center">
                            {editMode && variant && (
                            <Button disabled={variantAction.status === "executing"} type="button" variant={'destructive'} onClick={(e) => {
                                    e.preventDefault()
                                    variantAction.execute({id: variant.id})
                                }}>
                                Delete Variant
                            </Button>
                        )}
                        <Button disabled={status === 'executing' || !form.formState.isValid || !form.formState.isDirty} type="submit">{editMode ? "Update Variant" : "Create Variant"}</Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}