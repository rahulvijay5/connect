// File: app/api/user/cancelrequest/[requestId]/route.ts
import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server"

export async function DELETE(
    req: NextRequest,
    { params }: { params: { requestId: string } }
) {
    const { getUser } = getKindeServerSession()
    const user = await getUser()

    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    try {
        const request = await db.request.findUnique({
            where: { id: params.requestId },
        })

        if (!request || request.fromUserId !== user.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        await db.request.delete({
            where: { id: params.requestId },
        })

        return NextResponse.json({ message: "Request cancelled successfully" })
    } catch (error) {
        console.error("Error cancelling request:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}