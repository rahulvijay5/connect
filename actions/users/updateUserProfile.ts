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