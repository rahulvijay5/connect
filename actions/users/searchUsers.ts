// File: actions/users/searchUsers.ts
import { db } from "@/lib/db";

export const searchUserByExternalId = async (query: string) => {
  try {
    const user = await db.user.findUnique({
      where: {
        externalId: query
      },
      include: {
        contactDetails: true
      }
    });
    console.log(user)
    return user
  } catch (error) {
    console.error("Error searching for user.", error);
    throw new Error("Error searching for users");
  }
};

export const searchUserByUsername = async (username: string) => {
  try {
    const user = await db.user.findUnique({
      where: {
        username: username
      },
      include: {
        socialLinks: true,
        connectionsFrom: true,
        connectionsTo: true,
        contactDetails: true
      }
    });
    return user;
  } catch (error) {
    console.error("Error searching for user.", error);
    throw new Error("Error searching for users");
  }
};

export const searchUsers = async (query: string, currentUserId: string) => {
  try {
    const users = await db.user.findMany({
      where: {
        AND: [
          {
            OR: [
              { email: { contains: query, mode: 'insensitive' } },
              { given_name: { contains: query, mode: 'insensitive' } },
              { username: { contains: query, mode: 'insensitive' } }
            ]
          },
          {
            NOT: {
              externalId: currentUserId
            }
          }
        ]
      }
    });
    return users;
  } catch (error) {
    console.error("Error searching for users:", error);
    throw new Error("Error searching for users");
  }
};