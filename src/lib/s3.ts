import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"

const s3Client = new S3Client({
  region: process.env.AWS_REGION || "us-east-1",
  // If credentials are provided in .env, use them. 
  // Otherwise, the SDK will automatically look for IAM Roles on EC2.
  credentials: process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY 
    ? {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      }
    : undefined,
})

export async function getUploadUrl(key: string, contentType: string) {
  const command = new PutObjectCommand({
    Bucket: process.env.S3_BUCKET_NAME || "giglet-prod-uploads",
    Key: key,
    ContentType: contentType,
  })

  // URL expires in 15 minutes
  return await getSignedUrl(s3Client, command, { expiresIn: 900 })
}

export async function getDownloadUrl(key: string) {
  const command = new GetObjectCommand({
    Bucket: process.env.S3_BUCKET_NAME || "giglet-prod-uploads",
    Key: key,
  })

  // URL expires in 1 hour
  return await getSignedUrl(s3Client, command, { expiresIn: 3600 })
}

export function getPublicUrl(key: string) {
  return `https://${process.env.S3_BUCKET_NAME || "giglet-prod-uploads"}.s3.${
    process.env.AWS_REGION || "us-east-1"
  }.amazonaws.com/${key}`
}
