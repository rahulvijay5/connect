
import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export const POST = async (req: NextRequest) => {
  const {
    email,
    given_name,
    externalId,
    birthdate,
    username,
    currentLocation,
    profilePicture,
    hometown,
    profession,
    bio,
    contactDetails,
    socialLinks,
    interests,
    hobbies,
    images
  }: {
    email: string;
    externalId: string;
    given_name: string;
    birthdate: Date;
    username:string;
    currentLocation: string;
    profilePicture:string;
    hometown: string;
    profession: string;
    bio: string;
    contactDetails: {
      phone: string;
      address: string;
    };
    socialLinks: {
      facebook?: string;
      Instagram?: string;
    };
    interests: string[];
    hobbies: string[];
    images: string[];
  } = await req.json();

  try {
    const user = await db.user.create({
      data: {
        email,
        externalId,
        // given_name,
        // birthdate,
        username,
        // currentLocation,
        // hometown,
        // profession,
        // bio,
        // contactDetails: {
        //   create: contactDetails
        // },
        // socialLinks: {
        //   create: socialLinks
        // },
        // interests,
        // hobbies,
        // images
      },
    });

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json({ error: "Error creating user" }, { status: 500 });
  }
};
