import { NextRequest, NextResponse } from 'next/server'
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server"
import { db } from '@/lib/db'

const s3 = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY!,
  },
})

export async function POST(req: NextRequest) {
  try {
    const { getUser } = getKindeServerSession()
    const user = await getUser()

    if (!user || !user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await req.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const fileName = `profileimg/${user.id}-${Date.now()}.jpg`

    // Upload new image
    await s3.send(new PutObjectCommand({
      Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
      Key: fileName,
      Body: buffer,
      ContentType: 'image/jpeg',
    }))

    const imageUrl = `${process.env.CLOUDFLARE_R2_PUBLIC_URL}/${fileName}`
    // console.log(imageUrl)

    // Get the current user from the database
    const dbUser = await db.user.findUnique({
      where: { externalId: user.id },
    })

    if (dbUser && dbUser.profilePicture) {
      const oldFileName = dbUser.profilePicture.split('/').pop()
      if (oldFileName && !oldFileName.startsWith('https://')) {
        // Delete old image if it exists and is not an external URL
        await s3.send(new DeleteObjectCommand({
          Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
          Key: oldFileName,
        }))
      }
    }

    // Update user profile picture in the database
    await db.user.update({
      where: { externalId: user.id },
      data: { profilePicture: imageUrl },
    })

    return NextResponse.json({ imageUrl })
  } catch (error) {
    console.error('Error uploading image:', error)
    return NextResponse.json({ error: 'Error uploading image' }, { status: 500 })
  }
}