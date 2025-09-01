// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const res = NextResponse.next();

  // Si ya hay cookie de idioma, no hacemos nada.
  const current = req.cookies.get("zproject_lang")?.value;
  if (current) return res;

  // Autodetección simple por Accept-Language
  const header = req.headers.get("accept-language") || "";
  const first = header.split(",")[0]?.trim().toLowerCase() || "";
  let lang: "es" | "en" | "pt" | "fr" = "en";
  if (first.startsWith("es")) lang = "es";
  else if (first.startsWith("pt")) lang = "pt";
  else if (first.startsWith("fr")) lang = "fr";

  res.cookies.set("zproject_lang", lang, { path: "/", maxAge: 60 * 60 * 24 * 365 });
  return res;
}

// Aplica a todo el sitio
export const config = {
  matcher: ["/:path*"],
};