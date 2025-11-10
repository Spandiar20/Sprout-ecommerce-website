'use client'

import { Session } from 'next-auth'
import { signOut } from 'next-auth/react'
import Image from 'next/image'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
  import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
  import { LogOut, Moon, Settings, Sun, Truck } from 'lucide-react'
  import { useTheme } from 'next-themes'
  import { Switch } from "@/components/ui/switch"
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export const UserButton = ({user} : Session) => {
    const { setTheme, theme } = useTheme();
    const [checked, setChecked] = useState(true)

    const router = useRouter();

    function useSwitchState() {
        switch (theme){
            case "dark": setChecked(true);
            case "light": setChecked(false);
            case "system": setChecked(false);
        }
    }
    
    
    if (user) {
        // useSwitchState();
        return (
            <div>
    
                <DropdownMenu modal={false}>
                <DropdownMenuTrigger>
                    <Avatar>
                    {user.image && (
                        <Image
                        src={user.image}
                        alt={user.name!}
                        fill={true}
                         />
                    )}
                    {!user.image && (
                        <AvatarFallback className='bg-primary/25'>
                            <div className='font-bold flex items-center justify-center'>
                            {user.name?.charAt(0).toUpperCase()}
                            </div>
                        </AvatarFallback>
                    )}
                    </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent className='w-64 p-6' align='end'>
                    <div className='mb-4 p-4 flex flex-col gap-2 items-center rounded-lg bg-primary/20'>
                        {user.image && (
                            <Image
                            src={user.image}
                            alt={user.name!}
                            // fill={true}
                            width={36}
                            height={36}
                            className='rounded-full'
                             />
                        )}
                        {!user.image && (
                        <div className='bg-primary/25'>
                            <div className='font-bold flex items-center justify-center'>
                            {user.name?.charAt(0).toUpperCase()}
                            </div>
                        </div>
                        )}
                        <p className='font-bold text-xs'
                        >{user.name}</p>
                        <span className='text-xs font-medium text-secondary-foreground'>{user.email}</span>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => {router.push("/dashboard/orders")}} className='group items-center flex font-medium cursor-pointer'>
                        <Truck className='group-hover:translate-x-1 transition-all duration-200'/>
                        My Orders
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => {router.push("/dashboard/settings")}} className='group items-center flex font-medium cursor-pointer'>
                        <Settings className='group-hover:rotate-90 transition-all duration-200 ease-in-out'></Settings>
                        Settings
                    </DropdownMenuItem>
                    <DropdownMenuItem className='group items-center flex font-medium cursor-pointer'>
                        {theme && (
                            <div onClick={(e) => e.stopPropagation()} className='flex items-center justify-between w-full'>
                            <div className='flex items-center gap-1'>
                                <div className='flex mr-5 relative gap-0.5 items-center'>
                                    <Sun className='group-hover:text-yellow-300 absolute dark:scale-0 dark:-rotate-90 transition-all duration-200'></Sun>
                                    <Moon className='group-hover:text-blue-900 absolute scale-0 dark:scale-100 transition-all duration-200'></Moon>
                                </div>
                                <p className='dark:text-blue-400 text-yellow-300 flex items-center gap-2 transition-all'>
                                    {theme[0].toUpperCase() + theme.slice(1)} Mode
                                </p>
                            </div>

                            <Switch className='scale-75' onCheckedChange={(e) => {
                                setChecked(prev => !prev)
                                if (e) setTheme("dark")
                                if (!e) setTheme("light")
                            }} checked={checked}
                            />
                        </div>
                        )}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => signOut()} className='group hover:bg-destructive/30 items-center flex font-medium cursor-pointer'>
                        <LogOut className='group-hover:scale-75 group-hover:text-destructive transition-all duration-200'></LogOut>
                        Sign out
                    </DropdownMenuItem>

                </DropdownMenuContent>
                </DropdownMenu>
                
            </div>
        )
    }
}