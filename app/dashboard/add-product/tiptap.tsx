'use client'

import { Toggle } from '@/components/ui/toggle'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { Bold, Italic, List, ListOrdered, Strikethrough } from 'lucide-react'
import { Placeholder } from '@tiptap/extension-placeholder'
import { useFormContext } from 'react-hook-form'

const Tiptap = ({ val } : { val : string }) => {
  const { setValue } = useFormContext();
  const editor = useEditor({
    extensions: [
        Placeholder.configure({
            placeholder: "Add a longer description of your product here...",
            emptyNodeClass: 'first:before:text-gray-600 first:before:float-left first:before:content-[attr(data-placeholder)] first:before:pointer-events-none'
        }),
        StarterKit.configure({
            orderedList: {
                HTMLAttributes: {
                    class: "list-decimal pl-4"
                }
            },
            bulletList: {
                HTMLAttributes: {
                    class: "list-disc pl-4"
                }
            }
        })
    ],
    onUpdate: ({ editor }) => {
        const content = editor.getHTML()
        setValue('description', content,{
            shouldValidate: true,
            shouldDirty: true
        } 
        )
    },
    editorProps: {
        attributes: {
            class: 'file:text-foreground min-h-[80px] placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
        },
    },
    content: val,
    // Don't render immediately on the server to avoid SSR issues
    immediatelyRender: false,
  })

  return (
    <div className='flex flex-col gap-2'>
        {editor && (
            <div className='flex border border-input rounded-md'>
                <Toggle pressed={editor.isActive("bold")} onPressedChange={() => editor.chain().focus().toggleBold().run()} size={'sm'}>
                    <Bold className='w-4 h-4'/>
                </Toggle>
                <Toggle pressed={editor.isActive("italic")} onPressedChange={() => editor.chain().focus().toggleItalic().run()} size={'sm'}>
                    <Italic className='w-4 h-4'/>
                </Toggle>
                <Toggle pressed={editor.isActive("strike")} onPressedChange={() => editor.chain().focus().toggleStrike().run()} size={'sm'}>
                    <Strikethrough className='w-4 h-4'/>
                </Toggle>
                <Toggle pressed={editor.isActive("orderedList")} onPressedChange={() => editor.chain().focus().toggleOrderedList().run()} size={'sm'}>
                    <ListOrdered className='w-4 h-4'/>
                </Toggle>
                <Toggle pressed={editor.isActive("bulletList")} onPressedChange={() => editor.chain().focus().toggleBulletList().run()} size={'sm'}>
                    <List className='w-4 h-4'/>
                </Toggle>
            </div>
        )}
        <EditorContent editor={editor} />
    </div>
  )
}

export default Tiptap

function useFormContent(): { setValue: any } {
    throw new Error('Function not implemented.')
}
