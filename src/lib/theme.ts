export type ThemeChoice = "light" | "dark" | "system";

const THEME_KEY = "zproject:theme";
const COOKIE = "zproject_theme";
const COOKIE_RESOLVED = "zproject_theme_resolved";

export function readStoredTheme(): ThemeChoice | null {
  try {
    const v = localStorage.getItem(THEME_KEY);
    if (v === "light" || v === "dark" || v === "system") return v;
    return null;
  } catch {
    return null;
  }
}

export function systemPrefersDark() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  );
}

export function resolveTheme(choice: ThemeChoice): "light" | "dark" {
  if (choice === "system") return systemPrefersDark() ? "dark" : "light";
  return choice;
}

export function applyTheme(choice: ThemeChoice) {
  const html = document.documentElement;
  html.setAttribute("data-theme", choice);

  try {
    localStorage.setItem(THEME_KEY, choice);
  } catch {}

  // Cookie 1 año (SSR la usa para pintar data-theme/favicon)
  try {
    document.cookie = `${COOKIE}=${choice}; Path=/; Max-Age=31536000; SameSite=Lax`;
  } catch {}

  // Resuelto actual y snapshot para el SSR siguiente
  const resolved = resolveTheme(choice);
  try {
    document.cookie = `${COOKIE_RESOLVED}=${resolved}; Path=/; Max-Age=31536000; SameSite=Lax`;
  } catch {}

  // Favicon en cliente (coherente con SSR)
  const href = resolved === "dark" ? "/favicon-dark.png" : "/favicon-light.png";
  setFavicon(href);

  // Notificar a layout
  window.dispatchEvent(new Event("zproject:theme-change"));
}

export function setFavicon(href: string) {
  let link = document.querySelector<HTMLLinkElement>("#favicon");
  if (!link) {
    link = document.createElement("link");
    link.id = "favicon";
    link.rel = "icon";
    document.head.appendChild(link);
  }
  link.href = href;
}