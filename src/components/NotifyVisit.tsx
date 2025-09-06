"use client";
import { useEffect } from "react";

export default function NotifyVisit() {
  useEffect(() => {
    // 1 vez por pestaña para no spamear (y evita doble efecto de StrictMode)
    if (sessionStorage.getItem("__z_notified")) return;
    sessionStorage.setItem("__z_notified", "1");

    const tz   = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const lang = navigator.language;
    const path = location.pathname;

    fetch("/api/notify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text: `👋 Nueva visita\n• Path: ${path}\n• Lang: ${lang}\n• TZ: ${tz}`,
      }),
      keepalive: true,
    }).catch(() => {});
  }, []);

  return null;
}
