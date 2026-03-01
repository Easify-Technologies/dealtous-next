import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(req = NextRequest) {
  const formData = await req.formData();
  const files = formData.getAll("files");

  const uploadDir = path.join(process.cwd(), "public/uploads");

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const urls = [];

  for (const file of files) {
    if (!(file instanceof File)) continue;

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = `${Date.now()}-${file.name}`;
    const filePath = path.join(uploadDir, fileName);

    fs.writeFileSync(filePath, buffer);
    urls.push(`/uploads/${fileName}`);
  }

  return NextResponse.json({ urls });
}
