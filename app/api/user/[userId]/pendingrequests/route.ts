// File: app/api/user/[userId]/pendingrequests/route.ts
import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server"
import { searchUserByExternalId } from "@/actions/users/searchUsers"

export async function GET(
    req: NextRequest,
    { params }: { params: { userId: string } }
) {
    const { getUser } = getKindeServerSession()
    const user = await getUser()
    const userexists = await searchUserByExternalId(user?.id!)


    if (!user || userexists?.id !== params.userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    try {
        const pendingRequests = await db.request.findMany({
            where: {
                toUserId: params.userId,
                status: 'Pending',
            },
            include: {
                fromUser: {
                    select: {
                        given_name: true,
                        email: true,
                        username: true
                    },
                },
            },
        })

        return NextResponse.json(pendingRequests)
    } catch (error) {
        console.error("Error fetching pending requests:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}