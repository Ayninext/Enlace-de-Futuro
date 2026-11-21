import type { Metadata } from "next";
import Link from "next/link";
import { getAdminUser } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Administración",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await getAdminUser();

  return (
    <div className="min-h-screen bg-surface-muted">
      <header className="border-b border-line bg-surface">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link href="/admin" className="flex items-center gap-2.5" aria-label="Panel de administración">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
              <rect width="32" height="32" rx="8" fill="#2448D8" />
              <path d="M9 21l7-10 7 10" stroke="#F2BD38" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="text-lg font-bold text-ink">
              Enlace de <span className="text-brand">Futuro</span>
              <span className="ml-2 rounded-full bg-brand-soft px-2.5 py-0.5 align-middle text-xs font-semibold text-brand">Admin</span>
            </span>
          </Link>
          <div className="flex items-center gap-4 text-sm font-medium">
            <Link href="/" className="text-ink/70 hover:text-brand">Ver sitio</Link>
            {admin && (
              <>
                <span className="hidden max-w-[200px] truncate text-ink/50 md:inline" title={admin.email ?? undefined}>
                  {admin.email}
                </span>
                {/* POST normal: navegación completa, así el encabezado se actualiza al salir */}
                <form action="/admin/logout" method="post">
                  <button type="submit" className="rounded-xl border border-line px-4 py-2 text-ink transition-colors hover:border-brand hover:text-brand">
                    Cerrar sesión
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </header>
      {children}
    </div>
  );
}
