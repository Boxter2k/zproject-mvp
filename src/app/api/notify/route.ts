// src/app/api/notify/route.ts
import { NextResponse } from "next/server";

export const runtime = "nodejs"; // asegura process.env en Vercel

type TgResponse = { ok: boolean; result?: unknown; error_code?: number; description?: string };

function maskToken(tok: string) {
  if (!tok) return "(empty)";
  if (tok.length <= 12) return tok;
  return tok.slice(0, 6) + "…***…" + tok.slice(-6);
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const text = url.searchParams.get("text") ?? "Ping desde /api/notify";

  const token = process.env.TELEGRAM_BOT_TOKEN || "";
  const chatId = process.env.TELEGRAM_CHAT_ID || "";

  if (!token || !chatId) {
    return NextResponse.json(
      {
        ok: false,
        reason: "Missing env",
        hint: {
          TELEGRAM_BOT_TOKEN: !!token,
          TELEGRAM_CHAT_ID: !!chatId,
        },
      },
      { status: 500 }
    );
  }

  const tgUrl = `https://api.telegram.org/bot${encodeURIComponent(token)}/sendMessage`;

  const tgRes = await fetch(tgUrl, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text }),
  });

  let data: TgResponse;
  try {
    data = (await tgRes.json()) as TgResponse;
  } catch {
    data = { ok: false, error_code: tgRes.status, description: "Non-JSON from Telegram" };
  }

  const debug = {
    called_url: tgUrl.replace(token, maskToken(token)),
    http_status: tgRes.status,
    ok_from_telegram: data.ok,
    tg_error_code: data.error_code ?? null,
    tg_description: data.description ?? null,
  };

  if (!data.ok) {
    return NextResponse.json({ ok: false, debug, data }, { status: 502 });
  }

  return NextResponse.json({ ok: true, debug, data });
}
