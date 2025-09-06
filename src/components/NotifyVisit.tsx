"use client";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export default function NotifyVisit() {
  const pathname = usePathname();
  const enterTsRef = useRef<number>(0);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const path = pathname || window.location.pathname + window.location.search;
    const referrer = document.referrer || "";

    // marcar entrada y enviar "view"
    enterTsRef.current = performance.now();
    fetch("/api/visit", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ event: "view", path, referrer }),
      keepalive: true,
    }).catch(() => {});

    // al cambiar de ruta o cerrar, enviar "leave" con permanencia
    return () => {
      const ms = Math.max(0, performance.now() - enterTsRef.current);
      const blob = new Blob([JSON.stringify({ event: "leave", path, ms })], {
        type: "application/json",
      });
      navigator.sendBeacon("/api/visit", blob);
    };
  }, [pathname]);

  return null;
}
