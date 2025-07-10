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

export const UserButton = ({user} : Session) => {
    if (user) {
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
                            fill={true}
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
                    <DropdownMenuItem className='group items-center flex font-medium cursor-pointer transition-all duration-300'>
                        <Truck className='group-hover:translate-x-1 transition-all duration-200'/>
                        My Orders
                    </DropdownMenuItem>
                    <DropdownMenuItem className='group items-center flex font-medium cursor-pointer transition-all duration-300'>
                        <Settings className='group-hover:rotate-90 transition-all duration-200 ease-in-out'></Settings>
                        Settings
                    </DropdownMenuItem>
                    <DropdownMenuItem className='group items-center flex font-medium cursor-pointer transition-all duration-300'>
                        <div className='flex items-center'>
                            <Sun className='group-hover:translate-x-1 transition-all duration-200'></Sun>
                            <Moon className='group-hover:translate-x-1 transition-all duration-200'></Moon>
                            <p>
                                Theme <span>theme</span>
                            </p>
                        </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => signOut()} className='group hover:bg-destructive/30 items-center flex font-medium cursor-pointer transition-all duration-300'>
                        <LogOut className='group-hover:scale-75 group-hover:text-destructive transition-all duration-200'></LogOut>
                        Sign out
                    </DropdownMenuItem>

                </DropdownMenuContent>
                </DropdownMenu>
                
            </div>
        )
    }
}