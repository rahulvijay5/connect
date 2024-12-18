// app/api/ai-search/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { searchUserByExternalId } from "@/actions/users/searchUsers";

export async function POST(req: NextRequest) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user || !user.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const dbuser = await searchUserByExternalId(user.id);

  if (!dbuser || !dbuser.id) {
    return NextResponse.json(
      { error: "User not found in DB" },
      { status: 401 }
    );
  }

  const body = await req.json();
  const { query, connectionLevels, connectionUserIds } = body;

  console.log("Connection User IDs:", connectionUserIds);
  console.log("Connection Levels:", connectionLevels);

  try {
    const response = await fetch(
      `${process.env.PUBLIC_WORKER_URL}/api/search`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.WORKER_API_SECRET}`,
        },
        body: JSON.stringify({
          query,
          userId: dbuser.id,
          connectionLevels,
          connectionUserIds,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error during AI search:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
