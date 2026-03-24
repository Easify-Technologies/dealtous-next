import { NextResponse } from "next/server";
import { Api } from "telegram";
import { createTelegramClient } from "@/lib/telegramClient";

export async function POST(request) {
    try {
        const client = createTelegramClient();

        await client.connect();

        const { phone } = await request.json();

        const result = await client.invoke(
            new Api.auth.SendCode({
                phoneNumber: phone,
                apiId: Number(process.env.TELEGRAM_API_ID),
                apiHash: process.env.TELEGRAM_API_HASH,
                settings: new Api.CodeSettings({}),
            })
        );

        return NextResponse.json({
            phoneCodeHash: result.phoneCodeHash,
            session: client.session.save(),
        },
        { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}