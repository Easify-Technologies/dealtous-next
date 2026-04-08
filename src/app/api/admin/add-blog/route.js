import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request) {
    try {
        const formData = await request.formData();

        const title = formData.get("title");
        const content = formData.get("content");
        const author = formData.get("author");
        const images = formData.getAll("images");

        if(!title) {
            return NextResponse.json({ error: "Title is required" }, { status: 400 });
        }
        else if(!content) {
            return NextResponse.json({ error: "Content is required" }, { status: 400 });
        }
        else if(!author) {
            return NextResponse.json({ error: "Author is required" }, { status: 400 });
        }
        else if(images.length === 0) {
            return NextResponse.json({ error: "At least one image is required" }, { status: 400 });
        }
        else if(images.length > 3) {
            return NextResponse.json({ error: "Max 3 images allowed" }, { status: 400 });
        }

        const imageUrls = await Promise.all(
            images.map(async (file) => {
                const buffer = Buffer.from(await file.arrayBuffer());

                const base64Data = `data:${file.type};base64,${buffer.toString("base64")}`;

                const uploadResponse = await cloudinary.uploader.upload(base64Data, {
                    folder: "blog_images",
                });

                return uploadResponse.secure_url;
            })
        );

        const newBlog = await prisma.blogs.create({
            data: {
                title,
                content,
                author,
                images: imageUrls
            }
        });

        return NextResponse.json({ message: "Blog created successfully", blog: newBlog }, { status: 201 });
    } catch (error) {
        console.error("Error adding blog", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}