// src/app/terms/page.tsx
"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

export default function TermsPage() {
  // ==== idioma por cookie (cliente) con fallback ====
  function getLangFromCookies(): string {
    try {
      const m = document.cookie.match(/(?:^|;\s*)zproject_lang=([^;]+)/i);
      return (m?.[1] || "en").toLowerCase();
    } catch {
      return "en";
    }
  }
  const [lang, setLang] = useState<string>("en");
  useEffect(() => setLang(getLangFromCookies()), []);

  const L = useMemo(() => {
    const is = (p: string) => lang.startsWith(p);
    return {
      badge:  is("es") ? "Próximamente" : is("pt") ? "Em breve" : is("fr") ? "Bientôt" : "Coming soon",
      title:  is("es") ? "Términos y Condiciones" : is("pt") ? "Termos e Condições" : is("fr") ? "Conditions d’utilisation" : "Terms & Conditions",
      aria:   is("es") ? "Términos y Condiciones" : is("pt") ? "Termos e Condições" : is("fr") ? "Conditions d’utilisation" : "Terms & Conditions",
      back:   is("es") ? "Volver" : is("pt") ? "Voltar" : is("fr") ? "Retour" : "Back",
      privacy:is("es") ? "Privacidad" : is("pt") ? "Privacidade" : is("fr") ? "Confidentialité" : "Privacy",
      bubbles: is("es")
        ? ["Lee esto antes de continuar 📜", "Nada aburrido, lo prometo 😅", "Términos importantes ✨"]
        : is("pt")
        ? ["Leia isto antes de seguir 📜", "Prometo que é rápido 😅", "Termos importantes ✨"]
        : is("fr")
        ? ["À lire avant de continuer 📜", "Promis, c’est rapide 😅", "Conditions importantes ✨"]
        : ["Read this before continuing 📜", "Promise it’s quick 😅", "Important terms ✨"],
      contactLead: is("es")
        ? "Dudas, comentarios o solicitudes legales:"
        : is("pt")
        ? "Dúvidas, comentários ou solicitações legais:"
        : is("fr")
        ? "Questions, commentaires ou demandes légales :"
        : "Questions, comments or legal requests:",
      discord: "https://discord.gg/5Y4Yz2cS",
      updatedLabel: is("es")
        ? "Última actualización"
        : is("pt")
        ? "Última atualização"
        : is("fr")
        ? "Dernière mise à jour"
        : "Last updated",
      updatedDate: "[dd/mm/aaaa]",
    };
  }, [lang]);

  // ===== Globo de diálogo (rotación por visita) =====
  const bubbleRef = useRef<HTMLDivElement>(null);
  const [bubbleText, setBubbleText] = useState<string>("");

  useEffect(() => {
    // 1) Mensaje rotatorio (solo cliente)
    const choices = L.bubbles;
    let txt = choices[0];
    try {
      const key = "z_bubble_idx_terms";
      const prev = Number((typeof window !== "undefined" ? window.localStorage?.getItem(key) : "0") || "0");
      const idx = isNaN(prev) ? 0 : prev;
      txt = choices[idx % choices.length];
      if (typeof window !== "undefined") {
        window.localStorage?.setItem(key, String((idx + 1) % choices.length));
      }
    } catch { /* noop */ }
    setBubbleText(txt);

    // 2) Colocar globo apuntando al icono del header + wiggle
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

        const targetX = r.left + r.width / 2; // centro icono
        const ARROW_LEFT_PX = 18;             // coincide con CSS
        const EXTRA_LEFT_SHIFT = 8;           // corrimiento leve a la izquierda

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
  }, [L.bubbles]);

  return (
    <main className="relative min-h-[72vh] flex items-center justify-center text-center overflow-hidden">
      {/* Globo de diálogo pegado al icono del header */}
      <div ref={bubbleRef} className="talk-bubble" role="status" aria-live="polite">
        {bubbleText}
      </div>

      {/* Contenido */}
      <section className="container px-6 relative z-[2] w-full flex justify-center">
        <article className="settings-card t-card" aria-label={L.aria} role="status">
          <div className="badge t-badge">{L.badge}</div>

          <div className="t-icon" aria-hidden>
            <span className="t-emoji">📜</span>
          </div>

          <h1 className="t-title">{L.title}</h1>

          {/* ====== Términos (texto base) ====== */}
          <div className="t-legal">
            <p><strong>{L.updatedLabel}:</strong> {L.updatedDate}</p>

            <h2>1) Aceptación</h2>
            <p>
              Al acceder o usar ZProject (el “Servicio”), aceptas estos Términos y nuestra Política de Privacidad.
              Si no estás de acuerdo, por favor no uses el Servicio.
            </p>

            <h2>2) Quién puede usar ZProject</h2>
            <p>
              Debes tener al menos 13 años (o la edad mínima legal en tu país) y capacidad para aceptar contratos.
              Si usas ZProject en nombre de una organización, declaras que tienes autoridad para vincularla a estos Términos.
            </p>

            <h2>3) Cuenta y seguridad</h2>
            <ul>
              <li>Serás responsable de la veracidad de los datos que proporciones.</li>
              <li>Debes mantener la confidencialidad de tus credenciales.</li>
              <li>Eres responsable de todas las actividades realizadas desde tu cuenta.</li>
            </ul>

            <h2>4) Contenido de usuario</h2>
            <p>
              Conservas todos los derechos sobre el contenido que publiques. Al subirlo, concedes a ZProject una licencia
              mundial, no exclusiva, gratuita y revocable para alojar, reproducir, adaptar y mostrar tu contenido dentro
              del Servicio, con el único fin de operar, promocionar y mejorar ZProject. Puedes eliminar tu contenido en
              cualquier momento; al hacerlo, cesa la licencia (salvo copias de respaldo razonables y usos ya iniciados).
            </p>

            <h2>5) Conducta y usos prohibidos</h2>
            <ul>
              <li>No publiques contenido ilegal, que infrinja derechos o que promueva odio/violencia.</li>
              <li>No intentes vulnerar la seguridad ni interrumpir el Servicio.</li>
              <li>No hagas scraping masivo o uso automatizado abusivo.</li>
              <li>No suplantes identidad ni manipules métricas.</li>
            </ul>

            <h2>6) Propiedad intelectual de ZProject</h2>
            <p>
              ZProject, su código, marca, logotipos, diseño e infraestructura son propiedad de su titular. No adquieres
              ningún derecho salvo lo permitido por estos Términos.
            </p>

            <h2>7) IA y contenido generado/transformado</h2>
            <p>
              Algunas funciones pueden asistir en la creación o transformación de obras. Tú sigues siendo responsable del uso
              y del resultado final. Verifica derechos, licencias y permisos antes de publicar o comercializar.
            </p>

            <h2>8) Pagos, donaciones y apoyo</h2>
            <p>
              ZProject puede ofrecer opciones de apoyo/donación y, en el futuro, funciones de pago. Las donaciones no son
              reembolsables salvo que la ley exija lo contrario.
            </p>

            <h2>9) Beta, cambios y disponibilidad</h2>
            <p>
              ZProject está en desarrollo activo. El Servicio puede cambiar, mejorar o interrumpirse sin previo aviso. Podemos
              actualizar estos Términos; tu uso continuo implica aceptación.
            </p>

            <h2>10) Privacidad</h2>
            <p>
              El tratamiento de datos se rige por la Política de Privacidad. Por favor revísala para conocer qué datos
              recopilamos, cómo los usamos y tus derechos.
            </p>

            <h2>11) Terceros y enlaces</h2>
            <p>
              ZProject puede incluir enlaces o integraciones de terceros. No nos responsabilizamos por sus contenidos, políticas o prácticas.
            </p>

            <h2>12) Reportes de infracción</h2>
            <p>
              Si consideras que algún contenido infringe tus derechos, escríbenos en Discord con la información necesaria
              (obra afectada, URL específica en ZProject y prueba de titularidad).
            </p>

            <h2>13) Exención de garantías</h2>
            <p>
              ZProject se ofrece “tal cual” y “según disponibilidad”. No garantizamos que sea ininterrumpido, libre de errores o seguro.
            </p>

            <h2>14) Limitación de responsabilidad</h2>
            <p>
              En la medida permitida por la ley, no seremos responsables de daños indirectos o pérdida de datos/beneficios derivados del uso o imposibilidad de uso del Servicio.
            </p>

            <h2>15) Terminación</h2>
            <p>
              Puedes dejar de usar ZProject en cualquier momento. También podemos suspender o cerrar cuentas que incumplan estos Términos.
            </p>

            <h2>16) Ley aplicable y jurisdicción</h2>
            <p>
              Estos Términos se rigen por las leyes de los Estados Unidos de América y del Estado de Florida.
              Cualquier disputa relacionada con el Servicio se someterá a la jurisdicción exclusiva de los tribunales
              del Condado de Miami-Dade, Florida, EE. UU., salvo que la legislación de tu residencia disponga otra cosa de forma imperativa.
            </p>

            <h2>17) Contacto</h2>
            <p>
              {L.contactLead}{" "}
              <a href={L.discord} target="_blank" rel="noopener noreferrer" className="footer-link">
                Discord
              </a>
              .
            </p>
          </div>

          <div className="t-ctas">
            <Link href="/" className="btn-ghost">{L.back}</Link>
            <Link href="/privacy" className="btn-primary">{L.privacy}</Link>
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

        /* ===== Card ===== */
        .t-card{
          max-width: 980px;
          width: 100%;
          margin-inline: auto;
          padding: clamp(18px, 4vw, 34px);
          display: grid;
          gap: clamp(10px, 1.8vw, 16px);
          justify-items: center;
          text-align: left;
        }
        .t-badge{ font-weight: 600; letter-spacing: .2px; }

        .t-icon{
          display: grid; place-items: center;
          width: clamp(72px, 12vw, 110px);
          height: clamp(72px, 12vw, 110px);
          border-radius: 18px;
          border: 1px solid rgba(34,197,94,.35);
          background: color-mix(in oklab, var(--background), transparent 10%);
          box-shadow: 0 10px 24px rgba(0,0,0,.22);
          color: color-mix(in oklab, var(--foreground), transparent 0%);
          user-select: none;
        }
        .t-emoji{ font-size: clamp(42px, 6vw, 64px); line-height:1; }

        .t-title{
          margin: 6px 0 4px 0;
          font-size: clamp(22px, 4.2vw, 32px);
          font-weight: 800;
          letter-spacing: .2px;
          color: color-mix(in oklab, var(--foreground), transparent 4%);
          text-align: center;
        }

        .t-legal{
          width: 100%;
          max-width: 80ch;
          font-size: clamp(14px, 2vw, 16px);
          line-height: 1.6;
        }
        .t-legal h2{
          margin: 16px 0 6px 0;
          font-size: 1.1em;
          font-weight: 800;
          color: color-mix(in oklab, var(--foreground), transparent 6%);
        }
        .t-legal p{ margin: 6px 0; }
        .t-legal ul{ margin: 6px 0 6px 18px; }

        .t-ctas{
          display: flex; gap: 12px; margin-top: clamp(10px, 3vh, 18px);
          justify-content: center; width: 100%;
        }

        /* ===== Mobile ===== */
        @media (max-width: 900px){
          .t-legal{ max-width: 100%; }
        }
      `}</style>
    </main>
  );
}
