import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { writeFile } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"];
const MAX_SIZE = 5 * 1024 * 1024;

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Dosya bulunamadı." }, { status: 400 });
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json({ error: "Sadece JPEG, PNG, WEBP veya AVIF yükleyebilirsiniz." }, { status: 400 });
  }

  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "Dosya 5MB'tan büyük olamaz." }, { status: 400 });
  }

  const extension = file.type.split("/")[1];
  const filename = `${randomUUID()}.${extension}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  // On Vercel the filesystem is read-only and per-invocation, so uploads go to
  // Blob storage. Without a token (local dev) we keep writing to public/uploads.
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const blob = await put(`uploads/${filename}`, buffer, {
      access: "public",
      contentType: file.type,
      addRandomSuffix: false,
    });
    return NextResponse.json({ url: blob.url });
  }

  await writeFile(path.join(process.cwd(), "public", "uploads", filename), buffer);

  return NextResponse.json({ url: `/uploads/${filename}` });
}
