// File: app/api/user/[userId]/sentrequests/route.ts
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
        const sentRequests = await db.request.findMany({
          where: {
            fromUserId: params.userId,
            status: {
              not: "Accepted", // Exclude requests with the status "Accepted"
            },
          },
          include: {
            toUser: {
              select: {
                given_name: true,
                email: true,
                username: true,
                profilePicture:true,
              },
            },
          },
        });
      
        return NextResponse.json(sentRequests);
      } catch (error) {
        console.error("Error fetching sent requests:", error);
        return NextResponse.json(
          { error: "Internal Server Error" },
          { status: 500 }
        );
      }
      
}