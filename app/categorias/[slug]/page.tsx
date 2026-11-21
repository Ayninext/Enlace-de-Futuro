import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CategoryTabs from "@/components/CategoryTabs";
import CategoryIcon from "@/components/CategoryIcon";
import OpportunityCard from "@/components/OpportunityCard";
import { categories, getCategoryBySlug } from "@/lib/categories";
import { byDeadline, countsByCategory } from "@/lib/opportunities";
import { getActive } from "@/lib/store";
import { pageMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";
export const dynamicParams = false;

export function generateStaticParams() {
  return categories.map((c) => ({ slug: c.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const info = getCategoryBySlug(params.slug);
  if (!info) return {};
  return pageMetadata({
    title: info.label,
    description: `${info.tagline}. ${info.description}`,
    path: `/categorias/${info.slug}`,
  });
}

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const info = getCategoryBySlug(params.slug);
  if (!info) notFound();

  const active = await getActive();
  const counts = countsByCategory(active);
  const items = active.filter((o) => o.category === info.category).sort(byDeadline);

  return (
    <>
      <Header />
      <main>
        <section className="border-b border-line bg-surface-muted">
          <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
            <nav aria-label="Ruta" className="mb-5 text-sm text-ink/60">
              <Link href="/" className="hover:text-brand">Inicio</Link>
              <span className="mx-2">/</span>
              <Link href="/categorias" className="hover:text-brand">Categorías</Link>
              <span className="mx-2">/</span>
              <span className="text-ink">{info.label}</span>
            </nav>

            <div className="flex items-center gap-4">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand text-white">
                <CategoryIcon slug={info.slug} size={28} />
              </span>
              <div>
                <h1 className="text-3xl font-bold sm:text-4xl">{info.label}</h1>
                <p className="mt-1 text-ink/70">{info.tagline}</p>
              </div>
            </div>

            <p className="mt-5 max-w-2xl text-ink/70">{info.description}</p>

            <div className="mt-6 inline-flex items-center gap-3 rounded-xl border border-line bg-surface px-4 py-3">
              <span className="text-3xl font-bold text-brand">{items.length}</span>
              <span className="text-sm font-medium text-ink/70">
                {items.length === 1 ? "oportunidad activa" : "oportunidades activas"}
              </span>
              <span aria-hidden="true" className="h-6 w-1 rounded-full bg-accent" />
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
          <div className="mb-8">
            <CategoryTabs current={info.slug} counts={counts} />
          </div>

          {items.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((o) => (
                <OpportunityCard key={o.id} item={o} />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-line bg-surface-muted p-12 text-center">
              <p className="font-semibold">No hay oportunidades activas por ahora</p>
              <p className="mt-1 text-sm text-ink/60">Vuelve pronto o explora otras categorías.</p>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
