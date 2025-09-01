// src/lib/i18n.ts
export type Lang = "es" | "en" | "pt" | "fr";
type Messages = Record<string, string>;

const es: Messages = {
  "nav.home": "Inicio",
  "nav.zshop": "ZShop",
  "nav.ztv": "ZTV",
  "nav.zplaza": "ZPlaza",
  "nav.support": "Apoyar",
  "nav.settings": "Configuración",

  "settings.title": "Configuración",
  "settings.language": "Idioma",
  "settings.appearance": "Apariencia",
  "settings.bgfx": "Fondo visual",
  "settings.advanced.show": "Mostrar avanzado",
  "settings.advanced.hide": "Ocultar avanzado",

  "settings.theme.system": "Sistema",
  "settings.theme.dark": "Oscuro",
  "settings.theme.light": "Claro",
  "settings.theme.system.desc": "Detecta claro/oscuro automáticamente.",
  "settings.theme.dark.desc": "Negro + acentos equilibrados.",
  "settings.theme.light.desc": "Blanco limpio con estrellas negras.",

  "settings.bgfx.lava": "Lava",
  "settings.bgfx.stars": "Estrellas",
  "settings.bgfx.nebula": "Nebulosa",
  "settings.bgfx.off": "Apagado",
  "settings.bgfx.lava.desc": "Blobs orgánicos con fusión (lámpara de lava).",
  "settings.bgfx.stars.desc": "Constelación (con opción mapa del mundo).",
  "settings.bgfx.nebula.desc": "Nubes de color suaves y animadas.",
  "settings.bgfx.off.desc": "Sin fondo animado.",

  "settings.fab.title": "Opciones",
  "lang.label": "Idioma",
  "lang.es": "Español (LATAM)",
  "lang.en": "English",
  "lang.pt": "Português",
  "lang.fr": "Français",
};

const en: Messages = {
  "nav.home": "Home",
  "nav.zshop": "ZShop",
  "nav.ztv": "ZTV",
  "nav.zplaza": "ZPlaza",
  "nav.support": "Support",
  "nav.settings": "Settings",

  "settings.title": "Settings",
  "settings.language": "Language",
  "settings.appearance": "Appearance",
  "settings.bgfx": "Visual background",
  "settings.advanced.show": "Show advanced",
  "settings.advanced.hide": "Hide advanced",

  "settings.theme.system": "System",
  "settings.theme.dark": "Dark",
  "settings.theme.light": "Light",
  "settings.theme.system.desc": "Automatically matches light/dark.",
  "settings.theme.dark.desc": "True black with balanced accents.",
  "settings.theme.light.desc": "Clean white with black stars.",

  "settings.bgfx.lava": "Lava",
  "settings.bgfx.stars": "Stars",
  "settings.bgfx.nebula": "Nebula",
  "settings.bgfx.off": "Off",
  "settings.bgfx.lava.desc": "Organic blobs with gooey blending.",
  "settings.bgfx.stars.desc": "Constellation (optional world map).",
  "settings.bgfx.nebula.desc": "Soft, animated color clouds.",
  "settings.bgfx.off.desc": "No animated background.",

  "settings.fab.title": "Options",
  "lang.label": "Language",
  "lang.es": "Español (LATAM)",
  "lang.en": "English",
  "lang.pt": "Português",
  "lang.fr": "Français",
};

const pt: Messages = {
  "nav.home": "Início",
  "nav.zshop": "ZShop",
  "nav.ztv": "ZTV",
  "nav.zplaza": "ZPlaza",
  "nav.support": "Apoiar",
  "nav.settings": "Configurações",

  "settings.title": "Configurações",
  "settings.language": "Idioma",
  "settings.appearance": "Aparência",
  "settings.bgfx": "Fundo visual",
  "settings.advanced.show": "Mostrar avançado",
  "settings.advanced.hide": "Ocultar avançado",

  "settings.theme.system": "Sistema",
  "settings.theme.dark": "Escuro",
  "settings.theme.light": "Claro",
  "settings.theme.system.desc": "Detecta claro/escuro automaticamente.",
  "settings.theme.dark.desc": "Preto com acentos equilibrados.",
  "settings.theme.light.desc": "Branco limpo com estrelas pretas.",

  "settings.bgfx.lava": "Lava",
  "settings.bgfx.stars": "Estrelas",
  "settings.bgfx.nebula": "Névoa",
  "settings.bgfx.off": "Desligado",
  "settings.bgfx.lava.desc": "Blobs orgânicos com mistura fluida.",
  "settings.bgfx.stars.desc": "Constelação (mapa-múndi opcional).",
  "settings.bgfx.nebula.desc": "Nuvens de cor suaves e animadas.",
  "settings.bgfx.off.desc": "Sem fundo animado.",

  "settings.fab.title": "Opções",
  "lang.label": "Idioma",
  "lang.es": "Español (LATAM)",
  "lang.en": "English",
  "lang.pt": "Português",
  "lang.fr": "Français",
};

const fr: Messages = {
  "nav.home": "Accueil",
  "nav.zshop": "ZShop",
  "nav.ztv": "ZTV",
  "nav.zplaza": "ZPlaza",
  "nav.support": "Soutenir",
  "nav.settings": "Paramètres",

  "settings.title": "Paramètres",
  "settings.language": "Langue",
  "settings.appearance": "Apparence",
  "settings.bgfx": "Arrière-plan visuel",
  "settings.advanced.show": "Afficher avancé",
  "settings.advanced.hide": "Masquer avancé",

  "settings.theme.system": "Système",
  "settings.theme.dark": "Sombre",
  "settings.theme.light": "Clair",
  "settings.theme.system.desc": "S'adapte automatiquement clair/sombre.",
  "settings.theme.dark.desc": "Noir avec accents équilibrés.",
  "settings.theme.light.desc": "Blanc épuré avec étoiles noires.",

  "settings.bgfx.lava": "Lave",
  "settings.bgfx.stars": "Étoiles",
  "settings.bgfx.nebula": "Nébuleuse",
  "settings.bgfx.off": "Désactivé",
  "settings.bgfx.lava.desc": "Blobs organiques avec fusion fluide.",
  "settings.bgfx.stars.desc": "Constellation (carte du monde en option).",
  "settings.bgfx.nebula.desc": "Nuages de couleur doux et animés.",
  "settings.bgfx.off.desc": "Pas d'arrière-plan animé.",

  "settings.fab.title": "Options",
  "lang.label": "Langue",
  "lang.es": "Español (LATAM)",
  "lang.en": "English",
  "lang.pt": "Português",
  "lang.fr": "Français",
};

const dicts: Record<Lang, Messages> = { es, en, pt, fr };

export function getT(lang: string | undefined) {
  const l = (["es", "en", "pt", "fr"].includes((lang || "").toLowerCase())
    ? (lang || "en").toLowerCase()
    : "en") as Lang;

  const base = dicts[l];
  const fallback = dicts.en;

  return (key: string): string => base[key] ?? fallback[key] ?? key;
}