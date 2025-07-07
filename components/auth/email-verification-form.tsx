'use client'

import { newVerification } from "@/server/actions/tokens"
import { useSearchParams } from "next/navigation"
import { useRouter } from "next/navigation"
import { useCallback, useEffect, useState } from "react"
import { AuthCard } from "@/components/auth/auth-card"
import { FormSuccess } from "@/components/auth/form-success"
import { FormError } from "@/components/auth/form-error"


export const EmailVerificationForm = () => {
    const token = useSearchParams().get('token')
    const router = useRouter()

    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const handleVerification = useCallback(() => {
        (async () => {
            if (success || error) return
            if (!token) {
                setError('Token is required')
                return
            }
            newVerification(token).then((data) => {
                if (data.error) {
                    setError(data.error)
                }
                if(data.success) {
                    setSuccess(data.success)
                    router.push("/auth/login")
                }
            })
        })()
    }, []) 
        
    useEffect(() => {
        handleVerification()
    }, [])

    return <AuthCard backButtonLabel="Back to Login" backButtonHref="/auth/login" cardTitle="Verify your account">
        <div className="flex items-center justify-center flex-col w-full">
            <p>{!success && !error ? 'Verifying email...' : null}</p>
            <FormSuccess message={success}></FormSuccess>
            <FormError message={error}></FormError>
        </div>
    </AuthCard>
}