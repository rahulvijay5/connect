// app/api/user/searchOneUser/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
    const { KindeId }: { KindeId: string } = await req.json();
    
    // Add validation for KindeId
    if (!KindeId) {
        return NextResponse.json({ error: "KindeId is required" }, { status: 400 });
    }

    try {
      const user = await db.user.findUnique({
        where: {
          externalId: KindeId
        },
        include: {
          contactDetails: true
        }
      });
      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }
      return NextResponse.json(user, { status: 200 });
    } catch (error) {
      console.error("Error searching for user:", error);
      return NextResponse.json({ error: "Error searching for user" }, { status: 500 });
    }
}