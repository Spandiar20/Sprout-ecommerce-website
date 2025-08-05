"use client"

import { ColumnDef, Row } from "@tanstack/react-table"
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
import { deleteProduct } from "@/server/actions/delete-product"
import { useAction } from "next-safe-action/hooks"
import { toast } from "sonner"
import Link from "next/link"

type ProductColumn = {
    title: string,
    price: number,
    image: string,
    variants: any,
    id: number,
}

async function deleteProductWrapper(id: number) {
    const { data } = await deleteProduct({ id })

    if (!data) {
        return new Error("No data found")
    }
    if (data.error) {
        throw new Error(data.error)
    }
    if (data.success) {
        return data.success
    }
}

const ActionCell = ({ row }: { row: Row<ProductColumn> }) => {
    const { execute, status } = useAction(deleteProduct, {
        onSuccess: (data) => {
            if (data.data?.success) {
                toast.success(data.data?.success)
            }
            if (data.data?.error) {
                toast.error(data.data?.error)
            }
        },
        onExecute: () => {
            toast.loading("Deleting product...")
        },
        onError: (error) => {
            toast.error(`Error: ${error}`)
        }
    })
    const product = row.original
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant={"ghost"} className="h-8 w-8 p-0">
                    <MoreHorizontal></MoreHorizontal>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem className="dark:focus:bg-primary/20 focus:bg-primary/20 cursor-pointer"><Link href={`/dashboard/add-product?id=${product.id}`}>Edit Product</Link></DropdownMenuItem>
                <DropdownMenuItem onClick={() => execute({id: product.id})} className="dark:focus:bg-destructive focus:bg-destructive/50 cursor-pointer">Delete Product</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
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
    cell: ActionCell
    
  },

]