import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";

import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/auth";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const userId = session.user.id;
        const role = session.user.role;

        let products;

        if (role === "ADMIN") {
            // Admin gets all products
            products = await prisma.product.findMany({
                orderBy: { createdAt: "desc" },
            });
        } else {
            // Vendor gets only their products
            products = await prisma.product.findMany({
                where: { vendorId: userId },
                include: {
                    vendor: {
                        select: {
                            name: true
                        }
                    }
                },
                orderBy: { createdAt: "desc" },
            });
        }

        return NextResponse.json(
            { products },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}
