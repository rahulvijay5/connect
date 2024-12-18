// app/api/user-connections/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { getUserConnections } from "@/actions/users/getUserConnections";
import { searchUserByExternalId } from "@/actions/users/searchUsers";

export async function GET(req: NextRequest) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user || !user.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const dbUser = await searchUserByExternalId(user.id);
  if (!dbUser) {
    return NextResponse.json(
      { error: "Error in finding user from external Id." },
      { status: 500 }
    );
  }
  try {
    const connections = await getUserConnections(dbUser.id);
    return NextResponse.json(connections);
  } catch (error) {
    console.error("Error fetching user connections:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
