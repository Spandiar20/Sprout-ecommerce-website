'use client'

import { userCartStore } from "@/lib/client-store"
import { BadgeIcon, ShoppingBag } from "lucide-react"

export default function CartDrawer() {
    const {cart} = userCartStore()
    return (
        <div>
            <ShoppingBag />
        </div>
    )
}