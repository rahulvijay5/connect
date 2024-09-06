import { getUpdates } from "@/actions/updates/route"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatDistanceToNow } from 'date-fns'

interface DisplayUpdatesProps {
    userId: string
    connectionLevel: 'known' | 'closer' | 'closest'
}

export default async function DisplayUpdates({ userId, connectionLevel }: DisplayUpdatesProps) {
    const updates = await getUpdates(userId, connectionLevel)

    return (
        <div className="space-y-4">
            {updates.map((update) => (
                <Card key={update.id}>
                    <CardHeader>
                        <CardTitle className="text-sm text-gray-500">
                            {formatDistanceToNow(new Date(update.createdAt), { addSuffix: true })}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>{update.content}</p>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}