import { auth } from "@/server/auth"
import { redirect } from "next/navigation"
import { useForm } from "react-hook-form"



export default async function DashboardLayout() {

    const session = await auth()
    if (session?.user.role !== 'admin') redirect('/dashboard/settings')

    const form = useForm({
        defaultValues: {
            
        }
    })

    return (
        <div>
            
        </div>
    )
}