import { auth } from "@/server/auth"
import Logo from "@/components/navigation/logo"
import { UserButton } from "@/components/navigation/user-button"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { LogIn } from "lucide-react"

export default async function Nav() {
    const session = await auth();


    return (
        <header>
            <nav>
                <ul className="flex justify-between items-center bg-cyan-950 w-full py-4 px-12 text-white">
                    <li className="w-8">
                    <Link href={'/'} aria-label="sprout and scribble logo">
                        <Logo />
                    </Link>
                    </li>
                {!session ? (
                    <li>
                        <Button asChild>
                            <Link href='/auth/login'><LogIn size={16}/><span>Login</span> </Link>
                        </Button>
                    </li>
                ) : (
                    <li className="h-full w-fit"><UserButton user={session?.user} expires={session?.expires!}/></li>
                )}
                </ul>
            </nav>
        </header>
    )
}