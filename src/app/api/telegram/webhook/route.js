import { NextResponse } from "next/server";

const BOT_TOKEN = process.env.BOT_TOKEN;
const TELEGRAM_SECRET = process.env.TELEGRAM_SECRET;

// ✅ Send message helper
async function sendMessage(chatId, text) {
  await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text,
    }),
  });
}

export async function POST(req) {
  try {
    // ✅ 1. Verify Telegram secret
    const secret = req.headers.get("x-telegram-bot-api-secret-token");

    if (secret !== TELEGRAM_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    console.log("Telegram Update:", JSON.stringify(body, null, 2));

    const message = body.message;

    // ✅ 2. Handle /start
    if (message && message.text === "/start") {
      await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: message.chat.id,
          text: "Welcome 🚀\n\nClick below to share your channel",
          reply_markup: {
            keyboard: [
              [
                {
                  text: "Share Channel",
                  request_chat: {
                    request_id: 1,
                    chat_is_channel: true,
                    chat_is_created: true,
                    bot_is_member: true,
                  },
                },
              ],
            ],
            resize_keyboard: true,
          },
        }),
      });
    }

    // ✅ 3. Handle channel selection
    if (message && message.chat_shared) {
      const channelId = message.chat_shared.chat_id;

      const chatRes = await fetch(
        `https://api.telegram.org/bot${BOT_TOKEN}/getChat?chat_id=${channelId}`
      ).then((res) => res.json());

      const countRes = await fetch(
        `https://api.telegram.org/bot${BOT_TOKEN}/getChatMemberCount?chat_id=${channelId}`
      ).then((res) => res.json());

      const chat = chatRes.result;
      const memberCount = countRes.result;

      await sendMessage(
        message.chat.id,
        `✅ Channel received:\n\nName: ${chat.title}\nMembers: ${memberCount}`
      );

      // 👉 NEXT: save to DB
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}