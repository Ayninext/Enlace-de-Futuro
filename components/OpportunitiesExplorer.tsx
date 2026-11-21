"use client";

import { useMemo, useState } from "react";
import OpportunityCard from "./OpportunityCard";
import { daysLeft, type Category, type Opportunity } from "@/lib/opportunities";

type ExtraCategory = "Concursos";
type CategoryFilter = "Todas" | Category | ExtraCategory;
type Closing = "all" | "7" | "30";
type Sort = "deadline-asc" | "deadline-desc" | "recent";

const chips: CategoryFilter[] = [
  "Todas",
  "Becas",
  "Empleos",
  "Cursos",
  "Convocatorias",
  "Concursos",
];

const LOCATIONS = [
  "100% virtual",
  "Internacional",
  "Lima, Perú",
  "Nacional",
] as const;

const normalize = (s: string) =>
  s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

const selectClass =
  "w-full rounded-xl border border-line bg-surface px-3 py-2.5 text-sm text-ink focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20";

export default function OpportunitiesExplorer({ items }: { items: Opportunity[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<CategoryFilter>("Todas");
  const [location, setLocation] = useState("all");
  const [closing, setClosing] = useState<Closing>("all");
  const [sort, setSort] = useState<Sort>("deadline-asc");

  const results = useMemo(() => {
    const terms = normalize(query).split(/\s+/).filter(Boolean);
    const filtered = items.filter((o) => {
      if (category !== "Todas" && o.category !== category) return false;
      if (location !== "all" && o.location !== location) return false;
      if (closing !== "all" && daysLeft(o) > Number(closing)) return false;
      if (terms.length === 0) return true;
      const haystack = normalize(
        [
          o.title,
          o.organization,
          o.description,
          o.location,
          o.category,
          o.details ?? "",
          ...(o.requirements ?? []),
        ].join(" ")
      );
      return terms.every((t) => haystack.includes(t));
    });

    return filtered.sort((a, b) => {
      if (sort === "deadline-desc") return b.deadline.localeCompare(a.deadline);
      if (sort === "recent") {
        return (b.createdAt ?? "").localeCompare(a.createdAt ?? "") || Number(b.id) - Number(a.id);
      }
      return a.deadline.localeCompare(b.deadline);
    });
  }, [items, query, category, location, closing, sort]);

  const hasFilters =
    query !== "" || category !== "Todas" || location !== "all" || closing !== "all" || sort !== "deadline-asc";

  function clear() {
    setQuery("");
    setCategory("Todas");
    setLocation("all");
    setClosing("all");
    setSort("deadline-asc");
  }

  return (
    <>
      {/* Hero */}
      <section className="border-b border-line bg-surface-muted">
        <div className="mx-auto max-w-6xl px-4 py-16 text-center sm:px-6 sm:py-24">
          <span className="inline-block rounded-full bg-accent-soft px-3 py-1 text-xs font-semibold text-[#8A6508]">
            Oportunidades para jóvenes
          </span>
          <h2 className="mx-auto mt-5 max-w-3xl text-4xl font-bold leading-tight sm:text-5xl">
            Encuentra tu próxima <span className="text-brand">oportunidad</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-ink/70 sm:text-lg">
            Becas, empleos, cursos gratuitos, convocatorias y concursos, reunidos en un solo lugar y actualizados a diario.
          </p>

          <form
            role="search"
            onSubmit={(e) => e.preventDefault()}
            className="mx-auto mt-8 flex max-w-2xl flex-col gap-3 rounded-2xl border border-line bg-surface p-2 sm:flex-row"
          >
            <label htmlFor="search" className="sr-only">
              Buscar oportunidades
            </label>
            <input
              id="search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Busca por palabra clave, institución o ciudad"
              className="flex-1 rounded-xl bg-transparent px-4 py-3 text-sm text-ink placeholder:text-ink/40 focus:outline-none"
            />
            <a
              href="#oportunidades"
              className="rounded-xl bg-brand px-6 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-brand-dark"
            >
              Buscar
            </a>
          </form>

          <div
            className="mt-6 flex flex-wrap items-center justify-center gap-2"
            role="group"
            aria-label="Filtrar por categoría"
          >
            {chips.map((f) => {
              const active = category === f;
              return (
                <button
                  key={f}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setCategory(f)}
                  className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${
                    active
                      ? "bg-brand text-white"
                      : "border border-line bg-surface text-ink/75 hover:border-brand hover:text-brand"
                  }`}
                >
                  {f}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Oportunidades */}
      <section id="oportunidades" className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
        <div className="flex flex-col justify-between gap-4 border-b border-line pb-6 sm:flex-row sm:items-end">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">
              Oportunidades activas
            </h2>
            <p className="mt-1 text-sm text-ink/65">
              {results.length === 1
                ? "Mostrando 1 oportunidad disponible"
                : `Mostrando ${results.length} oportunidades disponibles`}
            </p>
          </div>

          {hasFilters && (
            <button
              type="button"
              onClick={clear}
              className="self-start rounded-xl border border-line bg-surface px-3.5 py-2 text-xs font-semibold text-ink/80 transition-colors hover:border-brand hover:text-brand sm:self-auto"
            >
              Limpiar filtros
            </button>
          )}
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label htmlFor="filter-location" className="mb-1.5 block text-xs font-semibold text-ink/75">
              Ubicación
            </label>
            <select
              id="filter-location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className={selectClass}
            >
              <option value="all">Todas las ubicaciones</option>
              {LOCATIONS.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="filter-closing" className="mb-1.5 block text-xs font-semibold text-ink/75">
              Cierre próximo
            </label>
            <select
              id="filter-closing"
              value={closing}
              onChange={(e) => setClosing(e.target.value as Closing)}
              className={selectClass}
            >
              <option value="all">Cualquier fecha de cierre</option>
              <option value="7">Cierra en 7 días o menos</option>
              <option value="30">Cierra en 30 días o menos</option>
            </select>
          </div>

          <div>
            <label htmlFor="filter-sort" className="mb-1.5 block text-xs font-semibold text-ink/75">
              Ordenar por
            </label>
            <select
              id="filter-sort"
              value={sort}
              onChange={(e) => setSort(e.target.value as Sort)}
              className={selectClass}
            >
              <option value="deadline-asc">Cierre más próximo</option>
              <option value="deadline-desc">Cierre más lejano</option>
              <option value="recent">Publicadas recientemente</option>
            </select>
          </div>
        </div>

        {results.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-line bg-surface-muted p-10 text-center">
            <p className="text-base font-semibold text-ink">
              No encontramos oportunidades con esos filtros
            </p>
            <p className="mt-2 text-sm text-ink/65">
              Intenta cambiar la categoría, ampliar la fecha de cierre o limpiar los filtros activos.
            </p>
            <button
              type="button"
              onClick={clear}
              className="mt-5 rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-dark"
            >
              Ver todas las oportunidades
            </button>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {results.map((item) => (
              <OpportunityCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
