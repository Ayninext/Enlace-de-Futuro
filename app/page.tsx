import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CategoryCard from "@/components/CategoryCard";
import OpportunitiesExplorer from "@/components/OpportunitiesExplorer";
import { categories } from "@/lib/categories";
import { countsByCategory } from "@/lib/opportunities";
import { getActive } from "@/lib/store";

export const dynamic = "force-dynamic"; // lee el almacén en cada visita

export const metadata: Metadata = { alternates: { canonical: "/" } };

export default async function Home() {
  const active = await getActive();
  const counts = countsByCategory(active);

  return (
    <>
      <Header />
      <main>
        <OpportunitiesExplorer items={active} />
        <section id="categorias" className="border-t border-line bg-surface-muted">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
            <h2 className="text-2xl font-bold sm:text-3xl">Explora por categoría</h2>
            <p className="mt-1 text-sm text-ink/60">Oportunidades activas en cada área.</p>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {categories.map((c) => (
                <CategoryCard key={c.slug} info={c} count={counts[c.category]} />
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
