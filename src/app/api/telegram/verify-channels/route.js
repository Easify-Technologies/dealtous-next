import { NextResponse } from "next/server";
import { Api } from "telegram";
import { createTelegramClient } from "@/lib/telegramClient";

export async function POST(request) {
    try {
        const { session, channelId } = await request.json();

        const client = createTelegramClient(session);
        await client.connect();

        const entity = await client.getEntity(channelId);

        const me = await client.getMe();

        const participant = await client.invoke(
            new Api.channels.GetParticipant({
                channel: entity,
                participant: me.id,
            })
        );

        const role = participant.participant.className;

        const isAdmin =
            role === "ChannelParticipantAdmin" ||
            role === "ChannelParticipantCreator";

        return NextResponse.json({
            verified: isAdmin,
            role,
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}