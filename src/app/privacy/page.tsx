// src/app/privacy/page.tsx
"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

export default function PrivacyPage() {
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
      badge:  is("es") ? "Información" : is("pt") ? "Informações" : is("fr") ? "Informations" : "Info",
      title:  is("es") ? "Política de Privacidad" : is("pt") ? "Política de Privacidade" : is("fr") ? "Politique de Confidentialité" : "Privacy Policy",
      aria:   is("es") ? "Política de Privacidad" : is("pt") ? "Política de Privacidade" : is("fr") ? "Politique de Confidentialité" : "Privacy Policy",
      back:   is("es") ? "Volver" : is("pt") ? "Voltar" : is("fr") ? "Retour" : "Back",
      terms:  is("es") ? "Términos" : is("pt") ? "Termos" : is("fr") ? "Conditions" : "Terms",
      updatedLabel: is("es") ? "Última actualización" : is("pt") ? "Última atualização" : is("fr") ? "Dernière mise à jour" : "Last updated",
      updatedDate: "[dd/mm/aaaa]",
      bubbles: is("es")
        ? ["Tu privacidad importa 🔒", "Cuidamos tus datos 💚", "Control en tus manos ✨"]
        : is("pt")
        ? ["Sua privacidade importa 🔒", "Cuidamos dos seus dados 💚", "Controle nas suas mãos ✨"]
        : is("fr")
        ? ["Ta vie privée compte 🔒", "On prend soin de tes données 💚", "Contrôle entre tes mains ✨"]
        : ["Your privacy matters 🔒", "We care about your data 💚", "Control in your hands ✨"],
      contactLead: is("es")
        ? "Contacto y solicitudes de privacidad:"
        : is("pt")
        ? "Contato e solicitações de privacidade:"
        : is("fr")
        ? "Contact et demandes de confidentialité :"
        : "Privacy contact and requests:",
      discord: "https://discord.gg/5Y4Yz2cS",
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
      const key = "z_bubble_idx_privacy";
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
        <article className="settings-card p-card" aria-label={L.aria} role="status">
          <div className="badge p-badge">{L.badge}</div>

          <div className="p-icon" aria-hidden>
            <span className="p-emoji">🔒</span>
          </div>

          <h1 className="p-title">{L.title}</h1>

          {/* ====== Política de Privacidad (base en español; Florida, EE.UU.) ====== */}
          <div className="p-legal">
            <p><strong>{L.updatedLabel}:</strong> {L.updatedDate}</p>

            <h2>1) Alcance</h2>
            <p>
              Esta Política explica cómo ZProject (“nosotros”) recopila, usa y comparte información cuando accedes o usas
              nuestros sitios, apps y servicios (el “Servicio”). ZProject está basado en Estados Unidos (Estado de Florida).
            </p>

            <h2>2) Información que recopilamos</h2>
            <ul>
              <li><strong>Información de cuenta</strong>: nombre de usuario, idioma, preferencias.</li>
              <li><strong>Contenido</strong> que publicas (obras, textos, imágenes, videos, procesos) y metadatos asociados.</li>
              <li><strong>Uso y dispositivo</strong>: páginas visitadas, interacciones, identificadores de dispositivo, sistema operativo, navegador, dirección IP aproximada.</li>
              <li><strong>Cookies y tecnologías similares</strong> para recordar preferencias y mejorar tu experiencia.</li>
            </ul>

            <h2>3) Para qué usamos la información</h2>
            <ul>
              <li>Operar, mantener y mejorar el Servicio.</li>
              <li>Personalizar contenido (por ejemplo, idioma o feed).</li>
              <li>Seguridad, prevención de fraude y cumplimiento legal.</li>
              <li>Comunicaciones sobre cambios relevantes del Servicio.</li>
              <li>Analítica y métricas agregadas.</li>
            </ul>

            <h2>4) Bases legales (si aplican en tu jurisdicción)</h2>
            <ul>
              <li><em>Ejecución del contrato</em> (brindarte el Servicio que solicitaste).</li>
              <li><em>Interés legítimo</em> (seguridad, mejora y analítica agregada).</li>
              <li><em>Consentimiento</em> (cuando la ley lo requiera, por ejemplo, ciertas cookies).</li>
              <li><em>Cumplimiento legal</em> (responder a requerimientos válidos).</li>
            </ul>

            <h2>5) Conservación</h2>
            <p>
              Conservamos datos mientras tu cuenta esté activa y por el tiempo necesario para los fines descritos o para cumplir
              obligaciones legales. Puedes eliminar contenido específico y/o solicitar cierre de cuenta.
            </p>

            <h2>6) Compartir con terceros</h2>
            <p>
              Podemos usar proveedores que procesan datos en nuestro nombre (alojamiento, analítica, herramientas de soporte).
              Exigimos compromisos contractuales para proteger la información. No vendemos tus datos personales.
            </p>

            <h2>7) Transferencias internacionales</h2>
            <p>
              El Servicio opera desde EE. UU. Si accedes desde otra región, tus datos pueden transferirse y procesarse en EE. UU.,
              donde las leyes de privacidad pueden ser distintas.
            </p>

            <h2>8) Tus opciones y derechos</h2>
            <ul>
              <li><strong>Acceso y rectificación</strong> de información de tu cuenta.</li>
              <li><strong>Eliminación</strong> de contenido que subiste o cierre de cuenta.</li>
              <li><strong>Preferencias</strong> de notificaciones (cuando estén disponibles).</li>
              <li><strong>Cookies</strong>: puedes ajustar tu navegador para limitar o rechazar cookies (puede afectar funciones).</li>
            </ul>

            <h2>9) Seguridad</h2>
            <p>
              Aplicamos medidas razonables de seguridad técnica y organizativa. Ningún sistema es 100% seguro; te pedimos usar
              contraseñas robustas y mantener tus credenciales confidenciales.
            </p>

            <h2>10) Menores</h2>
            <p>
              ZProject no está dirigido a menores de 13 años. Si crees que un menor nos proporcionó datos sin el consentimiento
              requerido, contáctanos para eliminarlos.
            </p>

            <h2>11) Cambios a esta Política</h2>
            <p>
              Podremos actualizar esta Política. Si el cambio es sustancial, intentaremos notificarlo por medios razonables.
              El uso continuado del Servicio implica aceptación de la versión vigente.
            </p>

            <h2>12) Contacto</h2>
            <p>
              {L.contactLead}{" "}
              <a href={L.discord} target="_blank" rel="noopener noreferrer" className="footer-link">Discord</a>.
            </p>

            <h2>13) Ley aplicable</h2>
            <p>
              Esta Política se interpreta conforme a las leyes de Estados Unidos y del Estado de Florida, sin perjuicio de las
              normas de conflicto de leyes aplicables.
            </p>
          </div>

          <div className="p-ctas">
            <Link href="/" className="btn-ghost">{L.back}</Link>
            <Link href="/terms" className="btn-primary">{L.terms}</Link>
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
        .p-card{
          max-width: 980px;
          width: 100%;
          margin-inline: auto;
          padding: clamp(18px, 4vw, 34px);
          display: grid;
          gap: clamp(10px, 1.8vw, 16px);
          justify-items: center;
          text-align: left;
        }
        .p-badge{ font-weight: 600; letter-spacing: .2px; }

        .p-icon{
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
        .p-emoji{ font-size: clamp(42px, 6vw, 64px); line-height:1; }

        .p-title{
          margin: 6px 0 4px 0;
          font-size: clamp(22px, 4.2vw, 32px);
          font-weight: 800;
          letter-spacing: .2px;
          color: color-mix(in oklab, var(--foreground), transparent 4%);
          text-align: center;
        }

        .p-legal{
          width: 100%;
          max-width: 80ch;
          font-size: clamp(14px, 2vw, 16px);
          line-height: 1.6;
        }
        .p-legal h2{
          margin: 16px 0 6px 0;
          font-size: 1.1em;
          font-weight: 800;
          color: color-mix(in oklab, var(--foreground), transparent 6%);
        }
        .p-legal p{ margin: 6px 0; }
        .p-legal ul{ margin: 6px 0 6px 18px; }

        .p-ctas{
          display: flex; gap: 12px; margin-top: clamp(10px, 3vh, 18px);
          justify-content: center; width: 100%;
        }

        /* ===== Mobile ===== */
        @media (max-width: 900px){
          .p-legal{ max-width: 100%; }
        }
      `}</style>
    </main>
  );
}