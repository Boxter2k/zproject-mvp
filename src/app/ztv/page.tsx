// src/app/ztv/page.tsx
"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { I18nProvider, useLang } from "../../lib/i18n-client";

function ZTVInner() {
  const { lang } = useLang();

  const T = {
    es: {
      badge: "Próximamente",
      title: "ZTV",
      lead: "Algo grande se está preparando en nuestras pantallas.",
      sub: "El arte nunca volverá a verse igual.",
      support: "Apoyar",
      back: "Volver al inicio",
      aria: "ZTV — próximamente",
      bubbles: [
        "Luces, cámara… paciencia 👀",
        "¿Te gustan las palomitas? ¡A mí también! 🍿",
        "Preparando algo especial 📺",
        "Dicen que la tele está muerta… pero aquí respira creatividad 💚",
        "Prepárate, tu imaginación es la estrella principal ⭐",
        "ZTV: donde los artistas son las verdaderas celebridades 🎤🎨",
        "Gracias por pasar por ZTV ✨",
      ],
      burst: ["📺", "🎬", "🎞️", "⭐", "✨"],
      bg: ["📺", "🎬", "🎞️", "📺", "✨"],
    },
    pt: {
      badge: "Em breve",
      title: "ZTV",
      lead: "Algo grande está chegando às nossas telas.",
      sub: "A arte não será mais a mesma.",
      support: "Apoiar",
      back: "Voltar ao início",
      aria: "ZTV — em breve",
      bubbles: [
        "Luzes, câmera… paciência 👀",
        "Gosta de pipoca? Eu também 🍿",
        "Dizem que a TV está morta… mas aqui respira criatividade 💚",
        "ZTV: onde os artistas são as verdadeiras celebridades 🎤🎨",
        "Prepare-se, sua imaginação é a estrela principal ⭐",
        "Preparando algo especial 📺",
        "Obrigado por passar ✨",
      ],
      burst: ["📺", "🎬", "🎞️", "⭐", "✨"],
      bg: ["📺", "🎬", "🎞️", "📺", "✨"],
    },
    fr: {
      badge: "Bientôt",
      title: "ZTV",
      lead: "Quelque chose de grand arrive sur nos écrans.",
      sub: "L’art ne se verra plus jamais pareil.",
      support: "Soutenir",
      back: "Retour à l’accueil",
      aria: "ZTV — bientôt",
      bubbles: [
        "Lumières, caméra… patience 👀",
        "Tu aimes le pop-corn ? Moi aussi 🍿",
        "On prépare quelque chose 📺",
        "Prépare-toi, ton imagination est la vedette principale ⭐",
        "ZTV : là où les artistes sont les vraies célébrités 🎤🎨",
        "On dit que la télé est morte… mais ici elle respire la créativité 💚",
        "Merci de ta visite ✨",
      ],
      burst: ["📺", "🎬", "🎞️", "⭐", "✨"],
      bg: ["📺", "🎬", "🎞️", "📺", "✨"],
    },
    en: {
      badge: "Coming soon",
      title: "ZTV",
      lead: "Something big is brewing for our screens.",
      sub: "Art will never look the same.",
      support: "Support",
      back: "Back to home",
      aria: "ZTV — coming soon",
      bubbles: [
        "Lights, camera… patience 👀",
        "Do you like popcorn? Me too 🍿",
        "They say TV is dead… but here it breathes creativity 💚",
        "Cooking up something 📺",
        "ZTV: where artists are the true celebrities 🎤🎨",
        "Get ready, your imagination is the main star ⭐",
        "Thanks for dropping by ✨",
      ],
      burst: ["📺", "🎬", "🎞️", "⭐", "✨"],
      bg: ["📺", "🎬", "🎞️", "📺", "✨"],
    },
  } as const;

  const L = lang === "es" ? T.es : lang === "pt" ? T.pt : lang === "fr" ? T.fr : T.en;

  /* ========= Globo: rota 1 a 1 por visita, sincronizado con idioma =========
     - Lee el índice guardado por idioma
     - Muestra el texto correspondiente al idioma actual
     - Avanza el índice SOLO una vez por sesión (evita doble efecto en Strict Mode)
  */
  const [bubbleText, setBubbleText] = useState<string>("");

  useEffect(() => {
    // no correr en SSR
    if (typeof window === "undefined") return;

    // sesión única por pestaña: evita doble avance en Strict Mode
    const sessKey = "__z_session_id";
    // @ts-ignore
    const session = (window[sessKey] ||= Math.random().toString(36).slice(2));

    const key = `z_bubble_idx_ztv_${lang}`;        // índice por IDIOMA
    const guardKey = `${key}__last_session`;       // quién avanzó por última vez

    try {
      const prevRaw = window.localStorage.getItem(key);
      const prev = prevRaw ? parseInt(prevRaw, 10) : 0;
      const idx = Number.isFinite(prev) ? prev : 0;

      // Mostrar texto del idioma actual
      const text = L.bubbles.length ? L.bubbles[idx % L.bubbles.length] : "";
      setBubbleText(text || "");

      // Avanzar el índice solo si no avanzó ya esta misma sesión
      const lastSess = window.localStorage.getItem(guardKey);
      if (lastSess !== session) {
        const next = L.bubbles.length ? (idx + 1) % L.bubbles.length : 0;
        window.localStorage.setItem(key, String(next));
        window.localStorage.setItem(guardKey, session);
      }
    } catch {
      // Si localStorage falla, al menos mostramos el primero
      setBubbleText(L.bubbles[0] || "");
    }
  }, [lang, L.bubbles]);

  // refs
  const iconRef = useRef<HTMLDivElement>(null);
  const layerRef = useRef<HTMLDivElement>(null);
  const bubbleRef = useRef<HTMLDivElement>(null);

  /* ===== Chispas al tocar el ícono ===== */
  useEffect(() => {
    const el = iconRef.current;
    const layer = layerRef.current || document.body;
    if (!el) return;

    const burst = () => {
      const r = el.getBoundingClientRect();
      const s = document.createElement("span");
      s.className = "spark";
      s.textContent = L.burst[Math.floor(Math.random() * L.burst.length)];
      const a = Math.random() * Math.PI * 2;
      const d = 26 + Math.random() * 18;
      s.style.left = `${r.left + r.width / 2}px`;
      s.style.top = `${r.top + r.height / 2}px`;
      s.style.setProperty("--dx", `${Math.cos(a) * d}px`);
      s.style.setProperty("--dy", `${Math.sin(a) * d}px`);
      s.style.fontSize = `${18 + Math.random() * 8}px`;
      (layer as HTMLElement).appendChild(s);
      setTimeout(() => s.remove(), 900);
    };

    el.addEventListener("click", burst);
    return () => el.removeEventListener("click", burst);
  }, [L.burst]);

  /* ===== Globo anclado al icono del header + wiggle ===== */
  useEffect(() => {
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
        const EXTRA_LEFT_SHIFT = 8;           // pequeño corrimiento

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

    icon.classList.add("logo-solo-talk");
    const stop = setTimeout(() => icon.classList.remove("logo-solo-talk"), 2600);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(frame);
      clearTimeout(stop);
    };
  }, []);

  return (
    <main className="page-root">
      {/* Globo pegado al icono del header */}
      <div ref={bubbleRef} className="talk-bubble" role="status" aria-live="polite">
        {bubbleText}
      </div>

      <div ref={layerRef} className="ucard-pop-layer" aria-hidden />

      <div className="ucard-bg-emoji" aria-hidden>
        <span className="bg-emo e1">{L.bg[0]}</span>
        <span className="bg-emo e2">{L.bg[1]}</span>
        <span className="bg-emo e3">{L.bg[2]}</span>
        <span className="bg-emo e4">{L.bg[3]}</span>
        <span className="bg-emo e5">{L.bg[4]}</span>
      </div>

      <section className="uc-wrap">
        <article className="settings-card ucard" role="status" aria-label={L.aria}>
          <div className="badge ucard-badge">{L.badge}</div>
          <div ref={iconRef} className="ucard-icon" aria-hidden>
            <span className="ucard-emoji">📺</span>
          </div>
          <h1 className="ucard-title">{L.title}</h1>
          <p className="ucard-lead">{L.lead}</p>
          <p className="ucard-sub">{L.sub}</p>
          <div className="ucard-ctas">
            <Link href="/thanks" className="btn-primary">{L.support}</Link>
            <Link href="/" className="btn-ghost">{L.back}</Link>
          </div>
        </article>
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
          font-weight: 600;
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

        /* Wiggle SOLO del iconito del header */
        .logo-solo-talk{ animation: wiggle .6s ease-in-out 3; transform-origin: 50% 50%; }
        @keyframes wiggle{
          0%,100%{ transform: rotate(0) }
          20%{ transform: rotate(-6deg) }
          40%{ transform: rotate(6deg) }
          60%{ transform: rotate(-4deg) }
          80%{ transform: rotate(3deg) }
        }

        /* ===== Layout base ===== */
        .page-root{ position:relative; min-height:70vh; display:grid; place-items:center; text-align:center; overflow:hidden; }
        .uc-wrap{ width:100%; display:flex; justify-content:center; align-items:center; padding-inline:12px; }
        .ucard{ box-sizing:border-box; max-width:760px; padding: clamp(18px,4vw,30px) clamp(18px,4vw,34px); display:grid; gap:14px; justify-items:center; text-align:center; margin-inline:auto !important; }
        .ucard-badge{ font-weight:600; letter-spacing:.2px; }
        .ucard-icon{ display:grid; place-items:center; width: clamp(72px,12vw,110px); height: clamp(72px,12vw,110px); border-radius:18px; border:1px solid rgba(34,197,94,.35); background: color-mix(in oklab, var(--background), transparent 10%); box-shadow: 0 10px 24px rgba(0,0,0,.22); color: color-mix(in oklab, var(--foreground), transparent 0%); cursor:pointer; }
        .ucard-emoji{ font-size: clamp(42px,6vw,64px); line-height:1; }
        .ucard-title{ margin:6px 0 2px 0; font-size: clamp(22px,4.2vw,32px); font-weight:800; letter-spacing:.2px; color: color-mix(in oklab, var(--foreground), transparent 4%); }
        .ucard-lead{ margin:0; font-size: clamp(15px,2.1vw,18px); opacity:.92; }
        .ucard-sub { margin:0; font-size: clamp(14px,2vw,17px); opacity:.85; }
        .ucard-ctas{ display:inline-flex; gap:12px; margin-top: clamp(8px,3vh,16px); flex-wrap:wrap; justify-content:center; }

        /* Chispas */
        .ucard-pop-layer{ position:fixed; inset:0; pointer-events:none; z-index:8; }
        .spark{ position:fixed; left:0; top:0; transform:translate(-50%,-50%); animation:spark-pop .9s ease forwards; text-shadow:0 2px 10px rgba(34,197,94,.35); pointer-events:none; }
        @keyframes spark-pop{ 0%{opacity:0; transform: translate(calc(-50% + 0px), calc(-50% + 0px)) scale(.9);} 15%{opacity:1;} 100%{opacity:0; transform: translate(calc(-50% + var(--dx)), calc(-50% + var(--dy))) scale(1.15);} }

        /* Fondo animado (PC) */
        .ucard-bg-emoji{ position:fixed; inset:-8%; z-index:0; pointer-events:none; opacity:.12; display:none; filter:blur(1px); }
        .bg-emo{ position:absolute; font-size: clamp(80px,14vw,220px); animation:drift 22s ease-in-out infinite alternate; transform:translate3d(0,0,0); user-select:none; }
        .bg-emo.e1{ left:10%; top:20%; animation-duration:24s; }
        .bg-emo.e2{ left:65%; top:18%; animation-duration:26s; }
        .bg-emo.e3{ left:30%; top:65%; animation-duration:22s; }
        .bg-emo.e4{ left:78%; top:62%; animation-duration:20s; }
        .bg-emo.e5{ left:6%;  top:78%; animation-duration:23s; }
        @keyframes drift{ 0%{ transform:translate(0,0) scale(.98) rotate(.5deg); opacity:.13;} 50%{ transform:translate(2vw,-2vh) scale(1.02) rotate(-1deg); opacity:.16;} 100%{transform:translate(-1.2vw,2vh) scale(1) rotate(1deg); opacity:.14;} }

        /* Móvil */
        @media (max-width: 900px){
          html, body { overflow-x:hidden; }
          .page-root{ min-height:auto; padding:16px 0; overflow:visible; display:block; }
          .uc-wrap{ padding-inline:12px; }
          .ucard{ width:100%; max-width:520px; padding:16px 16px; gap:12px; }
          .ucard-title{ font-size: clamp(20px,6.2vw,28px); }
          .ucard-lead { font-size: clamp(14px,4.2vw,17px); }
          .ucard-sub  { font-size: clamp(13px,3.9vw,16px); }
          .ucard-ctas { gap:10px; }
          .ucard-bg-emoji{ display:none; }
        }
        @media (max-width: 900px) and (orientation: landscape){ .ucard{ max-width:560px; } }
        @media (min-width: 901px){ .ucard-bg-emoji{ display:block; } }
      `}</style>
    </main>
  );
}

export default function ZTVPage() {
  return (
    <I18nProvider>
      <ZTVInner />
    </I18nProvider>
  );
}
