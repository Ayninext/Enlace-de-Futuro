import Link from "next/link";
import type { CategoryInfo } from "@/lib/categories";
import CategoryIcon from "./CategoryIcon";

export default function CategoryCard({ info, count }: { info: CategoryInfo; count: number }) {
  return (
    <Link
      href={`/categorias/${info.slug}`}
      className="group flex flex-col rounded-2xl border border-line bg-surface p-6 transition-colors hover:border-brand"
    >
      <div className="flex items-start justify-between">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-soft text-brand">
          <CategoryIcon slug={info.slug} />
        </span>
        <span className="rounded-full bg-accent-soft px-3 py-1 text-xs font-semibold text-[#8A6508]">
          {count} {count === 1 ? "activa" : "activas"}
        </span>
      </div>

      <h3 className="mt-5 text-lg font-semibold">{info.label}</h3>
      <p className="mt-1 flex-1 text-sm leading-relaxed text-ink/70">{info.description}</p>

      <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-brand">
        Explorar
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F2BD38" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-x-0.5" aria-hidden="true">
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      </span>
    </Link>
  );
}
