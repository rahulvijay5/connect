'use server'

import { db } from '@/lib/db'
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server"

export async function updateProfile(formData: any) {
    const { getUser } = getKindeServerSession()
    const user = await getUser()

    if (!user || !user.id) {
        throw new Error('User not authenticated')
    }

    try {
        await db.user.update({
            where: { externalId: user.id },
            data: {
                birthdate: formData.birthdate,
                currentLocation: formData.currentLocation,
                hometown: formData.hometown,
                profession: formData.profession,
                bio: formData.bio,
                interests: formData.interests,
                hobbies: formData.hobbies,
                contactDetails: {
                    upsert: {
                        create: {
                            phone: formData.phone,
                            address: formData.address,
                        },
                        update: {
                            phone: formData.phone,
                            address: formData.address,
                        },
                    },
                },
                socialLinks: {
                    upsert: {
                        create: formData.socialLinks,
                        update: formData.socialLinks,
                    },
                },
            },
        })

        return { success: true }
    } catch (error) {
        console.error('Error updating profile:', error)
        throw new Error('Failed to update profile')
    }
}

// actions/users/updateProfile.ts

export async function updateBasicInfo(userId: string, data: any) {
  await db.user.update({
    where: { id: userId },
    data: {
      username: data.username,
      email: data.email,
      given_name: data.given_name,
      family_name: data.family_name,
      birthdate: data.birthdate ? new Date(data.birthdate) : null,
      currentLocation: data.currentLocation,
      hometown: data.hometown,
      profession: data.profession,
      bio: data.bio,
    },
  });
}

export async function updateContactSocial(userId: string, contactDetails: any, socialLinks: Record<string, string>) {
  await db.user.update({
    where: { id: userId },
    data: {
      contactDetails: {
        upsert: {
          create: contactDetails,
          update: contactDetails,
        },
      },
      socialLinks: {
        upsert: {
          create: { ...socialLinks },
          update: { ...socialLinks },
        },
      },
    },
  });
}

export async function updateInterestsSkills(userId: string, data: { interests: string[], skills: string[], hobbies: string[] }) {
  await db.user.update({
    where: { id: userId },
    data: {
      interests: data.interests,
      skills: data.skills,
      hobbies: data.hobbies,
    },
  });
}