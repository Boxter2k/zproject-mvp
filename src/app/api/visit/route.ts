// src/app/api/visit/route.ts
import { NextResponse, NextRequest } from "next/server";

function looksLikeBot(ua: string) {
  const s = ua.toLowerCase();
  return /bot|crawler|spider|facebookexternalhit|slurp|bingpreview|uptime|curl|wget/.test(s);
}

async function sendTelegram(text: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return { ok: false, reason: "missing env" };

  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text }),
    cache: "no-store",
  });
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, status: res.status, data };
}

export async function POST(req: NextRequest) {
  const ua = req.headers.get("user-agent") || "";
  if (looksLikeBot(ua)) return NextResponse.json({ ok: true, skipped: "bot" });

  // 20% de muestreo para no saturar
  if (Math.random() > 0.2) return NextResponse.json({ ok: true, sampledOut: true });

  const country =
    req.headers.get("x-vercel-ip-country") ||
    req.headers.get("cf-ipcountry") ||
    "??";

  const { path, referrer, event, ms } = await req.json().catch(() => ({}));

  let msg = "";
  if (event === "view") {
    msg = `👀 Nueva visita\n• Ruta: ${path || "/"}\n• País: ${country}\n• Referrer: ${referrer || "(direct)"}\n• UA: ${ua.slice(0,90)}…`;
  } else if (event === "leave" && typeof ms === "number") {
    const secs = Math.max(0, Math.round(ms / 1000));
    msg = `⏱ Permanencia\n• Ruta: ${path || "/"}\n• Tiempo: ${secs}s\n• País: ${country}`;
  } else {
    return NextResponse.json({ ok: false, reason: "bad payload" }, { status: 400 });
  }

  const r = await sendTelegram(msg);
  return NextResponse.json(r);
}
