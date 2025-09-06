import { NextResponse } from "next/server";

const token  = process.env.TELEGRAM_BOT_TOKEN!;
const chatId = process.env.TELEGRAM_CHAT_ID!;

async function send(text: string) {
  try {
    const r = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text }),
      cache: "no-store",
    });
    const data = await r.json().catch(() => null);
    return { ok: r.ok && data?.ok === true, status: r.status, data };
  } catch (e: any) {
    return { ok: false, status: 0, data: { error: String(e) } };
  }
}

export async function GET(req: Request) {
  const text = new URL(req.url).searchParams.get("text") || "Ping from ZProject";
  const res = await send(text);
  return NextResponse.json(res);
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const text = String(body.text ?? "Ping from ZProject");
  const res = await send(text);
  return NextResponse.json(res);
}
