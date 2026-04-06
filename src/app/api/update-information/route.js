import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/auth";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request) {
    try {
        const session = await getServerSession(authOptions);
        const formData = await request.formData();

        const userId = session?.user?.id ?? "";

        const updatedData = {};

        for (const [key, value] of formData.entries()) {
            if (key === "avatar" && value instanceof File) {
                const bytes = await value.arrayBuffer();
                const buffer = Buffer.from(bytes);

                const uploadResult = await new Promise((resolve, reject) => {
                    cloudinary.uploader
                        .upload_stream(
                            {
                                folder: "avatars",
                            },
                            (error, result) => {
                                if (error) return reject(error);
                                resolve(result);
                            }
                        )
                        .end(buffer);
                });

                updatedData.avatar = uploadResult.secure_url;
            } else {
                if (value !== "" && value !== null) {
                    updatedData[key] = value;
                }
            }
        }

        if (Object.keys(updatedData).length === 0) {
            return NextResponse.json(
                { error: "No fields to update" },
                { status: 400 }
            );
        }

        const updateUser = await prisma.user.update({
            where: {
                id: userId
            },
            data: {
                ...updatedData
            }
        });

        return NextResponse.json({ message: "Information updated successfully", user: updateUser }, { status: 200 });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}