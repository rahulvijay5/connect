import { db } from "@/lib/db";
import { Connection } from "@/lib/types";

export const getUserConnections = async (
  userId: string
): Promise<Connection[]> => {
  try {
    console.log("User Id in get user connections:", userId);
    const connections = await db.connection.findMany({
      where: {
        userId: userId,
      },
      include: {
        connectedUser: true
      }
    });

    return connections as Connection[];
  } catch (error) {
    console.error("Error retrieving user connections:", error);
    throw error;
  }
};