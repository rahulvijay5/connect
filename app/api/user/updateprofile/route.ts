// File: app/api/user/updateprofile/route.ts
import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server"

export async function POST(req: NextRequest) {
    const { getUser } = getKindeServerSession()
    const user = await getUser()

    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { mobileNumber, interests, address } = await req.json()

    try {
        const updatedUser = await db.user.update({
            where: { externalId: user.id },
            data: {
                contactDetails: {
                    upsert: {
                        create: { phone: mobileNumber, address },
                        update: { phone: mobileNumber, address },
                    },
                },
                interests: interests.split(',').map((interest: string) => interest.trim()),
            },
        })

        return NextResponse.json(updatedUser)
    } catch (error) {
        console.error("Error updating user profile:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}