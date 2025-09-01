'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import type { Route } from 'next';

// Enlaces internos que SÍ existen en /src/app
const internalLinks: Array<{ href: Route; label: string }> = [
  { href: '/' as Route, label: 'Inicio' },
  { href: '/zshop' as Route, label: 'ZShop' },
  { href: '/ztv' as Route, label: 'ZTV' },
  // Si tienes /zplaza o /thanks, descomenta:
  // { href: '/zplaza' as Route, label: 'ZPlaza' },
  // { href: '/thanks' as Route, label: 'Gracias' },
];

// Enlaces que aún NO existen como rutas (evita romper typedRoutes)
const pendingLinks: Array<{ href: string; label: string }> = [
  { href: '/comunidad', label: 'Comunidad' },
  { href: '/contacto', label: 'Contacto' },
];

export default function NavBar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-black/40 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        {/* Logo */}
        <Link href="/" className="font-bold text-xl text-white" aria-label="ZProject - Inicio">
          <span className="text-emerald-400">Z</span>Project
        </Link>

        {/* Botón móvil */}
        <button
          className="md:hidden rounded-lg border border-white/10 px-2 py-1 text-sm text-white"
          onClick={() => setOpen(!open)}
          aria-label="Abrir menú"
          aria-expanded={open}
          aria-controls="main-menu"
        >
          ☰
        </button>

        {/* Links */}
        <ul
          id="main-menu"
          className={`${
            open ? 'block' : 'hidden'
          } absolute left-0 right-0 top-full mx-4 rounded-xl border border-white/10 bg-zinc-900 p-3 md:static md:mx-0 md:flex md:gap-2 md:border-0 md:bg-transparent md:p-0`}
        >
          {/* Internos (Link) */}
          {internalLinks.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                onClick={() => setOpen(false)}
                className={`block rounded-lg px-3 py-2 text-sm transition ${
                  isActive(String(l.href))
                    ? 'bg-emerald-500/20 text-emerald-300'
                    : 'text-zinc-200 hover:bg-white/5'
                }`}
              >
                {l.label}
              </Link>
            </li>
          ))}

          {/* Pendientes/no-existentes (a) */}
          {pendingLinks.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                onClick={() => setOpen(false)}
                className={`block rounded-lg px-3 py-2 text-sm transition ${
                  isActive(l.href)
                    ? 'bg-emerald-500/20 text-emerald-300'
                    : 'text-zinc-200 hover:bg-white/5'
                }`}
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}