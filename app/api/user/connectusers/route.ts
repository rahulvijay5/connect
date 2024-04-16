import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";


export const POST = async (req: NextRequest, res: NextResponse) => {
  const { id1, id2 } = await req.json();
  try {
    const result = await connectUsers(id1, id2);
    return NextResponse.json({ message: "Users connected successfully", result },{status:200});
  } catch (error) {
    console.error("Error connecting users:", error);
    // res.status(500).json({ error: "Error connecting users" });
    return NextResponse.json({error:"Error connecting users"},{status:500})
  }
};

async function connectUsers(id1: string, id2: string) {
  try {
    const existingConnection = await db.connection.findFirst({
        where:{
            userId: id1,
            connectedUserId: id2
          }
      });
  
      if (existingConnection) {
        return NextResponse.json({ message: "Connection already exists" }, { status: 400 });
      }


    const user1 = await db.user.findUnique({
      where: { id: id1 },
    //   include: { connectionsFrom: true },
    });
    const user2 = await db.user.findUnique({
      where: { id: id2 },
    //   include: { connectionsTo: true },
    });

    if (!user1 || !user2) {
      throw new Error("One or both users not found");
    }

    const newConnection = await db.connection.create({
      data: {
        user: { connect: { id: id1 } },
        connectedUser: { connect: { id: id2 } },
        level: "known",
      },
    });

    const updatedUser1 = await db.user.update({
      where: { id: id1 },
      data: { connectionsTo: { connect: { id: newConnection.id } } },
    });

    const updatedUser2 = await db.user.update({
      where: { id: id2 },
      data: { connectionsFrom: { connect: { id: newConnection.id } } },
    });

    return NextResponse.json({ user1: updatedUser1, user2: updatedUser2 },{ status: 200 });
    // return { user1: updatedUser1, user2: updatedUser2 };
  } catch (error) {
    console.log(error)
    console.error("Tried to conect but got error:", error);
    throw error;
  }
}
