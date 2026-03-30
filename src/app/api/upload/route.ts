import { NextRequest, NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { randomUUID } from "crypto";

const S3_BUCKET = process.env.AWS_S3_BUCKET || "crewcheck-prod";
const S3_REGION = process.env.AWS_REGION || "ap-northeast-2";

const s3 = new S3Client({
  region: S3_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const files = formData.getAll("files") as File[];

  if (!files.length) {
    return NextResponse.json({ error: "파일이 없습니다." }, { status: 400 });
  }

  const urls: string[] = [];

  for (const file of files) {
    const buffer = Buffer.from(await file.arrayBuffer());
    const ext = file.name.split(".").pop() || "jpg";
    const key = `venues/${randomUUID()}.${ext}`;

    await s3.send(new PutObjectCommand({
      Bucket: S3_BUCKET,
      Key: key,
      Body: buffer,
      ContentType: file.type,
      CacheControl: "public, max-age=31536000",
    }));

    urls.push(`https://${S3_BUCKET}.s3.${S3_REGION}.amazonaws.com/${key}`);
  }

  return NextResponse.json({ urls });
}
