"use client";

import { useState } from "react";
import Link from "next/link";

const links = [
  { label: "Becas", href: "/categorias/becas" },
  { label: "Empleos", href: "/categorias/empleos" },
  { label: "Cursos", href: "/categorias/cursos" },
  { label: "Convocatorias", href: "/categorias/convocatorias" },
];

function Logo() {
  // Isotipo provisional: reemplazar por el logotipo oficial (SVG) cuando esté disponible.
  return (
    <Link href="/" className="flex items-center gap-2.5" aria-label="Enlace de Futuro">
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <rect width="32" height="32" rx="8" fill="#2448D8" />
        <path d="M9 21l7-10 7 10" stroke="#F2BD38" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span className="text-lg font-bold text-ink">
        Enlace de <span className="text-brand">Futuro</span>
      </span>
    </Link>
  );
}

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-surface/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Logo />

        <nav className="hidden items-center gap-8 md:flex" aria-label="Principal">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="text-sm font-medium text-ink/70 transition-colors hover:text-brand">
              {l.label}
            </Link>
          ))}
        </nav>

     

        <button
          type="button"
          className="rounded-xl border border-line p-2 md:hidden"
          aria-label="Abrir menú"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1E293B" strokeWidth="2" strokeLinecap="round">
            {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </div>

      {open && (
        <nav className="border-t border-line bg-surface px-4 py-3 md:hidden" aria-label="Móvil">
          <ul className="flex flex-col gap-1">
            {links.map((l) => (
              <li key={l.href}>
                <Link href={l.href} onClick={() => setOpen(false)} className="block rounded-xl px-3 py-2 text-sm font-medium text-ink hover:bg-surface-muted">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
