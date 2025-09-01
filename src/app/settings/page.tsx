 // src/app/settings/page.tsx
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import LanguageSwitcher from "../../components/LanguageSwitcher";
import { applyTheme, readStoredTheme, ThemeChoice } from "../../lib/theme";
import { getT } from "../../lib/i18n";

/* =========================
   Tipos y defaults BGFX
   ========================= */
type BgfxMode = "lava" | "stars" | "nebula" | "off";
type PerfPreset = "auto" | "low" | "mid" | "high";

type BgfxPrefs = {
  mode: BgfxMode;

  // Lava
  lavaBlur: number;

  // Stars (básico)
  starsPreset: PerfPreset;
  starsDensity: number;
  starsLinkAlpha: number;
  starsTwinkle: boolean;
  starsColorful: boolean;
  starsWorldShape: boolean;

  // Stars avanzado
  starsTwinkleSpeed: number;
  starsTwinkleAmp: number;

  // Nebula
  nebulaSpeed: number;
  nebulaAlpha: number;
  nebulaBlur: number;
  nebulaPalette: "green" | "purple" | "sunset";
};

const DEFAULT_BGFX: BgfxPrefs = {
  mode: "lava",
  lavaBlur: 0,

  starsPreset: "auto",
  starsDensity: 0.9,
  starsLinkAlpha: 0.25,
  starsTwinkle: true,
  starsColorful: false,
  starsWorldShape: false,

  starsTwinkleSpeed: 0.9,
  starsTwinkleAmp: 0.9,

  nebulaSpeed: 0.05,
  nebulaAlpha: 0.22,
  nebulaBlur: 24,
  nebulaPalette: "green",
};

/* =========================
   Utilidades
   ========================= */
function readLangCookie(): string {
  if (typeof document === "undefined") return "en";
  const m = document.cookie.match(/(?:^|;\s*)zproject_lang=([^;]+)/);
  return (m?.[1] || "en").toLowerCase();
}

function writeBgfx(p: BgfxPrefs) {
  localStorage.setItem("zproject_bgfx_v5", JSON.stringify(p));
  document.cookie = `zproject_bgfx=${p.mode}; path=/; max-age=31536000`;
}

function readBgfx(): BgfxPrefs {
  try {
    const raw = localStorage.getItem("zproject_bgfx_v5");
    if (!raw) return DEFAULT_BGFX;
    const p = JSON.parse(raw);
    const mode = (p.mode === "aurora" ? "lava" : (p.mode ?? "lava")) as BgfxMode;
    return {
      mode,
      lavaBlur: Number(p.lavaBlur ?? 0),
      starsPreset: (p.starsPreset ?? "auto") as PerfPreset,
      starsDensity: Number(p.starsDensity ?? 0.9),
      starsLinkAlpha: Number(p.starsLinkAlpha ?? 0.25),
      starsTwinkle: Boolean(p.starsTwinkle ?? true),
      starsColorful: Boolean(p.starsColorful ?? false),
      starsWorldShape: Boolean(p.starsWorldShape ?? false),
      starsTwinkleSpeed: Number(p.starsTwinkleSpeed ?? 0.9),
      starsTwinkleAmp: Number(p.starsTwinkleAmp ?? 0.9),
      nebulaSpeed: Number(p.nebulaSpeed ?? 0.05),
      nebulaAlpha: Number(p.nebulaAlpha ?? 0.22),
      nebulaBlur: Number(p.nebulaBlur ?? 24),
      nebulaPalette: (p.nebulaPalette ?? "green"),
    };
  } catch {
    return DEFAULT_BGFX;
  }
}

function emitBgfxChange() {
  window.dispatchEvent(new Event("zproject:bgfx-change"));
}

function isLightThemeNow(): boolean {
  const html = document.documentElement;
  const t = html.getAttribute("data-theme") || "system";
  if (t === "light") return true;
  if (t === "dark") return false;
  return window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches;
}

function applyBgfx(p: BgfxPrefs) {
  const body = document.body;
  body.setAttribute("data-bg", p.mode);

  // Lava
  body.style.setProperty("--lava-blur-extra", `${p.lavaBlur}px`);

  // Stars
  body.style.setProperty("--stars-density", `${Math.max(0.1, p.starsDensity)}`);
  body.style.setProperty("--stars-link-alpha", `${Math.max(0, Math.min(1, p.starsLinkAlpha))}`);
  body.style.setProperty("--stars-twinkle", p.starsTwinkle ? "1" : "0");
  body.style.setProperty("--stars-twinkle-speed", `${Math.max(0.2, Math.min(2, p.starsTwinkleSpeed))}`);
  body.style.setProperty("--stars-twinkle-amp", `${Math.max(0, Math.min(1, p.starsTwinkleAmp))}`);
  if (isLightThemeNow()) {
    body.style.setProperty("--stars-colorful", "0");
  } else {
    body.style.setProperty("--stars-colorful", p.starsColorful ? "1" : "0");
  }
  body.style.setProperty("--stars-world-shape", p.starsWorldShape ? "1" : "0");

  // Nebula
  body.style.setProperty("--nebula-speed", `${Math.max(0, Math.min(0.3, p.nebulaSpeed))}`);
  body.style.setProperty("--nebula-alpha", `${Math.max(0, Math.min(1, p.nebulaAlpha))}`);
  body.style.setProperty("--nebula-blur", `${Math.max(0, Math.min(40, p.nebulaBlur))}`);

  // Paletas
  const palettes = {
    green:  { c1: "16,185,129", c2: "34,197,94",  c3: "59,130,246" },
    purple: { c1: "168,85,247", c2: "99,102,241", c3: "236,72,153" },
    sunset: { c1: "251,146,60", c2: "244,63,94",  c3: "234,179,8"  },
  } as const;
  const pal = palettes[p.nebulaPalette] ?? palettes.green;
  body.style.setProperty("--nebula-c1", pal.c1);
  body.style.setProperty("--nebula-c2", pal.c2);
  body.style.setProperty("--nebula-c3", pal.c3);

  emitBgfxChange();
}

/* =========================
   Página Settings
   ========================= */
export default function SettingsPage() {
  // 🔥 idioma reactivo (se actualiza al instante)
  const [lang, setLang] = useState<string>("en");
  const t = useMemo(() => getT(lang), [lang]);

  // Tema + BGFX
  const [choice, setChoice] = useState<ThemeChoice>("system");
  const [mounted, setMounted] = useState(false);
  const [bgfx, setBgfx] = useState<BgfxPrefs>(DEFAULT_BGFX);
  const [showAdvanced, setShowAdvanced] = useState(false);

  // ====== GLOBO DE DIÁLOGO (Settings) ======
  const bubblePhrases =
    lang === "es"
      ? ["Ajusta tu mundo ✨", "Configura a tu gusto ⚙️", "Todo bajo control 🎛️"]
      : lang === "pt"
      ? ["Ajuste seu mundo ✨", "Configure do seu jeito ⚙️", "Tudo sob controle 🎛️"]
      : lang === "fr"
      ? ["Ajuste ton monde ✨", "Configure à ta façon ⚙️", "Tout sous contrôle 🎛️"]
      : ["Tweak your world ✨", "Set it your way ⚙️", "Everything under control 🎛️"];

  const [bubbleText, setBubbleText] = useState<string>(bubblePhrases[0]);
  const bubbleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);

    // idioma inicial
    setLang(readLangCookie());

    // tema inicial
    const stored = readStoredTheme();
    if (stored) {
      setChoice(stored);
      applyTheme(stored);
    }

    // bgfx inicial
    const fx = readBgfx();
    setBgfx(fx);
    applyBgfx(fx);
  }, []);

  // Escucha el evento global emitido por LanguageSwitcher
  useEffect(() => {
    const onLang = () => setLang(readLangCookie());
    window.addEventListener("zproject:lang-change", onLang);
    return () => window.removeEventListener("zproject:lang-change", onLang);
  }, []);

  // Reaplicar BGFX cuando cambie el tema
  useEffect(() => {
    const reapplyOnTheme = () => applyBgfx(bgfx);
    window.addEventListener("zproject:theme-change", reapplyOnTheme);
    return () => window.removeEventListener("zproject:theme-change", reapplyOnTheme);
  }, [bgfx]);

  function update(next: Partial<BgfxPrefs>) {
    const merged = { ...bgfx, ...next };
    setBgfx(merged);
    writeBgfx(merged);
    applyBgfx(merged);
  }

  function applyStarsPreset(p: PerfPreset) {
    if (p === "auto") {
      update({ starsPreset: p, starsDensity: 0.9, starsLinkAlpha: 0.25, starsTwinkle: true, starsTwinkleAmp: 0.9 });
    } else if (p === "low") {
      update({ starsPreset: p, starsDensity: 0.55, starsLinkAlpha: 0.18, starsTwinkle: false, starsTwinkleAmp: 0.0 });
    } else if (p === "mid") {
      update({ starsPreset: p, starsDensity: 0.85, starsLinkAlpha: 0.22, starsTwinkle: true, starsTwinkleAmp: 0.6 });
    } else if (p === "high") {
      update({ starsPreset: p, starsDensity: 1.4, starsLinkAlpha: 0.3, starsTwinkle: true, starsTwinkleAmp: 1 });
    }
  }

  // ===== Rotación de frases + colocación del globo y wiggle (SSR-safe) =====
  useEffect(() => {
    // 1) Rotación de frases por visita
    setBubbleText(bubblePhrases[0]);
    try {
      const key = "z_bubble_idx_settings";
      const prev = Number(
        (typeof window !== "undefined" ? window.localStorage?.getItem(key) : "0") || "0"
      );
      const idx = isNaN(prev) ? 0 : prev;
      const txt = bubblePhrases[idx % bubblePhrases.length];
      setBubbleText(txt);
      if (typeof window !== "undefined") {
        window.localStorage?.setItem(key, String((idx + 1) % bubblePhrases.length));
      }
    } catch {
      // fallback silencioso
    }

    // 2) Colocar el globo apuntando al icono del header + wiggle
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

        // centro del icono como objetivo
        const targetX = r.left + r.width / 2;

        // debe coincidir con CSS (--arrow-left)
        const ARROW_LEFT_PX = 18;

        // corrimiento leve a la izquierda (consistente con otras páginas)
        const EXTRA_LEFT_SHIFT = 8;

        const gapY = 10;
        let top = r.bottom + gapY;
        const minTop = navH + 6;
        if (top < minTop) top = minTop;

        const bubbleBox = bubble.getBoundingClientRect();
        const viewportW = window.innerWidth;
        let left = targetX - ARROW_LEFT_PX - EXTRA_LEFT_SHIFT;

        // evitar desbordes laterales
        const minLeft = 8;
        const maxLeft = Math.max(minLeft, viewportW - bubbleBox.width - 8);
        if (left < minLeft) left = minLeft;
        if (left > maxLeft) left = maxLeft;

        // sincroniza la variable CSS de la flecha
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

    // wiggle del icono del header cuando aparece el globo
    icon.classList.add("logo-solo-talk");
    const stop = setTimeout(() => icon.classList.remove("logo-solo-talk"), 2600);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(frame);
      clearTimeout(stop);
    };
  }, [lang]); // re-coloca / re-rotación al cambiar de idioma

  return (
    <main className="min-h-screen px-6 py-16 flex items-start justify-center">
      {/* Globo de diálogo pegado al icono del header */}
      <div ref={bubbleRef} className="talk-bubble" role="status" aria-live="polite">
        {bubbleText}
      </div>

      <section className="w-full max-w-3xl settings-wrap">
        {/* Título con placeholder SSR para evitar mismatch */}
        {!mounted ? (
          <div className="settings-title" style={{height: 44, borderRadius: 10, opacity:.35, background:"currentColor"}} />
        ) : (
          <h1 className="settings-title" suppressHydrationWarning>
            {t("settings.title")}
          </h1>
        )}

        {/* === Idioma === */}
        <div className="settings-card">
          {!mounted ? (
            <>
              <div className="section-title" style={{height: 22, width: 140, opacity:.25, background:"currentColor", borderRadius:8}} />
              <div className="h-10 rounded-xl bg-black/20 animate-pulse" />
            </>
          ) : (
            <>
              <h2 className="section-title" suppressHydrationWarning>
                {t("settings.language")}
              </h2>
              <LanguageSwitcher label={t("lang.label")} />
            </>
          )}
        </div>

        {/* Apariencia */}
        <div className="settings-card">
          {!mounted ? (
            <>
              <div className="section-title" style={{height: 22, width: 160, opacity:.25, background:"currentColor", borderRadius:8}} />
              <div className="h-24 rounded-xl bg-black/20 animate-pulse" />
            </>
          ) : (
            <>
              <h2 className="section-title" suppressHydrationWarning>
                {t("settings.appearance")}
              </h2>
              <div className="settings-options">
                {(["system","dark","light"] as ThemeChoice[]).map((th)=>(
                  <label key={th} className="radio-tile">
                    <input
                      type="radio" name="theme" value={th}
                      checked={choice === th}
                      onChange={() => {
                        setChoice(th);
                        applyTheme(th);
                        window.dispatchEvent(new Event("zproject:theme-change"));
                      }}
                    />
                    <div>
                      <div style={{fontWeight:700}}>
                        {th === "system" ? t("settings.theme.system")
                          : th === "dark" ? t("settings.theme.dark")
                          : t("settings.theme.light")}
                      </div>
                      <div style={{opacity:.8, fontSize:'.9rem'}}>
                        {th === "system" && t("settings.theme.system.desc")}
                        {th === "dark"   && t("settings.theme.dark.desc")}
                        {th === "light"  && t("settings.theme.light.desc")}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Fondo visual */}
        <div className="settings-card">
          {!mounted ? (
            <>
              <div className="section-title" style={{height: 22, width: 170, opacity:.25, background:"currentColor", borderRadius:8}} />
              <div className="h-24 rounded-xl bg-black/20 animate-pulse" />
            </>
          ) : (
            <>
              <h2 className="section-title" suppressHydrationWarning>
                {t("settings.bgfx")}
              </h2>

              <div className="settings-options">
                {(["lava","stars","nebula","off"] as BgfxMode[]).map((m) => (
                  <label key={m} className="radio-tile">
                    <input
                      type="radio" name="bgfx" value={m}
                      checked={bgfx.mode === m}
                      onChange={() => update({ mode: m })}
                    />
                    <div>
                      <div style={{fontWeight:700}}>
                        {m === "lava" ? t("settings.bgfx.lava")
                          : m === "stars" ? t("settings.bgfx.stars")
                          : m === "nebula" ? t("settings.bgfx.nebula")
                          : t("settings.bgfx.off")}
                      </div>
                      <div style={{opacity:.8, fontSize:'.9rem'}}>
                        {m === "lava"   && t("settings.bgfx.lava.desc")}
                        {m === "stars"  && t("settings.bgfx.stars.desc")}
                        {m === "nebula" && t("settings.bgfx.nebula.desc")}
                        {m === "off"    && t("settings.bgfx.off.desc")}
                      </div>
                    </div>
                  </label>
                ))}
              </div>

              {/* Controles por modo */}
              {bgfx.mode === "lava" && (
                <div className="settings-row" style={{marginTop: 14}}>
                  <div className="range-row">
                    <label>Difuminado lava: <span className="badge">{bgfx.lavaBlur}px</span></label>
                    <input
                      type="range" min={0} max={80} step={2}
                      value={bgfx.lavaBlur}
                      onChange={(e)=>update({ lavaBlur: Number(e.target.value) })}
                    />
                  </div>
                </div>
              )}

              {bgfx.mode === "stars" && (
                <div className="settings-row" style={{marginTop: 14}}>
                  {/* Presets */}
                  <div className="settings-options">
                    {(["auto","low","mid","high"] as PerfPreset[]).map((p)=>(
                      <label key={p} className="radio-tile">
                        <input
                          type="radio" name="stars-preset" value={p}
                          checked={bgfx.starsPreset === p}
                          onChange={() => applyStarsPreset(p)}
                        />
                        <div>
                          <div style={{fontWeight:700}}>
                            {p === "auto" ? "Auto" : p === "low" ? "Bajo" : p === "mid" ? "Medio" : "Alto"}
                          </div>
                          <div style={{opacity:.8, fontSize:'.9rem'}}>
                            {p === "auto" && "Balanceado según tu equipo."}
                            {p === "low"  && "Menos partículas y líneas; más ligero."}
                            {p === "mid"  && "Intermedio con parpadeo suave."}
                            {p === "high" && "Más densidad y brillo (requiere GPU)."}
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>

                  {/* Avanzado */}
                  <button className="adv-toggle" style={{marginTop: 8}} onClick={()=>setShowAdvanced(v=>!v)}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                    {showAdvanced ? t("settings.advanced.hide") : t("settings.advanced.show")}
                  </button>

                  {showAdvanced && (
                    <div className="settings-row" style={{marginTop: 10}}>
                      <div className="settings-options">
                        <div className="range-row">
                          <label>Densidad: <span className="badge">{bgfx.starsDensity.toFixed(2)}</span></label>
                          <input
                            type="range" min={0.3} max={2.0} step={0.05}
                            value={bgfx.starsDensity}
                            onChange={(e)=>update({ starsDensity: Number(e.target.value) })}
                          />
                        </div>
                        <div className="range-row">
                          <label>Opacidad de líneas: <span className="badge">{bgfx.starsLinkAlpha.toFixed(2)}</span></label>
                          <input
                            type="range" min={0.0} max={1.0} step={0.02}
                            value={bgfx.starsLinkAlpha}
                            onChange={(e)=>update({ starsLinkAlpha: Number(e.target.value) })}
                          />
                        </div>
                        <div className="range-row">
                          <label>Velocidad parpadeo: <span className="badge">{bgfx.starsTwinkleSpeed.toFixed(2)}</span></label>
                          <input
                            type="range" min={0.2} max={2.0} step={0.05}
                            value={bgfx.starsTwinkleSpeed}
                            onChange={(e)=>update({ starsTwinkleSpeed: Number(e.target.value) })}
                          />
                        </div>
                        <div className="range-row">
                          <label>Intensidad parpadeo: <span className="badge">{bgfx.starsTwinkleAmp.toFixed(2)}</span></label>
                          <input
                            type="range" min={0.0} max={1.0} step={0.02}
                            value={bgfx.starsTwinkleAmp}
                            onChange={(e)=>update({ starsTwinkleAmp: Number(e.target.value) })}
                          />
                        </div>
                      </div>

                      <div className="settings-options">
                        <label className="radio-tile" style={{cursor:"pointer"}}>
                          <input
                            type="checkbox"
                            checked={bgfx.starsTwinkle}
                            onChange={(e)=>update({ starsTwinkle: e.target.checked })}
                          />
                          <div>Parpadeo activo</div>
                        </label>

                        <label className="radio-tile" style={{cursor:"pointer"}}>
                          <input
                            type="checkbox"
                            checked={bgfx.starsColorful}
                            onChange={(e)=>update({ starsColorful: e.target.checked })}
                          />
                          <div>Toque de color (solo oscuro)</div>
                        </label>

                        <label className="radio-tile" style={{cursor:"pointer"}}>
                          <input
                            type="checkbox"
                            checked={bgfx.starsWorldShape}
                            onChange={(e)=>update({ starsWorldShape: e.target.checked })}
                          />
                          <div>Formar mapa del mundo</div>
                        </label>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {bgfx.mode === "nebula" && (
                <div className="settings-row" style={{marginTop: 14}}>
                  <div className="settings-options">
                    <label className="radio-tile">
                      <div style={{width:"100%"}}>
                        <div className="range-row">
                          <label>Velocidad: <span className="badge">{bgfx.nebulaSpeed.toFixed(2)}</span></label>
                          <input
                            type="range" min={0} max={0.3} step={0.01}
                            value={bgfx.nebulaSpeed}
                            onChange={(e)=>update({ nebulaSpeed: Number(e.target.value) })}
                          />
                        </div>
                        <div className="range-row">
                          <label>Opacidad: <span className="badge">{bgfx.nebulaAlpha.toFixed(2)}</span></label>
                          <input
                            type="range" min={0} max={1} step={0.02}
                            value={bgfx.nebulaAlpha}
                            onChange={(e)=>update({ nebulaAlpha: Number(e.target.value) })}
                          />
                        </div>
                        <div className="range-row">
                          <label>Desenfoque: <span className="badge">{bgfx.nebulaBlur}px</span></label>
                          <input
                            type="range" min={0} max={40} step={1}
                            value={bgfx.nebulaBlur}
                            onChange={(e)=>update({ nebulaBlur: Number(e.target.value) })}
                          />
                        </div>
                        <div className="settings-options" style={{marginTop: 6}}>
                          {(["green","purple","sunset"] as const).map(pal=>(
                            <label key={pal} className="radio-tile">
                              <input
                                type="radio" name="nebula-palette" value={pal}
                                checked={bgfx.nebulaPalette === pal}
                                onChange={()=>update({ nebulaPalette: pal })}
                              />
                              <div style={{textTransform:"capitalize"}}>{pal}</div>
                            </label>
                          ))}
                        </div>
                      </div>
                    </label>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
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
      `}</style>
    </main>
  );
}
