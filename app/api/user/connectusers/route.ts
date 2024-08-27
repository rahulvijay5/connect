import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest, res: NextResponse) => {
  const { id1, id2 } = await req.json();
  try {
    const result = await connectUsers(id1, id2);
    return NextResponse.json({ message: result.message, result }, { status: result.status });
  } catch (error) {
    console.error("Error connecting users:", error);
    return NextResponse.json({ error: "Error connecting users" }, { status: 500 })
  }
};

async function connectUsers(id1: string, id2: string) {
  try {
    const existingConnection = await db.connection.findFirst({
      where: {
        userId: id1,
        connectedUserId: id2
      }
    });

    if (existingConnection) {
      return { message: "Connection already exists", status: 400 };
    }

    const newConnection = await db.connection.create({
      data: {
        user: { connect: { id: id1 } },
        connectedUser: { connect: { id: id2 } },
        level: "known",
        connectionStatus: "Pending"
      },
    });

    return { message: "Users connected successfully🎉", status: 200 };
  } catch (error) {
    console.error("Error connecting users:", error);
    throw error;
  }
}
