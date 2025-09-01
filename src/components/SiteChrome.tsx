// src/components/SiteChrome.tsx
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import LanguageSwitcher from "./LanguageSwitcher";
import { getT } from "../lib/i18n";

export default function SiteChrome({
  initialLang,
  brandLogo,
  children,
}: {
  initialLang: string;
  brandLogo: string;
  children: React.ReactNode;
}) {
  const [lang, setLang] = useState(initialLang || "en");
  const [menuOpen, setMenuOpen] = useState(false);

  // Footer "Más" (solo móvil)
  const [footerMoreOpen, setFooterMoreOpen] = useState(false);
  const moreBtnRef = useRef<HTMLButtonElement | null>(null);
  const moreMenuRef = useRef<HTMLDivElement | null>(null);

  // Recalcula traducciones cuando cambia el idioma
  const t = useMemo(() => getT(lang), [lang]);

  useEffect(() => {
    // Escucha el evento emitido por LanguageSwitcher
    function onLangChange(e: Event) {
      // @ts-expect-error — CustomEvent.detail viene del LanguageSwitcher en runtime
      const detail = (e as CustomEvent)?.detail;
      const fromEvent = detail?.lang as string | undefined;

      if (fromEvent) {
        setLang(fromEvent.toLowerCase());
        return;
      }

      // Fallback: leer cookie
      try {
        const m = document.cookie.match(/(?:^|;\s*)zproject_lang=([^;]+)/);
        if (m?.[1]) setLang(m[1].toLowerCase());
      } catch {}
    }

    window.addEventListener("zproject:lang-change", onLangChange);
    return () => window.removeEventListener("zproject:lang-change", onLangChange);
  }, []);

  // Cierra el menú móvil al navegar
  useEffect(() => {
    const close = () => setMenuOpen(false);
    window.addEventListener("hashchange", close);
    return () => window.removeEventListener("hashchange", close);
  }, []);

  // Cerrar "Más" del footer al hacer click fuera / Esc / navegación
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      const t = e.target as Node;
      if (!footerMoreOpen) return;
      if (moreBtnRef.current?.contains(t)) return;
      if (moreMenuRef.current?.contains(t)) return;
      setFooterMoreOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setFooterMoreOpen(false);
    }
    function onNav() {
      setFooterMoreOpen(false);
    }
    document.addEventListener("click", onDocClick);
    document.addEventListener("keydown", onKey);
    window.addEventListener("hashchange", onNav);
    return () => {
      document.removeEventListener("click", onDocClick);
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("hashchange", onNav);
    };
  }, [footerMoreOpen]);

  return (
    <>
      {/* Header */}
      <header className="z-header">
        <div className="container header-inner">
          <Link href="/" className="brand" aria-label="ZProject Home">
            <Image
              id="brandLogo"
              src={brandLogo}
              alt="ZProject"
              width={28}
              height={28}
              className="brand-logo"
              priority
            />
            <span className="brand-name">
              ZProject<sup className="tm">™</sup>
            </span>
          </Link>

          {/* Botón Hamburguesa (solo móvil) */}
          <button
            type="button"
            className="menu-toggle"
            aria-label="Open menu"
            aria-expanded={menuOpen}
            aria-controls="mobileMenu"
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span className={`bar ${menuOpen ? "x1" : ""}`} />
            <span className={`bar ${menuOpen ? "x2" : ""}`} />
            <span className={`bar ${menuOpen ? "x3" : ""}`} />
          </button>

          {/* NAV DESKTOP (traduce EN VIVO) */}
          <nav className="nav" style={{ gap: ".6rem" }}>
            <Link href="/" className="nav-link">{t("nav.home")}</Link>
            <Link href="/zshop" className="nav-link">
              {t("nav.zshop")}<sup className="tm">™</sup>
            </Link>
            <Link href="/ztv" className="nav-link">
              {t("nav.ztv")}<sup className="tm">™</sup>
            </Link>
            <Link href="/zplaza" className="nav-link">
              {t("nav.zplaza")}<sup className="tm">™</sup>
            </Link>
            <Link
              href="/thanks"
              className="btn-primary"
              style={{ padding: ".55rem .9rem", lineHeight: 1 }}
            >
              {t("nav.support")}
            </Link>
          </nav>
        </div>

        {/* Drawer MÓVIL */}
        <div
          id="mobileMenu"
          className={`mobile-drawer ${menuOpen ? "is-open" : ""}`}
          role="dialog"
          aria-modal="true"
        >
          <div className="mobile-drawer__inner container">
            <nav className="mobile-nav">
              <Link href="/" className="mobile-link" onClick={() => setMenuOpen(false)}>
                {t("nav.home")}
              </Link>
              <Link href="/zshop" className="mobile-link" onClick={() => setMenuOpen(false)}>
                {t("nav.zshop")}<sup className="tm">™</sup>
              </Link>
              <Link href="/ztv" className="mobile-link" onClick={() => setMenuOpen(false)}>
                {t("nav.ztv")}<sup className="tm">™</sup>
              </Link>
              <Link href="/zplaza" className="mobile-link" onClick={() => setMenuOpen(false)}>
                {t("nav.zplaza")}<sup className="tm">™</sup>
              </Link>
              <Link href="/thanks" className="btn-primary mobile-cta" onClick={() => setMenuOpen(false)}>
                {t("nav.support")}
              </Link>
              <div className="mobile-lang">
                <LanguageSwitcher label={t("lang.label")} compact />
              </div>
            </nav>
          </div>
          <button className="drawer-backdrop" aria-label="Close menu" onClick={() => setMenuOpen(false)} />
        </div>
      </header>

      {/* Main */}
      <main id="main" className="z-main">
        <div className="container">{children}</div>
      </main>

      {/* Footer */}
      <footer className="z-footer">
        <div className="container footer-inner" style={{ gap: ".75rem", alignItems: "center" }}>
          <p className="footer-copy">
            © {new Date().getFullYear()} ZProject — Un santuario para los creadores.
          </p>

          <div
            className="footer-links"
            style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: ".6rem", flexWrap: "wrap" }}
          >
            {/* SIEMPRE visible */}
            <a className="footer-link" href="/about">Acerca</a>

            {/* En desktop, Términos y Privacidad visibles como siempre */}
            <a className="footer-link footer-only-desktop" href="/terms">Términos</a>
            <a className="footer-link footer-only-desktop" href="/privacy">Privacidad</a>

            {/* En móvil, se colapsan dentro de "Más" */}
            <div className="footer-more-wrap">
              <button
                ref={moreBtnRef}
                type="button"
                className="footer-more-btn"
                aria-haspopup="menu"
                aria-expanded={footerMoreOpen}
                aria-controls="footerMoreMenu"
                onClick={() => setFooterMoreOpen(v => !v)}
                title="Más opciones"
              >
                <span className="sr-only">Más opciones</span>
                <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden>
                  <circle cx="5" cy="12" r="2" />
                  <circle cx="12" cy="12" r="2" />
                  <circle cx="19" cy="12" r="2" />
                </svg>
              </button>

              <div
                id="footerMoreMenu"
                ref={moreMenuRef}
                className={`footer-more-menu ${footerMoreOpen ? "is-open" : ""}`}
                role="menu"
              >
                <a role="menuitem" className="footer-more-item" href="/terms" onClick={() => setFooterMoreOpen(false)}>Términos</a>
                <a role="menuitem" className="footer-more-item" href="/privacy" onClick={() => setFooterMoreOpen(false)}>Privacidad</a>
              </div>
            </div>

            <div style={{ marginLeft: "8px" }}>
              <LanguageSwitcher label={t("lang.label")} compact />
            </div>

            <Link
              href="/settings"
              className="settings-chip"
              aria-label={t("settings.fab.title")}
              title={t("settings.fab.title")}
            >
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                <path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z"/>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l-.06-.06a1.65 1.65 0 0 0-1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06-.06a1.65 1.65 0 0 0-.33 1.82V9c0 .67.4 1.27 1.02 1.54.18.08.38.12.58.12H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
              </svg>
            </Link>
          </div>
        </div>
      </footer>

      {/* Estilos mínimos para brand + nav + drawer */}
      <style>{`
        .tm{ font-size:.62em; margin-left:.2em; vertical-align: super; opacity:.6; font-weight:700; letter-spacing:.02em; line-height:0; }

        .brand { display: inline-flex; align-items: center; gap: .55rem; text-decoration: none; }
        .brand-logo { width: 28px; height: 28px; border-radius: 6px; box-shadow: 0 4px 12px rgba(0,0,0,.18); object-fit: contain; background: transparent; }
        .brand-name { font-weight: 800; letter-spacing: .2px; line-height: 1; }
        .nav { display:flex; align-items:center; gap:.6rem; }
        .nav-link { padding: .55rem .7rem; border-radius: .6rem; text-decoration: none; color: color-mix(in oklab, var(--foreground), transparent 8%); transition: background .2s ease, color .2s ease, transform .15s ease; }
        .nav-link:hover { background: color-mix(in oklab, var(--foreground), transparent 92%); transform: translateY(-1px); }
        .nav-link:active { transform: translateY(0); }
        @media (max-width: 900px){ .nav-link { padding: .5rem .55rem; } }

        /* --- Hamburguesa --- */
        .menu-toggle{
          display:none; margin-left:auto; width:42px; height:42px; border-radius:10px;
          border:1px solid rgba(34,197,94,.45); background: rgba(0,0,0,.35); backdrop-filter: blur(6px);
        }
        .menu-toggle .bar{ display:block; width:20px; height:2px; margin:5px auto; background: currentColor; transition: transform .2s ease, opacity .2s ease; }
        .menu-toggle .bar.x1{ transform: translateY(7px) rotate(45deg); }
        .menu-toggle .bar.x2{ opacity:0; }
        .menu-toggle .bar.x3{ transform: translateY(-7px) rotate(-45deg); }

        /* --- Drawer móvil --- */
        .mobile-drawer{
          position: fixed; inset: 0; display:none;
        }
        .mobile-drawer.is-open{ display:block; }
        .drawer-backdrop{
          position: absolute; inset: 0; background: rgba(0,0,0,.35); backdrop-filter: blur(2px);
        }
        .mobile-drawer__inner{
          position: absolute; right: 0; top: 60px; /* bajo el header */
          width: min(92vw, 380px);
          max-width: 100vw;
        }
        .mobile-nav{
          position: relative; z-index: 2;
          display: grid; gap: 10px;
          border: 1px solid rgba(34,197,94,.28);
          background: color-mix(in oklab, var(--background), transparent 0%);
          box-shadow: 0 10px 24px rgba(0,0,0,.25);
          border-radius: 14px; padding: 12px;
        }
        .mobile-link{
          display:block; padding:.8rem .9rem; border-radius:10px; border:1px solid transparent;
          color: color-mix(in oklab, var(--foreground), transparent 8%);
        }
        .mobile-link:hover{ border-color: rgba(34,197,94,.35); background: rgba(0,0,0,.22); color: inherit; }
        .mobile-cta{ width:100%; justify-content:center; }
        .mobile-lang{ margin-top: 4px; }

        /* Breakpoints: en móvil, oculta nav desktop y muestra hamburguesa */
        @media (max-width: 900px){
          .nav{ display:none; }
          .menu-toggle{ display:inline-flex; align-items:center; justify-content:center; }
        }

        /* ----- Footer More (solo móvil) ----- */
        .footer-more-wrap{ position: relative; }
        .footer-more-btn{
          display: none; /* oculto en desktop */
          align-items: center; justify-content: center;
          width: 38px; height: 38px; border-radius: 10px;
          border: 1px solid rgba(34,197,94,.35);
          background: color-mix(in oklab, var(--background), transparent 10%);
          color: color-mix(in oklab, var(--foreground), transparent 0%);
          backdrop-filter: blur(6px);
          transition: border-color .2s ease, background .2s ease, color .2s ease, transform .08s ease;
        }
        .footer-more-btn:hover{ border-color: rgba(34,197,94,.55); transform: translateY(-1px); }
        .footer-more-btn:active{ transform: translateY(0); }

        .footer-more-menu{
          position: absolute;
          bottom: calc(100% + 8px);
          right: 0;
          display: none;
          min-width: 160px;
          max-width: calc(100vw - 24px);
          padding: 6px;
          border-radius: 12px;
          border: 1px solid rgba(34,197,94,.28);
          background: color-mix(in oklab, var(--background), transparent 0%);
          box-shadow: 0 10px 24px rgba(0,0,0,.25);
          z-index: 8;
        }
        .footer-more-menu.is-open{ display: block; }
        .footer-more-item{
          display:block; padding:.6rem .7rem; border-radius:10px; text-decoration:none;
          color: inherit; border: 1px solid transparent;
        }
        .footer-more-item:hover{ background: rgba(0,0,0,.18); border-color: rgba(34,197,94,.35); }

        .footer-only-desktop{ display: inline-flex; }
        @media (max-width:900px){
          .footer-only-desktop{ display:none; }              /* oculta Términos/Privacidad directos */
          .footer-more-btn{ display:inline-flex; }           /* muestra botón Más */
          .footer-inner{ flex-wrap: wrap; }
          .footer-links{ gap: .5rem !important; }
        }

        /* A11y helper */
        .sr-only{ position:absolute; width:1px; height:1px; padding:0; margin:-1px; overflow:hidden; clip:rect(0,0,0,0); border:0; }
      `}</style>
    </>
  );
}
