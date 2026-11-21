"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { deleteOpportunity } from "@/app/admin/actions";
import DeleteButton from "./DeleteButton";
import { CATEGORY_VALUES, type Category } from "@/lib/opportunities";
import {
  filterByQueryAndCategory,
  filterByStatus,
  statusCounts,
  type AdminRow,
  type CategoryFilter,
  type StatusFilter,
} from "@/lib/admin-filter";

const categoryLabel = (c: Category) => (c === "Convocatorias" ? "Fondos y Convocatorias" : c);

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
        active
          ? "border-brand bg-brand text-white"
          : "border-line bg-surface text-ink hover:border-brand hover:text-brand"
      }`}
    >
      {children}
    </button>
  );
}

function Count({ active, n }: { active: boolean; n: number }) {
  return (
    <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${active ? "bg-white/20 text-white" : "bg-surface-muted text-ink/70"}`}>
      {n}
    </span>
  );
}

export default function AdminOpportunitiesTable({ rows }: { rows: AdminRow[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<CategoryFilter>("all");
  const [status, setStatus] = useState<StatusFilter>("all");

  // Los contadores de estado reflejan la búsqueda y la categoría elegidas.
  const base = useMemo(() => filterByQueryAndCategory(rows, query, category), [rows, query, category]);
  const counts = useMemo(() => statusCounts(base), [base]);
  const visible = useMemo(() => filterByStatus(base, status), [base, status]);

  const hasFilters = query !== "" || category !== "all" || status !== "all";
  const clear = () => {
    setQuery("");
    setCategory("all");
    setStatus("all");
  };

  const statusChips: { value: StatusFilter; label: string }[] = [
    { value: "all", label: "Todas" },
    { value: "active", label: "Activas" },
    { value: "closed", label: "Cerradas" },
  ];

  return (
    <section aria-label="Oportunidades publicadas" className="mt-8">
      {/* Barra de búsqueda y filtros */}
      <div className="rounded-2xl border border-line bg-surface p-4">
        <div role="search">
          <label htmlFor="admin-search" className="sr-only">Buscar por título u organización</label>
          <div className="relative">
            <svg className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1E293B" strokeOpacity="0.45" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <circle cx="11" cy="11" r="7" />
              <path d="M20 20l-3.5-3.5" />
            </svg>
            <input
              id="admin-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar por título u organización"
              className="w-full rounded-xl border border-line bg-surface py-3 pl-11 pr-4 text-sm text-ink placeholder:text-ink/40 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
            />
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrar por estado">
            {statusChips.map((s) => (
              <Chip key={s.value} active={status === s.value} onClick={() => setStatus(s.value)}>
                {s.label}
                <Count active={status === s.value} n={counts[s.value]} />
              </Chip>
            ))}
          </div>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrar por categoría">
            <Chip active={category === "all"} onClick={() => setCategory("all")}>Todas las categorías</Chip>
            {CATEGORY_VALUES.map((c) => (
              <Chip key={c} active={category === c} onClick={() => setCategory(c)}>
                {categoryLabel(c)}
              </Chip>
            ))}
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between text-sm">
          <p className="text-ink/60" aria-live="polite">
            Mostrando {visible.length} de {rows.length}
          </p>
          {hasFilters && (
            <button type="button" onClick={clear} className="font-semibold text-brand hover:text-brand-dark">
              Limpiar filtros
            </button>
          )}
        </div>
      </div>

      {/* Tabla */}
      <div className="mt-4 overflow-x-auto rounded-2xl border border-line bg-surface">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b border-line bg-surface-muted text-xs uppercase tracking-wide text-ink/50">
            <tr>
              <th className="px-5 py-3 font-semibold">Oportunidad</th>
              <th className="px-5 py-3 font-semibold">Categoría</th>
              <th className="px-5 py-3 font-semibold">Cierre</th>
              <th className="px-5 py-3 font-semibold">Estado</th>
              <th className="px-5 py-3 text-right font-semibold">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {visible.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-5 py-12 text-center">
                  <p className="font-semibold">No hay oportunidades que coincidan</p>
                  <p className="mt-1 text-sm text-ink/60">Prueba con otra búsqueda o limpia los filtros.</p>
                </td>
              </tr>
            ) : (
              visible.map((o) => (
                <tr key={o.id}>
                  <td className="px-5 py-4">
                    <p className="font-medium">{o.title}</p>
                    <p className="text-xs text-ink/60">{o.organization}</p>
                  </td>
                  <td className="px-5 py-4">{categoryLabel(o.category)}</td>
                  <td className="px-5 py-4 text-ink/70">{o.deadline}</td>
                  <td className="px-5 py-4">
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${o.active ? "bg-brand-soft text-brand" : "bg-surface-muted text-ink/60"}`}>
                      {o.active ? "Activa" : "Cerrada"}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-4">
                      <Link href={`/oportunidades/${o.id}`} className="text-sm font-semibold text-ink/60 hover:text-ink">
                        Ver
                      </Link>
                      <Link
                        href={`/admin/editar/${o.id}`}
                        className="rounded-lg border border-line px-3 py-1.5 text-sm font-semibold text-brand transition-colors hover:border-brand"
                      >
                        Editar
                      </Link>
                      <form action={deleteOpportunity}>
                        <input type="hidden" name="id" value={o.id} />
                        <DeleteButton title={o.title} />
                      </form>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
