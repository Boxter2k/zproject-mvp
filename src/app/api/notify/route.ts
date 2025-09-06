import { NextResponse } from "next/server";

const token = process.env.TELEGRAM_BOT_TOKEN!;
const chatId = process.env.TELEGRAM_CHAT_ID!;

type TelegramAPIRes = {
  ok: boolean;
  result?: unknown;
  error_code?: number;
  description?: string;
};

type SendResult =
  | { ok: true; status: number; data: TelegramAPIRes }
  | { ok: false; status: number; data: TelegramAPIRes | { error: string } };

async function send(text: string): Promise<SendResult> {
  try {
    const r = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text }),
      cache: "no-store",
    });
    const data = (await r.json().catch(() => ({}))) as TelegramAPIRes;
    if (r.ok && data?.ok) return { ok: true, status: r.status, data };
    return { ok: false, status: r.status, data };
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    return { ok: false, status: 0, data: { error: msg } };
  }
}

export async function GET(req: Request) {
  const text = new URL(req.url).searchParams.get("text") || "Ping from ZProject";
  const res = await send(text);
  return NextResponse.json(res);
}

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as { text?: string };
  const text = body?.text ?? "Ping from ZProject";
  const res = await send(text);
  return NextResponse.json(res);
}
