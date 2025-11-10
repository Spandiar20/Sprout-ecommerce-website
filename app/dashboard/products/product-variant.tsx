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

export default function ProductVariant({editMode, productID, variant, children}: {editMode: boolean, productID?: number, variant?: VariantsWithImagesTags, children: React.ReactNode}) {
    
    const {execute, status} = useAction(createVariant, {
        onExecute(){
            toast.loading("Applying changes...", {duration: 500})
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
    
    function onSubmit(values: z.infer<typeof VariantSchema>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        console.log("hey")
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
        <Dialog>
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