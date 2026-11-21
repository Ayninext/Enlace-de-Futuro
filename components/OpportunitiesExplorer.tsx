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

  const locations = useMemo(
    () => Array.from(new Set(items.map((o) => o.location))).sort((a, b) => a.localeCompare(b, "es")),
    [items]
  );

  const results = useMemo(() => {
    const terms = normalize(query).split(/\s+/).filter(Boolean);
    const filtered = items.filter((o) => {
      if (category !== "Todas" && o.category !== category) return false;
      if (location !== "all" && o.location !== location) return false;
      if (closing !== "all" && daysLeft(o) > Number(closing)) return false;
      if (terms.length === 0) return true;
      const haystack = normalize(
        [o.title, o.organization, o.description, o.location, o.category, o.details ?? "", ...(o.requirements ?? [])].join(" ")
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
            Oportunidades para todas las edades
          </span>
          <h1 className="mx-auto mt-5 max-w-3xl text-4xl font-bold leading-tight sm:text-5xl">
            Encuentra tu próxima <span className="text-brand">oportunidad</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-ink/70 sm:text-lg">
            Becas, empleos, cursos gratuitos, convocatorias y concursos, reunidos en un solo lugar y actualizados a diario.
          </p>

          <form
            role="search"
            onSubmit={(e) => e.preventDefault()}
            className="mx-auto mt-8 flex max-w-2xl flex-col gap-3 rounded-2xl border border-line bg-surface p-2 sm:flex-row"
          >
            <label htmlFor="search" className="sr-only">Buscar oportunidades</label>
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

          <div className="mt-6 flex flex-wrap items-center justify-center gap-2" role="group" aria-label="Filtrar por categoría">
            {chips.map((f) => {
              const active = category === f;
              return (
                <button
                  key={f}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setCategory(f)}
                  className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
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

      {/* Explorador de oportunidades */}
      <section id="oportunidades" className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label htmlFor="location" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-ink/60">
              Ubicación
            </label>
            <select
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className={selectClass}
            >
              <option value="all">Todas las ubicaciones</option>
              {locations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="closing" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-ink/60">
              Cierre
            </label>
            <select
              id="closing"
              value={closing}
              onChange={(e) => setClosing(e.target.value as Closing)}
              className={selectClass}
            >
              <option value="all">Cualquier fecha</option>
              <option value="7">Cierra en 7 días</option>
              <option value="30">Cierra en 30 días</option>
            </select>
          </div>

          <div>
            <label htmlFor="sort" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-ink/60">
              Ordenar por
            </label>
            <select
              id="sort"
              value={sort}
              onChange={(e) => setSort(e.target.value as Sort)}
              className={selectClass}
            >
              <option value="deadline-asc">Próximos a cerrar</option>
              <option value="deadline-desc">Fecha de cierre más lejana</option>
              <option value="recent">Agregados recientemente</option>
            </select>
          </div>
        </div>

        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <p className="text-sm text-ink/70">
            Mostrando <strong className="font-semibold text-ink">{results.length}</strong>{" "}
            {results.length === 1 ? "oportunidad" : "oportunidades"}
          </p>

          {hasFilters && (
            <button
              type="button"
              onClick={clear}
              className="text-sm font-medium text-brand hover:underline"
            >
              Limpiar filtros
            </button>
          )}
        </div>

        {results.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-line bg-surface-muted px-6 py-16 text-center">
            <p className="text-base font-medium text-ink">No encontramos oportunidades con esos filtros</p>
            <p className="mt-1 text-sm text-ink/65">
              Prueba buscando con otras palabras clave o restablece los filtros.
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
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {results.map((item) => (
              <OpportunityCard key={item.id} opportunity={item} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
