// src/app/terms/page.tsx
"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

/* ===== Utilidades de idioma ===== */
function resolveLangKey(raw: string) {
  const v = (raw || "en").toLowerCase();
  if (v.startsWith("es")) return "es";
  if (v.startsWith("pt")) return "pt";
  if (v.startsWith("fr")) return "fr";
  return "en";
}
function getLangFromEnv(): string {
  try {
    const m = document.cookie.match(/(?:^|;\s*)zproject_lang=([^;]+)/i);
    if (m?.[1]) return m[1].toLowerCase();
  } catch {}
  const htmlLang = document.documentElement.getAttribute("lang") || "en";
  return htmlLang.toLowerCase();
}
function useReactiveLang() {
  const [lang, setLang] = useState<string>("en");
  useEffect(() => {
    const refresh = () => setLang(getLangFromEnv());
    refresh();

    const onCustom = () => refresh();
    const onStorage = (e: StorageEvent) => {
      if (e.key === "zproject_lang") refresh();
    };
    const mo = new MutationObserver(refresh);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });

    window.addEventListener("zproject:set-lang", onCustom as EventListener);
    window.addEventListener("storage", onStorage);

    // Pulso breve por si el selector de idioma setea async
    let raf = 0;
    const t0 = performance.now();
    const pump = (t: number) => {
      if (t - t0 < 800) {
        refresh();
        raf = requestAnimationFrame(pump);
      } else cancelAnimationFrame(raf);
    };
    raf = requestAnimationFrame(pump);

    return () => {
      window.removeEventListener("zproject:set-lang", onCustom as EventListener);
      window.removeEventListener("storage", onStorage);
      mo.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);
  return resolveLangKey(lang);
}

/* ===== Diccionarios UI + Títulos de secciones ===== */
const dict = {
  es: {
    ui: {
      badge: "Próximamente",
      title: "Términos y Condiciones",
      aria: "Términos y Condiciones",
      back: "Volver",
      privacy: "Privacidad",
      bubbles: ["Lee esto antes de continuar 📜", "Nada aburrido, lo prometo 😅", "Términos importantes ✨"],
      contactLead: "Dudas, comentarios o solicitudes legales:",
      discord: "https://discord.gg/5Y4Yz2cS",
      updatedLabel: "Última actualización",
      updatedDate: "[04/09/2025]",
    },
    headings: {
      s1: "1) Aceptación",
      s2: "2) Quién puede usar ZProject",
      s3: "3) Cuenta y seguridad",
      s4: "4) Contenido de usuario",
      s5: "5) Conducta y usos prohibidos",
      s51: "5.1) Monetización y contenido prohibido — Excepción artística",
      s52: "5.2) IPs/marcas y obras de terceros (licencias requeridas)",
      s6: "6) Propiedad intelectual de ZProject",
      s7: "7) IA y contenido generado/transformado",
      s8: "8) Pagos, donaciones y apoyo",
      s81: "8.1) Procesamiento de pagos con Stripe",
      s82: "8.2) Métricas internas y estadísticas para artistas (anonimizadas)",
      s9: "9) Beta, cambios y disponibilidad",
      s10: "10) Privacidad",
      s11: "11) Terceros y enlaces",
      s12: "12) Reportes de infracción",
      s13: "13) Exención de garantías",
      s14: "14) Limitación de responsabilidad",
      s15: "15) Terminación",
      s16: "16) Ley aplicable y jurisdicción",
      s17: "17) Contacto",
    },
  },
  en: {
    ui: {
      badge: "Coming soon",
      title: "Terms & Conditions",
      aria: "Terms & Conditions",
      back: "Back",
      privacy: "Privacy",
      bubbles: ["Read this before continuing 📜", "Promise it’s quick 😅", "Important terms ✨"],
      contactLead: "Questions, comments or legal requests:",
      discord: "https://discord.gg/5Y4Yz2cS",
      updatedLabel: "Last updated",
      updatedDate: "[09/04/2025]",
    },
    headings: {
      s1: "1) Acceptance",
      s2: "2) Who can use ZProject",
      s3: "3) Account & security",
      s4: "4) User content",
      s5: "5) Conduct & prohibited uses",
      s51: "5.1) Monetization & prohibited content — Artistic exception",
      s52: "5.2) Third-party IP/brands & works (licenses required)",
      s6: "6) ZProject intellectual property",
      s7: "7) AI & generated/transformed content",
      s8: "8) Payments, donations & support",
      s81: "8.1) Payment processing with Stripe",
      s82: "8.2) Internal metrics & artist stats (anonymized)",
      s9: "9) Beta, changes & availability",
      s10: "10) Privacy",
      s11: "11) Third parties & links",
      s12: "12) Infringement reports",
      s13: "13) Disclaimer of warranties",
      s14: "14) Limitation of liability",
      s15: "15) Termination",
      s16: "16) Governing law & jurisdiction",
      s17: "17) Contact",
    },
  },
  pt: {
    ui: {
      badge: "Em breve",
      title: "Termos e Condições",
      aria: "Termos e Condições",
      back: "Voltar",
      privacy: "Privacidade",
      bubbles: ["Leia isto antes de seguir 📜", "Prometo que é rápido 😅", "Termos importantes ✨"],
      contactLead: "Dúvidas, comentários ou solicitações legais:",
      discord: "https://discord.gg/5Y4Yz2cS",
      updatedLabel: "Última atualização",
      updatedDate: "[04/09/2025]",
    },
    headings: {
      s1: "1) Aceitação",
      s2: "2) Quem pode usar o ZProject",
      s3: "3) Conta e segurança",
      s4: "4) Conteúdo do usuário",
      s5: "5) Conduta e usos proibidos",
      s51: "5.1) Monetização e conteúdo proibido — Exceção artística",
      s52: "5.2) IPs/marcas e obras de terceiros (licenças exigidas)",
      s6: "6) Propriedade intelectual do ZProject",
      s7: "7) IA e conteúdo gerado/transformado",
      s8: "8) Pagamentos, doações e apoio",
      s81: "8.1) Processamento de pagamentos com a Stripe",
      s82: "8.2) Métricas internas e estatísticas para artistas (anonimizadas)",
      s9: "9) Beta, mudanças e disponibilidade",
      s10: "10) Privacidade",
      s11: "11) Terceiros e links",
      s12: "12) Relatos de infração",
      s13: "13) Isenção de garantias",
      s14: "14) Limitação de responsabilidade",
      s15: "15) Rescisão",
      s16: "16) Lei aplicável e jurisdição",
      s17: "17) Contato",
    },
  },
  fr: {
    ui: {
      badge: "Bientôt",
      title: "Conditions d’utilisation",
      aria: "Conditions d’utilisation",
      back: "Retour",
      privacy: "Confidentialité",
      bubbles: ["À lire avant de continuer 📜", "Promis, c’est rapide 😅", "Conditions importantes ✨"],
      contactLead: "Questions, commentaires ou demandes légales :",
      discord: "https://discord.gg/5Y4Yz2cS",
      updatedLabel: "Dernière mise à jour",
      updatedDate: "[04/09/2025]",
    },
    headings: {
      s1: "1) Acceptation",
      s2: "2) Qui peut utiliser ZProject",
      s3: "3) Compte et sécurité",
      s4: "4) Contenu utilisateur",
      s5: "5) Conduite & usages interdits",
      s51: "5.1) Monétisation & contenus interdits — Exception artistique",
      s52: "5.2) PI/marques & œuvres tierces (licences requises)",
      s6: "6) Propriété intellectuelle de ZProject",
      s7: "7) IA & contenu généré/transformé",
      s8: "8) Paiements, dons & soutien",
      s81: "8.1) Traitement des paiements avec Stripe",
      s82: "8.2) Métriques internes & statistiques pour artistes (anonymisées)",
      s9: "9) Bêta, changements & disponibilité",
      s10: "10) Confidentialité",
      s11: "11) Tiers & liens",
      s12: "12) Signalements d’atteinte",
      s13: "13) Exclusion de garanties",
      s14: "14) Limitation de responsabilité",
      s15: "15) Résiliation",
      s16: "16) Droit applicable & juridiction",
      s17: "17) Contact",
    },
  },
} as const;

export default function TermsPage() {
  const langKey = useReactiveLang();
  const T = useMemo(() => dict[langKey].ui, [langKey]);
  const H = useMemo(() => dict[langKey].headings, [langKey]);
  const is = (p: string) => langKey === p;

  // ===== Globo de diálogo (rotación por visita) =====
  const bubbleRef = useRef<HTMLDivElement>(null);
  const [bubbleText, setBubbleText] = useState<string>("");

  useEffect(() => {
    // ⚠️ Forzamos a string[] para evitar unions de literales demasiado estrictos
    const choices = (T.bubbles as unknown as string[]) || [];
    let txt: string = choices[0] || "";
    try {
      const key = "z_bubble_idx_terms";
      const prev = Number((typeof window !== "undefined" ? window.localStorage?.getItem(key) : "0") || "0");
      const idx = isNaN(prev) ? 0 : prev;
      txt = choices.length ? choices[idx % choices.length] : (choices[0] || "");
      if (typeof window !== "undefined") {
        const next = choices.length ? (idx + 1) % choices.length : 0;
        window.localStorage?.setItem(key, String(next));
      }
    } catch {}
    setBubbleText(txt);

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
  }, [T.bubbles]);

  return (
    <main className="relative min-h-[72vh] flex items-center justify-center text-center overflow-hidden">
      {/* Globo de diálogo pegado al icono del header */}
      <div ref={bubbleRef} className="talk-bubble" role="status" aria-live="polite">
        {bubbleText}
      </div>

      {/* Contenido */}
      <section className="container px-6 relative z-[2] w-full flex justify-center">
        <article className="settings-card t-card" aria-label={T.aria} role="status">
          <div className="badge t-badge">{T.badge}</div>

          <div className="t-icon" aria-hidden>
            <span className="t-emoji">📜</span>
          </div>

          <h1 className="t-title">{T.title}</h1>

          {/* ====== Términos ====== */}
          <div className="t-legal">
            <p>
              <strong>{T.updatedLabel}:</strong> {T.updatedDate}
            </p>

            <h2>{H.s1}</h2>
            <p>
              {is("es") &&
                "Al acceder o usar ZProject (el “Servicio”), aceptas estos Términos y nuestra Política de Privacidad. Si no estás de acuerdo, por favor no uses el Servicio."}
              {is("en") &&
                "By accessing or using ZProject (the “Service”), you agree to these Terms and our Privacy Policy. If you don’t agree, please don’t use the Service."}
              {is("pt") &&
                "Ao acessar ou usar o ZProject (“Serviço”), você concorda com estes Termos e com nossa Política de Privacidade. Se não concordar, não use o Serviço."}
              {is("fr") &&
                "En accédant à ZProject (le « Service »), vous acceptez ces Conditions et notre Politique de confidentialité. Si vous n’êtes pas d’accord, n’utilisez pas le Service."}
            </p>

            <h2>{H.s2}</h2>
            <p>
              {is("es") &&
                "Debes tener al menos 13 años (o la edad mínima legal en tu país) y capacidad para aceptar contratos. Si usas ZProject en nombre de una organización, declaras que tienes autoridad para vincularla a estos Términos."}
              {is("en") &&
                "You must be at least 13 (or the legal minimum in your country) and able to enter contracts. If you use ZProject on behalf of an organization, you confirm you’re authorized to bind it to these Terms."}
              {is("pt") &&
                "Você deve ter pelo menos 13 anos (ou a idade mínima legal no seu país) e aptidão para aceitar contratos. Se usar o ZProject em nome de uma organização, declara ter autoridade para vinculá-la a estes Termos."}
              {is("fr") &&
                "Vous devez avoir au moins 13 ans (ou l’âge légal dans votre pays) et être capable de contracter. Si vous utilisez ZProject pour une organisation, vous certifiez être habilité à l’engager par ces Conditions."}
            </p>

            <h2>{H.s3}</h2>
            <ul>
              <li>
                {is("es")
                  ? "Serás responsable de la veracidad de los datos que proporciones."
                  : is("pt")
                  ? "Você é responsável pela veracidade dos dados que fornecer."
                  : is("fr")
                  ? "Vous êtes responsable de l’exactitude des informations fournies."
                  : "You’re responsible for the accuracy of information you provide."}
              </li>
              <li>
                {is("es")
                  ? "Debes mantener la confidencialidad de tus credenciales."
                  : is("pt")
                  ? "Mantenha suas credenciais confidenciais."
                  : is("fr")
                  ? "Vous devez garder vos identifiants confidentiels."
                  : "Keep your credentials confidential."}
              </li>
              <li>
                {is("es")
                  ? "Eres responsable de todas las actividades realizadas desde tu cuenta."
                  : is("pt")
                  ? "Você é responsável por atividades realizadas a partir de sua conta."
                  : is("fr")
                  ? "Vous êtes responsable de toute activité depuis votre compte."
                  : "You’re responsible for activities under your account."}
              </li>
            </ul>

            <h2>{H.s4}</h2>
            <p>
              {is("es") &&
                "Conservas todos los derechos sobre tu contenido. Al subirlo, concedes a ZProject una licencia mundial, no exclusiva, gratuita y revocable para alojar, reproducir, adaptar y mostrar tu contenido dentro del Servicio, con el único fin de operar, promocionar y mejorar ZProject. Puedes eliminar tu contenido en cualquier momento; al hacerlo, cesa la licencia (salvo copias de respaldo razonables y usos ya iniciados)."}
              {is("en") &&
                "You retain all rights to your content. By uploading, you grant ZProject a worldwide, non-exclusive, royalty-free, revocable license to host, reproduce, adapt and display it within the Service solely to operate, promote and improve ZProject. You may delete content at any time; upon deletion the license ends (except reasonable backups and already-initiated uses)."}
              {is("pt") &&
                "Você mantém todos os direitos sobre seu conteúdo. Ao enviar, concede ao ZProject uma licença mundial, não exclusiva, gratuita e revogável para hospedar, reproduzir, adaptar e exibir seu conteúdo no Serviço apenas para operar, promover e melhorar o ZProject. Você pode remover seu conteúdo a qualquer momento; ao fazê-lo, a licença cessa (salvo backups razoáveis e usos já iniciados)."}
              {is("fr") &&
                "Vous conservez tous les droits sur votre contenu. En le téléversant, vous accordez à ZProject une licence mondiale, non exclusive, gratuite et révocable pour héberger, reproduire, adapter et afficher votre contenu dans le Service aux seules fins d’exploitation, de promotion et d’amélioration de ZProject. Vous pouvez supprimer votre contenu à tout moment ; la licence cesse alors (sauf sauvegardes raisonnables et usages déjà engagés)."}
            </p>

            <h2>{H.s5}</h2>
            <ul>
              <li>
                {is("es")
                  ? "No publiques contenido ilegal, que infrinja derechos o que promueva odio/violencia."
                  : is("pt")
                  ? "Não publique conteúdo ilegal, que infrinja direitos ou promova ódio/violência."
                  : is("fr")
                  ? "Ne publiez pas de contenu illégal, contrefaisant ou promouvant la haine/la violence."
                  : "Don’t post illegal, infringing, or hate/violence-promoting content."}
              </li>
              <li>
                {is("es")
                  ? "No intentes vulnerar la seguridad ni interrumpir el Servicio."
                  : is("pt")
                  ? "Não tente violar a segurança nem interromper o Serviço."
                  : is("fr")
                  ? "N’essayez pas de compromettre la sécurité ni d’interrompre le Service."
                  : "Don’t attempt to compromise security or disrupt the Service."}
              </li>
              <li>
                {is("es")
                  ? "No hagas scraping masivo o uso automatizado abusivo."
                  : is("pt")
                  ? "Não faça scraping massivo ou uso automatizado abusivo."
                  : is("fr")
                  ? "Pas de scraping massif ni d’usage automatisé abusif."
                  : "No massive scraping or abusive automated use."}
              </li>
              <li>
                {is("es")
                  ? "No suplantes identidad ni manipules métricas."
                  : is("pt")
                  ? "Não pratique falsidade ideológica nem manipule métricas."
                  : is("fr")
                  ? "Pas d’usurpation d’identité ni de manipulation des métriques."
                  : "No impersonation or metric manipulation."}
              </li>
              <li>
                {is("es")
                  ? "La comunidad puede reportar abusos (incluido uso indebido de IA); ZProject podrá actuar, desmonetizar o retirar contenido y sancionar cuentas."
                  : is("pt")
                  ? "A comunidade pode reportar abusos (incluindo uso indevido de IA); o ZProject poderá agir, desmonetizar ou remover conteúdo e sancionar contas."
                  : is("fr")
                  ? "La communauté peut signaler les abus (y compris l’usage abusif d’IA) ; ZProject peut agir, démonétiser ou retirer des contenus et sanctionner des comptes."
                  : "The community may report abuses (including improper AI use); ZProject may act, demonetize or remove content and sanction accounts."}
              </li>
            </ul>

            <h3>{H.s51}</h3>
            {is("es") && (
              <>
                <p>
                  Está <strong>prohibido monetizar</strong> (vender, cobrar acceso, suscripciones, propinas o anuncios) contenido
                  que: (a) sea sexualmente explícito/pornográfico o implique explotación de menores; (b) fomente o celebre{" "}
                  <em>violencia ilegal</em> o <em>discurso de odio</em>; (c) infrinja derechos de autor o marcas; (d) promueva
                  actividades ilegales graves (p. ej., drogas ilegales, armas prohibidas); (e) incite autolesiones o daño a
                  terceros.
                </p>
                <p>
                  <strong>Excepción artística:</strong> se permiten representaciones <em>artísticas o de ficción</em> de temas
                  sensibles (p. ej., violencia, armas, drogas) con propósito artístico/educativo, no sexualmente explícitas ni
                  destinadas a la excitación, y que cumplan la ley y nuestras políticas. Podemos exigir etiquetado/edad y{" "}
                  <em>desmonetizar</em> o retirar caso por caso.
                </p>
                <p>
                  Además, ciertas actividades pueden estar restringidas por las políticas de <strong>Stripe</strong>. ZProject
                  puede deshabilitar pagos o retiros que violen dichas reglas o la ley.
                </p>
              </>
            )}
            {is("en") && (
              <>
                <p>
                  It is <strong>prohibited to monetize</strong> (sell, charge access, subscriptions, tips, or ads) content that:
                  (a) is sexually explicit/pornographic or involves child exploitation; (b) promotes or celebrates{" "}
                  <em>illegal violence</em> or <em>hate speech</em>; (c) infringes copyrights or trademarks; (d) promotes
                  serious illegal activities (e.g., illegal drugs, prohibited weapons); (e) incites self-harm or harm to others.
                </p>
                <p>
                  <strong>Artistic exception:</strong> <em>artistic/fictional</em> depictions of sensitive topics (e.g.,
                  violence, weapons, drugs) are allowed if they serve an artistic/educational purpose, are not sexually
                  explicit or intended to arouse, and comply with law and our policies. We may require labels/age gates and may{" "}
                  <em>demonetize</em> or remove content case-by-case.
                </p>
                <p>
                  Additionally, some activities may be restricted under <strong>Stripe</strong> policies. ZProject may disable
                  payments or payouts that violate those rules or the law.
                </p>
              </>
            )}
            {is("pt") && (
              <>
                <p>
                  É <strong>proibido monetizar</strong> (vender, cobrar acesso, assinaturas, gorjetas ou anúncios) conteúdo que:
                  (a) seja sexualmente explícito/pornográfico ou envolva exploração infantil; (b) promova ou celebre{" "}
                  <em>violência ilegal</em> ou <em>discurso de ódio</em>; (c) viole direitos autorais ou marcas; (d) promova
                  atividades ilegais graves (ex.: drogas ilícitas, armas proibidas); (e) incite autoagressão ou dano a terceiros.
                </p>
                <p>
                  <strong>Exceção artística:</strong> representações <em>artísticas/ficcionais</em> de temas sensíveis (ex.:
                  violência, armas, drogas) são permitidas se tiverem propósito artístico/educativo, não forem sexualmente
                  explícitas nem voltadas à excitação, e cumprirem a lei e nossas políticas. Podemos exigir rotulagem/idade e{" "}
                  <em>desmonetizar</em> ou remover conteúdo caso a caso.
                </p>
                <p>
                  Adicionalmente, certas atividades podem ser restritas pelas políticas da <strong>Stripe</strong>. O ZProject
                  pode desativar pagamentos ou repasses que violem essas regras ou a lei.
                </p>
              </>
            )}
            {is("fr") && (
              <>
                <p>
                  Il est <strong>interdit de monétiser</strong> (vendre, faire payer l’accès, abonnements, pourboires ou
                  publicités) les contenus qui : (a) sont sexuellement explicites/pornographiques ou impliquent l’exploitation
                  d’enfants ; (b) promeuvent ou célèbrent la <em>violence illégale</em> ou le <em>discours de haine</em> ; (c)
                  portent atteinte aux droits d’auteur ou aux marques ; (d) promeuvent des activités illégales graves (p. ex.
                  drogues illicites, armes interdites) ; (e) incitent à l’automutilation ou à nuire à autrui.
                </p>
                <p>
                  <strong>Exception artistique :</strong> les représentations <em>artistiques/fictionnelles</em> de sujets
                  sensibles (p. ex. violence, armes, drogues) sont autorisées si elles ont une finalité artistique/pédagogique,
                  ne sont pas sexuellement explicites ni destinées à l’excitation, et respectent la loi ainsi que nos politiques.
                  Nous pouvons exiger un étiquetage/contrôle d’âge et <em>démonétiser</em> ou retirer du contenu au cas par cas.
                </p>
                <p>
                  En outre, certaines activités peuvent être restreintes par les politiques de <strong>Stripe</strong>. ZProject
                  peut désactiver les paiements ou versements contraires à ces règles ou à la loi.
                </p>
              </>
            )}

            {/* NUEVA SECCIÓN: IPs/marcas y obras de terceros */}
            <h3>{H.s52}</h3>
            {is("es") && (
              <>
                <p>
                  ZProject <strong>fomenta el contenido original y humano</strong>. Para evitar conflictos legales, está
                  <strong> prohibido</strong> publicar o monetizar obras que utilicen <strong>IPs/marcas de terceros</strong> (por
                  ejemplo, música con copyright, imágenes, videos, personajes, logos, videojuegos, assets, fuentes, etc.)
                  <strong> sin contar con los derechos o licencias correspondientes</strong>.
                </p>
                <ul>
                  <li>
                    Solo se permite subir/monetizar obras de terceros si el usuario <strong>posee una licencia válida</strong>, una{" "}
                    <strong>cesión/autorización escrita</strong> o si la obra está <strong>en dominio público</strong> o bajo{" "}
                    <strong>licencia compatible</strong> con el uso que se realizará (comercial/no comercial, modificaciones,
                    atribuciones).
                  </li>
                  <li>
                    El material “fan-made” de IPs reconocibles <strong>no está permitido</strong> salvo que el usuario demuestre
                    <strong> permiso expreso</strong> del titular de la IP para publicar/monetizar en ZProject.
                  </li>
                  <li>
                    A petición, ZProject puede requerir <strong>pruebas de titularidad/licencia</strong> y retirar contenido o
                    desmonetizarlo ante dudas razonables.
                  </li>
                </ul>
              </>
            )}
            {is("en") && (
              <>
                <p>
                  ZProject <strong>promotes original, human-made content</strong>. To avoid legal conflicts, it is{" "}
                  <strong>forbidden</strong> to publish or monetize works that use <strong>third-party IP/brands</strong> (e.g.,
                  copyrighted music, images, videos, characters, logos, videogames, assets, fonts, etc.){" "}
                  <strong>without the proper rights or licenses</strong>.
                </p>
                <ul>
                  <li>
                    You may only upload/monetize third-party works if you hold a <strong>valid license</strong>, a{" "}
                    <strong>written assignment/authorization</strong>, or if the work is <strong>public domain</strong> or under a{" "}
                    <strong>compatible license</strong> for the intended use (commercial/non-commercial, derivatives, attribution).
                  </li>
                  <li>
                    “Fan-made” content of recognizable IPs is <strong>not allowed</strong> unless the user demonstrates{" "}
                    <strong>explicit permission</strong> from the IP holder to publish/monetize on ZProject.
                  </li>
                  <li>
                    Upon request, ZProject may require <strong>proof of ownership/licensing</strong> and remove or demonetize
                    content where there are reasonable doubts.
                  </li>
                </ul>
              </>
            )}
            {is("pt") && (
              <>
                <p>
                  O ZProject <strong>incentiva conteúdo original e humano</strong>. Para evitar conflitos legais, é{" "}
                  <strong>proibido</strong> publicar ou monetizar obras que utilizem <strong>IPs/marcas de terceiros</strong> (ex.:
                  músicas com copyright, imagens, vídeos, personagens, logos, videogames, assets, fontes etc.){" "}
                  <strong>sem os direitos ou licenças apropriados</strong>.
                </p>
                <ul>
                  <li>
                    Só é permitido enviar/monetizar obras de terceiros se o usuário possuir <strong>licença válida</strong>,{" "}
                    <strong>cessão/autorização por escrito</strong> ou se a obra estiver <strong>em domínio público</strong> ou sob{" "}
                    <strong>licença compatível</strong> com o uso pretendido (comercial/não comercial, derivações, atribuições).
                  </li>
                  <li>
                    Conteúdo “fan-made” de IPs reconhecíveis <strong>não é permitido</strong>, salvo se o usuário comprovar{" "}
                    <strong>permissão expressa</strong> do titular da IP para publicar/monetizar no ZProject.
                  </li>
                  <li>
                    Quando solicitado, o ZProject pode exigir <strong>provas de titularidade/licença</strong> e remover ou
                    desmonetizar conteúdo em caso de dúvidas razoáveis.
                  </li>
                </ul>
              </>
            )}
            {is("fr") && (
              <>
                <p>
                  ZProject <strong>encourage le contenu original et humain</strong>. Pour éviter les litiges, il est{" "}
                  <strong>interdit</strong> de publier ou monétiser des œuvres utilisant des <strong>PI/marques tierces</strong>{" "}
                  (p. ex. musique protégée, images, vidéos, personnages, logos, jeux vidéo, assets, polices, etc.){" "}
                  <strong>sans droits ou licences adéquats</strong>.
                </p>
                <ul>
                  <li>
                    Vous ne pouvez téléverser/monétiser des œuvres tierces que si vous détenez une <strong>licence valide</strong>,{" "}
                    une <strong>cession/autorisation écrite</strong> ou si l’œuvre est <strong>dans le domaine public</strong> ou
                    sous une <strong>licence compatible</strong> avec l’usage prévu (commercial/non commercial, dérivés,
                    attribution).
                  </li>
                  <li>
                    Le contenu “fan-made” d’IPs reconnaissables est <strong>interdit</strong> sauf si l’utilisateur démontre une{" "}
                    <strong>permission explicite</strong> du détenteur de la PI pour publier/monétiser sur ZProject.
                  </li>
                  <li>
                    Sur demande, ZProject peut exiger des <strong>preuves de titularité/de licence</strong> et retirer ou
                    démonétiser le contenu en cas de doute raisonnable.
                  </li>
                </ul>
              </>
            )}

            <h2>{H.s6}</h2>
            <p>
              {is("es") &&
                "ZProject, su código, marca, logotipos, diseño e infraestructura son propiedad de su titular. No adquieres ningún derecho salvo lo permitido por estos Términos."}
              {is("en") &&
                "ZProject’s code, brand, logos, design, and infrastructure are owned by its holder. You gain no rights except as allowed by these Terms."}
              {is("pt") &&
                "O código, a marca, os logotipos, o design e a infraestrutura do ZProject pertencem ao seu titular. Você não adquire direitos além do permitido nestes Termos."}
              {is("fr") &&
                "Le code, la marque, les logos, le design et l’infrastructure de ZProject appartiennent à leur titulaire. Aucun droit n’est acquis au-delà de ce que prévoient ces Conditions."}
            </p>

            <h2>{H.s7}</h2>
            {/* Política de IA reforzada */}
            {is("es") && (
              <>
                <p>
                  ZProject es un <strong>santuario para creadores humanos</strong>. Como regla general, <strong>al menos el 90%</strong> de cada obra publicada debe ser creación auténtica humana.
                </p>
                <ul>
                  <li>
                    <strong>Prohibido publicar o vender</strong> contenido <strong>100% generado por IA</strong> en ZProject.
                    De detectarse, el contenido será eliminado; el responsable podrá ser <strong>baneado</strong>. La
                    reincidencia implicará <strong>restricciones o suspensión</strong> de la cuenta.
                  </li>
                  <li>
                    El uso parcial de IA como <em>herramienta</em> (por ejemplo, colorización, upscaling, retoques) puede
                    permitirse si <strong>se acredita de forma clara</strong> y no pretende engañar sobre la autoría humana.
                    ZProject puede solicitar pruebas del proceso.
                  </li>
                  <li>
                    <strong>Deepfakes</strong>, suplantación de identidad o atribución engañosa están prohibidos.
                  </li>
                  <li>
                    La comunidad puede reportar usos indebidos; ZProject responderá y tomará medidas cuando corresponda.
                  </li>
                </ul>
                <p>
                  Dejamos en claro que <strong>no usamos ninguna obra de usuarios para entrenar IA</strong> y <strong>no vendemos datos personales</strong>.
                </p>
              </>
            )}
            {is("en") && (
              <>
                <p>
                  ZProject is a <strong>sanctuary for human creators</strong>. As a rule, <strong>at least 90%</strong> of each
                  published work must be authentic human creation.
                </p>
                <ul>
                  <li>
                    <strong>Publishing or selling</strong> content that is <strong>100% AI-generated</strong> on ZProject is
                    <strong> prohibited</strong>. Detected content will be removed; offenders may be <strong>banned</strong>.
                    Repeated violations may lead to <strong>restrictions or suspension</strong>.
                  </li>
                  <li>
                    Partial AI use as a <em>tool</em> (e.g., colorization, upscaling, touch-ups) may be allowed if it is{" "}
                    <strong>clearly disclosed</strong> and does not mislead about human authorship. ZProject may request process
                    proof.
                  </li>
                  <li>
                    <strong>Deepfakes</strong>, impersonation, or deceptive attribution are forbidden.
                  </li>
                  <li>The community may report misuse; ZProject will respond and act where appropriate.</li>
                </ul>
                <p>
                  We make it clear that we <strong>do not use user works to train AI</strong> and we <strong>do not sell personal data</strong>.
                </p>
              </>
            )}
            {is("pt") && (
              <>
                <p>
                  O ZProject é um <strong>santuário para criadores humanos</strong>. Como regra, <strong>pelo menos 90%</strong>{" "}
                  de cada obra publicada deve ser criação humana autêntica.
                </p>
                <ul>
                  <li>
                    É <strong>proibido publicar ou vender</strong> conteúdo <strong>100% gerado por IA</strong> no ZProject.
                    Conteúdo detectado será removido; o responsável poderá ser <strong>banido</strong>. Reincidência pode levar a{" "}
                    <strong>restrições ou suspensão</strong>.
                  </li>
                  <li>
                    Uso parcial de IA como <em>ferramenta</em> (p.ex., colorização, upscaling, retoques) pode ser permitido se{" "}
                    <strong>declarado claramente</strong> e sem enganar quanto à autoria humana. O ZProject pode solicitar
                    provas do processo.
                  </li>
                  <li>
                    <strong>Deepfakes</strong>, personificação ou atribuição enganosa são proibidos.
                  </li>
                  <li>A comunidade pode reportar usos indevidos; o ZProject responderá e tomará medidas quando cabível.</li>
                </ul>
                <p>
                  Esclarecemos que <strong>não usamos obras de usuários para treinar IA</strong> e <strong>não vendemos dados pessoais</strong>.
                </p>
              </>
            )}
            {is("fr") && (
              <>
                <p>
                  ZProject est un <strong>sanctuaire pour les créateurs humains</strong>. En règle générale,{" "}
                  <strong>au moins 90 %</strong> de chaque œuvre publiée doit être une création humaine authentique.
                </p>
                <ul>
                  <li>
                    Il est <strong>interdit de publier ou de vendre</strong> des contenus <strong>100 % générés par IA</strong>{" "}
                    sur ZProject. Les contenus détectés seront supprimés ; les responsables peuvent être <strong>bannis</strong>.
                    La récidive peut entraîner des <strong>restrictions ou une suspension</strong>.
                  </li>
                  <li>
                    L’usage partiel de l’IA comme <em>outil</em> (p. ex. colorisation, upscaling, retouches) peut être autorisé
                    s’il est <strong>clairement divulgué</strong> et ne trompe pas sur l’auteur humain. ZProject peut demander
                    des preuves de processus.
                  </li>
                  <li>
                    Les <strong>deepfakes</strong>, l’usurpation d’identité ou l’attribution trompeuse sont interdits.
                  </li>
                  <li>La communauté peut signaler les abus ; ZProject répondra et agira le cas échéant.</li>
                </ul>
                <p>
                  Nous précisons que nous <strong>n’utilisons pas les œuvres des utilisateurs pour entraîner l’IA</strong> et{" "}
                  <strong>ne vendons pas de données personnelles</strong>.
                </p>
              </>
            )}

            <h2>{H.s8}</h2>
            <p>
              {is("es") &&
                "ZProject puede ofrecer opciones de apoyo/donación y, en el futuro, funciones de pago. Las donaciones no son reembolsables salvo que la ley exija lo contrario."}
              {is("en") &&
                "ZProject may offer support/donation options and, in future, paid features. Donations are non-refundable unless required by law."}
              {is("pt") &&
                "O ZProject pode oferecer opções de apoio/doação e, no futuro, recursos pagos. Doações não são reembolsáveis, salvo exigência legal."}
              {is("fr") &&
                "ZProject peut proposer des options de soutien/don et, à l’avenir, des fonctionnalités payantes. Les dons ne sont pas remboursables sauf exigence légale."}
            </p>

            <h3>{H.s81}</h3>
            <p>
              {is("es") &&
                "Usamos Stripe para procesar pagos y, cuando corresponda, verificaciones de identidad (KYC) y medidas antifraude. Stripe actúa como nuestro encargado de tratamiento. No almacenamos números completos de tarjeta ni CVV."}
              {is("en") &&
                "We use Stripe to process payments and, where applicable, identity verification (KYC) and fraud prevention. Stripe acts as our processor. We do not store full card numbers or CVV."}
              {is("pt") &&
                "Usamos a Stripe para processar pagamentos e, quando aplicável, verificação de identidade (KYC) e prevenção a fraudes. A Stripe atua como nossa operadora. Não armazenamos números completos de cartão nem CVV."}
              {is("fr") &&
                "Nous utilisons Stripe pour traiter les paiements et, le cas échéant, la vérification d’identité (KYC) et la prévention de fraude. Stripe agit comme notre sous-traitant. Nous ne stockons ni numéros complets de carte ni CVV."}
            </p>
            <p>
              {is("es") && (
                <>
                  Al usar pagos en ZProject, aceptas el procesamiento por Stripe y sus términos para cuentas conectadas. Consulta
                  la{" "}
                  <a
                    className="footer-link"
                    href="https://stripe.com/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Política de Privacidad
                  </a>{" "}
                  y el{" "}
                  <a className="footer-link" href="https://stripe.com/legal" target="_blank" rel="noopener noreferrer">
                    Acuerdo de Servicios
                  </a>
                  .
                </>
              )}
              {is("en") && (
                <>
                  By using ZProject payments you acknowledge processing by Stripe and agree to Stripe’s connected-account terms.
                  See{" "}
                  <a
                    className="footer-link"
                    href="https://stripe.com/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Privacy Policy
                  </a>{" "}
                  and{" "}
                  <a className="footer-link" href="https://stripe.com/legal" target="_blank" rel="noopener noreferrer">
                    Services Agreement
                  </a>
                  .
                </>
              )}
              {is("pt") && (
                <>
                  Ao usar pagamentos no ZProject você reconhece o processamento pela Stripe e concorda com os termos de contas
                  conectadas. Veja a{" "}
                  <a
                    className="footer-link"
                    href="https://stripe.com/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Política de Privacidade
                  </a>{" "}
                  e o{" "}
                  <a className="footer-link" href="https://stripe.com/legal" target="_blank" rel="noopener noreferrer">
                    Contrato de Serviços
                  </a>
                  .
                </>
              )}
              {is("fr") && (
                <>
                  En utilisant les paiements ZProject, vous reconnaissez le traitement par Stripe et acceptez ses conditions
                  pour comptes connectés. Voir la{" "}
                  <a
                    className="footer-link"
                    href="https://stripe.com/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Politique de confidentialité
                  </a>{" "}
                  et le{" "}
                  <a className="footer-link" href="https://stripe.com/legal" target="_blank" rel="noopener noreferrer">
                    Contrat de services
                  </a>
                  .
                </>
              )}
            </p>

            <h3>{H.s82}</h3>
            {is("es") && (
              <p>
                Podemos ofrecer <strong>métricas internas y estadísticas anonimizadas</strong> (por ejemplo, rendimiento por
                tags, visualizaciones, interacción, ventanas horarias) a los artistas dentro de ZProject, incluidas funciones
                premium. Estas métricas no incluyen nombres, IDs directos ni datos que identifiquen a otros usuarios y{" "}
                <strong>no se comparten con empresas externas</strong>. Proveer estas estadísticas dentro del Servicio{" "}
                <strong>no constituye venta a terceros</strong>.
              </p>
            )}
            {is("en") && (
              <p>
                We may provide <strong>internal anonymized metrics</strong> (e.g., performance by tags, views, engagement,
                time-windows) to artists within ZProject, including premium features. These stats exclude names, direct IDs, or
                data that identify other users and <strong>are not shared with external companies</strong>. Providing such
                in-service stats <strong>does not constitute a sale to third parties</strong>.
              </p>
            )}
            {is("pt") && (
              <p>
                Podemos fornecer <strong>métricas internas anonimizadas</strong> (ex.: desempenho por tags, visualizações,
                engajamento, janelas de tempo) aos artistas dentro do ZProject, inclusive recursos premium. Essas estatísticas
                não incluem nomes, IDs diretos nem dados que identifiquem outros usuários e <strong>não são compartilhadas com
                empresas externas</strong>. Fornecer tais estatísticas no Serviço <strong>não configura venda a terceiros</strong>.
              </p>
            )}
            {is("fr") && (
              <p>
                Nous pouvons proposer des <strong>métriques internes anonymisées</strong> (p. ex. performance par tags, vues,
                engagement, créneaux horaires) aux artistes au sein de ZProject, y compris des fonctions premium. Ces
                statistiques excluent noms, identifiants directs ou données identifiant d’autres utilisateurs et{" "}
                <strong>ne sont pas partagées avec des sociétés externes</strong>. Les fournir dans le Service{" "}
                <strong>ne constitue pas une vente à des tiers</strong>.
              </p>
            )}

            <h2>{H.s9}</h2>
            <p>
              {is("es") &&
                "ZProject está en desarrollo activo. El Servicio puede cambiar, mejorar o interrumpirse sin previo aviso. Podemos actualizar estos Términos; tu uso continuo implica aceptación."}
              {is("en") &&
                "ZProject is under active development. The Service may change, improve, or be discontinued without notice. We may update these Terms; continued use implies acceptance."}
              {is("pt") &&
                "O ZProject está em desenvolvimento ativo. O Serviço pode mudar, melhorar ou ser descontinuado sem aviso. Podemos atualizar estes Termos; o uso contínuo implica aceitação."}
              {is("fr") &&
                "ZProject est en développement actif. Le Service peut évoluer ou cesser sans préavis. Nous pouvons mettre à jour ces Conditions ; l’usage continu vaut acceptation."}
            </p>

            <h2>{H.s10}</h2>
            <p>
              {is("es") &&
                "El tratamiento de datos se rige por la Política de Privacidad. Por favor revísala para conocer qué datos recopilamos, cómo los usamos y tus derechos."}
              {is("en") &&
                "Data processing is governed by the Privacy Policy. Please review it to understand what we collect, how we use it, and your rights."}
              {is("pt") &&
                "O tratamento de dados é regido pela Política de Privacidade. Reveja-a para saber o que coletamos, como usamos e seus direitos."}
              {is("fr") &&
                "Le traitement des données est régi par la Politique de confidentialité. Veuillez la consulter pour savoir ce que nous collectons, comment nous l’utilisons et vos droits."}
            </p>

            <h2>{H.s11}</h2>
            <p>
              {is("es") &&
                "ZProject puede incluir enlaces o integraciones de terceros. No nos responsabilizamos por sus contenidos, políticas o prácticas."}
              {is("en") &&
                "ZProject may include links or integrations from third parties. We’re not responsible for their content, policies, or practices."}
              {is("pt") &&
                "O ZProject pode incluir links ou integrações de terceiros. Não nos responsabilizamos por seus conteúdos, políticas ou práticas."}
              {is("fr") &&
                "ZProject peut inclure des liens ou intégrations tiers. Nous ne sommes pas responsables de leur contenu, politiques ou pratiques."}
            </p>

            <h2>{H.s12}</h2>
            <p>
              {is("es") &&
                "Si consideras que algún contenido infringe tus derechos, escríbenos en Discord con la información necesaria (obra afectada, URL específica en ZProject y prueba de titularidad)."}
              {is("en") &&
                "If you believe content infringes your rights, contact us on Discord with details (affected work, specific ZProject URL, proof of ownership)."}
              {is("pt") &&
                "Se você entender que algum conteúdo infringe seus direitos, contate-nos no Discord com detalhes (obra afetada, URL específica no ZProject, prova de titularidade)."}
              {is("fr") &&
                "Si vous estimez qu’un contenu porte atteinte à vos droits, contactez-nous sur Discord avec les détails (œuvre concernée, URL ZProject, preuve de titularité)."}
            </p>

            <h2>{H.s13}</h2>
            <p>
              {is("es") &&
                "ZProject se ofrece “tal cual” y “según disponibilidad”. No garantizamos que sea ininterrumpido, libre de errores o seguro."}
              {is("en") &&
                "ZProject is provided “as is” and “as available”. We do not guarantee it will be uninterrupted, error-free, or secure."}
              {is("pt") &&
                "O ZProject é oferecido “no estado” e “conforme disponibilidade”. Não garantimos operação ininterrupta, sem erros ou segura."}
              {is("fr") &&
                "ZProject est fourni « en l’état » et « selon disponibilité ». Aucune garantie d’absence d’interruptions, d’erreurs ou de sécurité."}
            </p>

            <h2>{H.s14}</h2>
            <p>
              {is("es") &&
                "En la medida permitida por la ley, no seremos responsables de daños indirectos o pérdida de datos/beneficios derivados del uso ou imposibilidad de uso del Servicio."}
              {is("en") &&
                "To the extent permitted by law, we’re not liable for indirect damages or loss of data/profits arising from use or inability to use the Service."}
              {is("pt") &&
                "Na medida permitida por lei, não seremos responsáveis por danos indiretos ou perda de dados/lucros decorrentes do uso ou impossibilidade de uso do Serviço."}
              {is("fr") &&
                "Dans la limite permise par la loi, nous déclinons toute responsabilité pour les dommages indirects ou pertes de données/bénéfices liés à l’usage ou l’impossibilité d’usage du Service."}
            </p>

            <h2>{H.s15}</h2>
            <p>
              {is("es") &&
                "Puedes dejar de usar ZProject en cualquier momento. También podemos suspender o cerrar cuentas que incumplan estos Términos."}
              {is("en") &&
                "You may stop using ZProject at any time. We may suspend or terminate accounts that violate these Terms."}
              {is("pt") &&
                "Você pode parar de usar o ZProject a qualquer momento. Podemos suspender ou encerrar contas que violem estes Termos."}
              {is("fr") &&
                "Vous pouvez cesser d’utiliser ZProject à tout moment. Nous pouvons suspendre/fermer des comptes en cas de violation des présentes Conditions."}
            </p>

            <h2>{H.s16}</h2>
            <p>
              {is("es") &&
                "Estos Términos se rigen por las leyes de los Estados Unidos de América y del Estado de Florida. Cualquier disputa se somete a los tribunales del Condado de Miami-Dade, Florida, salvo que la ley imperativa de tu residencia disponga otra cosa."}
              {is("en") &&
                "These Terms are governed by the laws of the United States and the State of Florida. Disputes go to the courts of Miami-Dade County, Florida, unless mandatory law of your residence provides otherwise."}
              {is("pt") &&
                "Estes Termos são regidos pelas leis dos Estados Unidos e do Estado da Flórida. Disputas serão resolvidas nos tribunais do Condado de Miami-Dade, salvo lei imperativa da sua residência."}
              {is("fr") &&
                "Les présentes Conditions sont régies par les lois des États-Unis et de l’État de Floride. Les litiges relèvent des tribunaux du comté de Miami-Dade, sauf dispositions impératives de votre résidence."}
            </p>

            <h2>{H.s17}</h2>
            <p>
              {T.contactLead}{" "}
              <a href={T.discord} target="_blank" rel="noopener noreferrer" className="footer-link">
                Discord
              </a>
              .
            </p>
          </div>

          <div className="t-ctas">
            <Link href="/" className="btn-ghost">
              {T.back}
            </Link>
            <Link href="/privacy" className="btn-primary">
              {T.privacy}
            </Link>
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
        .t-legal h3{
          margin: 10px 0 4px 0;
          font-size: 1.02em;
          font-weight: 800;
          color: color-mix(in oklab, var(--foreground), transparent 8%);
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
