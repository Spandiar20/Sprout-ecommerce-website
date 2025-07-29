import { auth } from "@/server/auth"
import { redirect } from "next/navigation"
import { useForm } from "react-hook-form"
import ProductForm from "./productForm"



export default async function DashboardLayout() {

    const session = await auth()
    if (session?.user.role !== 'admin') redirect('/dashboard/settings')



    return (
        <div>
            <ProductForm />
        </div>
    )
}