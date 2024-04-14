
import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export const POST = async (req: NextRequest) => {
  const {
    email,
    name,
    birthdate,
    username,
    currentLocation,
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
    name: string;
    birthdate: Date;
    username:string;
    currentLocation: string;
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
      // Add more social links as needed
    };
    interests: string[];
    hobbies: string[];
    images: string[];
  } = await req.json();

  try {
    const user = await db.user.create({
      data: {
        email,
        name,
        birthdate,
        username,
        currentLocation,
        hometown,
        profession,
        bio,
        contactDetails: {
          create: contactDetails
        },
        socialLinks: {
          create: socialLinks
        },
        interests,
        hobbies,
        images
      },
    });

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json({ error: "Error creating user" }, { status: 500 });
  }
};
