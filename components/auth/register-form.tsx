'use client'
import { AuthCard } from "./auth-card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel,FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form"
import { zodResolver as resolver } from "@hookform/resolvers/zod"
import { RegisterSchema } from "@/types/register-schema"
import { useState } from "react"
import * as z from 'zod'
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useAction } from "next-safe-action/hooks"
import { cn } from "@/lib/utils"
import { emailRegister } from "@/server/actions/email-register"
import { FormError } from "@/components/auth/form-error"
import { FormSuccess } from "@/components/auth/form-success"

export const RegisterForm = () => {
    const form = useForm({
        resolver: resolver(RegisterSchema),
        defaultValues: {
            email: "",
            password: "",
            confirmPassword: "",
            name: ""
        }
    })

    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")
    const { execute, status } = useAction(emailRegister, {
        onSuccess: (data) => {
            if (data.data?.error) setError(data.data.error)
            if (data.data?.success) setSuccess(data.data.success)
        }
    })


    const onSubmit = (values: z.infer<typeof RegisterSchema>) => {
        execute(values)
    }

    return (
        <AuthCard cardTitle="Create an account💥" backButtonHref="/auth/login" backButtonLabel="already have an account?" showSocials>
            <div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <div>
                            <FormField
                                control={form.control}
                                name="name"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Username</FormLabel>
                                        <FormControl>
                                            <Input {...field} 
                                            placeholder="developedbysaman"
                                            type="text" />
                                        </FormControl>
                                        <FormDescription />
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
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
                                            autoComplete="email" />
                                        </FormControl>
                                        <FormDescription />
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
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
                                            autoComplete="current-password" />
                                        </FormControl>
                                        <FormDescription />
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="confirmPassword"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Confirm Password</FormLabel>
                                        <FormControl>
                                            <Input {...field} 
                                            placeholder="********"
                                            type="password" />
                                        </FormControl>
                                        <FormDescription />
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button size={"sm"} variant={"link"} asChild>
                                <Link href="/auth/reset">Forgot you password?</Link>
                            </Button>

                        </div>
                        <FormSuccess message={success}></FormSuccess>
                        <FormError message={error}></FormError>
                        <Button type={'submit'} className={cn("w-full my-2", status === 'executing' ? "animate-pules" : "")}>
                            Register
                        </Button>
                    </form>
                </Form>
            </div>
        </AuthCard>
    )
}