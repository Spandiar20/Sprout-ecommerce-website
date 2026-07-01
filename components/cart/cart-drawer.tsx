'use client'

import { userCartStore } from "@/lib/client-store"
import { ShoppingBag } from "lucide-react"
import { Drawer, DrawerContent, DrawerHeader, DrawerTrigger } from "../ui/drawer"
import { AnimatePresence, motion } from "framer-motion"

export default function CartDrawer() {
    const {cart} = userCartStore()
    return (
        <Drawer>
            <DrawerTrigger>
                <div className="relative px-2">
                    <AnimatePresence>
                        {cart.length > 0 && (
                            <motion.span className="flex items-center justify-center absolute -top-1 -right-0.5 w-4 h-4 dark:bg-primary bg-primary text-white text-xs font-bold rounded-full" animate={{scale: 1, opacity: 1}} initial={{opacity:0, scale:0}} exit={{scale:0}}>
                                {cart.length}
                            </motion.span>
                        )}
                    </AnimatePresence>
                    <ShoppingBag />
                </div>
            </DrawerTrigger>
            <DrawerContent>
                <DrawerHeader>
                    <h1>Cart Stuff</h1>
                </DrawerHeader>
            </DrawerContent>
        </Drawer>
    )
}