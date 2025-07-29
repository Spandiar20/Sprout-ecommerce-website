'use client'

import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link';
import { usePathname } from "next/navigation";
import { JSX } from 'react';

export default function DashboardNav({allLinks} : {allLinks: {label: string, path: string, icon: JSX.Element}[]}){

    const pathName = usePathname()

    return (
        <nav className=" pt-8 overflow-auto px-5">
                <AnimatePresence>
                    <ul className="flex justify-evenly gap-5 text-xs font-bold">
                        {allLinks.map((link) => (
                            <motion.li  key={link.path} whileTap={{ scale: 0.95 }}> 
                                <Link className={cn("flex flex-col items-center justify-center relative pb-2", 
                                        pathName === link.path ? "text-primary/90"
                                        : null)
                                    } href={link.path}>
                                    
                                    {link.icon}
                                    {link.label}
                                    {pathName === link.path ? (
                                        <motion.div className='h-[3px] w-full rounded-full absolute bg-primary z-0 left-0 bottom-0' 
                                        initial={{scale: 0.5}}
                                        animate={{scale: 1}}
                                        layoutId="underline"
                                        transition={{type: 'tween', stiffness: 100}}
                                         />
                                    ): null}
                                </Link>
                            </motion.li>
                        ))}
                    </ul>
                </AnimatePresence>
            </nav>
    )
}