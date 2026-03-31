import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function DELETE(req) {
    try {
        const { blogId } = await req.json();

        if(!blogId) {
            return NextResponse.json({ error: "Blog ID is required" }, { status: 400 });
        }

        await prisma.blogs.delete({
            where: {
                id: blogId
            }
        });

        return NextResponse.json({ message: "Blog deleted successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error deleting the blog", error);
        return NextResponse.json({ error: "Failed to delete the blog" }, { status: 500 });
    }
}