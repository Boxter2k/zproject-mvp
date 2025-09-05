// src/app/page.tsx
"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { I18nProvider, useLang } from "../lib/i18n-client";

function HomeInner() {
  const { lang } = useLang();

  // CTA principal (más aspiracional)
  const startLabel =
    lang === "es" ? "Únete al santuario" :
    lang === "pt" ? "Junte-se ao santuário" :
    lang === "fr" ? "Rejoignez le sanctuaire" :
    "Join the sanctuary";

  const dlLabel =
    lang === "es" ? "Descargar app" :
    lang === "pt" ? "Baixar app" :
    lang === "fr" ? "Télécharger l’app" :
    "Download app";

  const supportLabel =
    lang === "es" ? "Apoyar" :
    lang === "pt" ? "Apoiar" :
    lang === "fr" ? "Soutenir" :
    "Support";

  const communityTitle =
    lang === "es" ? "Únete a la comunidad" :
    lang === "pt" ? "Junte-se à comunidade" :
    lang === "fr" ? "Rejoignez la communauté" :
    "Join the community";

  const communityText =
    lang === "es" ? "Feedback, sneak peeks y artistas como tú." :
    lang === "pt" ? "Feedbacks, bastidores e criadores como você." :
    lang === "fr" ? "Retours, aperçus et des créateurs comme vous." :
    "Feedback, sneak peeks, and creators like you.";

  const aspiration =
    lang === "es" ? "Construyamos un santuario donde el arte respire." :
    lang === "pt" ? "Vamos construir um santuário onde a arte respira." :
    lang === "fr" ? "Bâtissons un sanctuaire où l’art respire." :
    "Let’s build a sanctuary where art breathes.";

  const heroLine =
    lang === "es"
      ? "Donde las ideas se convierten en arte — y el arte en mundos por descubrir."
      : lang === "pt"
      ? "Onde ideias viram arte — e a arte se torna mundos para explorar."
      : lang === "fr"
      ? "Là où les idées deviennent art — et l’art ouvre des mondes à explorer."
      : "Where ideas become art — and art becomes worlds to explore.";

  const R = {
    es: ["Un santuario para creadores", "Inspírate, crea, comparte", "Donde tu arte encuentra hogar"],
    pt: ["Um santuário para criadores", "Inspire-se, crie, compartilhe", "Onde sua arte encontra um lar"],
    fr: ["Un sanctuaire pour créateurs", "Inspirez, créez, partagez", "Là où votre art a sa place"],
    en: ["A sanctuary for creators", "Inspire, create, share", "Where your art belongs"],
  } as const;

  const phrases =
    lang === "es" ? R.es :
    lang === "pt" ? R.pt :
    lang === "fr" ? R.fr :
    R.en;

  const BRAND1 =
    lang === "es" ? "No venimos a reemplazar tu mundo — venimos a mejorarlo." :
    lang === "pt" ? "Não viemos substituir o seu mundo — viemos torná-lo melhor." :
    lang === "fr" ? "Nous ne sommes pas là pour remplacer ton monde — nous sommes là pour l’améliorer." :
    "We’re not here to replace your world — we’re here to make it better.";

  const BRAND2 =
    lang === "es" ? "Cumplamos nuestros sueños juntos." :
    lang === "pt" ? "Vamos realizar nossos sonhos juntos." :
    lang === "fr" ? "Réalisons nos rêves ensemble." :
    "Let’s make our dreams come true.";

  const rollerPhrases = [heroLine, ...phrases, BRAND1, BRAND2];
  const COMMUNITY_URL = "https://discord.gg/5Y4Yz2cS";

  // ===== Pasos con rebote + chispitas =====
  const step1Ref = useRef<HTMLDivElement>(null);
  const step2Ref = useRef<HTMLDivElement>(null);
  const step3Ref = useRef<HTMLDivElement>(null);
  const layerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const layer = layerRef.current || document.body;

    function spawnSparkles(target: HTMLElement) {
      const rect = target.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const EMOJIS = ["✨", "⭐", "🎉"];
      const n = 12 + Math.floor(Math.random() * 6);
      for (let i = 0; i < n; i++) {
        const s = document.createElement("span");
        s.className = "spark";
        s.textContent = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
        const ang = Math.random() * Math.PI * 2;
        const dist = 20 + Math.random() * 36;
        const dx = Math.cos(ang) * dist;
        const dy = Math.sin(ang) * dist;
        s.style.left = `${cx}px`;
        s.style.top = `${cy}px`;
        s.style.setProperty("--dx", `${dx}px`);
        s.style.setProperty("--dy", `${dy}px`);
        s.style.fontSize = `${16 + Math.random() * 10}px`;
        (layer as HTMLElement).appendChild(s);
        setTimeout(() => s.remove(), 900);
      }
    }

    function bounce(el?: HTMLElement | null) {
      if (!el) return;
      el.classList.add("is-bounce");
      setTimeout(() => el.classList.remove("is-bounce"), 600);
    }

    const run = () => {
      let t = 200;
      setTimeout(() => bounce(step1Ref.current), (t += 200));
      setTimeout(() => bounce(step2Ref.current), (t += 400));
      setTimeout(() => {
        bounce(step3Ref.current);
        if (step3Ref.current) spawnSparkles(step3Ref.current);
      }, (t += 400));
    };
    run();
    const loopId = window.setInterval(run, 6000);
    return () => clearInterval(loopId);
  }, []);

  // ===== Roller (derecha en desktop, centrado bajo el título en móvil) =====
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const winRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => {
      setIdx((i) => (i + 1) % rollerPhrases.length);
    }, 8000);
    return () => clearInterval(t);
  }, [paused, rollerPhrases.length]);

  // ⬇️ Ajuste: en móvil, ancho cómodo ~82vw
  useEffect(() => {
    const win = winRef.current;
    const txt = textRef.current;
    if (!win || !txt) return;

    const cs = getComputedStyle(win);
    const pl = parseFloat(cs.paddingLeft);
    const pr = parseFloat(cs.paddingRight);
    const pt = parseFloat(cs.paddingTop);
    const pb = parseFloat(cs.paddingBottom);

    const isMobile = window.innerWidth <= 900;
    const maxW = Math.min(window.innerWidth * (isMobile ? 0.82 : 0.46), 780);
    const minW = isMobile ? 140 : 280;

    txt.style.whiteSpace = "nowrap";
    const natural = txt.getBoundingClientRect();
    let targetW = natural.width + pl + pr;
    targetW = Math.max(minW, Math.min(targetW, maxW));
    win.style.width = `${targetW}px`;

    txt.style.whiteSpace = "normal";
    const wrapped = txt.getBoundingClientRect();
    win.style.height = `${wrapped.height + pt + pb}px`;
  }, [idx, lang]);

  useEffect(() => {
    const onR = () => setIdx((i) => i);
    window.addEventListener("resize", onR);
    return () => window.removeEventListener("resize", onR);
  }, []);

  // ===== Globo de diálogo pegado al icono del header =====
  const bubblePhrases = useMemo(
    () =>
      lang === "es"
        ? [
            "¡Hola! Bienvenido ✨",
            "Disfruta la casa del arte 💚",
            "La página se ve mucho mejor en ordenador",
            "¿Que si me programaron?!.. ¡Soy independiente!!.. bueno sí, tal vez un poco...",
            "¿A veces hablo demasiado eh?... Debería hablar menos",
            "Me dijeron que seré tu guía. Puedes cambiar el idioma y configuraciones abajo👇",
            "Deberías conocer a Kuro, te caerá bien",
            "Hay un easter egg. ¿Ya lo viste?",
            "Gracias por pasar 🛎️",
            "Hoy me levanté creativo. Tú trae el café ☕ y vamos.",
            "Si ves algo raro… es arte moderno 😉",
            "Prometo no spammear… a menos que me lo pidas.",
            "¿Modo zen o modo caos creativo? Tú eliges.",
            "Mi hobby: animar píxeles y halagar artistas. Sí, tú.",
            "Tip ninja: el botón de Discord te abre puertas 🔑",
            "Si te pierdes, me chiflas. Soy GPS con glitter ✨",
            "Tu proyecto + un empujón = magia. Haz push.",
            "En ordenador vuelo. En móvil bailo. En ambos te acompaño.",
            "¿Venías por arte o por chisme? Acá hay de los dos 😌"
          ]
        : lang === "pt"
        ? [
            "Olá! Bem-vindo ✨",
            "Aproveite a casa da arte 💚",
            "A página fica muito melhor no computador",
            "Me programaram?!.. Sou independente!!.. bom, talvez um pouco...",
            "Às vezes eu falo demais, né?... Deveria falar menos",
            "Disseram que eu seria o seu guia. Você pode mudar o idioma e as configurações abaixo👇",
            "Você deveria conhecer o Kuro, vai gostar dele",
            "Tem um easter egg. Já viu?",
            "Obrigado por passar 🛎️",
            "Hoje acordei criativo. Você traz o café ☕ e vamos.",
            "Se vir algo estranho… é arte moderna 😉",
            "Prometo não spammar… a menos que peça.",
            "Modo zen ou caos criativo? Você escolhe.",
            "Meu hobby: animar pixels e elogiar artistas. Sim, você.",
            "Dica ninja: o botão do Discord abre portas 🔑",
            "Se se perder, me chama. Sou um GPS com glitter ✨",
            "Seu projeto + um empurrão = mágica. Dá o push.",
            "No computador eu voo. No celular eu danço. Em ambos te acompanho.",
            "Veio por arte ou fofoca? Aqui tem os dois 😌"
          ]
        : lang === "fr"
        ? [
            "Salut ! Bienvenue ✨",
            "Profite de la maison de l’art 💚",
            "Le site est bien plus beau sur ordinateur",
            "On m’a programmé ?!.. Je suis indépendant !!.. enfin, peut-être un peu...",
            "Je parle trop parfois, hein ?... Je devrais parler moins",
            "On m’a dit que je serai ton guide. Tu peux changer la langue et les réglages en bas👇",
            "Tu devrais rencontrer Kuro, tu l’aimeras bien",
            "Il y a un easter egg. Tu l’as trouvé ?",
            "Merci de passer 🛎️",
            "Aujourd’hui, je me sens créatif. Apporte le café ☕ et allons-y.",
            "Si tu vois quelque chose de bizarre… c’est de l’art moderne 😉",
            "Je promets de ne pas spammer… sauf si tu le demandes.",
            "Mode zen ou chaos créatif ? À toi de choisir.",
            "Mon hobby : animer des pixels et flatter les artistes. Oui, toi.",
            "Astuce ninja : le bouton Discord ouvre des portes 🔑",
            "Si tu te perds, appelle-moi. Je suis un GPS avec des paillettes ✨",
            "Ton projet + un coup de pouce = magie. Push-le.",
            "Sur ordinateur je vole. Sur mobile je danse. Je t’accompagne partout.",
            "Tu viens pour l’art ou pour les potins ? Ici, il y a les deux 😌"
          ]
        : [
            "Hey! Welcome ✨",
            "Enjoy the art sanctuary 💚",
            "The page looks way better on desktop",
            "Did they program me?!.. I'm independent!!.. well, maybe a little...",
            "Do I talk too much sometimes?... I should talk less",
            "They told me I’d be your guide. You can change language and settings below👇",
            "You should meet Kuro, you’ll like him",
            "There’s an easter egg. Did you find it?",
            "Thanks for stopping by 🛎️",
            "Woke up creative today. You bring the coffee ☕ and let’s go.",
            "If you see something weird… it’s modern art 😉",
            "Promise I won’t spam… unless you ask me to.",
            "Zen mode or creative chaos? You choose.",
            "My hobby: animating pixels and complimenting artists. Yes, you.",
            "Ninja tip: the Discord button opens doors 🔑",
            "If you get lost, just call me. I’m GPS with glitter ✨",
            "Your project + a little push = magic. Go ship it.",
            "On desktop I fly. On mobile I dance. On both, I’m with you.",
            "Came for the art or the gossip? We’ve got both 😌"
          ],
    [lang]
  );

  const [bubbleText, setBubbleText] = useState<string>(bubblePhrases[0]);
  const bubbleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setBubbleText(bubblePhrases[0]);
    try {
      const key = "z_bubble_idx_home";
      const prev = Number((typeof window !== "undefined" ? window.localStorage?.getItem(key) : "0") || "0");
      const idx = isNaN(prev) ? 0 : prev;
      const txt = bubblePhrases[idx % bubblePhrases.length];
      setBubbleText(txt);
      if (typeof window !== "undefined") {
        window.localStorage?.setItem(key, String((idx + 1) % bubblePhrases.length));
      }
    } catch {}
  }, [lang, bubblePhrases]);

  // Colocación y wiggle del icono del header
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
        bubble.style.left = `${left}px`; // ← corregido (sin paréntesis extra)
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
    <main className="relative min-h-screen flex items-center justify-center text-center">
      {/* Globo de diálogo pegado al icono del header */}
      <div ref={bubbleRef} className="talk-bubble" role="status" aria-live="polite">
        {bubbleText}
      </div>

      <div className="grid-overlay" aria-hidden />
      <div ref={layerRef} className="steps-pop-layer" aria-hidden />

      <section className="container px-6 flex flex-col items-center gap-12">
        {/* Título + roller */}
        <div className="hero-wrap">
          <h1 className="leading-[0.8] font-black tracking-tight m-0">
            <span className="hero-zproject hero-zproject--XL">
              ZProject<sup className="tm">TM</sup>
              <span className="hero-shine" aria-hidden />
            </span>
          </h1>

        <div
            ref={winRef}
            className="roller-window fader-mode"
            aria-live="polite"
            aria-atomic="true"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            <span key={idx} ref={textRef} className={`fader ${paused ? "is-paused" : ""}`}>
              {rollerPhrases[idx]}
            </span>
          </div>
        </div>

        {/* CTAs */}
        <div className="flex justify-center gap-4 mt-2 hero-ctas">
          <Link href="/signup" className="btn-primary">{startLabel}</Link>
          <Link href="/download" className="btn-ghost">{dlLabel}</Link>
        </div>

        {/* Beneficios */}
        <section className="benefits section-spacer">
          <article className="settings-card b-card">
            <div className="b-ico" aria-hidden>✨</div>
            <h3 className="b-title">
              {lang === "es" ? "Descubre talento" :
               lang === "pt" ? "Descubra talento" :
               lang === "fr" ? "Découvrez des talents" : "Discover talent"}
            </h3>
            <p className="b-text">
              {lang === "es" ? "Un feed curado que pone el arte en primer plano." :
               lang === "pt" ? "Um feed curado com foco na arte." :
               lang === "fr" ? "Un flux soigné qui met l’art en avant." :
               "A curated feed that puts art first."}
            </p>
          </article>

          <article className="settings-card b-card">
            <div className="b-ico" aria-hidden>🎨</div>
            <h3 className="b-title">
              {lang === "es" ? "Crea sin fricción" :
               lang === "pt" ? "Crie sem atrito" :
               lang === "fr" ? "Créez sans friction" : "Create frictionlessly"}
            </h3>
            <p className="b-text">
              {lang === "es" ? "Perfiles de artista y herramientas pensadas para ti." :
               lang === "pt" ? "Perfis de artista e ferramentas pensadas para você." :
               lang === "fr" ? "Profils d’artistes et outils pensés pour vous." :
               "Artist profiles and tools built for you."}
            </p>
          </article>

          <article className="settings-card b-card">
            <div className="b-ico" aria-hidden>💚</div>
            <h3 className="b-title">
              {lang === "es" ? "Apoya y crece" :
               lang === "pt" ? "Apoie e cresça" :
               lang === "fr" ? "Soutenez et grandissez" : "Support & grow"}
            </h3>
            <p className="b-text">
              {lang === "es" ? "Una comunidad que impulsa a los creadores." :
               lang === "pt" ? "Uma comunidade que impulsiona criadores." :
               lang === "fr" ? "Une communauté qui propulse les créateurs." :
               "A community that uplifts creators."}
            </p>
          </article>
        </section>

        {/* Pasos */}
        <section className="steps settings-card section-spacer">
          <div ref={step1Ref} className="step anim-step">
            <div className="step-ico" aria-hidden>👤</div>
            <h4 className="step-title">
              {lang === "es" ? "Regístrate" :
               lang === "pt" ? "Cadastre-se" :
               lang === "fr" ? "Inscrivez-vous" : "Sign up"}
            </h4>
            <p className="step-text">
              {lang === "es" ? "Crea tu perfil y di qué haces." :
               lang === "pt" ? "Crie seu perfil e diga o que faz." :
               lang === "fr" ? "Créez votre profil et dites ce que vous faites." :
               "Create your profile and tell us what you do."}
            </p>
          </div>

          <div ref={step2Ref} className="step anim-step">
            <div className="step-ico" aria-hidden>🎨</div>
            <h4 className="step-title">
              {lang === "es" ? "Comparte" :
               lang === "pt" ? "Compartilhe" :
               lang === "fr" ? "Partagez" : "Share"}
            </h4>
            <p className="step-text">
              {lang === "es" ? "Sube obras, prototipos o procesos." :
               lang === "pt" ? "Envie obras, protótipos ou processos." :
               lang === "fr" ? "Publiez œuvres, prototypes ou process." :
               "Post finished work, WIPs, or process."}
            </p>
          </div>

          <div ref={step3Ref} className="step anim-step">
            <div className="step-ico" aria-hidden>🤝</div>
            <h4 className="step-title">
              {lang === "es" ? "Conecta" :
               lang === "pt" ? "Conecte" :
               lang === "fr" ? "Connectez" : "Connect"}
            </h4>
            <p className="step-text">
              {lang === "es" ? "Recibe feedback y apoya a otros." :
               lang === "pt" ? "Receba feedback e apoie outros." :
               lang === "fr" ? "Recevez des retours et soutenez." :
               "Get feedback and support others."}
            </p>
          </div>
        </section>

        {/* Comunidad */}
        <section className="community settings-card section-spacer">
          <div className="c-left">
            <h3 className="c-title">{communityTitle}</h3>
            <p className="c-text">{communityText}</p>
          </div>
          <div className="c-right">
            <a href={COMMUNITY_URL} className="btn-primary" target="_blank" rel="noopener noreferrer">Discord</a>
            <span className="c-or">/</span>
            <Link href="/thanks" className="btn-ghost">{supportLabel}</Link>
          </div>
        </section>

        <p className="asp">{aspiration}</p>
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

        .logo-solo-talk{ animation: wiggle .6s ease-in-out 3; transform-origin: 50% 50%; }
        @keyframes wiggle{
          0%,100%{ transform: rotate(0) }
          20%{ transform: rotate(-6deg) }
          40%{ transform: rotate(6deg) }
          60%{ transform: rotate(-4deg) }
          80%{ transform: rotate(3deg) }
        }

        .hero-zproject--XL { font-size: clamp(80px, 16vw, 200px); display: inline-block; position: relative; }
        .hero-zproject .tm { 
          font-size: 0.28em; 
          margin-left: 0.25em; 
          vertical-align: super; 
          opacity: .6; 
          font-weight: 700;
          letter-spacing: .02em;
          line-height: 0;
        }

        /* Desktop: título + roller a la derecha (intacto) */
        .hero-wrap {
          display: flex; 
          align-items: flex-end; 
          gap: 0.6rem;
          justify-content: flex-start; 
          width: 100%; 
          margin-left: -2vw;
          flex-wrap: nowrap;
        }

        .roller-window.fader-mode{
          --roller-nudge: -70px;
          display: inline-flex; align-items: center; justify-content: center;
          min-height: 3.2em; min-width: 280px;
          border-radius: 12px;
          border: 1px solid rgba(34,197,94,.28);
          background: color-mix(in oklab, var(--background), transparent 6%);
          backdrop-filter: blur(6px);
          padding: .9rem 1.2rem;
          box-shadow: 0 10px 24px rgba(0,0,0,.18);
          align-self: flex-end;
          transform: translate(var(--roller-nudge), 12%);
          max-width: min(780px, 46vw);
          overflow: hidden;
          transition: width .6s ease, height .6s ease, transform .3s ease;
        }
        .fader{
          display:block;
          font-size: clamp(18px, 1.8vw, 28px);
          line-height: 1.25;
          font-weight: 600;
          letter-spacing: .2px;
          animation: fadeCycle 8s linear forwards;
          will-change: opacity, transform;
        }
        .roller-window.fader-mode:hover .fader{ animation-play-state: paused; }
        @keyframes fadeCycle{
          0%   { opacity: 0; transform: translateY(6px); }
          10%  { opacity: 1; transform: translateY(0); }
          80%  { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(-4px); }
        }

        .section-spacer { margin-top: clamp(32px, 7vh, 80px); }
        .benefits{ width:100%; display:grid; grid-template-columns:repeat(3,1fr); gap:22px; }
        .b-card{ padding:20px; text-align:left; }
        .b-ico{ font-size:24px; line-height:1; margin-bottom:12px; }
        .b-title{ margin:0 0 8px 0; font-weight:800; color: color-mix(in oklab, var(--foreground), transparent 6%); }
        .b-text{ opacity:.85; margin:0; }

        .steps{ display:grid; grid-template-columns:repeat(3,1fr); gap:22px; padding:18px; text-align:left; }
        .step{ padding:10px; position:relative; min-height:120px; border-radius:12px; }
        .steps .step:not(:last-child)::after{
          content:"➜"; position:absolute; right:-18px; top:50%; transform:translateY(-50%);
          opacity:.65; font-size:22px; line-height:1; color: color-mix(in oklab, var(--foreground), transparent 10%);
          text-shadow:0 0 12px rgba(34,197,94,.35);
        }
        .step-ico{ font-size:22px; opacity:.95; margin-bottom:6px; }
        .step-title{ margin:0 0 8px 0; font-weight:800; }
        .step-text{ margin:0; opacity:.85; }

        .anim-step { will-change: transform; }
        .anim-step.is-bounce{ animation: step-bounce .55s cubic-bezier(.34,1.56,.64,1); }
        @keyframes step-bounce {
          0% { transform: translateY(0); }
          30% { transform: translateY(-8px); }
          60% { transform: translateY(0); }
          80% { transform: translateY(-4px); }
          100% { transform: translateY(0); }
        }

        .steps-pop-layer{ position: fixed; inset: 0; pointer-events: none; z-index: 8; }
        .spark{
          position: fixed; left: 0; top: 0; transform: translate(-50%, -50%);
          animation: spark-pop .9s ease forwards; text-shadow: 0 2px 10px rgba(34,197,94,.35);
          pointer-events: none;
        }
        @keyframes spark-pop{
          0% { opacity: 0; transform: translate(calc(-50% + 0px), calc(-50% + 0px)) scale(.9); }
          15% { opacity: 1; }
          100% { opacity: 0; transform: translate(calc(-50% + var(--dx)), calc(-50% + var(--dy))) scale(1.15); }
        }

        .community{ display:grid; grid-template-columns:2fr 1fr; align-items:center; gap:16px; padding:20px; text-align:left; }
        .c-title{ margin:0 0 6px 0; font-weight:800; }
        .c-text{ margin:0; opacity:.85; }
        .c-right{ display:inline-flex; gap:12px; align-items:center; justify-content:flex-end; }
        .c-or{ opacity:.6; }
        .asp{ opacity:.85; margin-top:6px; font-size:.98rem; }

        /* ======== MÓVIL: centrado real, sin cortes, CTAs lado a lado ======== */
        @media (max-width: 900px) {
          /* safe-area para que nada quede bajo el header/notch */
          main { padding-top: max(12px, env(safe-area-inset-top)); }

          .hero-wrap { 
            flex-direction: column;        /* título arriba, roller abajo */
            align-items: center;
            justify-content: center;
            gap: .7rem;
            margin-left: 0;
            width: 100%;
            text-align: center;
          }

          .hero-zproject--XL{
            font-size: clamp(52px, 15vw, 108px); /* más grande en phone */
            line-height: .92;
            display: inline-block;
          }

          .roller-window.fader-mode { 
            --roller-nudge: 0px;
            transform: none;
            max-width: 92vw;               /* el JS limitará aprox. a 82vw */
            min-width: 140px;
            padding: .7rem .9rem;
            border-radius: 12px;
            align-self: center;
          }
          .roller-window.fader-mode .fader{
            font-size: clamp(14px, 3.9vw, 18px);
            line-height: 1.25;
          }

          /* CTAs lado a lado */
          .hero-ctas{
            width: 100%;
            display: flex;
            justify-content: center;
            margin-top: clamp(28px, 7vh, 64px) !important;
            gap: 10px;
            flex-wrap: nowrap;
          }
          .hero-ctas .btn-primary,
          .hero-ctas .btn-ghost{
            min-width: 47%;
            max-width: 48%;
            padding-left: 14px;
            padding-right: 14px;
          }
          /* En pantallas muy pequeñas, permitir wrap */
          @media (max-width: 360px){
            .hero-ctas{ flex-wrap: wrap; }
            .hero-ctas .btn-primary, .hero-ctas .btn-ghost{
              min-width: 100%;
              max-width: 100%;
            }
          }

          /* CARDS: ocupar más ancho y con aire */
          .benefits{ grid-template-columns:1fr; gap:16px; }
          .b-card{ padding: 18px; }
          .steps{ grid-template-columns:1fr; gap:16px; }
          .steps .step:not(:last-child)::after{ display:none; }

          .community{ 
            grid-template-columns:1fr; 
            text-align:left; 
            gap:14px; 
            padding:18px; 
          }
          .c-right{ justify-content:flex-start; }

          /* Texto aspiracional con mejor legibilidad */
          .asp{ font-size: clamp(15px, 3.9vw, 18px); line-height: 1.35; }
        }
      `}</style>
    </main>
  );
}

export default function Home() {
  return (
    <I18nProvider>
      <HomeInner />
    </I18nProvider>
  );
}// src/app/page.tsx
"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { I18nProvider, useLang } from "../lib/i18n-client";

function HomeInner() {
  const { lang } = useLang();

  // CTA principal (más aspiracional)
  const startLabel =
    lang === "es" ? "Únete al santuario" :
    lang === "pt" ? "Junte-se ao santuário" :
    lang === "fr" ? "Rejoignez le sanctuaire" :
    "Join the sanctuary";

  const dlLabel =
    lang === "es" ? "Descargar app" :
    lang === "pt" ? "Baixar app" :
    lang === "fr" ? "Télécharger l’app" :
    "Download app";

  const supportLabel =
    lang === "es" ? "Apoyar" :
    lang === "pt" ? "Apoiar" :
    lang === "fr" ? "Soutenir" :
    "Support";

  const communityTitle =
    lang === "es" ? "Únete a la comunidad" :
    lang === "pt" ? "Junte-se à comunidade" :
    lang === "fr" ? "Rejoignez la communauté" :
    "Join the community";

  const communityText =
    lang === "es" ? "Feedback, sneak peeks y artistas como tú." :
    lang === "pt" ? "Feedbacks, bastidores e criadores como você." :
    lang === "fr" ? "Retours, aperçus et des créateurs comme vous." :
    "Feedback, sneak peeks, and creators like you.";

  const aspiration =
    lang === "es" ? "Construyamos un santuario donde el arte respire." :
    lang === "pt" ? "Vamos construir um santuário onde a arte respira." :
    lang === "fr" ? "Bâtissons un sanctuaire où l’art respire." :
    "Let’s build a sanctuary where art breathes.";

  const heroLine =
    lang === "es"
      ? "Donde las ideas se convierten en arte — y el arte en mundos por descubrir."
      : lang === "pt"
      ? "Onde ideias viram arte — e a arte se torna mundos para explorar."
      : lang === "fr"
      ? "Là où les idées deviennent art — et l’art ouvre des mondes à explorer."
      : "Where ideas become art — and art becomes worlds to explore.";

  const R = {
    es: ["Un santuario para creadores", "Inspírate, crea, comparte", "Donde tu arte encuentra hogar"],
    pt: ["Um santuário para criadores", "Inspire-se, crie, compartilhe", "Onde sua arte encontra um lar"],
    fr: ["Un sanctuaire pour créateurs", "Inspirez, créez, partagez", "Là où votre art a sa place"],
    en: ["A sanctuary for creators", "Inspire, create, share", "Where your art belongs"],
  } as const;

  const phrases =
    lang === "es" ? R.es :
    lang === "pt" ? R.pt :
    lang === "fr" ? R.fr :
    R.en;

  const BRAND1 =
    lang === "es" ? "No venimos a reemplazar tu mundo — venimos a mejorarlo." :
    lang === "pt" ? "Não viemos substituir o seu mundo — viemos torná-lo melhor." :
    lang === "fr" ? "Nous ne sommes pas là pour remplacer ton monde — nous sommes là pour l’améliorer." :
    "We’re not here to replace your world — we’re here to make it better.";

  const BRAND2 =
    lang === "es" ? "Cumplamos nuestros sueños juntos." :
    lang === "pt" ? "Vamos realizar nossos sonhos juntos." :
    lang === "fr" ? "Réalisons nos rêves ensemble." :
    "Let’s make our dreams come true.";

  const rollerPhrases = [heroLine, ...phrases, BRAND1, BRAND2];
  const COMMUNITY_URL = "https://discord.gg/5Y4Yz2cS";

  // ===== Pasos con rebote + chispitas =====
  const step1Ref = useRef<HTMLDivElement>(null);
  const step2Ref = useRef<HTMLDivElement>(null);
  const step3Ref = useRef<HTMLDivElement>(null);
  const layerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const layer = layerRef.current || document.body;

    function spawnSparkles(target: HTMLElement) {
      const rect = target.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const EMOJIS = ["✨", "⭐", "🎉"];
      const n = 12 + Math.floor(Math.random() * 6);
      for (let i = 0; i < n; i++) {
        const s = document.createElement("span");
        s.className = "spark";
        s.textContent = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
        const ang = Math.random() * Math.PI * 2;
        const dist = 20 + Math.random() * 36;
        const dx = Math.cos(ang) * dist;
        const dy = Math.sin(ang) * dist;
        s.style.left = `${cx}px`;
        s.style.top = `${cy}px`;
        s.style.setProperty("--dx", `${dx}px`);
        s.style.setProperty("--dy", `${dy}px`);
        s.style.fontSize = `${16 + Math.random() * 10}px`;
        (layer as HTMLElement).appendChild(s);
        setTimeout(() => s.remove(), 900);
      }
    }

    function bounce(el?: HTMLElement | null) {
      if (!el) return;
      el.classList.add("is-bounce");
      setTimeout(() => el.classList.remove("is-bounce"), 600);
    }

    const run = () => {
      let t = 200;
      setTimeout(() => bounce(step1Ref.current), (t += 200));
      setTimeout(() => bounce(step2Ref.current), (t += 400));
      setTimeout(() => {
        bounce(step3Ref.current);
        if (step3Ref.current) spawnSparkles(step3Ref.current);
      }, (t += 400));
    };
    run();
    const loopId = window.setInterval(run, 6000);
    return () => clearInterval(loopId);
  }, []);

  // ===== Roller (derecha en desktop, centrado bajo el título en móvil) =====
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const winRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => {
      setIdx((i) => (i + 1) % rollerPhrases.length);
    }, 8000);
    return () => clearInterval(t);
  }, [paused, rollerPhrases.length]);

  // ⬇️ Ajuste: en móvil, ancho cómodo ~82vw
  useEffect(() => {
    const win = winRef.current;
    const txt = textRef.current;
    if (!win || !txt) return;

    const cs = getComputedStyle(win);
    const pl = parseFloat(cs.paddingLeft);
    const pr = parseFloat(cs.paddingRight);
    const pt = parseFloat(cs.paddingTop);
    const pb = parseFloat(cs.paddingBottom);

    const isMobile = window.innerWidth <= 900;
    const maxW = Math.min(window.innerWidth * (isMobile ? 0.82 : 0.46), 780);
    const minW = isMobile ? 140 : 280;

    txt.style.whiteSpace = "nowrap";
    const natural = txt.getBoundingClientRect();
    let targetW = natural.width + pl + pr;
    targetW = Math.max(minW, Math.min(targetW, maxW));
    win.style.width = `${targetW}px`;

    txt.style.whiteSpace = "normal";
    const wrapped = txt.getBoundingClientRect();
    win.style.height = `${wrapped.height + pt + pb}px`;
  }, [idx, lang]);

  useEffect(() => {
    const onR = () => setIdx((i) => i);
    window.addEventListener("resize", onR);
    return () => window.removeEventListener("resize", onR);
  }, []);

  // ===== Globo de diálogo pegado al icono del header =====
  const bubblePhrases = useMemo(
    () =>
      lang === "es"
        ? [
            "¡Hola! Bienvenido ✨",
            "Disfruta la casa del arte 💚",
            "La página se ve mucho mejor en ordenador",
            "¿Que si me programaron?!.. ¡Soy independiente!!.. bueno sí, tal vez un poco...",
            "¿A veces hablo demasiado eh?... Debería hablar menos",
            "Me dijeron que seré tu guía. Puedes cambiar el idioma y configuraciones abajo👇",
            "Deberías conocer a Kuro, te caerá bien",
            "Hay un easter egg. ¿Ya lo viste?",
            "Gracias por pasar 🛎️",
            "Hoy me levanté creativo. Tú trae el café ☕ y vamos.",
            "Si ves algo raro… es arte moderno 😉",
            "Prometo no spammear… a menos que me lo pidas.",
            "¿Modo zen o modo caos creativo? Tú eliges.",
            "Mi hobby: animar píxeles y halagar artistas. Sí, tú.",
            "Tip ninja: el botón de Discord te abre puertas 🔑",
            "Si te pierdes, me chiflas. Soy GPS con glitter ✨",
            "Tu proyecto + un empujón = magia. Haz push.",
            "En ordenador vuelo. En móvil bailo. En ambos te acompaño.",
            "¿Venías por arte o por chisme? Acá hay de los dos 😌"
          ]
        : lang === "pt"
        ? [
            "Olá! Bem-vindo ✨",
            "Aproveite a casa da arte 💚",
            "A página fica muito melhor no computador",
            "Me programaram?!.. Sou independente!!.. bom, talvez um pouco...",
            "Às vezes eu falo demais, né?... Deveria falar menos",
            "Disseram que eu seria o seu guia. Você pode mudar o idioma e as configurações abaixo👇",
            "Você deveria conhecer o Kuro, vai gostar dele",
            "Tem um easter egg. Já viu?",
            "Obrigado por passar 🛎️",
            "Hoje acordei criativo. Você traz o café ☕ e vamos.",
            "Se vir algo estranho… é arte moderna 😉",
            "Prometo não spammar… a menos que peça.",
            "Modo zen ou caos criativo? Você escolhe.",
            "Meu hobby: animar pixels e elogiar artistas. Sim, você.",
            "Dica ninja: o botão do Discord abre portas 🔑",
            "Se se perder, me chama. Sou um GPS com glitter ✨",
            "Seu projeto + um empurrão = mágica. Dá o push.",
            "No computador eu voo. No celular eu danço. Em ambos te acompanho.",
            "Veio por arte ou fofoca? Aqui tem os dois 😌"
          ]
        : lang === "fr"
        ? [
            "Salut ! Bienvenue ✨",
            "Profite de la maison de l’art 💚",
            "Le site est bien plus beau sur ordinateur",
            "On m’a programmé ?!.. Je suis indépendant !!.. enfin, peut-être un peu...",
            "Je parle trop parfois, hein ?... Je devrais parler moins",
            "On m’a dit que je serai ton guide. Tu peux changer la langue et les réglages en bas👇",
            "Tu devrais rencontrer Kuro, tu l’aimeras bien",
            "Il y a un easter egg. Tu l’as trouvé ?",
            "Merci de passer 🛎️",
            "Aujourd’hui, je me sens créatif. Apporte le café ☕ et allons-y.",
            "Si tu vois quelque chose de bizarre… c’est de l’art moderne 😉",
            "Je promets de ne pas spammer… sauf si tu le demandes.",
            "Mode zen ou chaos créatif ? À toi de choisir.",
            "Mon hobby : animer des pixels et flatter les artistes. Oui, toi.",
            "Astuce ninja : le bouton Discord ouvre des portes 🔑",
            "Si tu te perds, appelle-moi. Je suis un GPS avec des paillettes ✨",
            "Ton projet + un coup de pouce = magie. Push-le.",
            "Sur ordinateur je vole. Sur mobile je danse. Je t’accompagne partout.",
            "Tu viens pour l’art ou pour les potins ? Ici, il y a les deux 😌"
          ]
        : [
            "Hey! Welcome ✨",
            "Enjoy the art sanctuary 💚",
            "The page looks way better on desktop",
            "Did they program me?!.. I'm independent!!.. well, maybe a little...",
            "Do I talk too much sometimes?... I should talk less",
            "They told me I’d be your guide. You can change language and settings below👇",
            "You should meet Kuro, you’ll like him",
            "There’s an easter egg. Did you find it?",
            "Thanks for stopping by 🛎️",
            "Woke up creative today. You bring the coffee ☕ and let’s go.",
            "If you see something weird… it’s modern art 😉",
            "Promise I won’t spam… unless you ask me to.",
            "Zen mode or creative chaos? You choose.",
            "My hobby: animating pixels and complimenting artists. Yes, you.",
            "Ninja tip: the Discord button opens doors 🔑",
            "If you get lost, just call me. I’m GPS with glitter ✨",
            "Your project + a little push = magic. Go ship it.",
            "On desktop I fly. On mobile I dance. On both, I’m with you.",
            "Came for the art or the gossip? We’ve got both 😌"
          ],
    [lang]
  );

  const [bubbleText, setBubbleText] = useState<string>(bubblePhrases[0]);
  const bubbleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setBubbleText(bubblePhrases[0]);
    try {
      const key = "z_bubble_idx_home";
      const prev = Number((typeof window !== "undefined" ? window.localStorage?.getItem(key) : "0") || "0");
      const idx = isNaN(prev) ? 0 : prev;
      const txt = bubblePhrases[idx % bubblePhrases.length];
      setBubbleText(txt);
      if (typeof window !== "undefined") {
        window.localStorage?.setItem(key, String((idx + 1) % bubblePhrases.length));
      }
    } catch {}
  }, [lang, bubblePhrases]);

  // Colocación y wiggle del icono del header
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
        bubble.style.left = `${left}px`; // ← corregido (sin paréntesis extra)
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
    <main className="relative min-h-screen flex items-center justify-center text-center">
      {/* Globo de diálogo pegado al icono del header */}
      <div ref={bubbleRef} className="talk-bubble" role="status" aria-live="polite">
        {bubbleText}
      </div>

      <div className="grid-overlay" aria-hidden />
      <div ref={layerRef} className="steps-pop-layer" aria-hidden />

      <section className="container px-6 flex flex-col items-center gap-12">
        {/* Título + roller */}
        <div className="hero-wrap">
          <h1 className="leading-[0.8] font-black tracking-tight m-0">
            <span className="hero-zproject hero-zproject--XL">
              ZProject<sup className="tm">TM</sup>
              <span className="hero-shine" aria-hidden />
            </span>
          </h1>

        <div
            ref={winRef}
            className="roller-window fader-mode"
            aria-live="polite"
            aria-atomic="true"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            <span key={idx} ref={textRef} className={`fader ${paused ? "is-paused" : ""}`}>
              {rollerPhrases[idx]}
            </span>
          </div>
        </div>

        {/* CTAs */}
        <div className="flex justify-center gap-4 mt-2 hero-ctas">
          <Link href="/signup" className="btn-primary">{startLabel}</Link>
          <Link href="/download" className="btn-ghost">{dlLabel}</Link>
        </div>

        {/* Beneficios */}
        <section className="benefits section-spacer">
          <article className="settings-card b-card">
            <div className="b-ico" aria-hidden>✨</div>
            <h3 className="b-title">
              {lang === "es" ? "Descubre talento" :
               lang === "pt" ? "Descubra talento" :
               lang === "fr" ? "Découvrez des talents" : "Discover talent"}
            </h3>
            <p className="b-text">
              {lang === "es" ? "Un feed curado que pone el arte en primer plano." :
               lang === "pt" ? "Um feed curado com foco na arte." :
               lang === "fr" ? "Un flux soigné qui met l’art en avant." :
               "A curated feed that puts art first."}
            </p>
          </article>

          <article className="settings-card b-card">
            <div className="b-ico" aria-hidden>🎨</div>
            <h3 className="b-title">
              {lang === "es" ? "Crea sin fricción" :
               lang === "pt" ? "Crie sem atrito" :
               lang === "fr" ? "Créez sans friction" : "Create frictionlessly"}
            </h3>
            <p className="b-text">
              {lang === "es" ? "Perfiles de artista y herramientas pensadas para ti." :
               lang === "pt" ? "Perfis de artista e ferramentas pensadas para você." :
               lang === "fr" ? "Profils d’artistes et outils pensés pour vous." :
               "Artist profiles and tools built for you."}
            </p>
          </article>

          <article className="settings-card b-card">
            <div className="b-ico" aria-hidden>💚</div>
            <h3 className="b-title">
              {lang === "es" ? "Apoya y crece" :
               lang === "pt" ? "Apoie e cresça" :
               lang === "fr" ? "Soutenez et grandissez" : "Support & grow"}
            </h3>
            <p className="b-text">
              {lang === "es" ? "Una comunidad que impulsa a los creadores." :
               lang === "pt" ? "Uma comunidade que impulsiona criadores." :
               lang === "fr" ? "Une communauté qui propulse les créateurs." :
               "A community that uplifts creators."}
            </p>
          </article>
        </section>

        {/* Pasos */}
        <section className="steps settings-card section-spacer">
          <div ref={step1Ref} className="step anim-step">
            <div className="step-ico" aria-hidden>👤</div>
            <h4 className="step-title">
              {lang === "es" ? "Regístrate" :
               lang === "pt" ? "Cadastre-se" :
               lang === "fr" ? "Inscrivez-vous" : "Sign up"}
            </h4>
            <p className="step-text">
              {lang === "es" ? "Crea tu perfil y di qué haces." :
               lang === "pt" ? "Crie seu perfil e diga o que faz." :
               lang === "fr" ? "Créez votre profil et dites ce que vous faites." :
               "Create your profile and tell us what you do."}
            </p>
          </div>

          <div ref={step2Ref} className="step anim-step">
            <div className="step-ico" aria-hidden>🎨</div>
            <h4 className="step-title">
              {lang === "es" ? "Comparte" :
               lang === "pt" ? "Compartilhe" :
               lang === "fr" ? "Partagez" : "Share"}
            </h4>
            <p className="step-text">
              {lang === "es" ? "Sube obras, prototipos o procesos." :
               lang === "pt" ? "Envie obras, protótipos ou processos." :
               lang === "fr" ? "Publiez œuvres, prototypes ou process." :
               "Post finished work, WIPs, or process."}
            </p>
          </div>

          <div ref={step3Ref} className="step anim-step">
            <div className="step-ico" aria-hidden>🤝</div>
            <h4 className="step-title">
              {lang === "es" ? "Conecta" :
               lang === "pt" ? "Conecte" :
               lang === "fr" ? "Connectez" : "Connect"}
            </h4>
            <p className="step-text">
              {lang === "es" ? "Recibe feedback y apoya a otros." :
               lang === "pt" ? "Receba feedback e apoie outros." :
               lang === "fr" ? "Recevez des retours et soutenez." :
               "Get feedback and support others."}
            </p>
          </div>
        </section>

        {/* Comunidad */}
        <section className="community settings-card section-spacer">
          <div className="c-left">
            <h3 className="c-title">{communityTitle}</h3>
            <p className="c-text">{communityText}</p>
          </div>
          <div className="c-right">
            <a href={COMMUNITY_URL} className="btn-primary" target="_blank" rel="noopener noreferrer">Discord</a>
            <span className="c-or">/</span>
            <Link href="/thanks" className="btn-ghost">{supportLabel}</Link>
          </div>
        </section>

        <p className="asp">{aspiration}</p>
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

        .logo-solo-talk{ animation: wiggle .6s ease-in-out 3; transform-origin: 50% 50%; }
        @keyframes wiggle{
          0%,100%{ transform: rotate(0) }
          20%{ transform: rotate(-6deg) }
          40%{ transform: rotate(6deg) }
          60%{ transform: rotate(-4deg) }
          80%{ transform: rotate(3deg) }
        }

        .hero-zproject--XL { font-size: clamp(80px, 16vw, 200px); display: inline-block; position: relative; }
        .hero-zproject .tm { 
          font-size: 0.28em; 
          margin-left: 0.25em; 
          vertical-align: super; 
          opacity: .6; 
          font-weight: 700;
          letter-spacing: .02em;
          line-height: 0;
        }

        /* Desktop: título + roller a la derecha (intacto) */
        .hero-wrap {
          display: flex; 
          align-items: flex-end; 
          gap: 0.6rem;
          justify-content: flex-start; 
          width: 100%; 
          margin-left: -2vw;
          flex-wrap: nowrap;
        }

        .roller-window.fader-mode{
          --roller-nudge: -70px;
          display: inline-flex; align-items: center; justify-content: center;
          min-height: 3.2em; min-width: 280px;
          border-radius: 12px;
          border: 1px solid rgba(34,197,94,.28);
          background: color-mix(in oklab, var(--background), transparent 6%);
          backdrop-filter: blur(6px);
          padding: .9rem 1.2rem;
          box-shadow: 0 10px 24px rgba(0,0,0,.18);
          align-self: flex-end;
          transform: translate(var(--roller-nudge), 12%);
          max-width: min(780px, 46vw);
          overflow: hidden;
          transition: width .6s ease, height .6s ease, transform .3s ease;
        }
        .fader{
          display:block;
          font-size: clamp(18px, 1.8vw, 28px);
          line-height: 1.25;
          font-weight: 600;
          letter-spacing: .2px;
          animation: fadeCycle 8s linear forwards;
          will-change: opacity, transform;
        }
        .roller-window.fader-mode:hover .fader{ animation-play-state: paused; }
        @keyframes fadeCycle{
          0%   { opacity: 0; transform: translateY(6px); }
          10%  { opacity: 1; transform: translateY(0); }
          80%  { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(-4px); }
        }

        .section-spacer { margin-top: clamp(32px, 7vh, 80px); }
        .benefits{ width:100%; display:grid; grid-template-columns:repeat(3,1fr); gap:22px; }
        .b-card{ padding:20px; text-align:left; }
        .b-ico{ font-size:24px; line-height:1; margin-bottom:12px; }
        .b-title{ margin:0 0 8px 0; font-weight:800; color: color-mix(in oklab, var(--foreground), transparent 6%); }
        .b-text{ opacity:.85; margin:0; }

        .steps{ display:grid; grid-template-columns:repeat(3,1fr); gap:22px; padding:18px; text-align:left; }
        .step{ padding:10px; position:relative; min-height:120px; border-radius:12px; }
        .steps .step:not(:last-child)::after{
          content:"➜"; position:absolute; right:-18px; top:50%; transform:translateY(-50%);
          opacity:.65; font-size:22px; line-height:1; color: color-mix(in oklab, var(--foreground), transparent 10%);
          text-shadow:0 0 12px rgba(34,197,94,.35);
        }
        .step-ico{ font-size:22px; opacity:.95; margin-bottom:6px; }
        .step-title{ margin:0 0 8px 0; font-weight:800; }
        .step-text{ margin:0; opacity:.85; }

        .anim-step { will-change: transform; }
        .anim-step.is-bounce{ animation: step-bounce .55s cubic-bezier(.34,1.56,.64,1); }
        @keyframes step-bounce {
          0% { transform: translateY(0); }
          30% { transform: translateY(-8px); }
          60% { transform: translateY(0); }
          80% { transform: translateY(-4px); }
          100% { transform: translateY(0); }
        }

        .steps-pop-layer{ position: fixed; inset: 0; pointer-events: none; z-index: 8; }
        .spark{
          position: fixed; left: 0; top: 0; transform: translate(-50%, -50%);
          animation: spark-pop .9s ease forwards; text-shadow: 0 2px 10px rgba(34,197,94,.35);
          pointer-events: none;
        }
        @keyframes spark-pop{
          0% { opacity: 0; transform: translate(calc(-50% + 0px), calc(-50% + 0px)) scale(.9); }
          15% { opacity: 1; }
          100% { opacity: 0; transform: translate(calc(-50% + var(--dx)), calc(-50% + var(--dy))) scale(1.15); }
        }

        .community{ display:grid; grid-template-columns:2fr 1fr; align-items:center; gap:16px; padding:20px; text-align:left; }
        .c-title{ margin:0 0 6px 0; font-weight:800; }
        .c-text{ margin:0; opacity:.85; }
        .c-right{ display:inline-flex; gap:12px; align-items:center; justify-content:flex-end; }
        .c-or{ opacity:.6; }
        .asp{ opacity:.85; margin-top:6px; font-size:.98rem; }

        /* ======== MÓVIL: centrado real, sin cortes, CTAs lado a lado ======== */
        @media (max-width: 900px) {
          /* safe-area para que nada quede bajo el header/notch */
          main { padding-top: max(12px, env(safe-area-inset-top)); }

          .hero-wrap { 
            flex-direction: column;        /* título arriba, roller abajo */
            align-items: center;
            justify-content: center;
            gap: .7rem;
            margin-left: 0;
            width: 100%;
            text-align: center;
          }

          .hero-zproject--XL{
            font-size: clamp(52px, 15vw, 108px); /* más grande en phone */
            line-height: .92;
            display: inline-block;
          }

          .roller-window.fader-mode { 
            --roller-nudge: 0px;
            transform: none;
            max-width: 92vw;               /* el JS limitará aprox. a 82vw */
            min-width: 140px;
            padding: .7rem .9rem;
            border-radius: 12px;
            align-self: center;
          }
          .roller-window.fader-mode .fader{
            font-size: clamp(14px, 3.9vw, 18px);
            line-height: 1.25;
          }

          /* CTAs lado a lado */
          .hero-ctas{
            width: 100%;
            display: flex;
            justify-content: center;
            margin-top: clamp(28px, 7vh, 64px) !important;
            gap: 10px;
            flex-wrap: nowrap;
          }
          .hero-ctas .btn-primary,
          .hero-ctas .btn-ghost{
            min-width: 47%;
            max-width: 48%;
            padding-left: 14px;
            padding-right: 14px;
          }
          /* En pantallas muy pequeñas, permitir wrap */
          @media (max-width: 360px){
            .hero-ctas{ flex-wrap: wrap; }
            .hero-ctas .btn-primary, .hero-ctas .btn-ghost{
              min-width: 100%;
              max-width: 100%;
            }
          }

          /* CARDS: ocupar más ancho y con aire */
          .benefits{ grid-template-columns:1fr; gap:16px; }
          .b-card{ padding: 18px; }
          .steps{ grid-template-columns:1fr; gap:16px; }
          .steps .step:not(:last-child)::after{ display:none; }

          .community{ 
            grid-template-columns:1fr; 
            text-align:left; 
            gap:14px; 
            padding:18px; 
          }
          .c-right{ justify-content:flex-start; }

          /* Texto aspiracional con mejor legibilidad */
          .asp{ font-size: clamp(15px, 3.9vw, 18px); line-height: 1.35; }
        }
      `}</style>
    </main>
  );
}

export default function Home() {
  return (
    <I18nProvider>
      <HomeInner />
    </I18nProvider>
  );
}
