import { NextRequest, NextResponse } from "next/server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { db } from "@/lib/db";
import { searchUserByExternalId } from "@/actions/users/searchUsers";

export async function POST(req: NextRequest) {
    console.log("I got heree")
    const { getUser } = getKindeServerSession();
    const user = await getUser();
    const userexists = await searchUserByExternalId(user?.id!)

    if (!user || !user.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { toUserId } = await req.json();
    console.log(toUserId)

    try {
        // Delete the connection
        await db.connection.deleteMany({
            where: {
                userId: userexists?.id,
                connectedUserId: toUserId
            },
        });

        // Delete any pending requests
        await db.request.deleteMany({
            where: {
                fromUserId: userexists?.id,
                toUserId: toUserId
            }
        });

        return NextResponse.json({ message: "Disconnected successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error disconnecting users:", error);
        return NextResponse.json({ error: "Error disconnecting users" }, { status: 500 });
    }
}