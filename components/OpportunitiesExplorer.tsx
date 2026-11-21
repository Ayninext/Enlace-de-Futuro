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
                  className={`rounded-full
{/* Quiénes somos, Misión y Visión */}
      <section id="nosotros" className="border-t border-line bg-surface-muted">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-block rounded-full bg-accent-soft px-3 py-1 text-xs font-semibold text-[#8A6508]">
              Sobre el proyecto
            </span>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
              Quiénes somos en <span className="text-brand">Enlace de Futuro</span>
            </h2>
            <p className="mt-4 text-base leading-relaxed text-ink/75">
              Enlace de Futuro es una plataforma creada para acercar oportunidades reales de formación
              y crecimiento a quienes más las buscan. Reunimos becas, empleos, cursos gratuitos,
              convocatorias y concursos en un espacio claro, accesible y actualizado a diario para que
              nadie se quede sin descubrir su próximo paso.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-line bg-surface p-6 sm:p-8">
              <h3 className="text-xl font-bold text-ink">Misión</h3>
              <p className="mt-3 text-sm leading-relaxed text-ink/75 sm:text-base">
                Conectar el talento y las ganas de aprender con oportunidades concretas de estudio,
                trabajo y desarrollo, centralizando información confiable en un solo lugar y
                facilitando que cada persona encuentre opciones alineadas con sus metas y su etapa de
                vida.
              </p>
            </div>

            <div className="rounded-2xl border border-line bg-surface p-6 sm:p-8">
              <h3 className="text-xl font-bold text-ink">Visión</h3>
              <p className="mt-3 text-sm leading-relaxed text-ink/75 sm:text-base">
                Consolidarnos como el punto de referencia más confiable y cercano para descubrir
                oportunidades educativas, laborales y formativas, impulsando comunidades más
                preparadas, conectadas y con mayor acceso a su propio futuro.
              </p>
            </div>
          </div>
        </div>
      </section>
