'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from 'sonner'
import { Level } from '@prisma/client'
import { createUpdate } from '@/actions/updates/route'

export default function CreateUpdate() {
    const [content, setContent] = useState('')
    const [level, setLevel] = useState<Level>('known')
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        try {
            await createUpdate({ content, level })
            toast.success('Update posted successfully!')
            setContent('')
            setLevel('known')
        } catch (error) {
            toast.error('Failed to post update. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4 h-full">
            <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="What's your update of the day?"
                className="flex-grow p-2 h-full rounded-lg bg-inherit focus-visible:border-none focus:border-none focus:outline-none border-transparent focus:border-transparent focus:ring-0 break-words text-wrap  focus-visible:ring-0 focus-visible:outline-none focus-visible:ring-offset-0"
            />
            <div className="flex justify-end items-center gap-4">
                <Select value={level} onValueChange={(value: Level) => setLevel(value)}>
                    {/* <p className='text-sm'>Share with</p> */}
                    <SelectTrigger className="max-w-[100px] focus-visible:border-none focus:border-none focus:outline-none border-transparent focus:border-transparent focus:ring-0 focus-visible:ring-0 focus-visible:outline-none focus-visible:ring-offset-0">
                        <SelectValue placeholder="Share with" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="known">Known</SelectItem>
                        <SelectItem value="closer">Closer</SelectItem>
                        <SelectItem value="closest">Closest</SelectItem>
                    </SelectContent>
                </Select>
                <Button type="submit" disabled={isLoading || content.trim() === ''}>
                    {isLoading ? 'Posting...' : 'Post Update'}
                </Button>
            </div>
        </form>
    )
}