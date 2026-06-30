import { auth } from "@/server/auth"
import Logo from "@/components/navigation/logo"
import { UserButton } from "@/components/navigation/user-button"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { LogIn } from "lucide-react"
import CartDrawer from "../cart/cart-drawer"

export default async function Nav() {
    const session = await auth();


    return (
        <header>
            <nav>
                <ul className="flex justify-between items-center border-b-2 w-full py-4 px-12 text-white md:gap-8 gap-4 md:flex-row ">
                    <li className=" flex flex-1">
                    <Link href={'/'} aria-label="sprout and scribble logo">
                        <Logo />
                    </Link>
                    </li>
                    <li className="relative flex items-center hover:bg-muted">
                        <CartDrawer></CartDrawer>
                    </li>
                {!session ? (
                    <li className="flex justify-center items-center">
                        <Button asChild>
                            <Link href='/auth/login'><LogIn size={16}/><span>Login</span> </Link>
                        </Button>
                    </li>
                ) : (
                    <li className="flex justify-center items-center"><UserButton user={session?.user} expires={session?.expires!}/></li>
                )}
                </ul>
            </nav>
        </header>
    )
}