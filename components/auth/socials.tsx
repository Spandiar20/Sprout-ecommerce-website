'use client'

import { Button } from "@/components/ui/button"
import { signIn } from "@/server/auth"

export default function Socials(){
    return(
        <div>
            <Button onClick={() => 
                signIn("github", {
                    redirect: false,
                    callbackUrl: "/",
                })
            }>Sign in with Github</Button>
        </div>
    )
}