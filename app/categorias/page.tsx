import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CategoryCard from "@/components/CategoryCard";
import { categories } from "@/lib/categories";
import { countsByCategory } from "@/lib/opportunities";
import { getActive } from "@/lib/store";
import { pageMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata: Metadata = pageMetadata({
  title: "Categorías",
  description: "Explora becas, empleos, cursos y fondos y convocatorias, con el número de oportunidades activas en cada una.",
  path: "/categorias",
});

export default async function CategoriesPage() {
  const counts = countsByCategory(await getActive());

  return (
    <>
      <Header />
      <main>
        <section className="border-b border-line bg-surface-muted">
          <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
            <h1 className="text-3xl font-bold sm:text-4xl">Explora por categoría</h1>
            <p className="mt-3 max-w-2xl text-ink/70">
              Elige el tipo de oportunidad que buscas. Los contadores muestran cuántas siguen abiertas hoy.
            </p>
          </div>
        </section>
        <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((c) => (
              <CategoryCard key={c.slug} info={c} count={counts[c.category]} />
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
