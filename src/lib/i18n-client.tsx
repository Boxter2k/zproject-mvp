"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { getT, type Lang } from "./i18n";

type CtxType = {
  lang: Lang;
  t: (key: string) => string;
  setLang: (to: Lang) => void;
};

const Ctx = createContext<CtxType | null>(null);

// Lee cookie
function readLangCookie(): Lang {
  try {
    const cookie = document.cookie.split("; ").find((s) => s.startsWith("zproject_lang="));
    const value = (cookie?.split("=")[1] || "en").toLowerCase();
    return (["es", "en", "pt", "fr"].includes(value) ? value : "en") as Lang;
  } catch {
    return "en";
  }
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => "en");

  // montar: tomar cookie inicial
  useEffect(() => {
    setLangState(readLangCookie());
  }, []);

  const t = useMemo(() => getT(lang), [lang]);

  const setLang = useCallback((to: Lang) => {
    // guarda cookie 1 año
    document.cookie = `zproject_lang=${to}; path=/; max-age=${60 * 60 * 24 * 365}`;
    // accesibilidad
    try { document.documentElement.setAttribute("lang", to); } catch {}
    // estado local
    setLangState(to);
    // evento global para otros componentes (LanguageSwitcher, layout, etc.)
    try {
      window.dispatchEvent(new CustomEvent("zproject:lang-change", { detail: { lang: to } }));
    } catch {
      window.dispatchEvent(new Event("zproject:lang-change"));
    }
  }, []);

  // si otro componente cambia el idioma, sincronizamos
  useEffect(() => {
    const onChange = () => setLangState(readLangCookie());
    window.addEventListener("zproject:lang-change", onChange);
    return () => window.removeEventListener("zproject:lang-change", onChange);
  }, []);

  const value = useMemo(() => ({ lang, t, setLang }), [lang, t, setLang]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useLang() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useLang must be used within I18nProvider");
  return ctx;
}