'use client'

import { useState, useEffect } from 'react'
import { getMyUpdates } from '@/actions/updates/route'
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

export default function MyUpdates() {
    const [updates, setUpdates] = useState<EnrichedUpdate[]>([])
    const [page, setPage] = useState(1)
    const [ref, inView] = useInView()

    useEffect(() => {
        if (inView) {
            loadMoreUpdates()
        }
    }, [inView])

    const loadMoreUpdates = async () => {
        const newUpdates = await getMyUpdates(page)
        setUpdates([...updates, ...newUpdates])
        setPage(page + 1)
    }

    return (
        <div className="space-y-4">
            {updates.map((update) => (
                <Card key={update.id}>
                    <CardHeader className='p-2 px-4'>
                        <CardTitle className="text-sm text-gray-500 flex justify-between gap-4">
                            <span>{formatDistanceToNow(new Date(update.createdAt), { addSuffix: true })}</span>
                            <Badge className={update.level == "known" ? "bg-blue-200" : update.level == "closer" ? "bg-yellow-200/80" : "bg-green-200"}> Shared with{" "}{update.level}</Badge>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>{renderContentWithLinks(update.content)}</p>
                        {update.linkPreviews.map((preview, index) => (
                            <LinkPreview key={index} preview={preview} />
                        ))}
                    </CardContent>
                </Card>
            ))
            }
            <div ref={ref}>
                {inView && <p>Loading more...</p>}
            </div>
        </div >
    )
}

function renderContentWithLinks(content: string) {
    const urlRegex = /(https?:\/\/[^\s]+)/g
    const parts = content.split(urlRegex)
    return parts.map((part, index) =>
        urlRegex.test(part) ? <a key={index} href={part} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{part}</a> : part
    )
}