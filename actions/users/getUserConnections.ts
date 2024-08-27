import { db } from "@/lib/db";

interface UserConnection {
  id: string;
  userId: string;
  connectedUserId: string;
  level: string;
  connectionStatus: string;
  createdAt: Date;
}

export const getUserConnections = async (
  userId: string
): Promise<UserConnection[]> => {
  try {
    const connections = await db.connection.findMany({
      where: {
        userId: userId,
        //   { connectedUserId: userId }, // Connections initiated by others where this user is connected
      },
    });

    return connections;
  } catch (error) {
    console.error("Error retrieving user connections:", error);
    throw error;
  }
};
