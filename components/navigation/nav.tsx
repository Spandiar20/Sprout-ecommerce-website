import { auth } from "@/server/auth"
import Logo from "@/components/navigation/logo"
import { UserButton } from "@/components/navigation/user-button"

export default async function Nav() {
    const session = await auth();


    return (
        <header>
            <nav>
                <ul className="flex justify-between p-2 bg-slate-500 text-white">
                    <li><Logo/></li>
                    <li><UserButton user={session?.user} expires={session?.expires!}/></li>
                </ul>
            </nav>
        </header>
    )
}