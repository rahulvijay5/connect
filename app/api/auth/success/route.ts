import { db } from "@/lib/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();
    if (!user) {
      throw new Error("User data not found");
    }

    const {
      email,
      given_name,
      family_name,
      picture,
      id,
    }: {
      email: string | null;
      given_name: string | null;
      family_name: string | null;
      picture: string | null;
      id: string;
    } = user;
    const { username } = await req.json();
    // console.log(username);

    const existingUser = await db.user.findUnique({
      where: { externalId: id },
    });

    const dp = picture || `https://api.dicebear.com/8.x/shapes/png?seed=${given_name}`

    const userData = {
      externalId: id,
      username,
      given_name: given_name,
      email: email,
      family_name: family_name,
      profilePicture: dp,
    };

    if (existingUser) {
      await db.user.update({
        where: { externalId: id },
        data: {
          username,
          given_name: given_name,
          email: email!,
          family_name: family_name,
          profilePicture: dp,
        },
      });
    } else {
      await db.user.create({
        data: {
          externalId: id,
          username,
          given_name: given_name,
          email: email!,
          family_name: family_name,
          profilePicture: dp,
        },
      });
    }

    return NextResponse.json({ message: "User created/updated successfully" });
  } catch (error) {
    console.error("Error creating or updating user:", error);
    return NextResponse.json(
      { error: "Error creating or updating user" },
      { status: 500 }
    );
  }
};
