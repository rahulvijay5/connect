'use client'

import { useState, useEffect } from 'react'
import { getConnectionUpdates } from '@/actions/updates/route'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatDistanceToNow } from 'date-fns'
import { useInView } from 'react-intersection-observer'
import { Level, Update } from '@prisma/client'
import LinkPreview from '@/components/LinkPreview'

type LinkPreview = {
    url: string;
    title: string;
    description: string;
    image: string | null;
};

type EnrichedUpdate = Update & {
    linkPreviews: LinkPreview[];
    user: {
        given_name: string | null;
        family_name: string | null;
    };
};

type Connection = {
    id: string;
    userId: string;
    level: Level;
    user: {
        given_name: string | null;
        family_name: string | null;
    };
};

type ConnectionUpdatesProps = {
    connections: Connection[];
};

export default function ConnectionUpdates({ connections }: ConnectionUpdatesProps) {
    const [updates, setUpdates] = useState<Record<string, EnrichedUpdate[]>>({})
    const [page, setPage] = useState<Record<string, number>>({})
    const [ref, inView] = useInView()

    useEffect(() => {
        if (inView) {
            loadMoreUpdates()
        }
    }, [inView])

    const loadMoreUpdates = async () => {
        for (const connection of connections) {
            const newUpdates = await getConnectionUpdates(connection.userId, connection.level, page[connection.userId] || 1)
            setUpdates(prev => ({
                ...prev,
                [connection.userId]: [...(prev[connection.userId] || []), ...newUpdates]
            }))
            setPage(prev => ({
                ...prev,
                [connection.userId]: (prev[connection.userId] || 1) + 1
            }))
        }
    }

    return (
        <div className="space-y-8">
            {connections.map((connection) => (
                <div key={connection.id} className="mb-6">
                    <h3 className="text-lg font-medium mb-2">{connection.user.given_name}'s Updates</h3>
                    <div className="space-y-4">
                        {updates[connection.userId]?.map((update) => (
                            <Card key={update.id}>
                                <CardHeader>
                                    <CardTitle className="text-sm text-gray-500 flex justify-between">
                                        <span>{formatDistanceToNow(new Date(update.createdAt), { addSuffix: true })}</span>
                                        <Badge>{update.level}</Badge>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p>{renderContentWithLinks(update.content)}</p>
                                    {update.linkPreviews.map((preview, index) => (
                                        <LinkPreview key={index} preview={preview} />
                                    ))}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            ))}
            <div ref={ref}>
                {inView && <p>Loading more...</p>}
            </div>
        </div>
    )
}

function renderContentWithLinks(content: string) {
    const urlRegex = /(https?:\/\/[^\s]+)/g
    const parts = content.split(urlRegex)
    return parts.map((part, index) =>
        urlRegex.test(part) ? <a key={index} href={part} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{part}</a> : part
    )
}