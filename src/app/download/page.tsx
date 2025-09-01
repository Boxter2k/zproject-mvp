// src/app/download/page.tsx
"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

function getLangFromCookies(): string {
  try {
    const m = document.cookie.match(/(?:^|;\s*)zproject_lang=([^;]+)/i);
    return (m?.[1] || "en").toLowerCase();
  } catch {
    return "en";
  }
}

export default function DownloadPage() {
  // ===== idioma por cookie (cliente) con fallback =====
  const [lang, setLang] = useState<string>("en");
  useEffect(() => setLang(getLangFromCookies()), []);

  const L = useMemo(() => {
    const is = (p: string) => lang.startsWith(p);
    return {
      title: is("es") ? "Descargas" : is("pt") ? "Downloads" : is("fr") ? "Téléchargements" : "Downloads",
      back:  is("es") ? "Volver"    : is("pt") ? "Voltar"    : is("fr") ? "Retour"             : "Back",
      soon:  is("es") ? "Próx."     : is("pt") ? "Breve"     : is("fr") ? "Bientôt"            : "Soon",
      apk:   is("es") ? "APK directa" : is("pt") ? "APK direto" : "Direct APK",
      play:  "Google Play",
      appstore: "App Store",
    };
  }, [lang]);

  // ====== Globo de diálogo pegado al icono del header ======
  const bubblePhrases = useMemo(() => {
    if (lang.startsWith("es")) return ["¡Pronto en tu dispositivo! ✨", "Gracias por tu interés 💚", "Calentando motores 🚀"];
    if (lang.startsWith("pt")) return ["Em breve no seu aparelho! ✨", "Obrigado pelo interesse 💚", "Aquecendo os motores 🚀"];
    if (lang.startsWith("fr")) return ["Bientôt sur ton appareil ! ✨", "Merci de ton intérêt 💚", "On se prépare 🚀"];
    return ["Coming to your device soon! ✨", "Thanks for your interest 💚", "Warming up the engines 🚀"];
  }, [lang]);

  const [bubbleText, setBubbleText] = useState<string>(bubblePhrases[0]);
  const bubbleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Rotación de frase por visita (solo en cliente)
    setBubbleText(bubblePhrases[0]);
    try {
      const key = "z_bubble_idx_download";
      const prev = Number((typeof window !== "undefined" ? window.localStorage?.getItem(key) : "0") || "0");
      const idx = isNaN(prev) ? 0 : prev;
      const txt = bubblePhrases[idx % bubblePhrases.length];
      setBubbleText(txt);
      if (typeof window !== "undefined") {
        window.localStorage?.setItem(key, String((idx + 1) % bubblePhrases.length));
      }
    } catch { /* noop */ }

    // Colocar globo apuntando al icono del header + wiggle
    const icon =
      (document.querySelector(
        'header a svg, header a img, header .site-logo svg, header .site-logo img, [data-logo-icon]'
      ) as HTMLElement) || null;
    const bubble = bubbleRef.current;
    if (!icon || !bubble) return;

    const nav =
      (document.querySelector("header") as HTMLElement) ||
      (document.querySelector(".topbar,.navbar,.nav") as HTMLElement) ||
      undefined;
    const navH = nav?.getBoundingClientRect().height ?? 56;

    let frame = 0;
    const place = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const r = icon.getBoundingClientRect();
        const targetX = r.left + r.width / 2; // centro del icono
        const ARROW_LEFT_PX = 18;             // coincide con CSS
        const EXTRA_LEFT_SHIFT = 8;            // corrimiento leve a la izquierda

        const gapY = 10;
        let top = r.bottom + gapY;
        const minTop = navH + 6;
        if (top < minTop) top = minTop;

        const bubbleBox = bubble.getBoundingClientRect();
        const viewportW = window.innerWidth;
        let left = targetX - ARROW_LEFT_PX - EXTRA_LEFT_SHIFT;

        const minLeft = 8;
        const maxLeft = Math.max(minLeft, viewportW - bubbleBox.width - 8);
        if (left < minLeft) left = minLeft;
        if (left > maxLeft) left = maxLeft;

        bubble.style.setProperty("--arrow-left", `${ARROW_LEFT_PX}px`);
        bubble.style.top = `${top}px`;
        bubble.style.left = `${left}px`;
      });
    };

    place();
    const onScroll = () => place();
    const onResize = () => place();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);

    // Wiggle del icono del header al aparecer el globo
    icon.classList.add("logo-solo-talk");
    const stop = setTimeout(() => icon.classList.remove("logo-solo-talk"), 2600);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(frame);
      clearTimeout(stop);
    };
  }, [bubblePhrases, lang]);

  return (
    <main className="relative min-h-screen">
      {/* Globo de diálogo pegado al icono del header */}
      <div ref={bubbleRef} className="talk-bubble" role="status" aria-live="polite">
        {bubbleText}
      </div>

      <section className="container mx-auto px-4 py-10">
        <div className="mb-4">
          <Link href="/" className="footer-link">&larr; {L.back}</Link>
        </div>

        {/* Título */}
        <h1
          className="text-3xl font-extrabold tracking-tight"
          style={{ marginBottom: "16px", fontFamily: "'Segoe UI', Roboto, sans-serif" }}
        >
          {L.title}
        </h1>

        {/* === Layout en dos columnas === */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
          {/* ==== Columna izquierda: Móviles ==== */}
          <div style={{ display: "grid", gap: "10px" }}>
            {/* Android */}
            <article className="settings-card" style={{ padding: "10px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <path d="M6 8h12v9a2 2 0 0 1-2 2h-8a2 2 0 0 1-2-2V8Z"/>
                  <path d="M7.5 4.5 6 2.5M16.5 4.5 18 2.5M5 10v5M19 10v5M8 6h8"/>
                </svg>
                <div>
                  <div style={{ fontWeight: 700, fontSize: ".95rem" }}>Android</div>
                  <div style={{ opacity: .8, fontSize: ".75rem" }}>7.0+</div>
                </div>
              </div>
              <div style={{ display: "flex", gap: "6px", marginTop: "8px" }}>
                <Link href="/thanks" className="btn-primary" style={{ fontSize: ".8rem", padding: "4px 10px" }}>
                  {L.apk}
                </Link>
                <Link href="/thanks" className="btn-ghost" style={{ fontSize: ".8rem", padding: "4px 10px" }}>
                  {L.play}
                </Link>
              </div>
            </article>

            {/* iOS */}
            <article className="settings-card" style={{ padding: "10px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
                  <path d="M16.36 1.64a4.2 4.2 0 0 1-1.16 3.23 3.6 3.6 0 0 1-2.77 1.31 3.8 3.8 0 0 1 1.16-2.9A4 4 0 0 1 16.36 1.64Z"/>
                  <path d="M12.4 7.3c1.06 0 2.52-.73 3.5-.73.34 0 1.6.02 2.78 1.1-2.16 1.46-1.82 4.22-.43 6.02.43.56.95 1.06 1.57 1.5-.53 1.1-1.15 2.02-1.85 2.77-.99 1.04-2.04 2.1-3.53 2.1-1.17 0-1.66-.68-3.08-.68-1.44 0-1.95.68-3.12.68-1.5 0-2.6-1.14-3.58-2.17C3.63 16 2.2 12.55 3.88 9.93c.97-1.53 2.66-2.5 4.52-2.52 1.23 0 2.38.73 3 .73Z"/>
                </svg>
                <div>
                  <div style={{ fontWeight: 700, fontSize: ".95rem" }}>iOS</div>
                  <div style={{ opacity: .8, fontSize: ".75rem" }}>App Store</div>
                </div>
              </div>
              <div style={{ marginTop: "8px" }}>
                <Link href="/thanks" className="btn-primary" style={{ fontSize: ".8rem", padding: "4px 10px" }}>
                  {L.appstore}
                </Link>
              </div>
            </article>
          </div>

          {/* ==== Columna derecha: Ordenadores ==== */}
          <div style={{ display: "grid", gap: "10px" }}>
            {[
              { name: "Windows", ver: "10/11" },
              { name: "macOS", ver: "Intel / ARM" },
              { name: "Linux", ver: "AppImage" },
            ].map((os) => (
              <article key={os.name} className="settings-card" style={{ padding: "10px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <div style={{ fontSize: "1.1rem" }}>💻</div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: ".95rem" }}>{os.name}</div>
                    <div style={{ opacity: .8, fontSize: ".75rem" }}>{os.ver}</div>
                  </div>
                </div>
                <Link
                  href="/thanks"
                  className="btn-ghost"
                  style={{ marginTop: "8px", fontSize: ".8rem", padding: "4px 10px" }}
                >
                  {L.soon}
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <style>{`
        /* ===== Globo cómic pegado al icono del header ===== */
        .talk-bubble{
          position: fixed;
          z-index: 9;
          background: color-mix(in oklab, var(--background), white 8%);
          border: 1px solid rgba(34,197,94,.35);
          padding: 8px 12px;
          border-radius: 12px;
          box-shadow: 0 10px 24px rgba(0,0,0,.18);
          font-size: 13.5px;
          font-weight: 700;
          animation: bubble-in .35s ease, bubble-pulse 2.4s ease infinite;
        }
        .talk-bubble::before{
          content:"";
          position:absolute;
          top:-10px; left: var(--arrow-left, 16px);
          border-left:10px solid transparent;
          border-right:10px solid transparent;
          border-bottom:10px solid rgba(34,197,94,.35);
        }
        .talk-bubble::after{
          content:"";
          position:absolute;
          top:-8px; left: calc(var(--arrow-left, 16px) + 1px);
          border-left:9px solid transparent;
          border-right:9px solid transparent;
          border-bottom:9px solid color-mix(in oklab, var(--background), white 8%);
        }
        @keyframes bubble-in{ from{ transform: translateY(-6px); opacity:0 } to{ transform:none; opacity:1 } }
        @keyframes bubble-pulse{ 0%,100%{ transform: translateY(0) } 50%{ transform: translateY(-1px) } }

        /* Wiggle SOLO del iconito (svg/img del header) */
        .logo-solo-talk{ animation: wiggle .6s ease-in-out 3; transform-origin: 50% 50%; }
        @keyframes wiggle{
          0%,100%{ transform: rotate(0) }
          20%{ transform: rotate(-6deg) }
          40%{ transform: rotate(6deg) }
          60%{ transform: rotate(-4deg) }
          80%{ transform: rotate(3deg) }
        }
      `}</style>
    </main>
  );
}