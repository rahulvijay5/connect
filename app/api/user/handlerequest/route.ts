// File: app/api/user/handlerequest/route.ts
import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server"
import { searchUserByExternalId } from "@/actions/users/searchUsers"

export async function POST(req: NextRequest) {
    const { getUser } = getKindeServerSession()
    const user = await getUser()
    const userexists = await (searchUserByExternalId(user?.id!))

    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { requestId, action } = await req.json()

    try {
        const request = await db.request.findUnique({
            where: { id: requestId },
        })

        if (!request || request.toUserId !== userexists?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        if (action === 'accept') {
            await db.connection.create({
                data: {
                    userId: request.fromUserId,
                    connectedUserId: request.toUserId,
                    connectionStatus: 'Accepted',
                    level: request.level,
                },
            })
        }

        await db.request.update({
            where: { id: requestId },
            data: { status: action === 'accept' ? 'Accepted' : 'Rejected' },
        })

        return NextResponse.json({ message: `Request ${action}ed successfully` })
    } catch (error) {
        console.error(`Error ${action}ing request:`, error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}