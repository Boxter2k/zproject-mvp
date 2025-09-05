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

  // -- INSTANT UPDATE FIX --
  useEffect(() => {
    // 1) Inicial
    setLang(getLangFromCookies());

    // 2) Re-lectura reactiva
    const refreshLangFromCookie = () => setLang(getLangFromCookies());

    // a) storage (entre pestañas o si tu selector usa localStorage)
    const onStorage = (e: StorageEvent) => {
      if (e.key === "zproject_lang") refreshLangFromCookie();
    };
    window.addEventListener("storage", onStorage);

    // b) evento personalizado (si tu selector lo emite)
    const onCustom = () => refreshLangFromCookie();
    // @ts-expect-error – evento personalizado fuera de WindowEventMap
    window.addEventListener("zproject:set-lang", onCustom as EventListener);

    // c) atributo lang en [html]  ← ¡quitamos los < >
    const htmlEl = document.documentElement;
    const mo = new MutationObserver(() => refreshLangFromCookie());
    mo.observe(htmlEl, { attributes: true, attributeFilter: ["lang"] });

    // d) pequeño bombeo para capturar cambios inmediatos
    let raf = 0;
    const t0 = performance.now();
    const pump = (now: number) => {
      if (now - t0 < 2000) {
        raf = requestAnimationFrame(pump);
      } else {
        cancelAnimationFrame(raf);
      }
      refreshLangFromCookie();
    };
    raf = requestAnimationFrame(pump);

    return () => {
      window.removeEventListener("storage", onStorage);
      // @ts-expect-error – evento personalizado fuera de WindowEventMap
      window.removeEventListener("zproject:set-lang", onCustom as EventListener);
      mo.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  const L = useMemo(() => {
    const is = (p: string) => lang.startsWith(p);
    return {
      badge: is("es")
        ? "Información"
        : is("pt")
        ? "Informações"
        : is("fr")
        ? "Informations"
        : "Info",
      title: is("es")
        ? "Política de Privacidad"
        : is("pt")
        ? "Política de Privacidade"
        : is("fr")
        ? "Politique de Confidentialité"
        : "Privacy Policy",
      aria: is("es")
        ? "Política de Privacidad"
        : is("pt")
        ? "Política de Privacidade"
        : is("fr")
        ? "Politique de Confidentialité"
        : "Privacy Policy",
      back: is("es") ? "Volver" : is("pt") ? "Voltar" : is("fr") ? "Retour" : "Back",
      terms: is("es") ? "Términos" : is("pt") ? "Termos" : is("fr") ? "Conditions" : "Terms",
      updatedLabel: is("es")
        ? "Última actualización"
        : is("pt")
        ? "Última atualização"
        : is("fr")
        ? "Dernière mise à jour"
        : "Last updated",
      updatedDate: "[04/09/2025]",
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
    const choices = L.bubbles;
    let txt = choices[0];
    try {
      const key = "z_bubble_idx_privacy";
      const prev = Number(
        (typeof window !== "undefined" ? window.localStorage?.getItem(key) : "0") || "0"
      );
      const idx = isNaN(prev) ? 0 : prev;
      txt = choices[idx % choices.length];
      if (typeof window !== "undefined") {
        window.localStorage?.setItem(key, String((idx + 1) % choices.length));
      }
    } catch {}
    setBubbleText(txt);

    // Colocación del globo
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
        bubble.style.left = `${left}px`;
      });
    };

    place();
    const onScroll = () => place();
    const onResize = () => place();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);

    // Wiggle del icono
    icon.classList.add("logo-solo-talk");
    const stop = setTimeout(() => icon.classList.remove("logo-solo-talk"), 2600);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(frame);
      clearTimeout(stop);
    };
  }, [L.bubbles]);

  // ====== BLOQUE LEGAL MULTILENGUAJE ======
  const renderLegal = (code: string) => {
    // ===== ES =====
    if (code.startsWith("es")) {
      return (
        <div className="p-legal">
          <p><strong>{L.updatedLabel}:</strong> {L.updatedDate}</p>

          <h2>1) Alcance</h2>
          <p>
            Esta Política explica cómo ZProject (“nosotros”) recopila, usa y comparte información cuando accedes o usas
            nuestros sitios, apps y servicios (el “Servicio”). ZProject está basado en Estados Unidos (Estado de Florida).
          </p>

          {/* NUEVO: IA y Autenticidad */}
          <h2>IA y Autenticidad</h2>
          <p>
            ZProject es un santuario para creadores. El <strong>90% del contenido debe ser auténtico</strong>, hecho por humanos.
            La IA puede usarse como herramienta de apoyo, pero <strong>no se permite publicar ni vender obras creadas íntegramente por IA</strong>.
            Dicho contenido será eliminado y las cuentas reincidentes podrán ser suspendidas o restringidas.
          </p>
          <p>
            ZProject <strong>no utiliza</strong> las obras de los usuarios para entrenar IA y <strong>no vende datos privados</strong> de los usuarios.
          </p>

          <h2>2) Información que recopilamos</h2>
          <ul>
            <li><strong>Información de cuenta</strong>: nombre de usuario, idioma, preferencias.</li>
            <li><strong>Contenido</strong> que publicas (obras, textos, imágenes, videos, procesos) y metadatos asociados.</li>
            <li><strong>Uso y dispositivo</strong>: páginas visitadas, interacciones, identificadores de dispositivo, sistema operativo, navegador, IP aproximada.</li>
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

          {/* NUEVO: Métricas y Analítica (detalle) */}
          <h2>Métricas y Analítica</h2>
          <p>
            Utilizamos métricas <strong>anonimizadas</strong> (por ejemplo, tags, tendencias, años agregados) para entender qué funciona y mejorar la experiencia.
            <strong> No vendemos</strong> estas métricas a terceros externos. Podemos ofrecer <strong>estadísticas premium</strong> a los propios artistas dentro de ZProject;
            esto es uso interno y <strong>no constituye venta a terceros</strong>.
          </p>

          <h2>4) Bases legales (si aplican en tu jurisdicción)</h2>
          <ul>
            <li><em>Ejecución del contrato</em> (brindarte el Servicio que solicitaste).</li>
            <li><em>Interés legítimo</em> (seguridad, mejora y analítica agregada).</li>
            <li><em>Consentimiento</em> (cuando la ley lo requiera, p. ej., ciertas cookies).</li>
            <li><em>Cumplimiento legal</em> (responder a requerimientos válidos).</li>
          </ul>

          <h2>5) Conservación</h2>
          <p>
            Conservamos datos mientras tu cuenta esté activa y por el tiempo necesario para los fines descritos o para cumplir obligaciones legales.
            Puedes eliminar contenido específico y/o solicitar cierre de cuenta.
          </p>

          <h2>6) Compartir con terceros</h2>
          <p>
            Podemos usar proveedores que procesan datos en nuestro nombre (alojamiento, analítica, soporte).
            Requerimos compromisos contractuales para proteger la información. No vendemos tus datos personales.
          </p>

          <h3>6.1) Procesamiento de pagos (Stripe)</h3>
          <p>
            Usamos <strong>Stripe</strong> para procesar pagos. No almacenamos números completos de tarjeta ni códigos de seguridad.
            Stripe puede realizar verificación de identidad (KYC) y prevención de fraude cuando corresponda.
            Consulta la <a className="footer-link" href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer">Política de Privacidad</a> y el{" "}
            <a className="footer-link" href="https://stripe.com/legal" target="_blank" rel="noopener noreferrer">Acuerdo de Servicios</a>.
          </p>

          <h2>7) Transferencias internacionales</h2>
          <p>
            El Servicio opera desde EE. UU. Si accedes desde otra región, tus datos pueden transferirse y procesarse en EE. UU., donde las leyes de privacidad pueden diferir.
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
            Aplicamos medidas razonables de seguridad técnica y organizativa. Ningún sistema es 100% seguro; usa contraseñas robustas y mantén tus credenciales confidenciales.
          </p>

          <h2>10) Menores</h2>
          <p>
            ZProject no está dirigido a menores de 13 años. Si crees que un menor nos proporcionó datos sin el consentimiento requerido, contáctanos para eliminarlos.
          </p>

          <h2>11) Cambios a esta Política</h2>
          <p>
            Podremos actualizar esta Política. Si el cambio es sustancial, intentaremos notificarlo por medios razonables. El uso continuado del Servicio implica aceptación.
          </p>

          <h2>12) Contacto</h2>
          <p>
            {L.contactLead} <a href={L.discord} target="_blank" rel="noopener noreferrer" className="footer-link">Discord</a>.
          </p>

          <h2>13) Ley aplicable</h2>
          <p>
            Esta Política se interpreta conforme a las leyes de Estados Unidos y del Estado de Florida, sin perjuicio de las normas de conflicto de leyes aplicables.
          </p>
        </div>
      );
    }

    // ===== EN =====
    if (code.startsWith("en")) {
      return (
        <div className="p-legal">
          <p><strong>{L.updatedLabel}:</strong> {L.updatedDate}</p>

          <h2>1) Scope</h2>
          <p>
            This Policy explains how ZProject (“we”) collects, uses, and shares information when you access or use our sites,
            apps, and services (the “Service”). ZProject is based in the United States (State of Florida).
          </p>

          {/* NEW: AI & Authenticity */}
          <h2>AI & Authenticity</h2>
          <p>
            ZProject is a sanctuary for creators. At least <strong>90% of content must be authentic</strong>, human-made.
            AI can be used as a tool, but <strong>works created entirely by AI cannot be sold or published</strong>.
            Such content will be removed and repeat attempts may lead to suspension or restrictions.
          </p>
          <p>
            ZProject <strong>does not use</strong> user works to train AI and <strong>does not sell private user data</strong>.
          </p>

          <h2>2) Information we collect</h2>
          <ul>
            <li><strong>Account information</strong>: username, language, preferences.</li>
            <li><strong>Content</strong> you post (works, text, images, videos, processes) and related metadata.</li>
            <li><strong>Usage & device</strong>: pages visited, interactions, device identifiers, OS, browser, approximate IP.</li>
            <li><strong>Cookies</strong> and similar technologies to remember preferences and improve your experience.</li>
          </ul>

          <h2>3) How we use information</h2>
          <ul>
            <li>Operate, maintain, and improve the Service.</li>
            <li>Personalize content (e.g., language or feed).</li>
            <li>Security, fraud prevention, and legal compliance.</li>
            <li>Communications about relevant Service changes.</li>
            <li>Aggregated analytics and metrics.</li>
          </ul>

          {/* NEW: Metrics detail */}
          <h2>Metrics & Analytics</h2>
          <p>
            We use <strong>anonymized</strong> internal metrics (e.g., tags, trends, aggregated years) to understand what works and improve the experience.
            <strong> We do not sell</strong> these metrics to outside third parties. We may offer <strong>premium statistics</strong> to artists within ZProject;
            this is internal use and <strong>does not constitute third-party selling</strong>.
          </p>

          <h2>4) Legal bases (where applicable)</h2>
          <ul>
            <li><em>Contract performance</em> (providing the Service you requested).</li>
            <li><em>Legitimate interests</em> (security, improvement, aggregated analytics).</li>
            <li><em>Consent</em> (where required by law, e.g., certain cookies).</li>
            <li><em>Legal compliance</em> (responding to valid requests).</li>
          </ul>

          <h2>5) Retention</h2>
          <p>
            We retain data while your account is active and as needed for the purposes described or to meet legal obligations.
            You may delete specific content and/or request account closure.
          </p>

          <h2>6) Sharing with third parties</h2>
          <p>
            We may use vendors processing data on our behalf (hosting, analytics, support). We require contractual safeguards.
            We do not sell your personal data.
          </p>

          <h3>6.1) Payment processing (Stripe)</h3>
          <p>
            We use <strong>Stripe</strong> to process payments. We do not store full card numbers or security codes.
            Stripe may perform identity verification (KYC) and fraud prevention. See{" "}
            <a className="footer-link" href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer">Privacy Policy</a> and{" "}
            <a className="footer-link" href="https://stripe.com/legal" target="_blank" rel="noopener noreferrer">Services Agreement</a>.
          </p>

          <h2>7) International transfers</h2>
          <p>
            The Service operates from the U.S. If you access from another region, your data may be transferred to and processed in the U.S., where privacy laws may differ.
          </p>

          <h2>8) Your choices and rights</h2>
          <ul>
            <li><strong>Access and rectification</strong> of your account information.</li>
            <li><strong>Deletion</strong> of submitted content or account closure.</li>
            <li><strong>Notification preferences</strong> (where available).</li>
            <li><strong>Cookies</strong>: configure your browser to limit/reject cookies (may impact features).</li>
          </ul>

          <h2>9) Security</h2>
          <p>
            We apply reasonable technical and organizational measures. No system is 100% secure; please use strong passwords and keep credentials confidential.
          </p>

          <h2>10) Children</h2>
          <p>
            ZProject is not directed to children under 13. If you believe a child provided data without required consent, contact us to delete it.
          </p>

          <h2>11) Changes to this Policy</h2>
          <p>
            We may update this Policy. If changes are material, we will attempt to notify you by reasonable means. Continued use implies acceptance.
          </p>

          <h2>12) Contact</h2>
          <p>
            {L.contactLead} <a href={L.discord} target="_blank" rel="noopener noreferrer" className="footer-link">Discord</a>.
          </p>

          <h2>13) Governing law</h2>
          <p>
            This Policy is governed by U.S. and Florida law, without prejudice to applicable conflict-of-law rules.
          </p>
        </div>
      );
    }

    // ===== PT =====
    if (code.startsWith("pt")) {
      return (
        <div className="p-legal">
          <p><strong>{L.updatedLabel}:</strong> {L.updatedDate}</p>

          <h2>1) Escopo</h2>
          <p>
            Esta Política explica como o ZProject (“nós”) coleta, usa e compartilha informações quando você acessa ou usa nossos sites,
            apps e serviços (“Serviço”). O ZProject está sediado nos Estados Unidos (Estado da Flórida).
          </p>

          {/* NOVO: IA e Autenticidade */}
          <h2>IA e Autenticidade</h2>
          <p>
            O ZProject é um santuário para criadores. Pelo menos <strong>90% do conteúdo deve ser autêntico</strong>, feito por humanos.
            A IA pode ser usada como ferramenta, mas <strong>obras criadas inteiramente por IA não podem ser publicadas nem vendidas</strong>.
            Esse conteúdo será removido e reincidências podem levar à suspensão ou restrições.
          </p>
          <p>
            O ZProject <strong>não usa</strong> as obras dos usuários para treinar IA e <strong>não vende dados privados</strong> dos usuários.
            cancelAnimationFrame(raf);
    };
  }, []);

  const L = useMemo(() => {
    const is = (p: string) => lang.startsWith(p);
    return {
      badge: is("es")
        ? "Información"
        : is("pt")
        ? "Informações"
        : is("fr")
        ? "Informations"
        : "Info",
      title: is("es")
        ? "Política de Privacidad"
        : is("pt")
        ? "Política de Privacidade"
        : is("fr")
        ? "Politique de Confidentialité"
        : "Privacy Policy",
      aria: is("es")
        ? "Política de Privacidad"
        : is("pt")
        ? "Política de Privacidade"
        : is("fr")
        ? "Politique de Confidentialité"
        : "Privacy Policy",
      back: is("es") ? "Volver" : is("pt") ? "Voltar" : is("fr") ? "Retour" : "Back",
      terms: is("es") ? "Términos" : is("pt") ? "Termos" : is("fr") ? "Conditions" : "Terms",
      updatedLabel: is("es")
        ? "Última actualización"
        : is("pt")
        ? "Última atualização"
        : is("fr")
        ? "Dernière mise à jour"
        : "Last updated",
      updatedDate: "[04/09/2025]",
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
    const choices = L.bubbles;
    let txt = choices[0];
    try {
      const key = "z_bubble_idx_privacy";
      const prev = Number(
        (typeof window !== "undefined" ? window.localStorage?.getItem(key) : "0") || "0"
      );
      const idx = isNaN(prev) ? 0 : prev;
      txt = choices[idx % choices.length];
      if (typeof window !== "undefined") {
        window.localStorage?.setItem(key, String((idx + 1) % choices.length));
      }
    } catch {}
    setBubbleText(txt);

    // Colocación del globo
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
        bubble.style.left = `${left}px`;
      });
    };

    place();
    const onScroll = () => place();
    const onResize = () => place();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);

    // Wiggle del icono
    icon.classList.add("logo-solo-talk");
    const stop = setTimeout(() => icon.classList.remove("logo-solo-talk"), 2600);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(frame);
      clearTimeout(stop);
    };
  }, [L.bubbles]);

  // ====== BLOQUE LEGAL MULTILENGUAJE ======
  const renderLegal = (code: string) => {
    // ===== ES =====
    if (code.startsWith("es")) {
      return (
        <div className="p-legal">
          <p><strong>{L.updatedLabel}:</strong> {L.updatedDate}</p>

          <h2>1) Alcance</h2>
          <p>
            Esta Política explica cómo ZProject (“nosotros”) recopila, usa y comparte información cuando accedes o usas
            nuestros sitios, apps y servicios (el “Servicio”). ZProject está basado en Estados Unidos (Estado de Florida).
          </p>

          {/* NUEVO: IA y Autenticidad */}
          <h2>IA y Autenticidad</h2>
          <p>
            ZProject es un santuario para creadores. El <strong>90% del contenido debe ser auténtico</strong>, hecho por humanos.
            La IA puede usarse como herramienta de apoyo, pero <strong>no se permite publicar ni vender obras creadas íntegramente por IA</strong>.
            Dicho contenido será eliminado y las cuentas reincidentes podrán ser suspendidas o restringidas.
          </p>
          <p>
            ZProject <strong>no utiliza</strong> las obras de los usuarios para entrenar IA y <strong>no vende datos privados</strong> de los usuarios.
          </p>

          <h2>2) Información que recopilamos</h2>
          <ul>
            <li><strong>Información de cuenta</strong>: nombre de usuario, idioma, preferencias.</li>
            <li><strong>Contenido</strong> que publicas (obras, textos, imágenes, videos, procesos) y metadatos asociados.</li>
            <li><strong>Uso y dispositivo</strong>: páginas visitadas, interacciones, identificadores de dispositivo, sistema operativo, navegador, IP aproximada.</li>
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

          {/* NUEVO: Métricas y Analítica (detalle) */}
          <h2>Métricas y Analítica</h2>
          <p>
            Utilizamos métricas <strong>anonimizadas</strong> (por ejemplo, tags, tendencias, años agregados) para entender qué funciona y mejorar la experiencia.
            <strong> No vendemos</strong> estas métrricas a terceros externos. Podemos ofrecer <strong>estadísticas premium</strong> a los propios artistas dentro de ZProject;
            esto es uso interno y <strong>no constituye venta a terceros</strong>.
          </p>

          <h2>4) Bases legales (si aplican en tu jurisdicción)</h2>
          <ul>
            <li><em>Ejecución del contrato</em> (brindarte el Servicio que solicitaste).</li>
            <li><em>Interés legítimo</em> (seguridad, mejora y analítica agregada).</li>
            <li><em>Consentimiento</em> (cuando la ley lo requiera, p. ej., ciertas cookies).</li>
            <li><em>Cumplimiento legal</em> (responder a requerimientos válidos).</li>
          </ul>

          <h2>5) Conservación</h2>
          <p>
            Conservamos datos mientras tu cuenta esté activa y por el tiempo necesario para los fines descritos o para cumplir obligaciones legales.
            Puedes eliminar contenido específico y/o solicitar cierre de cuenta.
          </p>

          <h2>6) Compartir con terceros</h2>
          <p>
            Podemos usar proveedores que procesan datos en nuestro nombre (alojamiento, analítica, soporte).
            Requerimos compromisos contractuales para proteger la información. No vendemos tus datos personales.
          </p>

          <h3>6.1) Procesamiento de pagos (Stripe)</h3>
          <p>
            Usamos <strong>Stripe</strong> para procesar pagos. No almacenamos números completos de tarjeta ni códigos de seguridad.
            Stripe puede realizar verificación de identidad (KYC) y prevención de fraude cuando corresponda.
            Consulta la <a className="footer-link" href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer">Política de Privacidad</a> y el{" "}
            <a className="footer-link" href="https://stripe.com/legal" target="_blank" rel="noopener noreferrer">Acuerdo de Servicios</a>.
          </p>

          <h2>7) Transferencias internacionales</h2>
          <p>
            El Servicio opera desde EE. UU. Si accedes desde otra región, tus datos pueden transferirse y procesarse en EE. UU., donde las leyes de privacidad pueden diferir.
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
            Aplicamos medidas razonables de seguridad técnica y organizativa. Ningún sistema es 100% seguro; usa contraseñas robustas y mantén tus credenciales confidenciales.
          </p>

          <h2>10) Menores</h2>
          <p>
            ZProject no está dirigido a menores de 13 años. Si crees que un menor nos proporcionó datos sin el consentimiento requerido, contáctanos para eliminarlos.
          </p>

          <h2>11) Cambios a esta Política</h2>
          <p>
            Podremos actualizar esta Política. Si el cambio es sustancial, intentaremos notificarlo por medios razonables. El uso continuado del Servicio implica aceptación.
          </p>

          <h2>12) Contacto</h2>
          <p>
            {L.contactLead} <a href={L.discord} target="_blank" rel="noopener noreferrer" className="footer-link">Discord</a>.
          </p>

          <h2>13) Ley aplicable</h2>
          <p>
            Esta Política se interpreta conforme a las leyes de Estados Unidos y del Estado de Florida, sin perjuicio de las normas de conflicto de leyes aplicables.
          </p>
        </div>
      );
    }

    // ===== EN =====
    if (code.startsWith("en")) {
      return (
        <div className="p-legal">
          <p><strong>{L.updatedLabel}:</strong> {L.updatedDate}</p>

          <h2>1) Scope</h2>
          <p>
            This Policy explains how ZProject (“we”) collects, uses, and shares information when you access or use our sites,
            apps, and services (the “Service”). ZProject is based in the United States (State of Florida).
          </p>

          {/* NEW: AI & Authenticity */}
          <h2>AI & Authenticity</h2>
          <p>
            ZProject is a sanctuary for creators. At least <strong>90% of content must be authentic</strong>, human-made.
            AI can be used as a tool, but <strong>works created entirely by AI cannot be sold or published</strong>.
            Such content will be removed and repeat attempts may lead to suspension or restrictions.
          </p>
          <p>
            ZProject <strong>does not use</strong> user works to train AI and <strong>does not sell private user data</strong>.
          </p>

          <h2>2) Information we collect</h2>
          <ul>
            <li><strong>Account information</strong>: username, language, preferences.</li>
            <li><strong>Content</strong> you post (works, text, images, videos, processes) and related metadata.</li>
            <li><strong>Usage & device</strong>: pages visited, interactions, device identifiers, OS, browser, approximate IP.</li>
            <li><strong>Cookies</strong> and similar technologies to remember preferences and improve your experience.</li>
          </ul>

          <h2>3) How we use information</h2>
          <ul>
            <li>Operate, maintain, and improve the Service.</li>
            <li>Personalize content (e.g., language or feed).</li>
            <li>Security, fraud prevention, and legal compliance.</li>
            <li>Communications about relevant Service changes.</li>
            <li>Aggregated analytics and metrics.</li>
          </ul>

          {/* NEW: Metrics detail */}
          <h2>Metrics & Analytics</h2>
          <p>
            We use <strong>anonymized</strong> internal metrics (e.g., tags, trends, aggregated years) to understand what works and improve the experience.
            <strong> We do not sell</strong> these metrics to outside third parties. We may offer <strong>premium statistics</strong> to artists within ZProject;
            this is internal use and <strong>does not constitute third-party selling</strong>.
          </p>

          <h2>4) Legal bases (where applicable)</h2>
          <ul>
            <li><em>Contract performance</em> (providing the Service you requested).</li>
            <li><em>Legitimate interests</em> (security, improvement, aggregated analytics).</li>
            <li><em>Consent</em> (where required by law, e.g., certain cookies).</li>
            <li><em>Legal compliance</em> (responding to valid requests).</li>
          </ul>

          <h2>5) Retention</h2>
          <p>
            We retain data while your account is active and as needed for the purposes described or to meet legal obligations.
            You may delete specific content and/or request account closure.
          </p>

          <h2>6) Sharing with third parties</h2>
          <p>
            We may use vendors processing data on our behalf (hosting, analytics, support). We require contractual safeguards.
            We do not sell your personal data.
          </p>

          <h3>6.1) Payment processing (Stripe)</h3>
          <p>
            We use <strong>Stripe</strong> to process payments. We do not store full card numbers or security codes.
            Stripe may perform identity verification (KYC) and fraud prevention. See{" "}
            <a className="footer-link" href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer">Privacy Policy</a> and{" "}
            <a className="footer-link" href="https://stripe.com/legal" target="_blank" rel="noopener noreferrer">Services Agreement</a>.
          </p>

          <h2>7) International transfers</h2>
          <p>
            The Service operates from the U.S. If you access from another region, your data may be transferred to and processed in the U.S., where privacy laws may differ.
          </p>

          <h2>8) Your choices and rights</h2>
          <ul>
            <li><strong>Access and rectification</strong> of your account information.</li>
            <li><strong>Deletion</strong> of submitted content or account closure.</li>
            <li><strong>Notification preferences</strong> (where available).</li>
            <li><strong>Cookies</strong>: configure your browser to limit/reject cookies (may impact features).</li>
          </ul>

          <h2>9) Security</h2>
          <p>
            We apply reasonable technical and organizational measures. No system is 100% secure; please use strong passwords and keep credentials confidential.
          </p>

          <h2>10) Children</h2>
          <p>
            ZProject is not directed to children under 13. If you believe a child provided data without required consent, contact us to delete it.
          </p>

          <h2>11) Changes to this Policy</h2>
          <p>
            We may update this Policy. If changes are material, we will attempt to notify you by reasonable means. Continued use implies acceptance.
          </p>

          <h2>12) Contact</h2>
          <p>
            {L.contactLead} <a href={L.discord} target="_blank" rel="noopener noreferrer" className="footer-link">Discord</a>.
          </p>

          <h2>13) Governing law</h2>
          <p>
            This Policy is governed by U.S. and Florida law, without prejudice to applicable conflict-of-law rules.
          </p>
        </div>
      );
    }

    // ===== PT =====
    if (code.startsWith("pt")) {
      return (
        <div className="p-legal">
          <p><strong>{L.updatedLabel}:</strong> {L.updatedDate}</p>

          <h2>1) Escopo</h2>
          <p>
            Esta Política explica como o ZProject (“nós”) coleta, usa e compartilha informações quando você acessa ou usa nossos sites,
            apps e serviços (“Serviço”). O ZProject está sediado nos Estados Unidos (Estado da Flórida).
          </p>

          {/* NOVO: IA e Autenticidade */}
          <h2>IA e Autenticidade</h2>
          <p>
            O ZProject é um santuário para criadores. Pelo menos <strong>90% do conteúdo deve ser autêntico</strong>, feito por humanos.
            A IA pode ser usada como ferramenta, mas <strong>obras criadas inteiramente por IA não podem ser publicadas nem vendidas</strong>.
            Esse conteúdo será removido e reincidências podem levar à suspensão ou restrições.
          </p>
          <p>
            O ZProject <strong>não usa</strong> as obras dos usuários para treinar IA e <strong>não vende dados privados</strong> dos usuários.
          </p>

              window.addEventListener("zproject:set-lang", onCustom as EventListener);

    // c) atributo lang en <html>
    const htmlEl = document.documentElement;
    const mo = new MutationObserver(() => refreshLangFromCookie());
    mo.observe(htmlEl, { attributes: true, attributeFilter: ["lang"] });

    // d) pequeño bombeo para capturar cambios inmediatos
    let raf = 0;
    const t0 = performance.now();
    const pump = (now: number) => {
      if (now - t0 < 2000) {
        raf = requestAnimationFrame(pump);
      } else {
        cancelAnimationFrame(raf);
      }
      refreshLangFromCookie();
    };
    raf = requestAnimationFrame(pump);

    return () => {
      window.removeEventListener("storage", onStorage);
      // @ts-expect-error – evento personalizado fuera de WindowEventMap
      window.removeEventListener("zproject:set-lang", onCustom as EventListener);
      mo.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  const L = useMemo(() => {
    const is = (p: string) => lang.startsWith(p);
    return {
      badge: is("es")
        ? "Información"
        : is("pt")
        ? "Informações"
        : is("fr")
        ? "Informations"
        : "Info",
      title: is("es")
        ? "Política de Privacidad"
        : is("pt")
        ? "Política de Privacidade"
        : is("fr")
        ? "Politique de Confidentialité"
        : "Privacy Policy",
      aria: is("es")
        ? "Política de Privacidad"
        : is("pt")
        ? "Política de Privacidade"
        : is("fr")
        ? "Politique de Confidentialité"
        : "Privacy Policy",
      back: is("es") ? "Volver" : is("pt") ? "Voltar" : is("fr") ? "Retour" : "Back",
      terms: is("es") ? "Términos" : is("pt") ? "Termos" : is("fr") ? "Conditions" : "Terms",
      updatedLabel: is("es")
        ? "Última actualización"
        : is("pt")
        ? "Última atualização"
        : is("fr")
        ? "Dernière mise à jour"
        : "Last updated",
      updatedDate: "[04/09/2025]",
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
    const choices = L.bubbles;
    let txt = choices[0];
    try {
      const key = "z_bubble_idx_privacy";
      const prev = Number(
        (typeof window !== "undefined" ? window.localStorage?.getItem(key) : "0") || "0"
      );
      const idx = isNaN(prev) ? 0 : prev;
      txt = choices[idx % choices.length];
      if (typeof window !== "undefined") {
        window.localStorage?.setItem(key, String((idx + 1) % choices.length));
      }
    } catch {}
    setBubbleText(txt);

    // Colocación del globo
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
        bubble.style.left = `${left}px`;
      });
    };

    place();
    const onScroll = () => place();
    const onResize = () => place();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);

    // Wiggle del icono
    icon.classList.add("logo-solo-talk");
    const stop = setTimeout(() => icon.classList.remove("logo-solo-talk"), 2600);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(frame);
      clearTimeout(stop);
    };
  }, [L.bubbles]);

  // ====== BLOQUE LEGAL MULTILENGUAJE ======
  const renderLegal = (code: string) => {
    // ===== ES =====
    if (code.startsWith("es")) {
      return (
        <div className="p-legal">
          <p><strong>{L.updatedLabel}:</strong> {L.updatedDate}</p>

          <h2>1) Alcance</h2>
          <p>
            Esta Política explica cómo ZProject (“nosotros”) recopila, usa y comparte información cuando accedes o usas
            nuestros sitios, apps y servicios (el “Servicio”). ZProject está basado en Estados Unidos (Estado de Florida).
          </p>

          {/* NUEVO: IA y Autenticidad */}
          <h2>IA y Autenticidad</h2>
          <p>
            ZProject es un santuario para creadores. El <strong>90% del contenido debe ser auténtico</strong>, hecho por humanos.
            La IA puede usarse como herramienta de apoyo, pero <strong>no se permite publicar ni vender obras creadas íntegramente por IA</strong>.
            Dicho contenido será eliminado y las cuentas reincidentes podrán ser suspendidas o restringidas.
          </p>
          <p>
            ZProject <strong>no utiliza</strong> las obras de los usuarios para entrenar IA y <strong>no vende datos privados</strong> de los usuarios.
          </p>

          <h2>2) Información que recopilamos</h2>
          <ul>
            <li><strong>Información de cuenta</strong>: nombre de usuario, idioma, preferencias.</li>
            <li><strong>Contenido</strong> que publicas (obras, textos, imágenes, videos, procesos) y metadatos asociados.</li>
            <li><strong>Uso y dispositivo</strong>: páginas visitadas, interacciones, identificadores de dispositivo, sistema operativo, navegador, IP aproximada.</li>
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

          {/* NUEVO: Métricas y Analítica (detalle) */}
          <h2>Métricas y Analítica</h2>
          <p>
            Utilizamos métricas <strong>anonimizadas</strong> (por ejemplo, tags, tendencias, años agregados) para entender qué funciona y mejorar la experiencia.
            <strong> No vendemos</strong> estas métricas a terceros externos. Podemos ofrecer <strong>estadísticas premium</strong> a los propios artistas dentro de ZProject;
            esto es uso interno y <strong>no constituye venta a terceros</strong>.
          </p>

          <h2>4) Bases legales (si aplican en tu jurisdicción)</h2>
          <ul>
            <li><em>Ejecución del contrato</em> (brindarte el Servicio que solicitaste).</li>
            <li><em>Interés legítimo</em> (seguridad, mejora y analítica agregada).</li>
            <li><em>Consentimiento</em> (cuando la ley lo requiera, p. ej., ciertas cookies).</li>
            <li><em>Cumplimiento legal</em> (responder a requerimientos válidos).</li>
          </ul>

          <h2>5) Conservación</h2>
          <p>
            Conservamos datos mientras tu cuenta esté activa y por el tiempo necesario para los fines descritos o para cumplir obligaciones legales.
            Puedes eliminar contenido específico y/o solicitar cierre de cuenta.
          </p>

          <h2>6) Compartir con terceros</h2>
          <p>
            Podemos usar proveedores que procesan datos en nuestro nombre (alojamiento, analítica, soporte).
            Requerimos compromisos contractuales para proteger la información. No vendemos tus datos personales.
          </p>

          <h3>6.1) Procesamiento de pagos (Stripe)</h3>
          <p>
            Usamos <strong>Stripe</strong> para procesar pagos. No almacenamos números completos de tarjeta ni códigos de seguridad.
            Stripe puede realizar verificación de identidad (KYC) y prevención de fraude cuando corresponda.
            Consulta la <a className="footer-link" href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer">Política de Privacidad</a> y el{" "}
            <a className="footer-link" href="https://stripe.com/legal" target="_blank" rel="noopener noreferrer">Acuerdo de Servicios</a>.
          </p>

          <h2>7) Transferencias internacionales</h2>
          <p>
            El Servicio opera desde EE. UU. Si accedes desde otra región, tus datos pueden transferirse y procesarse en EE. UU., donde las leyes de privacidad pueden diferir.
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
            Aplicamos medidas razonables de seguridad técnica y organizativa. Ningún sistema es 100% seguro; usa contraseñas robustas y mantén tus credenciales confidenciales.
          </p>

          <h2>10) Menores</h2>
          <p>
            ZProject no está dirigido a menores de 13 años. Si crees que un menor nos proporcionó datos sin el consentimiento requerido, contáctanos para eliminarlos.
          </p>

          <h2>11) Cambios a esta Política</h2>
          <p>
            Podremos actualizar esta Política. Si el cambio es sustancial, intentaremos notificarlo por medios razonables. El uso continuado del Servicio implica aceptación.
          </p>

          <h2>12) Contacto</h2>
          <p>
            {L.contactLead} <a href={L.discord} target="_blank" rel="noopener noreferrer" className="footer-link">Discord</a>.
          </p>

          <h2>13) Ley aplicable</h2>
          <p>
            Esta Política se interpreta conforme a las leyes de Estados Unidos y del Estado de Florida, sin perjuicio de las normas de conflicto de leyes aplicables.
          </p>
        </div>
      );
    }

    // ===== EN =====
    if (code.startsWith("en")) {
      return (
        <div className="p-legal">
          <p><strong>{L.updatedLabel}:</strong> {L.updatedDate}</p>

          <h2>1) Scope</h2>
          <p>
            This Policy explains how ZProject (“we”) collects, uses, and shares information when you access or use our sites,
            apps, and services (the “Service”). ZProject is based in the United States (State of Florida).
          </p>

          {/* NEW: AI & Authenticity */}
          <h2>AI & Authenticity</h2>
          <p>
            ZProject is a sanctuary for creators. At least <strong>90% of content must be authentic</strong>, human-made.
            AI can be used as a tool, but <strong>works created entirely by AI cannot be sold or published</strong>.
            Such content will be removed and repeat attempts may lead to suspension or restrictions.
          </p>
          <p>
            ZProject <strong>does not use</strong> user works to train AI and <strong>does not sell private user data</strong>.
          </p>

          <h2>2) Information we collect</h2>
          <ul>
            <li><strong>Account information</strong>: username, language, preferences.</li>
            <li><strong>Content</strong> you post (works, text, images, videos, processes) and related metadata.</li>
            <li><strong>Usage & device</strong>: pages visited, interactions, device identifiers, OS, browser, approximate IP.</li>
            <li><strong>Cookies</strong> and similar technologies to remember preferences and improve your experience.</li>
          </ul>

          <h2>3) How we use information</h2>
          <ul>
            <li>Operate, maintain, and improve the Service.</li>
            <li>Personalize content (e.g., language or feed).</li>
            <li>Security, fraud prevention, and legal compliance.</li>
            <li>Communications about relevant Service changes.</li>
            <li>Aggregated analytics and metrics.</li>
          </ul>

          {/* NEW: Metrics detail */}
          <h2>Metrics & Analytics</h2>
          <p>
            We use <strong>anonymized</strong> internal metrics (e.g., tags, trends, aggregated years) to understand what works and improve the experience.
            <strong> We do not sell</strong> these metrics to outside third parties. We may offer <strong>premium statistics</strong> to artists within ZProject;
            this is internal use and <strong>does not constitute third-party selling</strong>.
          </p>

          <h2>4) Legal bases (where applicable)</h2>
          <ul>
            <li><em>Contract performance</em> (providing the Service you requested).</li>
            <li><em>Legitimate interests</em> (security, improvement, aggregated analytics).</li>
            <li><em>Consent</em> (where required by law, e.g., certain cookies).</li>
            <li><em>Legal compliance</em> (responding to valid requests).</li>
          </ul>

          <h2>5) Retention</h2>
          <p>
            We retain data while your account is active and as needed for the purposes described or to meet legal obligations.
            You may delete specific content and/or request account closure.
          </p>

          <h2>6) Sharing with third parties</h2>
          <p>
            We may use vendors processing data on our behalf (hosting, analytics, support). We require contractual safeguards.
            We do not sell your personal data.
          </p>

          <h3>6.1) Payment processing (Stripe)</h3>
          <p>
            We use <strong>Stripe</strong> to process payments. We do not store full card numbers or security codes.
            Stripe may perform identity verification (KYC) and fraud prevention. See{" "}
            <a className="footer-link" href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer">Privacy Policy</a> and{" "}
            <a className="footer-link" href="https://stripe.com/legal" target="_blank" rel="noopener noreferrer">Services Agreement</a>.
          </p>

          <h2>7) International transfers</h2>
          <p>
            The Service operates from the U.S. If you access from another region, your data may be transferred to and processed in the U.S., where privacy laws may differ.
          </p>

          <h2>8) Your choices and rights</h2>
          <ul>
            <li><strong>Access and rectification</strong> of your account information.</li>
            <li><strong>Deletion</strong> of submitted content or account closure.</li>
            <li><strong>Notification preferences</strong> (where available).</li>
            <li><strong>Cookies</strong>: configure your browser to limit/reject cookies (may impact features).</li>
          </ul>

          <h2>9) Security</h2>
          <p>
            We apply reasonable technical and organizational measures. No system is 100% secure; please use strong passwords and keep credentials confidential.
          </p>

          <h2>10) Children</h2>
          <p>
            ZProject is not directed to children under 13. If you believe a child provided data without required consent, contact us to delete it.
          </p>

          <h2>11) Changes to this Policy</h2>
          <p>
            We may update this Policy. If changes are material, we will attempt to notify you by reasonable means. Continued use implies acceptance.
          </p>

          <h2>12) Contact</h2>
          <p>
            {L.contactLead} <a href={L.discord} target="_blank" rel="noopener noreferrer" className="footer-link">Discord</a>.
          </p>

          <h2>13) Governing law</h2>
          <p>
            This Policy is governed by U.S. and Florida law, without prejudice to applicable conflict-of-law rules.
          </p>
        </div>
      );
    }

    // ===== PT =====
    if (code.startsWith("pt")) {
      return (
        <div className="p-legal">
          <p><strong>{L.updatedLabel}:</strong> {L.updatedDate}</p>

          <h2>1) Escopo</h2>
          <p>
            Esta Política explica como o ZProject (“nós”) coleta, usa e compartilha informações quando você acessa ou usa nossos sites,
            apps e serviços (“Serviço”). O ZProject está sediado nos Estados Unidos (Estado da Flórida).
          </p>

          {/* NOVO: IA e Autenticidade */}
          <h2>IA e Autenticidade</h2>
          <p>
            O ZProject é um santuário para criadores. Pelo menos <strong>90% do conteúdo deve ser autêntico</strong>, feito por humanos.
            A IA pode ser usada como ferramenta, mas <strong>obras criadas inteiramente por IA não podem ser publicadas nem vendidas</strong>.
            Esse conteúdo será removido e reincidências podem levar à suspensão ou restrições.
          </p>
          <p>
            O ZProject <strong>não usa</strong> as obras dos usuários para treinar IA e <strong>não vende dados privados</strong> dos usuários.
          </p>

          <
    // c) atributo lang en <html>
    const htmlEl = document.documentElement;
    const mo = new MutationObserver(() => refreshLangFromCookie());
    mo.observe(htmlEl, { attributes: true, attributeFilter: ["lang"] });

    // d) pequeño bombeo para capturar cambios inmediatos
    let raf = 0;
    let t = performance.now();
    const pump = (now: number) => {
      if (now - t < 2000) {
        raf = requestAnimationFrame(pump);
      } else {
        cancelAnimationFrame(raf);
      }
      refreshLangFromCookie();
    };
    raf = requestAnimationFrame(pump);

    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("zproject:set-lang" as any, onCustom as EventListener);
      mo.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  const L = useMemo(() => {
    const is = (p: string) => lang.startsWith(p);
    return {
      badge: is("es")
        ? "Información"
        : is("pt")
        ? "Informações"
        : is("fr")
        ? "Informations"
        : "Info",
      title: is("es")
        ? "Política de Privacidad"
        : is("pt")
        ? "Política de Privacidade"
        : is("fr")
        ? "Politique de Confidentialité"
        : "Privacy Policy",
      aria: is("es")
        ? "Política de Privacidad"
        : is("pt")
        ? "Política de Privacidade"
        : is("fr")
        ? "Politique de Confidentialité"
        : "Privacy Policy",
      back: is("es") ? "Volver" : is("pt") ? "Voltar" : is("fr") ? "Retour" : "Back",
      terms: is("es") ? "Términos" : is("pt") ? "Termos" : is("fr") ? "Conditions" : "Terms",
      updatedLabel: is("es")
        ? "Última actualización"
        : is("pt")
        ? "Última atualização"
        : is("fr")
        ? "Dernière mise à jour"
        : "Last updated",
      updatedDate: "[04/09/2025]",
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
    const choices = L.bubbles;
    let txt = choices[0];
    try {
      const key = "z_bubble_idx_privacy";
      const prev = Number(
        (typeof window !== "undefined" ? window.localStorage?.getItem(key) : "0") || "0"
      );
      const idx = isNaN(prev) ? 0 : prev;
      txt = choices[idx % choices.length];
      if (typeof window !== "undefined") {
        window.localStorage?.setItem(key, String((idx + 1) % choices.length));
      }
    } catch {}
    setBubbleText(txt);

    // Colocación del globo
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
        bubble.style.left = `${left}px`;
      });
    };

    place();
    const onScroll = () => place();
    const onResize = () => place();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);

    // Wiggle del icono
    icon.classList.add("logo-solo-talk");
    const stop = setTimeout(() => icon.classList.remove("logo-solo-talk"), 2600);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(frame);
      clearTimeout(stop);
    };
  }, [L.bubbles]);

  // ====== BLOQUE LEGAL MULTILENGUAJE ======
  const renderLegal = (code: string) => {
    // ===== ES =====
    if (code.startsWith("es")) {
      return (
        <div className="p-legal">
          <p><strong>{L.updatedLabel}:</strong> {L.updatedDate}</p>

          <h2>1) Alcance</h2>
          <p>
            Esta Política explica cómo ZProject (“nosotros”) recopila, usa y comparte información cuando accedes o usas
            nuestros sitios, apps y servicios (el “Servicio”). ZProject está basado en Estados Unidos (Estado de Florida).
          </p>

          {/* NUEVO: IA y Autenticidad */}
          <h2>IA y Autenticidad</h2>
          <p>
            ZProject es un santuario para creadores. El <strong>90% del contenido debe ser auténtico</strong>, hecho por humanos.
            La IA puede usarse como herramienta de apoyo, pero <strong>no se permite publicar ni vender obras creadas íntegramente por IA</strong>.
            Dicho contenido será eliminado y las cuentas reincidentes podrán ser suspendidas o restringidas.
          </p>
          <p>
            ZProject <strong>no utiliza</strong> las obras de los usuarios para entrenar IA y <strong>no vende datos privados</strong> de los usuarios.
          </p>

          <h2>2) Información que recopilamos</h2>
          <ul>
            <li><strong>Información de cuenta</strong>: nombre de usuario, idioma, preferencias.</li>
            <li><strong>Contenido</strong> que publicas (obras, textos, imágenes, videos, procesos) y metadatos asociados.</li>
            <li><strong>Uso y dispositivo</strong>: páginas visitadas, interacciones, identificadores de dispositivo, sistema operativo, navegador, IP aproximada.</li>
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

          {/* NUEVO: Métricas y Analítica (detalle) */}
          <h2>Métricas y Analítica</h2>
          <p>
            Utilizamos métricas <strong>anonimizadas</strong> (por ejemplo, tags, tendencias, años agregados) para entender qué funciona y mejorar la experiencia.
            <strong> No vendemos</strong> estas métricas a terceros externos. Podemos ofrecer <strong>estadísticas premium</strong> a los propios artistas dentro de ZProject;
            esto es uso interno y <strong>no constituye venta a terceros</strong>.
          </p>

          <h2>4) Bases legales (si aplican en tu jurisdicción)</h2>
          <ul>
            <li><em>Ejecución del contrato</em> (brindarte el Servicio que solicitaste).</li>
            <li><em>Interés legítimo</em> (seguridad, mejora y analítica agregada).</li>
            <li><em>Consentimiento</em> (cuando la ley lo requiera, p. ej., ciertas cookies).</li>
            <li><em>Cumplimiento legal</em> (responder a requerimientos válidos).</li>
          </ul>

          <h2>5) Conservación</h2>
          <p>
            Conservamos datos mientras tu cuenta esté activa y por el tiempo necesario para los fines descritos o para cumplir obligaciones legales.
            Puedes eliminar contenido específico y/o solicitar cierre de cuenta.
          </p>

          <h2>6) Compartir con terceros</h2>
          <p>
            Podemos usar proveedores que procesan datos en nuestro nombre (alojamiento, analítica, soporte).
            Requerimos compromisos contractuales para proteger la información. No vendemos tus datos personales.
          </p>

          <h3>6.1) Procesamiento de pagos (Stripe)</h3>
          <p>
            Usamos <strong>Stripe</strong> para procesar pagos. No almacenamos números completos de tarjeta ni códigos de seguridad.
            Stripe puede realizar verificación de identidad (KYC) y prevención de fraude cuando corresponda.
            Consulta la <a className="footer-link" href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer">Política de Privacidad</a> y el{" "}
            <a className="footer-link" href="https://stripe.com/legal" target="_blank" rel="noopener noreferrer">Acuerdo de Servicios</a>.
          </p>

          <h2>7) Transferencias internacionales</h2>
          <p>
            El Servicio opera desde EE. UU. Si accedes desde otra región, tus datos pueden transferirse y procesarse en EE. UU., donde las leyes de privacidad pueden diferir.
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
            Aplicamos medidas razonables de seguridad técnica y organizativa. Ningún sistema es 100% seguro; usa contraseñas robustas y mantén tus credenciales confidenciales.
          </p>

          <h2>10) Menores</h2>
          <p>
            ZProject no está dirigido a menores de 13 años. Si crees que un menor nos proporcionó datos sin el consentimiento requerido, contáctanos para eliminarlos.
          </p>

          <h2>11) Cambios a esta Política</h2>
          <p>
            Podremos actualizar esta Política. Si el cambio es sustancial, intentaremos notificarlo por medios razonables. El uso continuado del Servicio implica aceptación.
          </p>

          <h2>12) Contacto</h2>
          <p>
            {L.contactLead} <a href={L.discord} target="_blank" rel="noopener noreferrer" className="footer-link">Discord</a>.
          </p>

          <h2>13) Ley aplicable</h2>
          <p>
            Esta Política se interpreta conforme a las leyes de Estados Unidos y del Estado de Florida, sin perjuicio de las normas de conflicto de leyes aplicables.
          </p>
        </div>
      );
    }

    // ===== EN =====
    if (code.startsWith("en")) {
      return (
        <div className="p-legal">
          <p><strong>{L.updatedLabel}:</strong> {L.updatedDate}</p>

          <h2>1) Scope</h2>
          <p>
            This Policy explains how ZProject (“we”) collects, uses, and shares information when you access or use our sites,
            apps, and services (the “Service”). ZProject is based in the United States (State of Florida).
          </p>

          {/* NEW: AI & Authenticity */}
          <h2>AI & Authenticity</h2>
          <p>
            ZProject is a sanctuary for creators. At least <strong>90% of content must be authentic</strong>, human-made.
            AI can be used as a tool, but <strong>works created entirely by AI cannot be sold or published</strong>.
            Such content will be removed and repeat attempts may lead to suspension or restrictions.
          </p>
          <p>
            ZProject <strong>does not use</strong> user works to train AI and <strong>does not sell private user data</strong>.
          </p>

          <h2>2) Information we collect</h2>
          <ul>
            <li><strong>Account information</strong>: username, language, preferences.</li>
            <li><strong>Content</strong> you post (works, text, images, videos, processes) and related metadata.</li>
            <li><strong>Usage & device</strong>: pages visited, interactions, device identifiers, OS, browser, approximate IP.</li>
            <li><strong>Cookies</strong> and similar technologies to remember preferences and improve your experience.</li>
          </ul>

          <h2>3) How we use information</h2>
          <ul>
            <li>Operate, maintain, and improve the Service.</li>
            <li>Personalize content (e.g., language or feed).</li>
            <li>Security, fraud prevention, and legal compliance.</li>
            <li>Communications about relevant Service changes.</li>
            <li>Aggregated analytics and metrics.</li>
          </ul>

          {/* NEW: Metrics detail */}
          <h2>Metrics & Analytics</h2>
          <p>
            We use <strong>anonymized</strong> internal metrics (e.g., tags, trends, aggregated years) to understand what works and improve the experience.
            <strong> We do not sell</strong> these metrics to outside third parties. We may offer <strong>premium statistics</strong> to artists within ZProject;
            this is internal use and <strong>does not constitute third-party selling</strong>.
          </p>

          <h2>4) Legal bases (where applicable)</h2>
          <ul>
            <li><em>Contract performance</em> (providing the Service you requested).</li>
            <li><em>Legitimate interests</em> (security, improvement, aggregated analytics).</li>
            <li><em>Consent</em> (where required by law, e.g., certain cookies).</li>
            <li><em>Legal compliance</em> (responding to valid requests).</li>
          </ul>

          <h2>5) Retention</h2>
          <p>
            We retain data while your account is active and as needed for the purposes described or to meet legal obligations.
            You may delete specific content and/or request account closure.
          </p>

          <h2>6) Sharing with third parties</h2>
          <p>
            We may use vendors processing data on our behalf (hosting, analytics, support). We require contractual safeguards.
            We do not sell your personal data.
          </p>

          <h3>6.1) Payment processing (Stripe)</h3>
          <p>
            We use <strong>Stripe</strong> to process payments. We do not store full card numbers or security codes.
            Stripe may perform identity verification (KYC) and fraud prevention. See{" "}
            <a className="footer-link" href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer">Privacy Policy</a> and{" "}
            <a className="footer-link" href="https://stripe.com/legal" target="_blank" rel="noopener noreferrer">Services Agreement</a>.
          </p>

          <h2>7) International transfers</h2>
          <p>
            The Service operates from the U.S. If you access from another region, your data may be transferred to and processed in the U.S., where privacy laws may differ.
          </p>

          <h2>8) Your choices and rights</h2>
          <ul>
            <li><strong>Access and rectification</strong> of your account information.</li>
            <li><strong>Deletion</strong> of submitted content or account closure.</li>
            <li><strong>Notification preferences</strong> (where available).</li>
            <li><strong>Cookies</strong>: configure your browser to limit/reject cookies (may impact features).</li>
          </ul>

          <h2>9) Security</h2>
          <p>
            We apply reasonable technical and organizational measures. No system is 100% secure; please use strong passwords and keep credentials confidential.
          </p>

          <h2>10) Children</h2>
          <p>
            ZProject is not directed to children under 13. If you believe a child provided data without required consent, contact us to delete it.
          </p>

          <h2>11) Changes to this Policy</h2>
          <p>
            We may update this Policy. If changes are material, we will attempt to notify you by reasonable means. Continued use implies acceptance.
          </p>

          <h2>12) Contact</h2>
          <p>
            {L.contactLead} <a href={L.discord} target="_blank" rel="noopener noreferrer" className="footer-link">Discord</a>.
          </p>

          <h2>13) Governing law</h2>
          <p>
            This Policy is governed by U.S. and Florida law, without prejudice to applicable conflict-of-law rules.
          </p>
        </div>
      );
    }

    // ===== PT =====
    if (code.startsWith("pt")) {
      return (
        <div className="p-legal">
          <p><strong>{L.updatedLabel}:</strong> {L.updatedDate}</p>

          <h2>1) Escopo</h2>
          <p>
            Esta Política explica como o ZProject (“nós”) coleta, usa e compartilha informações quando você acessa ou usa nossos sites,
            apps e serviços (“Serviço”). O ZProject está sediado nos Estados Unidos (Estado da Flórida).
          </p>

          {/* NOVO: IA e Autenticidade */}
          <h2>IA e Autenticidade</h2>
          <p>
            O ZProject é um santuário para criadores. Pelo menos <strong>90% do conteúdo deve ser autêntico</strong>, feito por humanos.
            A IA pode ser usada como ferramenta, mas <strong>obras criadas inteiramente por IA não podem ser publicadas nem vendidas</strong>.
            Esse conteúdo será removido e reincidências podem levar à suspensão ou restrições.
          </p>
          <p>
            O ZProject <strong>não usa</strong> as obras dos usuários para treinar IA e <strong>não vende dados privados</strong> dos usuários.
          </p>

          <h2>2) Informações que coletamos</h2>
          <ul>
            <li><strong>Informações de conta</strong>: nome de usuário, idioma, preferências.</li>
            <li><strong>Conteúdo</strong> que você publica (obras, textos, imagens, vídeos, processos) e metadados associados.</li>
            <li><strong>Uso e dispositivo</strong>: páginas visitadas, interações, identificadores de dispositivo, SO, navegador, IP aproximado.</li>
            <li><strong>Cookies</strong> e tecnologias semelhantes para lembrar preferências e melhorar a experiência.</li>
          </ul>

          <h2>3) Para que usamos as informações</h2>
          <ul>
            <li>Operar, manter e melhorar o Serviço.</li>
            <li>Personalizar conteúdo (ex.: idioma ou feed).</li>
            <li>Segurança, prevenção a fraudes e conformidade legal.</li>
            <li>Comunicações sobre mudanças relevantes do Serviço.</li>
            <li>Métricas e análises agregadas.</li>
          </ul>

          {/* NOVO: Métricas detalhadas */}
          <h2>Métricas e Análises</h2>
          <p>
            Utilizamos métricas <strong>anonimizadas</strong> (tags, tendências, anos agregados) para entender o que funciona e melhorar a experiência.
            <strong> Não vendemos</strong> essas métricas a terceiros externos. Podemos oferecer <strong>estatísticas premium</strong> a artistas dentro do ZProject;
            isso é uso interno e <strong>não configura venda a terceiros</strong>.
          </p>

          <h2>4) Bases legais (quando aplicável)</h2>
          <ul>
            <li><em>Execução do contrato</em> (fornecer o Serviço solicitado).</li>
            <li><em>Interesse legítimo</em> (segurança, melhoria, análises agregadas).</li>
            <li><em>Consentimento</em> (quando exigido por lei, ex.: certos cookies).</li>
            <li><em>Cumprimento legal</em> (responder a solicitações válidas).</li>
          </ul>

          <h2>5) Retenção</h2>
          <p>
            Mantemos dados enquanto sua conta estiver ativa e pelo tempo necessário às finalidades descritas ou às obrigações legais.
            Você pode excluir conteúdo específico e/ou solicitar encerramento da conta.
          </p>

          <h2>6) Compartilhamento com terceiros</h2>
          <p>
            Podemos usar provedores que processam dados em nosso nome (hospedagem, análises, suporte). Exigimos salvaguardas contratuais.
            Não vendemos seus dados pessoais.
          </p>

          <h3>6.1) Processamento de pagamentos (Stripe)</h3>
          <p>
            Usamos a <strong>Stripe</strong> para processar pagamentos. Não armazenamos números completos de cartão nem códigos de segurança.
            A Stripe pode realizar KYC e prevenção a fraudes quando aplicável. Veja a{" "}
            <a className="footer-link" href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer">Política de Privacidade</a> e o{" "}
            <a className="footer-link" href="https://stripe.com/legal" target="_blank" rel="noopener noreferrer">Contrato de Serviços</a>.
          </p>

          <h2>7) Transferências internacionais</h2>
          <p>
            O Serviço opera a partir dos EUA. Se você acessa de outra região, seus dados podem ser transferidos e processados nos EUA, onde as leis podem diferir.
          </p>

          <h2>8) Suas opções e direitos</h2>
          <ul>
            <li><strong>Acesso e retificação</strong> das informações da sua conta.</li>
            <li><strong>Exclusão</strong> de conteúdo enviado ou encerramento da conta.</li>
            <li><strong>Preferências</strong> de notificações (quando disponíveis).</li>
            <li><strong>Cookies</strong>: ajuste seu navegador para limitar/recusar cookies (pode afetar funcionalidades).</li>
          </ul>

          <h2>9) Segurança</h2>
          <p>
            Aplicamos medidas técnicas e organizacionais razoáveis. Nenhum sistema é 100% seguro; use senhas fortes e mantenha suas credenciais confidenciais.
          </p>

          <h2>10) Menores</h2>
          <p>
            O ZProject não é destinado a menores de 13 anos. Se acredita que um menor forneceu dados sem consentimento, entre em contato para excluir.
          </p>

          <h2>11) Alterações a esta Política</h2>
          <p>
            Podemos atualizar esta Política. Se a alteração for substancial, tentaremos notificar por meios razoáveis. O uso contínuo implica aceitação.
          </p>

          <h2>12) Contato</h2>
          <p>
            {L.contactLead} <a href={L.discord} target="_blank" rel="noopener noreferrer" className="footer-link">Discord</a>.
          </p>

          <h2>13) Lei aplicável</h2>
          <p>
            Esta Política é regida pelas leis dos EUA e do Estado da Flórida, sem prejuízo das regras aplicáveis de conflito de leis.
          </p>
        </div>
      );
    }

    // ===== FR =====
    if (code.startsWith("fr")) {
      return (
        <div className="p-legal">
          <p><strong>{L.updatedLabel}:</strong> {L.updatedDate}</p>

          <h2>1) Portée</h2>
          <p>
            La présente Politique explique comment ZProject (« nous ») collecte, utilise et partage des informations lorsque
            vous accédez à nos sites, applications et services (le « Service »). ZProject est basé aux États-Unis (État de Floride).
          </p>

          {/* NOUVEAU : IA & Authenticité */}
          <h2>IA & Authenticité</h2>
          <p>
            ZProject est un sanctuaire pour créateurs. Au moins <strong>90 % du contenu doit être authentique</strong>, réalisé par des humains.
            L’IA peut être un outil, mais <strong>les œuvres créées entièrement par IA ne peuvent pas être publiées ni vendues</strong>.
            Ce contenu sera retiré et les récidives peuvent entraîner suspension ou restrictions.
          </p>
          <p>
            ZProject <strong>n’utilise pas</strong> les œuvres des utilisateurs pour entraîner l’IA et <strong>ne vend pas de données privées</strong> d’utilisateurs.
          </p>

          <h2>2) Informations collectées</h2>
          <ul>
            <li><strong>Infos de compte</strong> : nom d’utilisateur, langue, préférences.</li>
            <li><strong>Contenu</strong> publié (œuvres, textes, images, vidéos, processus) et métadonnées associées.</li>
            <li><strong>Usage & appareil</strong> : pages visitées, interactions, identifiants d’appareil, OS, navigateur, IP approximative.</li>
            <li><strong>Cookies</strong> et technologies similaires pour mémoriser les préférences et améliorer l’expérience.</li>
          </ul>

          <h2>3) Utilisation des informations</h2>
          <ul>
            <li>Exploiter, maintenir et améliorer le Service.</li>
            <li>Personnaliser le contenu (p. ex. langue ou fil).</li>
            <li>Sécurité, prévention de fraude, conformité légale.</li>
            <li>Communications sur des changements pertinents du Service.</li>
            <li>Analyses et métriques agrégées.</li>
          </ul>

          {/* NOUVEAU : métriques détaillées */}
          <h2>Métriques & Analyses</h2>
          <p>
            Nous utilisons des métriques <strong>anonymisées</strong> (tags, tendances, années agrégées) pour comprendre ce qui fonctionne et améliorer l’expérience.
            <strong> Nous ne vendons pas</strong> ces métriques à des tiers externes. Nous pouvons fournir des <strong>statistiques premium</strong> aux artistes au sein de ZProject ;
            il s’agit d’un usage interne et <strong>cela ne constitue pas une vente à des tiers</strong>.
          </p>

          <h2>4) Bases juridiques (le cas échéant)</h2>
          <ul>
            <li><em>Exécution du contrat</em> (fournir le Service demandé).</li>
            <li><em>Intérêt légitime</em> (sécurité, amélioration, analyses agrégées).</li>
            <li><em>Consentement</em> (lorsque la loi l’exige, p. ex. certains cookies).</li>
            <li><em>Obligation légale</em> (répondre à des demandes valides).</li>
          </ul>

          <h2>5) Conservation</h2>
          <p>
            Nous conservons les données tant que votre compte est actif et aussi longtemps que nécessaire aux finalités décrites ou aux obligations légales.
            Vous pouvez supprimer du contenu et/ou demander la clôture du compte.
          </p>

          <h2>6) Partage avec des tiers</h2>
          <p>
            Nous pouvons recourir à des prestataires traitant des données pour notre compte (hébergement, analyses, support).
            Des garanties contractuelles sont exigées. Nous ne vendons pas vos données personnelles.
          </p>

          <h3>6.1) Traitement des paiements (Stripe)</h3>
          <p>
            Les paiements sont traités par <strong>Stripe</strong>. Nous ne stockons ni numéros complets de carte ni codes de sécurité.
            Stripe peut effectuer KYC et prévention de fraude. Voir{" "}
            <a className="footer-link" href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer">Politique de confidentialité</a> et{" "}
            <a className="footer-link" href="https://stripe.com/legal" target="_blank" rel="noopener noreferrer">Contrat de services</a>.
          </p>

          <h2>7) Transferts internationaux</h2>
          <p>
            Le Service fonctionne depuis les États-Unis. Si vous y accédez depuis une autre région, vos données peuvent être transférées et traitées aux États-Unis,
            où les lois de confidentialité peuvent différer.
          </p>

          <h2>8) Vos choix et droits</h2>
          <ul>
            <li><strong>Accès et rectification</strong> des informations de votre compte.</li>
            <li><strong>Suppression</strong> de contenu envoyé ou clôture du compte.</li>
            <li><strong>Préférences</strong> de notifications (lorsqu’elles sont disponibles).</li>
            <li><strong>Cookies</strong> : vous pouvez configurer votre navigateur pour limiter/refuser les cookies (peut affecter certaines fonctions).</li>
          </ul>

          <h2>9) Sécurité</h2>
          <p>
            Nous appliquons des mesures raisonnables de sécurité techniques et organisationnelles. Aucun système n’est 100 % sûr ; utilisez des mots de passe robustes et gardez vos identifiants confidentiels.
          </p>

          <h2>10) Mineurs</h2>
          <p>
            ZProject ne s’adresse pas aux moins de 13 ans. Si vous pensez qu’un mineur nous a transmis des données sans consentement requis, contactez-nous pour les supprimer.
          </p>

          <h2>11) Modifications de cette Politique</h2>
          <p>
            Nous pouvons mettre à jour cette Politique. En cas de changement important, nous tenterons d’en informer par des moyens raisonnables. L’usage continu vaut acceptation.
          </p>

          <h2>12) Contact</h2>
          <p>
            {L.contactLead} <a href={L.discord} target="_blank" rel="noopener noreferrer" className="footer-link">Discord</a>.
          </p>

          <h2>13) Droit applicable</h2>
          <p>
            La présente Politique est régie par les lois des États-Unis et de l’État de Floride, sous réserve des règles applicables en matière de conflit de lois.
          </p>
        </div>
      );
    }

    // fallback (no debería verse)
    return <div className="p-legal">Coming soon...</div>;
  };

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

          {/* ====== Política multilenguaje (completa + nuevas secciones) ====== */}
          {renderLegal(lang)}

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
        .p-legal h3{
          margin: 10px 0 4px 0;
          font-size: 1.02em;
          font-weight: 800;
          color: color-mix(in oklab, var(--foreground), transparent 8%);
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
