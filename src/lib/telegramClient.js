import { TelegramClient } from "telegram";
import { StringSession } from "telegram/sessions";

export const createTelegramClient = (session) => {
  return new TelegramClient(
    new StringSession(session),
    Number(process.env.TELEGRAM_API_ID),
    process.env.TELEGRAM_API_HASH,
    {
      connectionRetries: 5,
    }
  );
};