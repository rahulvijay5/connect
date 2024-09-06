// File: components/SentRequests.tsx
'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import { Button } from "@/components/ui/button"
import Link from 'next/link'

interface Request {
    id: string
    toUser: {
        given_name: string
        email: string
        username: string
    }
    level: 'known' | 'closer' | 'closest'
    status: 'Pending' | 'Accepted' | 'Rejected'
}

interface Props {
    userId: string
}

const SentRequests: React.FC<Props> = ({ userId }) => {
    const [requests, setRequests] = useState<Request[]>([])

    useEffect(() => {
        const fetchSentRequests = async () => {
            try {
                const response = await axios.get(`/api/user/${userId}/sentrequests`)
                setRequests(response.data)
            } catch (error) {
                console.error('Error fetching sent requests:', error)
            }
        }

        fetchSentRequests()
    }, [userId])

    const cancelRequest = async (requestId: string) => {
        try {
            await axios.delete(`/api/user/cancelrequest/${requestId}`)
            setRequests(requests.filter(request => request.id !== requestId))
        } catch (error) {
            console.error('Error cancelling request:', error)
        }
    }

    return (
        <div className="space-y-4">
            <h2 className="text-xl font-semibold">Sent Requests</h2>
            {requests.length === 0 ? (
                <p>No sent requests.</p>
            ) : (
                <ul className="space-y-2">
                    {requests.map((request) => (
                        <li key={request.id} className="flex items-center justify-between p-2 border rounded">
                            <Link href={`/${request.toUser.username}`}>
                                <div>
                                    <p>{request.toUser.given_name} ({request.toUser.email})</p>
                                    <p className="text-sm text-gray-500">Level: {request.level}</p>
                                    <p className="text-sm text-gray-500">Status: {request.status}</p>
                                    <p className="text-sm text-gray-500">Username: {request.toUser.username}</p>
                                </div>
                            </Link>
                            <Button onClick={() => cancelRequest(request.id)} variant="destructive">
                                Cancel Request
                            </Button>
                        </li>
                    ))
                    }
                </ul >
            )
            }
        </div >
    )
}

export default SentRequests