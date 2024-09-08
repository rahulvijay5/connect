// app/updates/[userId]/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useInView } from 'react-intersection-observer'
import { getUserUpdates } from '@/actions/updates/route'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatDistanceToNow } from 'date-fns'

type Update = {
    id: string
    content: string
    createdAt: Date
    level: 'known' | 'closer' | 'closest'
    user: {
        given_name: string | null
        family_name: string | null
    }
}

export default function UserUpdatesPage({ params }: { params: { username: string } }) {
    const [updates, setUpdates] = useState<Update[]>([])
    const [page, setPage] = useState(1)
    const [loading, setLoading] = useState(false)
    const [hasMore, setHasMore] = useState(true)
    const { ref, inView } = useInView()

    const loadUpdates = async () => {
        if (loading || !hasMore) return
        setLoading(true)
        try {
            const newUpdates = await getUserUpdates(params.username, page)
            if (newUpdates.length === 0) {
                setHasMore(false)
            } else {
                setUpdates((prevUpdates) => [...prevUpdates, ...newUpdates])
                setPage((prevPage) => prevPage + 1)
            }
        } catch (error) {
            console.error('Error loading updates:', error)
        }
        setLoading(false)
    }

    useEffect(() => {
        loadUpdates()
    }, [])

    useEffect(() => {
        if (inView) {
            loadUpdates()
        }
    }, [inView])

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">User Updates</h1>
            <div className="space-y-4">
                {updates.map((update) => (
                    <Card key={update.id} className="bg-white dark:bg-gray-800">
                        <CardHeader>
                            <CardTitle className="text-sm text-gray-500 flex justify-between items-center">
                                <span>{update.user.given_name} {update.user.family_name}</span>
                                <Badge>{update.level}</Badge>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm whitespace-pre-wrap">{update.content}</p>
                            <p className="text-xs text-gray-500 mt-2">
                                {formatDistanceToNow(new Date(update.createdAt), { addSuffix: true })}
                            </p>
                        </CardContent>
                    </Card>
                ))}
                {loading && <p>Loading more updates...</p>}
                {!hasMore && <p>No more updates to load.</p>}
                <div ref={ref} />
            </div>
        </div>
    )
}