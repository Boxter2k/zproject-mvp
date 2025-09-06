// src/app/api/notify/route.ts
import { NextResponse } from "next/server";

const token  = process.env.TELEGRAM_BOT_TOKEN!;
const chatId = process.env.TELEGRAM_CHAT_ID!;

async function send(text: string) {
  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text }),
    // evita que una navegación corte la petición
    keepalive: true,
  });
  if (!res.ok) {
    console.error("Telegram error:", res.status, await res.text());
    return false;
  }
  return true;
}

export async function GET(req: Request) {
  const text = new URL(req.url).searchParams.get("text") || "Ping from ZProject";
  const ok = await send(text);
  return NextResponse.json({ ok });
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const text = String(body.text ?? "Ping from ZProject");
  const ok = await send(text);
  return NextResponse.json({ ok });
}
