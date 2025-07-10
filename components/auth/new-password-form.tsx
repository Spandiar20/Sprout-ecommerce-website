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
import { emailSignIn } from "@/server/actions/email-signin"
import { useAction } from "next-safe-action/hooks"
import { cn } from "@/lib/utils"
import { FormSuccess } from "./form-success"
import { ResetPasswordSchema } from "@/types/new-password-schema"
import { newPassword } from "@/server/actions/new-password"
import { useSearchParams } from "next/navigation"
import { FormError } from "./form-error"

export const NewPasswordForm = () => {
    const form = useForm<z.infer<typeof ResetPasswordSchema>>({
        resolver: resolver(ResetPasswordSchema),
        defaultValues: {
            password: '',
        }
    })

    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")
    const { execute, status } = useAction(newPassword, {
        onSuccess(data) {
            if(data?.data?.error) setError(data.data.error)
            if(data?.data?.success) setError(data.data.success)
        }
    })

    const searchParams = useSearchParams();
    const token = searchParams.get("token")

    const onSubmit = (values: z.infer<typeof ResetPasswordSchema>) => {
        execute({password: values.password, token})
    }

    return (
        <AuthCard cardTitle="Reset you password" backButtonHref="/auth/login" backButtonLabel="Back to login" showSocials>
            <div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <div>
                            <FormField
                                control={form.control}
                                name="password"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <Input {...field} 
                                            placeholder="********"
                                            type="password"
                                            disabled={status === "executing"}
                                            autoComplete="current-password" />
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