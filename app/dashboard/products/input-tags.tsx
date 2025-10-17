'use client'

import { Input, InputProps } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { Dispatch, forwardRef, SetStateAction, useState } from "react"
import { useFormContext } from "react-hook-form"
import {AnimatePresence, motion} from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { XIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

type InputTagsProps = InputProps & {
    value: string[]
    onChange: Dispatch<SetStateAction<string[]>>
}

export const InputTags = forwardRef<HTMLInputElement, InputTagsProps>(({ onChange, value, ...props },ref) => {
    const [pendingDataPoint, setPendingDataPoint] = useState("")
    const [focused, setFocused] = useState(false)

    function addPendingDataPoint() {
        if (pendingDataPoint) {
            const newDataPoints = new Set([...value, pendingDataPoint])
            onChange(Array.from(newDataPoints))
            setPendingDataPoint("")
        }
    }

    const { setFocus } = useFormContext()

    return (
        <div className={(cn('file:text-foreground min-h-[20px] placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input focused:outline-0 w-full min-w-0 rounded-md border bg-transparent text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm', focused ? "ring-offset-2 outline-none ring-ring ring-2" : "ring-offset-0 outline-none ring-ring ring-0"))} onClick={() => setFocus("tags")}>
            <motion.div className="rounded-md min-h-[2.5rem] p-2 gap-2 flex flex-wrap items-center">
                <AnimatePresence>
                    {value.map((tag) => (
                        <motion.div key={tag} animate={{ scale: 1 }} initial={{ scale: 0 }} exit={{ scale: 0 }}>

                            <Badge variant={"secondary"}>{tag}</Badge>
                            <button onClick={() => onChange(value.filter((i) => i !== tag))}>
                                <XIcon className="w-3 ml-2"></XIcon>
                            </button>

                        </motion.div>
                    ))}
                </AnimatePresence>
                <div className="flex">
                    <Input
                        className="focus-visible:border-transparent border-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                e.preventDefault()
                                addPendingDataPoint()
                            }
                            if (e.key === "Backspace" && !pendingDataPoint && value.length > 0) {
                                e.preventDefault()
                                const newValue = [...value];
                                newValue.pop()
                                onChange(newValue)
                            }
                        }}
                        value={pendingDataPoint}
                        onFocus={() => setFocused(true)}
                        onBlur={(e) => {setFocused(false)}}
                        onChange={(e) => setPendingDataPoint(e.target.value)}
                        {...props}
                        />
                </div>
            </motion.div>
        </div>
    )
})

InputTags.displayName = "InputTags"