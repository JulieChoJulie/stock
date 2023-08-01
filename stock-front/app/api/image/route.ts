import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"

import { NextResponse } from "next/server"

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
})

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

  // Configure the upload details to send to S3
  const key = `${Date.now().toString()}-${file.name}`
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
