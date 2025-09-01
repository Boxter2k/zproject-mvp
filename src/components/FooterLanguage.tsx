"use client";

import { usePathname } from "next/navigation";
import LanguageSwitcher from "./LanguageSwitcher";

export default function FooterLanguage() {
  const pathname = usePathname();

  // Solo mostrar en la página de inicio
  if (pathname !== "/") return null;

  return (
    <div className="flex items-center gap-3">
      <LanguageSwitcher label="Idioma" compact />
      {/* Guiño: banderita de Cuba */}
      <img
        src="/flags/cuba.svg"
        alt="Cuba"
        width={18}
        height={12}
        title="Un guiño ;)"
        style={{ borderRadius: 2, opacity: 0.85 }}
      />
    </div>
  );
}