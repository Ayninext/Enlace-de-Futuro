import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import OpportunityCard from "@/components/OpportunityCard";
import { categories } from "@/lib/categories";
import { isActive, daysLeft, type Category } from "@/lib/opportunities";
import { getById, getRelated } from "@/lib/store";
import { pageMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic"; // las nuevas oportunidades del admin aparecen de inmediato

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const o = await getById(params.id);
  if (!o) return { title: "Oportunidad no encontrada", robots: { index: false, follow: false } };

  return pageMetadata({
    title: o.title,
    description: `${o.organization} · ${o.description}`,
    path: `/oportunidades/${o.id}`,
    type: "article",
    publishedTime: o.createdAt,
    noindex: !isActive(o), // las convocatorias cerradas siguen accesibles pero no se indexan
  });
}

const badgeStyles: Record<Category, string> = {
  Becas: "bg-brand-soft text-brand",
  Empleos: "bg-accent-soft text-[#8A6508]",
  Cursos: "bg-white text-ink border border-line",
  Convocatorias: "bg-white text-ink border border-line",
};

function formatDate(iso: string) {
  return new Date(iso + "T00:00:00").toLocaleDateString("es-PE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function deadlineLabel(days: number) {
  if (days < 0) return "Convocatoria cerrada";
  if (days === 0) return "Cierra hoy";
  if (days === 1) return "Cierra mañana";
  return `Quedan ${days} días`;
}

function Check() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2448D8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0" aria-hidden="true">
      <path d="M5 12l5 5L20 7" />
    </svg>
  );
}

function Section({ title, items }: { title: string; items: string[] }) {
  return (
    <section className="mt-10">
      <h2 className="text-xl font-semibold">{title}</h2>
      <ul className="mt-4 space-y-3">
        {items.map((t) => (
          <li key={t} className="flex gap-3 text-sm leading-relaxed text-ink/80">
            <Check />
            <span>{t}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default async function OpportunityPage({ params }: { params: { id: string } }) {
  const o = await getById(params.id);
  if (!o) notFound();

  const active = isActive(o);
  const days = daysLeft(o);
  const cat = categories.find((c) => c.category === o.category)!;
  const related = await getRelated(o);

  return (
    <>
      <Header />
      <main>
        {/* Cabecera */}
        <section className="border-b border-line bg-surface-muted">
          <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
            <nav aria-label="Ruta" className="mb-6 text-sm text-ink/60">
              <Link href="/" className="hover:text-brand">Inicio</Link>
              <span className="mx-2">/</span>
              <Link href={`/categorias/${cat.slug}`} className="hover:text-brand">{cat.label}</Link>
              <span className="mx-2">/</span>
              <span className="text-ink">Detalle</span>
            </nav>

            <div className="flex flex-wrap items-center gap-3">
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${badgeStyles[o.category]}`}>
                {o.category}
              </span>
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  active ? "bg-brand text-white" : "bg-ink text-white"
                }`}
              >
                {active ? "Activa" : "Cerrada"}
              </span>
            </div>

            <h1 className="mt-4 max-w-3xl text-3xl font-bold leading-tight sm:text-4xl">{o.title}</h1>
            <p className="mt-2 text-lg font-medium text-brand">{o.organization}</p>
          </div>
        </section>

        {/* Contenido */}
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_340px]">
          <article>
            <section>
              <h2 className="text-xl font-semibold">Descripción</h2>
              <p className="mt-4 leading-relaxed text-ink/80">{o.details ?? o.description}</p>
            </section>

            {o.requirements && o.requirements.length > 0 && (
              <Section title="Requisitos" items={o.requirements} />
            )}
            {o.benefits && o.benefits.length > 0 && <Section title="Beneficios" items={o.benefits} />}

            <Link
              href={`/categorias/${cat.slug}`}
              className="mt-10 inline-flex items-center gap-2 text-sm font-semibold text-brand"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F2BD38" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M19 12H5M11 6l-6 6 6 6" />
              </svg>
              Volver a {cat.label}
            </Link>
          </article>

          {/* Panel lateral */}
          <aside>
            <div className="sticky top-24 rounded-2xl border border-line bg-surface p-6">
              <p className="text-xs font-semibold uppercase tracking-wide text-ink/50">Fecha de cierre</p>
              <p className="mt-1 text-lg font-semibold">{formatDate(o.deadline)}</p>
              <p className={`mt-1 text-sm font-medium ${active ? "text-[#8A6508]" : "text-ink/60"}`}>
                {deadlineLabel(days)}
              </p>

              <dl className="mt-6 space-y-4 border-t border-line pt-6 text-sm">
                <div>
                  <dt className="text-ink/50">Institución</dt>
                  <dd className="mt-0.5 font-medium">{o.organization}</dd>
                </div>
                <div>
                  <dt className="text-ink/50">Ubicación</dt>
                  <dd className="mt-0.5 font-medium">{o.location}</dd>
                </div>
                <div>
                  <dt className="text-ink/50">Categoría</dt>
                  <dd className="mt-0.5 font-medium">{cat.label}</dd>
                </div>
              </dl>

              {active ? (
                <a
                  href={o.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-brand px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-dark"
                >
                  Postular en el sitio oficial
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F2BD38" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </a>
              ) : (
                <div className="mt-6 rounded-xl bg-surface-muted px-5 py-3 text-center text-sm font-medium text-ink/60">
                  Esta convocatoria ya cerró
                </div>
              )}
            </div>
          </aside>
        </div>

        {/* Relacionadas */}
        {related.length > 0 && (
          <section className="border-t border-line bg-surface-muted">
            <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
              <h2 className="text-2xl font-bold">Más en {cat.label}</h2>
              <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {related.map((r) => (
                  <OpportunityCard key={r.id} item={r} />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
