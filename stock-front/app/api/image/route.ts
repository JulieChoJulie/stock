import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"

import { NextRequest, NextResponse } from "next/server"

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
})

function sanitizeFilename(filename: string) {
  // Replace spaces with underscores
  const sanitizedFilename = filename.replace(/\s+/g, "_")

  // Remove special characters (except underscores and hyphens)
  const cleanedFilename = sanitizedFilename.replace(/[^a-zA-Z0-9-_\.]/g, "")

  // Limit filename length (example: 50 characters)
  const limitedFilename = cleanedFilename.slice(0, 50)

  // Normalize to lowercase
  const normalizedFilename = limitedFilename.toLowerCase()

  return normalizedFilename as string
}

export const getNewUrl = async (key: string) => {
  const imageUrl = await getSignedUrl(
    s3,
    new GetObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: key,
    }),
    { expiresIn: 120 }, // 120 seconds
  )

  return imageUrl
}

export async function GET(req: NextRequest) {
  const key = req.nextUrl.searchParams.get("key") as string
  const imageUrl = await getNewUrl(key)
  return NextResponse.json({ url: imageUrl })
}

export async function POST(req: Request) {
  const formData = await req.formData()
  const file = formData.get("file") as Blob | null
  if (!file) {
    return NextResponse.json(
      {
        error: "File blob is required",
      },
      {
        status: 400,
      },
    )
  }
  const buffer = Buffer.from(await file.arrayBuffer())

  // make unique filename without special characters
  const uniqueIdentifier = `${Math.random()
    .toString(36)
    .substring(2)}-${Date.now()}`
  const filename = `${uniqueIdentifier}-${file.name}`
  const key: string = sanitizeFilename(filename)

  // Configure the upload details to send to S3
  const uploadParams = {
    Bucket: process.env.S3_BUCKET_NAME,
    Body: buffer,
    Key: key,
    ContentType: file.type,
  }

  // Send the upload to S3
  await s3.send(new PutObjectCommand(uploadParams))

  const imageUrl = await getSignedUrl(
    s3,
    new GetObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: key,
    }),
    { expiresIn: 60 }, // 60 seconds
  )

  return NextResponse.json({ url: imageUrl })
}
