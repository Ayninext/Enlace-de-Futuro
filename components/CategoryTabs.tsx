import Link from "next/link";
import { categories, type CategorySlug } from "@/lib/categories";
import type { Category } from "@/lib/opportunities";

export default function CategoryTabs({
  current,
  counts,
}: {
  current?: CategorySlug;
  counts: Record<Category, number>;
}) {
  return (
    <nav aria-label="Categorías" className="flex flex-wrap gap-2">
      {categories.map((c) => {
        const active = c.slug === current;
        return (
          <Link
            key={c.slug}
            href={`/categorias/${c.slug}`}
            aria-current={active ? "page" : undefined}
            className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
              active
                ? "border-brand bg-brand text-white"
                : "border-line bg-surface text-ink hover:border-brand hover:text-brand"
            }`}
          >
            {c.label}
            <span
              className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                active ? "bg-white/20 text-white" : "bg-surface-muted text-ink/70"
              }`}
            >
              {counts[c.category]}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
