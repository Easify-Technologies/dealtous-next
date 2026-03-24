import { NextResponse } from "next/server";
import { Api } from "telegram";
import { createTelegramClient } from "@/lib/telegramClient";

export async function POST(request) {
    try {
        const { phone, code, phoneCodeHash, session } = await request.json();
        
        if (!session) {
            return Response.json({ error: "Session missing" }, { status: 400 });
        }

        const client = createTelegramClient(session);
        await client.connect();

        const result = await client.invoke(
            new Api.auth.SignIn({
                phoneNumber: phone,
                phoneCode: code,
                phoneCodeHash: phoneCodeHash,
            })
        );

        const newSession = client.session.save();
        
        return NextResponse.json({
            success: true,
            session: newSession,
            user: result.user,
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}