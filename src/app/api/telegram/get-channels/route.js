import { NextResponse } from "next/server";
import { createTelegramClient } from "@/lib/telegramClient";

export async function POST(req) {
    try {
        const { session } = await req.json();

        if (!session) {
            return NextResponse.json({ error: "Session missing" }, { status: 400 });
        }

        const client = createTelegramClient(session);
        await client.connect();

        const dialogs = await client.getDialogs();

        return NextResponse.json({
            channels: dialogs
                .filter((d) => d.isChannel)
                .map((c) => ({
                    id: c.id,
                    title: c.title,
                })),
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}