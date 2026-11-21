import Link from "next/link";
import type { Category, Opportunity } from "@/lib/opportunities";

const badgeStyles: Record<Category, string> = {
  Becas: "bg-brand-soft text-brand",
  Empleos: "bg-accent-soft text-[#8A6508]",
  Cursos: "bg-surface-muted text-ink",
  Convocatorias: "bg-surface-muted text-ink",
};

function formatDate(iso: string) {
  return new Date(iso + "T00:00:00").toLocaleDateString("es-PE", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function OpportunityCard({ item }: { item: Opportunity }) {
  return (
    <article className="group flex flex-col rounded-2xl border border-line bg-surface p-6 transition-colors hover:border-brand">
      <div className="mb-4 flex items-center justify-between">
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${badgeStyles[item.category]}`}>
          {item.category}
        </span>
        <span className="text-xs text-ink/60">Cierra: {formatDate(item.deadline)}</span>
      </div>

      <h3 className="text-lg font-semibold leading-snug">{item.title}</h3>
      <p className="mt-1 text-sm font-medium text-brand">{item.organization}</p>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-ink/70">{item.description}</p>

      <div className="mt-5 flex items-center justify-between border-t border-line pt-4">
        <span className="text-xs text-ink/60">{item.location}</span>
        <Link href={`/oportunidades/${item.id}`} className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand">
          Ver detalles
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F2BD38" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-x-0.5" aria-hidden="true">
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </Link>
      </div>
    </article>
  );
}
