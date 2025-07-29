'use client'
import { AuthCard } from "./auth-card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel,FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form"
import { zodResolver as resolver } from "@hookform/resolvers/zod"
import { LoginSchema } from "@/types/login-schema"
import { useState } from "react"
import * as z from 'zod'
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { emailSignIn } from "@/server/actions/email-signin"
import { useAction } from "next-safe-action/hooks"
import { cn } from "@/lib/utils"
import { FormSuccess } from "./form-success"
import { FormError } from "./form-error"
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
  } from "@/components/ui/input-otp"

export const LoginForm = () => {
    const form = useForm<z.infer<typeof LoginSchema>>({
        resolver: resolver(LoginSchema),
        defaultValues: {
            email: '',
            password: '',
            code: '',
        }
    })

    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")
    const [showTwoFactor, setShowTwoFactor] = useState(false)
    const { execute, status } = useAction(emailSignIn, {
        onSuccess(data) {
            if(data?.data?.error) setError(data.data.error)
            if(data?.data?.success) setError(data.data.success)
            if(data?.data?.twoFactor) setShowTwoFactor(true)
        }
    })

    const onSubmit = (values: z.infer<typeof LoginSchema>) => {
        execute(values)
    }

    return (
        <AuthCard cardTitle="Welcome back!" backButtonHref="/auth/register" backButtonLabel="Create a new account" showSocials>
            <div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <div>
                            {showTwoFactor && (<FormField
                                control={form.control}
                                name="code"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Two-Factor-Authentication Code</FormLabel>
                                        <FormControl>
                                            <InputOTP
                                            maxLength={6}
                                            disabled={status === 'executing'}
                                            {...field}
                                            >
                                                <InputOTPGroup>
                                                    <InputOTPSlot index={0} />
                                                    <InputOTPSlot index={1} />
                                                    <InputOTPSlot index={2} />
                                                </InputOTPGroup>
                                                <InputOTPSeparator />
                                                <InputOTPGroup>
                                                    <InputOTPSlot index={3} />
                                                    <InputOTPSlot index={4} />
                                                    <InputOTPSlot index={5} />
                                                </InputOTPGroup>
                                            </InputOTP>
                                        </FormControl>
                                        <FormDescription />
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />)}
                            {!showTwoFactor && (
                                <>
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
                                </>
                            )}
                            
                            <FormSuccess message={success}></FormSuccess>
                            <FormError message={error}></FormError>
                            <Button size={"sm"} variant={"link"} asChild>
                                <Link href="/auth/reset">Forgot you password?</Link>
                            </Button>

                        </div>
                        <Button type={'submit'} className={cn("w-full my-2", status === 'executing' ? "animate-pules" : "")}>
                            {showTwoFactor ? "Verify" : "Sign In"}
                        </Button>
                    </form>
                </Form>
            </div>
        </AuthCard>
    )
}