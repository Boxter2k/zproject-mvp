// src/app/api/notify/route.ts
import { NextRequest, NextResponse } from "next/server";

const BOT = process.env.TELEGRAM_BOT_TOKEN!;
const CHATS = (process.env.TELEGRAM_CHAT_IDS || process.env.TELEGRAM_CHAT_ID || "")
  .split(",")
  .map(s => s.trim())
  .filter(Boolean);

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    // Enriquecimiento desde cabeceras de Vercel/Proxy
    const country = req.headers.get("x-vercel-ip-country") || "??";
    const city = req.headers.get("x-vercel-ip-city") || "";
    const ua = req.headers.get("user-agent") || "";
    const ip =
      req.headers.get("x-real-ip") ||
      (req.headers.get("x-forwarded-for") || "").split(",")[0].trim() ||
      "";

    const type: string = data?.type || "page_view";
    const path: string = data?.path || "/";
    const ref: string | null = data?.ref || null;
    const lang: string | undefined = data?.lang;
    const tz: string | undefined = data?.tz;
    const vp = data?.vp as { w?: number; h?: number } | undefined;
    const uid: string | undefined = data?.uid;
    const durMS: number | undefined = data?.durMS;

    const dur = typeof durMS === "number" ? `${Math.round(durMS / 1000)}s` : undefined;

    const title =
      type === "visit_start" ? "🟢 VISITA"
      : type === "visit_end" ? "🔴 SALIDA"
      : "📄 PAGE VIEW";

    const lines = [
      `${title}  ${path}`,
      ref ? `↩︎ Ref: ${ref}` : undefined,
      `🌍 ${country}${city ? " · " + city : ""}`,
      lang || tz ? `🗣 ${lang || "?"} · ⏰ ${tz || "?"}` : undefined,
      vp?.w && vp?.h ? `🖥 ${vp.w}×${vp.h}` : undefined,
      dur ? `⏱ ${dur}` : undefined,
      uid ? `🆔 ${uid}` : undefined,
      `📡 ${ip}`,
      `🧭 ${ua}`,
    ].filter(Boolean);
    const text = lines.join("\n");

    if (!BOT || CHATS.length === 0) {
      // No hay configuración de Telegram: no rompemos nada.
      return NextResponse.json({ ok: true, skipped: true });
    }

    const url = `https://api.telegram.org/bot${BOT}/sendMessage`;
    await Promise.all(
      CHATS.map((chat) =>
        fetch(url, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ chat_id: chat, text }),
        })
      )
    );

    return NextResponse.json({ ok: true });
  } catch {
    // Nunca rompemos el build por errores de runtime
    return NextResponse.json({ ok: false }, { status: 200 });
  }
}

export async function GET() {
  // Útil para probar rápidamente en el navegador
  return NextResponse.json({ ok: true, pong: "notify api up" });
}
