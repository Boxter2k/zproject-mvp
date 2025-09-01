// src/components/LanguageSwitcher.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation"; // ⬅️ para refrescar la ruta

type LangOpt = { code: string; label: string; flag: string };

const LANGS: LangOpt[] = [
  { code: "es", label: "Español",   flag: "/flags/es.svg" },
  { code: "en", label: "English",   flag: "/flags/us.svg" },
  { code: "pt", label: "Português", flag: "/flags/br.svg" },
  { code: "fr", label: "Français",  flag: "/flags/fr.svg" },
];

export default function LanguageSwitcher({
  label = "Idioma",
  compact = true,
}: { label?: string; compact?: boolean }) {
  const router = useRouter();                       // ✅
  const [lang, setLang] = useState("en");
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  // guiño
  const [showCuba, setShowCuba] = useState(false);
  const [winkPulse, setWinkPulse] = useState(false);
  const cubaTimer = useRef<number | null>(null);

  useEffect(() => {
    setMounted(true);
    const cookie = document.cookie.split("; ").find((x) => x.startsWith("zproject_lang="));
    const current = cookie?.split("=")[1] || "en";
    setLang(current);
  }, []);

  // cerrar al click fuera
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!wrapRef.current) return;
      if (!wrapRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  // guiño al abrir (solo español)
  useEffect(() => {
    if (!open || lang !== "es") return;
    setShowCuba(true);
    setWinkPulse(true);
    if (cubaTimer.current) window.clearTimeout(cubaTimer.current);
    cubaTimer.current = window.setTimeout(() => {
      setShowCuba(false);
      setWinkPulse(false);
    }, 900);
    return () => { if (cubaTimer.current) window.clearTimeout(cubaTimer.current); };
  }, [open, lang]);

  function change(to: string) {
    // guarda cookie 1 año
    document.cookie = `zproject_lang=${to}; path=/; max-age=${60 * 60 * 24 * 365}`;
    setLang(to);
    setOpen(false);

    // actualiza <html lang="..">
    try { document.documentElement.setAttribute("lang", to); } catch {}

    // notifica a toda la app (por si escuchan este evento)
    try {
      window.dispatchEvent(new CustomEvent("zproject:lang-change", { detail: { lang: to } }));
    } catch {
      window.dispatchEvent(new Event("zproject:lang-change"));
    }

    // 🔄 fuerza revalidación/SSR con la cookie nueva (instantáneo)
    // pequeño timeout evita competir con la escritura de la cookie
    setTimeout(() => {
      try { router.refresh(); } catch {}
    }, 30);
  }

  if (!mounted) return null;
  const current = LANGS.find(l => l.code === lang) ?? LANGS[1];

  if (compact) {
    return (
      <div ref={wrapRef} className="lang-wrap">
        <button
          onClick={() => setOpen(v => !v)}
          className={`lang-btn ${winkPulse ? "with-halo" : ""}`}
          aria-haspopup="listbox"
          aria-expanded={open}
          title={label}
        >
          <span className="flag-slot">
            <img src={current.flag} alt="" width={18} height={12} className="flag-base" />
            {showCuba && lang === "es" && (
              <img src="/flags/cuba.svg" alt="" width={18} height={12} className="flag-wink" />
            )}
          </span>
          <span className="lang-label">{current.label}</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </button>

        {open && (
          <div className="lang-menu" role="listbox" aria-label={label}>
            {LANGS.map((l) => (
              <button
                key={l.code}
                onClick={() => change(l.code)}
                className={`lang-item ${lang === l.code ? "is-active" : ""}`}
                role="option"
                aria-selected={lang === l.code}
              >
                <img src={l.flag} alt="" width={18} height={12} className="flag-item" />
                <span className="lang-item-label">{l.label}</span>
              </button>
            ))}
          </div>
        )}

        <style jsx>{`
          .lang-wrap { position: relative; display: inline-block; z-index: 4; }
          .lang-btn {
            display: inline-flex; align-items: center; gap: 8px;
            border-radius: 12px; border: 1px solid rgba(34,197,94,.35);
            padding: 6px 10px;
            background: rgba(0,0,0,.35); backdrop-filter: blur(6px);
            color: var(--foreground);
            box-shadow: 0 6px 16px rgba(0,0,0,.25);
            transition: box-shadow .3s ease;
          }
          .lang-btn.with-halo { animation: haloPulse .9s ease-out; }
          @keyframes haloPulse {
            0% { box-shadow: 0 0 0 rgba(34,197,94,0); }
            25% { box-shadow: 0 0 12px rgba(34,197,94,.55); }
            60% { box-shadow: 0 0 6px rgba(34,197,94,.35); }
            100% { box-shadow: 0 0 0 rgba(34,197,94,0); }
          }
          .flag-slot { position: relative; width:18px; height:12px; border-radius:2px; overflow:hidden; }
          .flag-base { width:18px; height:12px; display:block; border-radius:2px; }
          .flag-wink { position:absolute; inset:0; border-radius:2px; animation: winkFlag .9s ease-out forwards; }
          @keyframes winkFlag {
            0% { opacity:0; transform:scale(.92); }
            20%{ opacity:1; transform:scale(1.05); }
            60%{ opacity:.9; transform:scale(1.00); }
            100%{ opacity:0; transform:scale(1.00); }
          }
          .lang-menu {
            position:absolute; bottom:calc(100% + 8px); right:0;
            min-width:160px; border-radius:12px;
            border:1px solid rgba(34,197,94,.28);
            background: var(--background);
            backdrop-filter: blur(8px);
            box-shadow:0 10px 24px rgba(0,0,0,.28);
            padding:6px; z-index:5;
          }
          .lang-item {
            display:flex; align-items:center; gap:8px;
            padding:8px 10px; border-radius:10px; width:100%;
            background:transparent; color: var(--foreground);
          }
          .lang-item:hover { background:rgba(34,197,94,.10); }
          .lang-item.is-active { background:rgba(34,197,94,.12); }
        `}</style>
      </div>
    );
  }

  return null;
}