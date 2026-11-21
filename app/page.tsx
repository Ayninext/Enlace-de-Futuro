import OpportunitiesExplorer from "@/components/OpportunitiesExplorer";
import { getActive } from "@/lib/store";
import Image from "next/image";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function Home() {
  const opportunities = await getActive();

  return (
    <div className="min-h-screen bg-surface text-ink flex flex-col">
      {/* SECCIÓN 1: Quiénes Somos / Misión / Visión + Logo */}
      <section className="border-b border-line bg-surface-muted py-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-12 md:grid-cols-2 items-center">
            <div>
              <span className="inline-block rounded-full bg-accent-soft px-3 py-1 text-xs font-semibold text-[#8A6508] mb-4">
                ¿Quiénes somos?
              </span>
              <h1 className="text-4xl font-bold tracking-tight text-ink sm:text-5xl mb-4">
                Enlace de <span className="text-brand">Futuro</span>
              </h1>
              <p className="text-ink/75 leading-relaxed text-sm sm:text-base mb-8">
                Enlace de Futuro es una plataforma digital creada para conectar a jóvenes con
                oportunidades reales de crecimiento académico, profesional y personal. Reunimos y
                organizamos convocatorias, becas, empleos, cursos y concursos en un solo lugar,
                facilitando el acceso a información clara y confiable para que dar el siguiente paso
                no dependa de la suerte o de buscar en decenas de fuentes dispersas.
              </p>

              <div className="space-y-5">
                <div>
                  <h2 className="text-lg font-bold text-ink mb-1">Misión</h2>
                  <p className="text-ink/70 leading-relaxed text-sm">
                    Conectar a los jóvenes con oportunidades de desarrollo, como convocatorias, becas,
                    empleos, cursos y concursos, mediante una plataforma accesible, clara y curada
                    que impulse su formación, talento y proyección profesional.
                  </p>
                </div>
                <div>
                  <h2 className="text-lg font-bold text-ink mb-1">Visión</h2>
                  <p className="text-ink/70 leading-relaxed text-sm">
                    Consolidarnos como la plataforma de referencia para jóvenes que buscan
                    transformar su futuro, democratizando el acceso a oportunidades clave y
                    acompañando cada etapa de su crecimiento académico y laboral.
                  </p>
                </div>
              </div>

              <div className="mt-8 flex flex-wrap gap-4">
                <a
                  href="#explorar"
                  className="rounded-xl bg-brand px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-dark shadow-sm"
                >
                  Ver Oportunidades
                </a>
                <Link
                  href="/nosotros"
                  className="rounded-xl border border-line bg-surface px-6 py-3 text-sm font-semibold text-ink transition-colors hover:border-brand hover:text-brand"
                >
                  Conocer más
                </Link>
              </div>
            </div>

            <div className="flex justify-center">
              <div className="relative flex h-64 w-64 items-center justify-center overflow-hidden rounded-3xl border border-line bg-surface p-6 shadow-sm sm:h-80 sm:w-80">
                <Image
                  src="/logo.jpeg"
                  alt="Logo de Enlace de Futuro"
                  fill
                  className="object-contain p-4"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECCIÓN 2: Explorador + Explora por categoría */}
      <div id="explorar" className="flex-1">
        <OpportunitiesExplorer items={opportunities} />
      </div>

      {/* SECCIÓN 3: Instagram casi al final + Cierre */}
      <footer className="border-t border-line bg-surface-muted py-12 px-4 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-8 border-b border-line text-center sm:text-left">
            <div>
              <h3 className="text-lg font-bold text-ink">Enlace de Futuro</h3>
              <p className="text-sm text-ink/60 mt-1">
                Conectando oportunidades, transformando vidas.
              </p>
            </div>

            <div className="flex flex-col items-center sm:items-end gap-2">
              <p className="text-sm font-semibold text-ink">Síguenos en Instagram</p>
              <a
                href="https://www.instagram.com/enlace.de.futuro/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-brand/10 px-4 py-2 text-sm font-semibold text-brand transition-colors hover:bg-brand/20"
              >
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                >
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
                <span>@enlace.de.futuro</span>
              </a>
            </div>
          </div>

          <p className="text-xs text-ink/40 mt-6 text-center sm:text-left">
            © 2026 Enlace de Futuro. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
