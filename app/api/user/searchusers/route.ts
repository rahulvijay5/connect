// File: app/api/user/searchusers/route.ts
import { searchUsers } from "@/actions/users/searchUsers";
import { NextRequest, NextResponse } from "next/server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export const POST = async (req: NextRequest) => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user || !user.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { query }: { query: string } = await req.json();
  try {
    const users = await searchUsers(query, user.id);
    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    console.error("Error searching for users:", error);
    return NextResponse.json({ error: "Error searching for users" }, { status: 500 });
  }
};