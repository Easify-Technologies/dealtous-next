import { Api } from "telegram";
import { NextResponse } from "next/server";
import { createTelegramClient } from "@/lib/telegramClient";

export async function POST(request) {
    try {
        const { session, channelId } = await request.json();

        const client = createTelegramClient(session);
        await client.connect();

        const entity = await client.getEntity(channelId);
        const me = await client.getMe();

        // ✅ Verify ownership
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

        // ❌ If not admin → stop early
        if (!isAdmin) {
            return NextResponse.json({
                verified: false,
                error: "Not admin of channel",
            });
        }

        // ✅ Get subscriber count
        const fullChannel = await client.invoke(
            new Api.channels.GetFullChannel({
                channel: entity,
            })
        );

        const subscribers = fullChannel.fullChat.participantsCount;

        // ✅ Try fetching stats (may fail)
        let avgViews = null;
        let engagementRate = null;

        if (subscribers && avgViews) {
            engagementRate = ((avgViews / subscribers) * 100).toFixed(2);
        }

        try {
            const stats = await client.invoke(
                new Api.stats.GetBroadcastStats({
                    channel: entity,
                })
            );

            if (stats.viewsPerPost?.json) {
                const data = JSON.parse(stats.viewsPerPost.json);
                avgViews = data?.data?.[0]?.y?.slice(-1)[0] || null;
            }
        } catch (err) {
            console.log("Stats not available:", err.message);
        }

        return NextResponse.json({
            verified: true,
            role,
            channelName: entity.title,
            subscribers,
            averageViews: avgViews,
            engagementRate
        });

    } catch (error) {
        console.error("VERIFY CHANNEL ERROR:", error);
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}