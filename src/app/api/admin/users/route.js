import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                username: true,
                avatar: true,
                about: true,
                email: true,
                country: true,
                city: true,
                address: true,
                zipCode: true,
                about: true,
                role: true,
                isVerified: true,
                isBanned: true,
                createdAt: true,

                buyerOrders: {
                    select: {
                        paymentMethod: true,
                        status: true,

                        product: {
                            select: {
                                name: true,
                                price: true
                            }
                        },

                        seller: {
                            select: {
                                name: true
                            }
                        }
                    }
                },

                sellerOrders: {
                    select: {
                        paymentMethod: true,
                        status: true,

                        product: {
                            select: {
                                name: true,
                                price: true
                            }
                        },

                        seller: {
                            select: {
                                name: true
                            }
                        }
                    }
                }
            },
            orderBy: {
                createdAt: "desc"
            }
        });

        const formattedUsers = users.map(user => ({
            id: user.id,
            name: user.name,
            username: user.username,
            avatar: user.avatar,
            role: user.role,
            country: user.country,
            city: user.city,
            address: user.address,
            zipCode: user.zipCode,
            about: user.about,
            email: user.email,
            createdAt: user.createdAt,
            isBanned: user.isBanned,
            isVerified: user.isVerified,
            orders:
                user.role === "Buyer"
                    ? user.buyerOrders
                    : user.sellerOrders
        }));

        return NextResponse.json({ users: formattedUsers }, { status: 200 })
    } catch (error) {
        console.error("Error fetching users", error);
        return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
    }
}