import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

const BOT_TOKEN = process.env.BOT_TOKEN;
const TELEGRAM_SECRET = process.env.TELEGRAM_SECRET;

// helper
async function telegram(method, body) {
  const res = await fetch(
    `https://api.telegram.org/bot${BOT_TOKEN}/${method}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    },
  );
  return res.json();
}

async function sendMessage(chatId, text) {
  await telegram("sendMessage", {
    chat_id: chatId,
    text,
  });
}

export async function POST(req) {
  try {
    // 1. Security check
    const secret = req.headers.get("x-telegram-bot-api-secret-token");
    if (secret !== TELEGRAM_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const message = body.message;

    if (!message) {
      return NextResponse.json({ ok: true });
    }

    const userId = message.from?.id;

    // 2. /start
    if (message.text === "/start") {
      await telegram("sendMessage", {
        chat_id: message.chat.id,
        text: "Welcome 🚀\n\nClick below to share your channel 👇",
        reply_markup: {
          keyboard: [
            [
              {
                text: "📢 Share Channel",
                request_chat: {
                  request_id: 1,
                  chat_is_channel: true,
                },
              },
            ],
          ],
          resize_keyboard: true,
          one_time_keyboard: true,
        },
      });
    }

    // 3. Channel selected
    if (message.chat_shared) {
      const channelId = message.chat_shared.chat_id;

      // 🔥 Step 1: Get channel info
      const chatRes = await telegram("getChat", {
        chat_id: channelId,
      });

      if (!chatRes.ok) {
        await sendMessage(message.chat.id, "❌ Failed to fetch channel.");
        return NextResponse.json({ ok: true });
      }

      const chat = chatRes.result;

      // 🔥 Step 2: Check bot admin
      const botMember = await telegram("getChatMember", {
        chat_id: channelId,
        user_id: (await telegram("getMe")).result.id,
      });

      const botStatus = botMember.result.status;

      if (botStatus !== "administrator") {
        await sendMessage(
          message.chat.id,
          "❌ Bot is NOT admin in this channel.\n\n👉 Please add bot as ADMIN and try again.",
        );
        return NextResponse.json({ ok: true });
      }

      // Step 3: Check USER role
      const userMember = await telegram("getChatMember", {
        chat_id: channelId,
        user_id: userId,
      });

      const userStatus = userMember.result.status;

      if (userStatus !== "creator" && userStatus !== "administrator") {
        await sendMessage(
          message.chat.id,
          "❌ You are not owner/admin of this channel.",
        );
        return NextResponse.json({ ok: true });
      }

      // Step 4: Get member count
      const countRes = await telegram("getChatMemberCount", {
        chat_id: channelId,
      });

      const memberCount = countRes.result;

      // SUCCESS
      await sendMessage(
        message.chat.id,
        `✅ Channel Verified!\n\nName: ${chat.title}\nMembers: ${memberCount}`,
      );

      const user = await prisma.user.findFirst({
        where: {
          telegramId: String(userId),
        },
      });

      if (!user) {
        await sendMessage(
          message.chat.id,
          "❌ Please connect your account first.",
        );
        return NextResponse.json({ ok: true });
      }

      await prisma.product.create({
        data: {
          name: chat.title,
          summary: "Telegram channel auto-added",
          category: "telegram",
          currency: "INR",
          subscribers: String(memberCount),
          engagementRate: "0%",
          language: "unknown",
          postingFrequency: "unknown",
          monetizationMethods: "unknown",
          averageViews: "0",
          price: 0,
          images: [],
          pincode: "000000",
          vendorId: user.id,
          telegramChannelId: String(channelId),
          telegramChannelName: chat.title,
          telegramSubscribers: memberCount,
        },
      });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
