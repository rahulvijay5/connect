import { searchUsers } from "@/actions/users/searchUsers";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
    const { query }: { query: string } = await req.json();
  
    try {
      const users = await searchUsers(query);
      return NextResponse.json(users, { status: 200 });
    } catch (error) {
      console.error("Error searching for users:", error);
      return NextResponse.json({ error: "Error searching for users" }, { status: 500 });
    }
  };