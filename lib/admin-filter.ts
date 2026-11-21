import type { Category, Opportunity } from "./opportunities";

/** Fila del panel: la oportunidad + su estado calculado en el servidor (evita desajustes de hidratación). */
export type AdminRow = Opportunity & { active: boolean };
export type StatusFilter = "all" | "active" | "closed";
export type CategoryFilter = "all" | Category;

const normalize = (s: string) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

/** Aplica búsqueda (título u organización, sin tildes, todas las palabras) y categoría. */
export function filterByQueryAndCategory(rows: AdminRow[], query: string, category: CategoryFilter): AdminRow[] {
  const terms = normalize(query).split(/\s+/).filter(Boolean);
  return rows.filter((r) => {
    if (category !== "all" && r.category !== category) return false;
    if (terms.length === 0) return true;
    const haystack = normalize(`${r.title} ${r.organization}`);
    return terms.every((t) => haystack.includes(t));
  });
}

export function filterByStatus(rows: AdminRow[], status: StatusFilter): AdminRow[] {
  if (status === "all") return rows;
  return rows.filter((r) => (status === "active" ? r.active : !r.active));
}

export function statusCounts(rows: AdminRow[]) {
  const active = rows.filter((r) => r.active).length;
  return { all: rows.length, active, closed: rows.length - active };
}
