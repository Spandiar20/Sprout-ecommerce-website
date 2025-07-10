'use client'
import { AuthCard } from "./auth-card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel,FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form"
import { zodResolver as resolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import * as z from 'zod'
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useAction } from "next-safe-action/hooks"
import { cn } from "@/lib/utils"
import { FormSuccess } from "./form-success"
import { ResetSchema } from "@/types/reset-schemaw"
import { reset } from "@/server/actions/password-reset"
import { FormError } from "./form-error"

export const ResetForm = () => {
    const form = useForm<z.infer<typeof ResetSchema>>({
        resolver: resolver(ResetSchema),
        defaultValues: {
            email: '',
        }
    })

    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")
    const { execute, status } = useAction(reset, {
        onSuccess(data) {
            if(data?.data?.error) setError(data.data.error)
            if(data?.data?.success) setError(data.data.success)
        }
    })

    const onSubmit = (values: z.infer<typeof ResetSchema>) => {
        execute(values)
    }

    return (
        <AuthCard 
        cardTitle="Forgot your password?"
        backButtonHref="/auth/login" 
        backButtonLabel="Back to login" 
        showSocials>
            <div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <div>
                            <FormField
                                control={form.control}
                                name="email"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input {...field} 
                                            placeholder="developedbysaman@gmail.com"
                                            type="email"
                                            disabled={status === "executing"}
                                            autoComplete="email" />
                                        </FormControl>
                                        <FormDescription />
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormSuccess message={success}></FormSuccess>
                            <FormError message={error}></FormError>

                        </div>
                        <Button type={'submit'} className={cn("w-full my-2", status === 'executing' ? "animate-pules" : "")}>
                            {"Reset Password"}
                        </Button>
                    </form>
                </Form>
            </div>
        </AuthCard>
    )
}