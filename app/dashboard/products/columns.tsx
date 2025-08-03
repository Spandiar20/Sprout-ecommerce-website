"use client"

import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Image from "next/image"

type ProductColumn = {
    title: string,
    price: number,
    image: string,
    variants: any,
    id: number,
}

export const columns: ColumnDef<ProductColumn>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
  },
  {
    accessorKey: 'title',
    header: 'Title',
  },
  {
    accessorKey: 'variants',
    header: 'Variants',
  },
  {
    accessorKey: 'price',
    header: 'Price',
    cell: ({ row }) => {
        const price = parseFloat(row.getValue("price"))
        const formatted = new Intl.NumberFormat("en-US", {
            currency: "USD",
            style: "currency",
        }).format(price)
        return <div className="font-medium text-xs">{formatted}</div>
    }
  },
  {
    accessorKey: 'image',
    header: 'Image',
    cell: ({ row }) => {
        const cellImage = row.getValue("image") as string
        const cellTitle = row.getValue("title") as string
        return(
            <div>
                <Image width={64} height={64} className="rounded-md" src={cellImage} alt={cellTitle}></Image>
            </div>
        )
    }
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
        const product = row.original
        return (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant={"ghost"} className="h-8 w-8 p-0">
                        <MoreHorizontal></MoreHorizontal>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem className="dark:focus:bg-primary/20 focus:bg-primary/20 cursor-pointer">Edit Product</DropdownMenuItem>
                    <DropdownMenuItem className="dark:focus:bg-destructive focus:bg-destructive/50 cursor-pointer">Delete Product</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        )
    }
  },

]