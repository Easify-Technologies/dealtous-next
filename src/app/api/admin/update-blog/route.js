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
        const uploadBase64Image = async (base64) => {
            const uploadResponse = await cloudinary.uploader.upload(base64, {
                folder: "blog_content",
            });

            return uploadResponse.secure_url;
        };

        const processContentImages = async (html) => {
            const imgRegex = /<img[^>]+src="([^">]+)"/g;

            let match;
            let updatedHtml = html;

            while ((match = imgRegex.exec(html)) !== null) {
                const src = match[1];

                // Only process base64 images
                if (src.startsWith("data:image")) {
                    const uploadedUrl = await uploadBase64Image(src);

                    updatedHtml = updatedHtml.replace(src, uploadedUrl);
                }
            }

            return updatedHtml;
        };

        const formData = await request.formData();

        const blogId = formData.get("blogId");
        const title = formData.get("title");
        let content = formData.get("content");

        content = await processContentImages(content);

        const author = formData.get("author");
        const metaTitle = formData.get("metaTitle");
        const metaDesc = formData.get("metaDesc");
        const rawImages = formData.getAll("images");

        const images = rawImages.filter(
            (file) => file && typeof file === "object" && file.name
        );

        if (!title) {
            return NextResponse.json({ error: "Title is required" }, { status: 400 });
        }
        else if (!content) {
            return NextResponse.json({ error: "Content is required" }, { status: 400 });
        }
        else if (!author) {
            return NextResponse.json({ error: "Author is required" }, { status: 400 });
        }
        else if (!metaTitle) {
            return NextResponse.json({ error: "Meta Title is required" }, { status: 400 });
        }
        else if (!metaDesc) {
            return NextResponse.json({ error: "Meta Description is required" }, { status: 400 });
        }
        else if (images.length === 0) {
            return NextResponse.json(
                { error: "Main Image is required" },
                { status: 400 }
            );
        }
        else if (images.length > 3) {
            return NextResponse.json({ error: "Max 3 images allowed" }, { status: 400 });
        }

        const imageUrls = await Promise.all(
            images.map(async (file) => {
                if (!(file instanceof File)) {
                    throw new Error("Invalid file upload");
                }

                const buffer = Buffer.from(await file.arrayBuffer());

                const base64Data = `data:${file.type};base64,${buffer.toString("base64")}`;

                const uploadResponse = await cloudinary.uploader.upload(base64Data, {
                    folder: "blog_images",
                });

                return uploadResponse.secure_url;
            })
        );

        const newBlog = await prisma.blogs.update({
            where: {
                id: blogId
            },
            data: {
                title,
                content,
                author,
                metaTitle,
                metaDesc,
                status: "Draft",
                images: imageUrls
            }
        });

        return NextResponse.json({ message: "Blog updated successfully", blog: newBlog }, { status: 201 });
    } catch (error) {
        console.error("Error adding blog", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}