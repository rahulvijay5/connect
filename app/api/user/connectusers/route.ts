// import { db } from "@/lib/db";
// import { NextRequest, NextResponse } from "next/server";

// export const POST = async (req: NextRequest, res: NextResponse) => {
//   const { id1, id2 } = await req.json();
//   try {
//     const result = await connectUsers(id1, id2);
//     return NextResponse.json({ message: result.message, result }, { status: result.status });
//   } catch (error) {
//     console.error("Error connecting users:", error);
//     return NextResponse.json({ error: "Error connecting users" }, { status: 500 })
//   }
// };

// async function connectUsers(id1: string, id2: string) {
//   try {
//     const existingConnection = await db.connection.findFirst({
//       where: {
//         userId: id1,
//         connectedUserId: id2
//       }
//     });

//     if (existingConnection) {
//       return { message: "Connection already exists", status: 400 };
//     }

//     const newConnection = await db.connection.create({
//       data: {
//         user: { connect: { id: id1 } },
//         connectedUser: { connect: { id: id2 } },
//         level: "known",
//         connectionStatus: "Pending"
//       },
//     });

//     return { message: "Users connected successfully🎉", status: 200 };
//   } catch (error) {
//     console.error("Error connecting users:", error);
//     throw error;
//   }
// }

// File: app/api/user/connectusers/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { db } from "@/lib/db";
import { searchUserByExternalId } from "@/actions/users/searchUsers";

export const POST = async (req: NextRequest) => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  const userexists = await searchUserByExternalId(user?.id!);
  const currentUserID = userexists?.id;

  if (!user || !user.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { toUserId, level }: { toUserId: string, level: 'known' | 'closer' | 'closest' } = await req.json();

  try {
    // Check if a request already exists
    const existingRequest = await db.request.findFirst({
      where: {
        fromUserId: currentUserID,
        toUserId: toUserId
      }
    });

    if (existingRequest) {
      return NextResponse.json({ error: "A connection request already exists between these users" }, { status: 400 });
    }

    // Create a new connection request
    const newRequest = await db.request.create({
      data: {
        fromUserId: currentUserID!,
        toUserId: toUserId,
        level: level,
        status: 'Pending'
      }
    });

    return NextResponse.json(newRequest, { status: 200 });
  } catch (error) {
    console.error("Error creating connection request:", error);
    return NextResponse.json({ error: "Error creating connection request" }, { status: 500 });
  }
};