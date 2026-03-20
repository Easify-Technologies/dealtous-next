export const runtime = "nodejs";

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

const BOT_TOKEN = process.env.BOT_TOKEN;
const TELEGRAM_SECRET = process.env.TELEGRAM_SECRET;

/* ─────────────────────────────────────────────
   Telegram API Helper
───────────────────────────────────────────── */
async function telegram(method, body) {
  const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/${method}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await res.json();

  if (!data.ok) {
    console.error("Telegram API Error:", data);
  }

  return data;
}

async function sendMessage(chatId, text, extra = {}) {
  return telegram("sendMessage", {
    chat_id: chatId,
    text,
    ...extra,
  });
}

/* ─────────────────────────────────────────────
   Main Webhook Handler
───────────────────────────────────────────── */
export async function POST(req) {
  try {
    /* ✅ 1. Verify Telegram Secret */
    const secret = req.headers.get("x-telegram-bot-api-secret-token");

    if (!secret || secret !== TELEGRAM_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const message = body.message;

    if (!message) {
      return NextResponse.json({ ok: true });
    }

    const chatId = message.chat.id;
    const telegramUserId = String(message.from?.id);

    /* ─────────────────────────────────────────
       2. /start TOKEN HANDLER
    ───────────────────────────────────────── */
    if (message.text?.startsWith("/start")) {
      const token = message.text.split(" ")[1];

      if (!token) {
        await sendMessage(chatId, "❌ Invalid or expired session.");
        return NextResponse.json({ ok: true });
      }

      const verification = await prisma.telegramVerification.findUnique({
        where: { token },
      });

      if (!verification) {
        await sendMessage(chatId, "❌ Session not found or expired.");
        return NextResponse.json({ ok: true });
      }

      // Link telegram user
      await prisma.telegramVerification.update({
        where: { token },
        data: {
          telegramUserId,
        },
      });

      // Ask user to share channel
      await sendMessage(chatId, "✅ Connected!\n\nNow share your channel 👇", {
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

      return NextResponse.json({ ok: true });
    }

    /* ─────────────────────────────────────────
       3. CHANNEL SHARED HANDLER
    ───────────────────────────────────────── */
    if (message.chat_shared) {
      const channelId = message.chat_shared.chat_id;

      // Find active verification session
      const verification = await prisma.telegramVerification.findFirst({
        where: {
          telegramUserId,
          status: "PENDING",
        },
        orderBy: { createdAt: "desc" },
      });

      if (!verification) {
        await sendMessage(chatId, "❌ Session expired. Please try again.");
        return NextResponse.json({ ok: true });
      }

      /* ───────── Get Channel Info ───────── */
      const chatRes = await telegram("getChat", { chat_id: channelId });

      if (!chatRes.ok) {
        await sendMessage(chatId, "❌ Failed to fetch channel info.");
        return NextResponse.json({ ok: true });
      }

      const chat = chatRes.result;

      /* ───────── Check Bot is Admin ───────── */
      const botInfo = await telegram("getMe");
      const botId = botInfo.result.id;

      const botMember = await telegram("getChatMember", {
        chat_id: channelId,
        user_id: botId,
      });

      if (botMember.result.status !== "administrator") {
        await sendMessage(
          chatId,
          "❌ Bot is NOT admin.\n\n👉 Please add the bot as ADMIN and try again."
        );
        return NextResponse.json({ ok: true });
      }

      /* ───────── Check User is Owner/Admin ───────── */
      const userMember = await telegram("getChatMember", {
        chat_id: channelId,
        user_id: Number(telegramUserId),
      });

      const role = userMember.result.status;

      if (role !== "creator" && role !== "administrator") {
        await sendMessage(
          chatId,
          "❌ You must be the OWNER or ADMIN of this channel."
        );
        return NextResponse.json({ ok: true });
      }

      /* ───────── Get Subscriber Count ───────── */
      const countRes = await telegram("getChatMemberCount", {
        chat_id: channelId,
      });

      const subscribers = countRes.result;

      /* ───────── Save Verification Result ───────── */
      await prisma.telegramVerification.update({
        where: { id: verification.id },
        data: {
          status: "VERIFIED",
          channelId: String(channelId),
          channelName: chat.title,
          subscribers,
        },
      });

      await sendMessage(
        chatId,
        `✅ Channel Verified!\n\n📢 ${chat.title}\n👥 ${subscribers} subscribers\n\nReturn to the website to continue.`
      );

      return NextResponse.json({ ok: true });
    }

    /* ───────────────────────────────────────── */
    return NextResponse.json({ ok: true });

  } catch (error) {
    console.error("Webhook Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}