// src/app/signup/page.tsx
"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { I18nProvider, useLang } from "../../lib/i18n-client";

/* =========================================================
   Configuración de frases del globo por idioma
   ========================================================= */

type Lang = "es" | "pt" | "fr" | "en";

const BUBBLE_MESSAGES: Record<Lang, readonly string[]> = {
  es: [
    "Ups... eso no me lo esperaba...",
    "Si tocas algunos iconos sueltan emojis 😗",
    "Gracias por pasar ✨",
    "Obras en curso 👷‍♂️",
    "Pronto habrá novedades 🛠️",
  ],
  pt: [
    "Ops... eu não esperava por isso...",
    "Se você tocar em alguns ícones, eles soltam emojis",
    "Valeu a visita ✨",
    "Obras em andamento 🚧",
    "Novidades em breve 🛠️",
  ],
  fr: [
    "Oups... je ne m'y attendais pas...",
    "Si tu touches certains icônes, ils affichent des émojis",
    "Merci de la visite ✨",
    "Chantier en cours 🚧",
    "Des nouvelles arrivent 🛠️",
  ],
  en: [
    "Oops... I didn’t see that coming...",
    "If you tap some icons, they release emojis",
    "Thanks for stopping by ✨",
    "Work in progress 🚧",
    "Updates coming soon 🛠️",
  ],
};

/* Util para normalizar lang externo a nuestra union */
function normalizeLang(raw: string): Lang {
  const v = (raw || "en").toLowerCase();
  if (v.startsWith("es")) return "es";
  if (v.startsWith("pt")) return "pt";
  if (v.startsWith("fr")) return "fr";
  return "en";
}

function SignupInner() {
  const { lang } = useLang();
  const langKey = normalizeLang(lang);

  const i18n: Record<
    Lang,
    {
      title: string;
      lead: string;
      sub: string;
      support: string;
      back: string;
      more: string;
      badge: string;
      aria: string;
    }
  > = {
    es: {
      title: "Aún en construcción",
      lead:
        "Gracias por tu interés en ZProject. Estamos trabajando duro para tener el proyecto listo y disponible para todos.",
      sub:
        "Si quieres acelerar el desarrollo, tu apoyo hace una gran diferencia. Por ahora, yo estoy financiando el proyecto solo, y eso lleva más tiempo.",
      support: "Apoyar",
      back: "Volver al inicio",
      more: "Aprender más de nosotros",
      badge: "Próximamente",
      aria: "Página en construcción",
    },
    pt: {
      title: "Ainda em construção",
      lead:
        "Obrigado pelo seu interesse no ZProject. Estamos trabalhando para deixar tudo pronto e disponível para todos.",
      sub:
        "Se quiser acelerar o desenvolvimento, seu apoio faz muita diferença. Por enquanto estou financiando o projeto sozinho, e isso leva mais tempo.",
      support: "Apoiar",
      back: "Voltar ao início",
      more: "Saiba mais sobre nós",
      badge: "Em breve",
      aria: "Página em construção",
    },
    fr: {
      title: "Encore en construction",
      lead:
        "Merci pour votre intérêt pour ZProject. Nous travaillons dur pour rendre le projet disponible pour tous.",
      sub:
        "Si vous voulez accélérer le développement, votre soutien compte énormément. Pour l’instant je finance seul le projet, cela prend plus de temps.",
      support: "Soutenir",
      back: "Retour à l’accueil",
      more: "En savoir plus sur nous",
      badge: "Bientôt",
      aria: "Page en construction",
    },
    en: {
      title: "Still under construction",
      lead:
        "Thanks for your interest in ZProject. We’re working hard to get the project ready and available for everyone.",
      sub:
        "If you’d like to speed things up, your support makes a big difference. For now, I’m funding the project alone, which takes longer.",
      support: "Support",
      back: "Back to home",
      more: "Learn more about us",
      badge: "Coming soon",
      aria: "Page under construction",
    },
  };

  const t = i18n[langKey];

  // ====== Globo de diálogo (rotación 1 a 1 por visita/retorno) ======
  const bubbleRef = useRef<HTMLDivElement>(null);

  // Elegimos la lista según idioma (fallback garantizado por el tipo)
  const messages = BUBBLE_MESSAGES[langKey] ?? BUBBLE_MESSAGES.en;
  const LOCAL_KEY = "z_bubble_idx_signup";

  // Calcula el siguiente texto (memoizado para contentar el linter)
  const getNextBubbleText = useCallback((): string => {
    try {
      const raw = window.localStorage.getItem(LOCAL_KEY);
      const prev = raw ? parseInt(raw, 10) : 0;
      const safePrev = Number.isFinite(prev) ? prev : 0;
      const idx = messages.length > 0 ? safePrev % messages.length : 0;
      const text = messages[idx] || "";
      const next = messages.length > 0 ? (idx + 1) % messages.length : 0;
      window.localStorage.setItem(LOCAL_KEY, String(next));
      return text;
    } catch {
      // Si localStorage falla, devolvemos la primera
      return messages[0] || "";
    }
  }, [messages]);

  const [bubbleText, setBubbleText] = useState<string>(() => messages[0] || "");

  // Al montar o cambiar idioma: elegir siguiente y colocar el globo
  useEffect(() => {
    setBubbleText(getNextBubbleText());

    // Colocación + wiggle atado al icono del header
    const icon =
      (document.querySelector(
        "header a svg, header a img, header .site-logo svg, header .site-logo img, [data-logo-icon]"
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
        const targetX = r.left + r.width / 2;
        const ARROW_LEFT_PX = 18;
        const EXTRA_LEFT_SHIFT = 8;
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
  }, [getNextBubbleText, langKey]);

  // Pops del emoji central (sin cambios de comportamiento)
  const popLayerRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = iconRef.current;
    const layer = popLayerRef.current || document.body;
    if (!el) return;

    const EMOJIS: readonly string[] = ["🔨", "🛠️", "🧱", "⚠️", "🔧", "⛓️", "🏗️", "⛏️", "🚧", "⏰", "🐌"];

    function spawnOne() {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;

      const s = document.createElement("span");
      s.className = "uc-pop";
      s.textContent = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
      s.style.left = `${cx}px`;
      s.style.top = `${cy}px`;

      const ang = Math.random() * Math.PI - Math.PI / 2;
      const dist = 40 + Math.random() * 60;
      const dx = Math.cos(ang) * dist;
      const dy = -Math.abs(Math.sin(ang) * dist) - (20 + Math.random() * 20);
      s.style.setProperty("--dx", `${dx}px`);
      s.style.setProperty("--dy", `${dy}px`);
      s.style.setProperty(
        "--spin",
        `${(Math.random() > 0.5 ? 1 : -1) * (180 + Math.floor(Math.random() * 180))}deg`
      );
      s.style.fontSize = `${22 + Math.random() * 10}px`;

      layer.appendChild(s);
      setTimeout(() => s.remove(), 1100);
    }

    el.addEventListener("click", spawnOne);
    el.addEventListener("touchend", spawnOne as EventListener, { passive: true });
    return () => {
      el.removeEventListener("click", spawnOne);
      el.removeEventListener("touchend", spawnOne as EventListener);
    };
  }, []);

  return (
    <main className="uc-page relative min-h-[72vh] flex items-center justify-center text-center overflow-hidden">
      {/* Globo de diálogo pegado al icono del header */}
      <div ref={bubbleRef} className="talk-bubble" role="status" aria-live="polite">
        {bubbleText}
      </div>

      {/* Capa de pops */}
      <div ref={popLayerRef} className="uc-pop-layer" aria-hidden />

      {/* Fondo de emojis */}
      <div className="uc-bg" aria-hidden>
        <span className="uc-emo e1">🚧</span>
        <span className="uc-emo e2">👷‍♂️</span>
        <span className="uc-emo e3">🏗️</span>
        <span className="uc-emo e4">🛠️</span>
        <span className="uc-emo e5">🚧</span>
      </div>

      {/* Wrap centrado */}
      <section className="uc-wrap container px-6 relative z-[2]">
        <article className="settings-card uc-card" aria-label={t.aria} role="status">
          <div className="badge uc-badge">{t.badge}</div>

          <div
            ref={iconRef}
            className="uc-icon"
            aria-hidden
            role="button"
            tabIndex={0}
            title="Toca para una sorpresa"
          >
            <span className="uc-emoji">🚧</span>
          </div>

          <h1 className="uc-title">{t.title}</h1>
          <p className="uc-lead">{t.lead}</p>
          <p className="uc-sub">{t.sub}</p>

          <div className="uc-ctas">
            <Link href="/thanks" className="btn-primary uc-btn">
              {t.support}
            </Link>
            <Link href="/about" className="btn-ghost uc-btn btn-pulse">
              {t.more}
            </Link>
            <Link href="/" className="btn-ghost uc-btn">
              {t.back}
            </Link>
          </div>
        </article>
      </section>

      <style>{`
        /* ===== Evitar desplazamiento lateral SOLO en esta página ===== */
        .uc-page, .uc-page * { box-sizing: border-box; }
        .uc-page { overflow-x: hidden; }

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

        /* Wiggle del icono del header */
        .logo-solo-talk{ animation: wiggle .6s ease-in-out 3; transform-origin: 50% 50%; }
        @keyframes wiggle{
          0%,100%{ transform: rotate(0) }
          20%{ transform: rotate(-6deg) }
          40%{ transform: rotate(6deg) }
          60%{ transform: rotate(-4deg) }
          80%{ transform: rotate(3deg) }
        }

        /* ===== Centrado del bloque ===== */
        .uc-wrap{
          display: grid;
          place-items: center;
          width: 100%;
          padding-left: max(16px, env(safe-area-inset-left));
          padding-right: max(16px, env(safe-area-inset-right));
        }

        /* ===== Card ===== */
        .uc-card{
          width: min(100%, 820px);
          margin-inline: auto;
          padding: clamp(18px, 4vw, 34px);
          display: grid;
          gap: clamp(10px, 1.8vw, 16px);
          justify-items: center;
          text-align: center;
        }

        /* ===== Badge ===== */
        .uc-badge{
          font-weight: 600;
          letter-spacing: .2px;
          display: inline-block;
          max-width: 100%;
          white-space: normal;
          overflow-wrap: anywhere;
          line-height: 1.1;
          padding: .4rem .6rem;
        }

        /* ===== Icono (emoji) ===== */
        .uc-icon{
          display: grid; place-items: center;
          width: clamp(76px, 12vw, 124px);
          height: clamp(76px, 12vw, 124px);
          border-radius: 18px;
          border: 1px solid rgba(34,197,94,.35);
          background: color-mix(in oklab, var(--background), transparent 10%);
          box-shadow: 0 10px 24px rgba(0,0,0,.22);
          color: color-mix(in oklab, var(--foreground), transparent 0%);
          cursor: pointer;
          transition: transform .15s ease;
        }
        .uc-icon:active{ transform: scale(.98); }
        .uc-emoji{ font-size: clamp(42px, 6.5vw, 68px); line-height: 1; }

        /* ===== Tipografía ===== */
        .uc-title{
          margin: 6px 0 2px 0;
          font-size: clamp(22px, 4.4vw, 34px);
          font-weight: 800;
          letter-spacing: .2px;
          color: color-mix(in oklab, var(--foreground), transparent 4%);
        }
        .uc-lead{
          margin: 0; font-size: clamp(15px, 2.1vw, 18px);
          opacity: .92; max-width: 62ch;
        }
        .uc-sub{
          margin: 0; font-size: clamp(14px, 2vw, 17px);
          opacity: .85; max-width: 66ch;
        }

        /* ===== CTAs ===== */
        .uc-ctas{
          display: flex;
          gap: 12px;
          margin-top: clamp(10px, 3.4vh, 22px);
          flex-wrap: wrap;
          align-items: center;
          justify-content: center;
          width: 100%;
        }
        .uc-btn{
          text-align: center;
          min-width: 220px;
          white-space: normal;
          overflow-wrap: anywhere;
          line-height: 1.15;
        }
        .btn-primary, .btn-ghost{
          white-space: normal;
          overflow-wrap: anywhere;
        }

        /* ===== Efecto latido ===== */
        .btn-pulse{
          position: relative;
          animation: pulseBeat 2.2s ease-in-out infinite;
        }
        @keyframes pulseBeat{
          0%   { transform: translateY(0) scale(1); box-shadow: 0 0 0 0 rgba(34,197,94,0); }
          50%  { transform: translateY(-1px) scale(1.02); box-shadow: 0 0 0 6px rgba(34,197,94,.10); }
          100% { transform: translateY(0) scale(1); box-shadow: 0 0 0 0 rgba(34,197,94,0); }
        }

        /* ===== Pops (click en emoji central) ===== */
        .uc-pop-layer{ position: fixed; inset: 0; pointer-events: none; z-index: 6; }
        .uc-pop{
          position: fixed;
          left: 0; top: 0;
          transform: translate(calc(-50% + 0px), calc(-50% + 0px)) rotate(0deg);
          animation: uc-pop-fly 1.05s ease-out forwards;
          text-shadow: 0 2px 12px rgba(0,0,0,.35);
          user-select: none;
          will-change: transform, opacity;
        }
        @keyframes uc-pop-fly{
          0%   { opacity: 0; transform: translate(calc(-50% + 0px), calc(-50% + 0px)) scale(.9) rotate(0deg); }
          20%  { opacity: 1; }
          100% { opacity: 0; transform: translate(calc(-50% + var(--dx)), calc(-50% + var(--dy))) scale(1.15) rotate(var(--spin)); }
        }

        /* ===== Fondo animado (emojis) ===== */
        .uc-bg{
          position: fixed;
          inset: -8%;
          z-index: 1;
          pointer-events: none;
          opacity: .20;
          filter: blur(0.5px);
        }
        .uc-emo{
          position: absolute;
          font-size: clamp(78px, 14vw, 240px);
          animation: uc-drift 22s ease-in-out infinite alternate;
          transform: translate3d(0,0,0);
          user-select: none;
        }
        .uc-emo.e1{ left: 8%;  top: 18%; animation-duration: 24s; }
        .uc-emo.e2{ left: 62%; top: 16%; animation-duration: 26s; }
        .uc-emo.e3{ left: 28%; top: 66%; animation-duration: 22s; }
        .uc-emo.e4{ left: 76%; top: 64%; animation-duration: 20s; }
        .uc-emo.e5{ left: 4%;  top: 78%; animation-duration: 23s; }

        @keyframes uc-drift {
          0%   { transform: translate(0, 0) scale(.98) rotate(.4deg); opacity: .16; }
          50%  { transform: translate(2.2vw, -2vh) scale(1.02) rotate(-.8deg); opacity: .22; }
          100% { transform: translate(-1.2vw, 2.2vh) scale(1.00) rotate(.9deg); opacity: .18; }
        }

        /* ===== Mobile ===== */
        @media (max-width: 900px){
          .uc-bg{ opacity: .18; }
          .uc-emo{ font-size: clamp(72px, 22vw, 160px); }
          .uc-ctas{ gap: 10px; }
          .uc-btn{ width: min(100%, 440px); }
        }

        /* ===== Desktop ===== */
        @media (min-width: 901px){
          .uc-bg{ opacity: .22; }
        }
      `}</style>
    </main>
  );
}

export default function SignupPage() {
  return (
    <I18nProvider>
      <SignupInner />
    </I18nProvider>
  );
}
