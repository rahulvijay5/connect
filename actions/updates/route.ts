'use server'

import { db } from '@/lib/db'
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server"
import { Level, Update, User } from '@prisma/client'
import { JSDOM } from 'jsdom'
import { subDays } from 'date-fns'
import fetch from 'node-fetch'
import { searchUserByExternalId } from '../users/searchUsers'
// import { Redis } from 'ioredis'
// import redis from '@/lib/redis'

type LinkPreview = {
    url: string;
    title: string;
    description: string;
    image: string | null;
};

type EnrichedUpdate = Update & {
    linkPreviews: LinkPreview[];
    user: {
        given_name: string | null;
        family_name: string | null;
        username: string;
        profilePicture:string|null;
    };
};

export async function createUpdate({ content, level }: { content: string, level: Level }) {
    const { getUser } = getKindeServerSession()
    const user = await getUser()

    if (!user || !user.id) {
        throw new Error('Unauthorized')
    }

    const userexists = await searchUserByExternalId(user?.id!)

    if (!userexists) {
        throw new Error('User not exists in database.')
    }

    return db.update.create({
        data: {
            content,
            level,
            userId: userexists.id,
        },
    })
}

export async function getMyUpdates(page: number = 1, limit: number = 10): Promise<EnrichedUpdate[]> {
    const { getUser } = getKindeServerSession()
    const user = await getUser()

    if (!user || !user.id) {
        throw new Error('Unauthorized')
    }

    const dbUser = await db.user.findUnique({
        where: { externalId: user.id },
    })

    if (!dbUser) {
        throw new Error('User not found')
    }

    const updates = await db.update.findMany({
        where: {
            userId: dbUser.id,
        },
        include: {
            user: {
                select: {
                    given_name: true,
                    family_name: true,
                    username: true,
                    profilePicture:true,
                },
            },
        },
        orderBy: {
            createdAt: 'desc',
        },
        take: limit,
        skip: (page - 1) * limit,
    })

    return await enrichUpdatesWithLinkPreviews(updates)
}

export async function getConnectionUpdates(userId: string, connectionLevel: Level, page: number = 1, limit: number = 10): Promise<EnrichedUpdate[]> {
    const levels: Level[] = ['known', 'closer', 'closest']
    const allowedLevels = levels.slice(0, levels.indexOf(connectionLevel) + 1)

    const updates = await db.update.findMany({
        where: {
            userId,
            level: {
                in: allowedLevels,
            },
        },
        include: {
            user: {
                select: {
                    given_name: true,
                    family_name: true,
                    username: true,
                    profilePicture:true
                },
            },
        },
        orderBy: {
            createdAt: 'desc',
        },
        take: limit,
        skip: (page - 1) * limit,
    })

    return await enrichUpdatesWithLinkPreviews(updates)
}

export async function getRecentUpdates(page: number = 1, limit: number = 6): Promise<EnrichedUpdate[]> {
    const { getUser } = getKindeServerSession()
    const user = await getUser()

    if (!user || !user.id) {
        throw new Error('Unauthorized')
    }

    const dbUser = await db.user.findUnique({
        where: { externalId: user.id },
        include: {
            connectionsTo: {
                include: {
                    user: true,
                },
            },
        },
    })

    if (!dbUser) {
        throw new Error('User not found')
    }

    const sevenDaysAgo = subDays(new Date(), 7)

    // const viewedUpdateIds = await redis.smembers(`user:${dbUser.id}:viewed_updates`)

    const updates = await db.update.findMany({
        where: {
            userId: {
                in: dbUser.connectionsTo.map(conn => conn.userId),
            },
            createdAt: {
                gte: sevenDaysAgo,
            },
            level: {
                in: dbUser.connectionsTo.map(conn => {
                    const levels: Level[] = ['known', 'closer', 'closest']
                    return levels.slice(0, levels.indexOf(conn.level) + 1)
                }).flat(),
            },
            // id: {
            //     notIn: viewedUpdateIds,
            // },
        },
        include: {
            user: {
                select: {
                    given_name: true,
                    family_name: true,
                    username: true,
                    profilePicture:true,
                },
            },
        },
        orderBy: {
            createdAt: 'desc',
        },
        take: limit,
        skip: (page - 1) * limit,
    })

    return await enrichUpdatesWithLinkPreviews(updates)
}

// export async function markUpdateAsViewed(userId: string, updateId: string) {
//     await redis.sadd(`user:${userId}:viewed_updates`, updateId)
// }

async function enrichUpdatesWithLinkPreviews(updates: (Update & { user: { given_name: string | null; family_name: string | null; username: string; profilePicture:string |null; } })[]): Promise<EnrichedUpdate[]> {
    const enrichedUpdates = await Promise.all(updates.map(async (update) => {
        const urls = extractUrls(update.content)
        const previews = await Promise.all(urls.map(getLinkPreview))
        return { ...update, linkPreviews: previews.filter((preview): preview is LinkPreview => preview !== null) }
    }))
    return enrichedUpdates
}

function extractUrls(text: string): string[] {
    const urlRegex = /(https?:\/\/[^\s]+)/g
    return text.match(urlRegex) || []
}

async function getLinkPreview(url: string): Promise<LinkPreview | null> {
    try {
        const response = await fetch(url)
        const html = await response.text()
        const dom = new JSDOM(html)
        const doc = dom.window.document

        const title = doc.querySelector('title')?.textContent || ''
        const description = doc.querySelector('meta[name="description"]')?.getAttribute('content') || ''
        const image = doc.querySelector('meta[property="og:image"]')?.getAttribute('content') || null

        return { url, title, description, image }
    } catch (error) {
        console.error(`Error fetching link preview for ${url}:`, error)
        return null
    }
}

export async function getUserUpdates(username: string, page: number = 1, limit: number = 10) {
    const updates = await db.update.findMany({
        where: {
            userId: username,
        },
        include: {
            user: {
                select: {
                    given_name: true,
                    family_name: true,
                },
            },
        },
        orderBy: {
            createdAt: 'desc',
        },
        take: limit,
        skip: (page - 1) * limit,
    })

    return updates
}

export async function getUserUpdatesByLevel(userId: string, connectionLevel: string) {
    const level = connectionLevel.toUpperCase() as Level;
    
    return db.update.findMany({
      where: {
        userId: userId,
        level: {
          in: getLevelsForConnectionLevel(level),
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      include:{
        user:true
      }
    });
  }
  
  function getLevelsForConnectionLevel(level: Level): Level[] {
    switch (level) {
      case 'closest':
        return ['known', 'closer', 'closest'];
      case 'closer':
        return ['known', 'closer'];
      case 'known':
        return ['known'];
      default:
        return [];
    }
  }