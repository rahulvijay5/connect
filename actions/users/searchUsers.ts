import { db } from "@/lib/db";

export const searchUserByExternalId = async (query: string) => {
  try {
    const user = await db.user.findUnique({
      where: {
        externalId: query
      }
    });
    console.log(user)
    return user
  } catch (error) {
    console.error("Error searching for user.", error);
    throw new Error("Error searching for users");
  }
};

export const searchUserByUsername = async (query: string) => {
  try {
    const user = await db.user.findUnique({
      where: {
        username: query
      }
    });
    return user;
  } catch (error) {
    console.error("Error searching for user.", error);
    throw new Error("Error searching for users");
  }
};

export const searchUsers = async (query: string) => {
  try {
    const users = await db.user.findMany({
      where: {
        OR: [
          { email: { contains: query, mode: 'insensitive' } },
          { given_name: { contains: query, mode: 'insensitive' } },
          { username: { contains: query, mode: 'insensitive' } }
        ]
      }
    });
    return users;
  } catch (error) {
    console.error("Error searching for users:", error);
    throw new Error("Error searching for users");
  }
};