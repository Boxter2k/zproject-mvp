"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

type Payload = {
  type: "page_view" | "visit_start" | "visit_end";
  path: string;
  ref?: string | null;
  lang?: string;
  tz?: string;
  vp?: { w: number; h: number };
  uid?: string;            // ID anónimo por pestaña
  durMS?: number;          // duración en ms (solo en visit_end)
};

export default function NotifyVisit() {
  const pathname = usePathname();
  const startedAtRef = useRef<number | null>(null);
  const uidRef = useRef<string>("");

  // uid por pestaña
  useEffect(() => {
    const k = "__z_uid";
    uidRef.current = sessionStorage.getItem(k) || Math.random().toString(36).slice(2);
    sessionStorage.setItem(k, uidRef.current);
  }, []);

  // arranque de visita
  useEffect(() => {
    startedAtRef.current = Date.now();
    send("visit_start");
    // fin de visita (salida/cierre)
    const onBeforeUnload = () => send("visit_end");
    const onVisibility = () => {
      if (document.visibilityState === "hidden") send("visit_end");
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.removeEventListener("beforeunload", onBeforeUnload);
      document.removeEventListener("visibilitychange", onVisibility);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // página vista en cada cambio de ruta (client-side)
  useEffect(() => {
    send("page_view");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  function send(type: Payload["type"]) {
    const durMS =
      type === "visit_end" && startedAtRef.current
        ? Math.max(0, Date.now() - startedAtRef.current)
        : undefined;

    const payload: Payload = {
      type,
      path: window.location.pathname + window.location.search,
      ref: document.referrer || null,
      lang: navigator.language,
      tz: Intl.DateTimeFormat().resolvedOptions().timeZone,
      vp: { w: window.innerWidth, h: window.innerHeight },
      uid: uidRef.current,
      durMS,
    };

    // anti-spam simple: no spamear si está en localhost
    if (location.hostname === "localhost") return;

    fetch("/api/notify", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
      keepalive: type === "visit_end", // permite enviar al cerrar pestaña
    }).catch(() => {});
  }

  return null; // no renderiza nada
}
