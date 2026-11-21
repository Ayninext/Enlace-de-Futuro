import Link from "next/link";
import type { Category, Opportunity } from "@/lib/opportunities";

const badgeStyles: Record<string, string> = {
  Becas: "border border-brand/20 bg-brand-soft text-brand",
  Empleos: "border border-accent/45 bg-accent-soft text-[#8A6508]",
  Cursos: "border border-sky-500/20 bg-sky-50 text-sky-800",
  Convocatorias: "border border-amber-500/25 bg-amber-50/90 text-amber-900",
  Concursos: "border border-indigo-500/20 bg-indigo-50 text-indigo-800",
};

function getBadgeStyle(category: string) {
  return (
    badgeStyles[category as Category] ??
    badgeStyles[category] ??
    "border border-brand/15 bg-brand-soft/70 text-brand"
  );
}

function formatDate(iso: string) {
  return new Date(iso + "T00:00:00").toLocaleDateString("es-PE", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function OpportunityCard({ item }: { item: Opportunity }) {
  return (
    <article className="group flex flex-col rounded-2xl border border-brand/15 bg-surface p-6 shadow-2xs transition-all duration-200 hover:-translate-y-0.5 hover:border-brand/50 hover:shadow-md">
      <div className="mb-4 flex items-center justify-between gap-2">
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${getBadgeStyle(
            item.category
          )}`}
        >
          {item.category}
        </span>
        <span className="text-xs font-medium text-ink/60">
          Cierra: {formatDate(item.deadline)}
        </span>
      </div>

      <h3 className="text-lg font-semibold leading-snug text-ink transition-colors group-hover:text-brand">
        {item.title}
      </h3>
      <p className="mt-1 text-sm font-medium text-brand">{item.organization}</p>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-ink/70">
        {item.description}
      </p>

      <div className="mt-5 flex items-center justify-between border-t border-brand/10 pt-4">
        <span className="text-xs font-medium text-ink/60">{item.location}</span>
        <Link
          href={`/oportunidades/${item.id}`}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand transition-colors hover:text-brand-dark"
        >
          Ver detalles
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#F2BD38"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transition-transform duration-200 group-hover:translate-x-1"
            aria-hidden="true"
          >
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </Link>
      </div>
    </article>
  );
}
