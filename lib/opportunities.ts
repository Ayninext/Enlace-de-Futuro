export type Category = "Becas" | "Empleos" | "Cursos" | "Convocatorias";

export const CATEGORY_VALUES: Category[] = ["Becas", "Empleos", "Cursos", "Convocatorias"];

export interface Opportunity {
  id: string;
  category: Category;
  title: string;
  organization: string;
  location: string;
  deadline: string; // ISO date (YYYY-MM-DD)
  description: string;
  /** Texto largo para la página de detalle (opcional). */
  details?: string;
  requirements?: string[];
  benefits?: string[];
  /** Enlace externo oficial para postular (la tarjeta enlaza al detalle interno). */
  href: string;
  /** Fecha de publicación (ISO). */
  createdAt?: string;
}

// ---- Modelo de la tabla `opportunities` en Supabase (snake_case) ----

export interface OpportunityRow {
  id: number | string; // bigint
  category: Category;
  title: string;
  organization: string;
  location: string;
  deadline: string; // date → "YYYY-MM-DD"
  description: string;
  details: string | null;
  requirements: string[] | null;
  benefits: string[] | null;
  href: string;
  created_at: string; // timestamptz
}

export function fromRow(r: OpportunityRow): Opportunity {
  return {
    id: String(r.id),
    category: r.category,
    title: r.title,
    organization: r.organization,
    location: r.location,
    deadline: r.deadline,
    description: r.description,
    details: r.details ?? undefined,
    requirements: r.requirements && r.requirements.length ? r.requirements : undefined,
    benefits: r.benefits && r.benefits.length ? r.benefits : undefined,
    href: r.href,
    createdAt: r.created_at,
  };
}

/** Datos para INSERT: sin id ni created_at (los genera la base de datos). */
export function toInsert(o: Omit<Opportunity, "id" | "createdAt">) {
  return {
    category: o.category,
    title: o.title,
    organization: o.organization,
    location: o.location,
    deadline: o.deadline,
    description: o.description,
    details: o.details ?? null,
    requirements: o.requirements ?? [],
    benefits: o.benefits ?? [],
    href: o.href,
  };
}

// ---- Funciones puras (seguras para usar en cliente y servidor) ----

/** Una oportunidad está activa mientras su fecha de cierre no haya pasado. */
export function isActive(o: Opportunity, now: Date = new Date()): boolean {
  return o.deadline >= now.toISOString().slice(0, 10);
}

/** Días restantes hasta el cierre (0 = cierra hoy, negativo = ya cerró). */
export function daysLeft(o: Opportunity, now: Date = new Date()): number {
  const end = new Date(o.deadline + "T00:00:00Z").getTime();
  const today = new Date(now.toISOString().slice(0, 10) + "T00:00:00Z").getTime();
  return Math.round((end - today) / 86_400_000);
}

export function byDeadline(a: Opportunity, b: Opportunity): number {
  return a.deadline.localeCompare(b.deadline);
}

export function countsByCategory(items: Opportunity[]): Record<Category, number> {
  const counts = { Becas: 0, Empleos: 0, Cursos: 0, Convocatorias: 0 } as Record<Category, number>;
  for (const o of items) counts[o.category] += 1;
  return counts;
}

export function relatedTo(o: Opportunity, all: Opportunity[], limit = 3): Opportunity[] {
  return all
    .filter((x) => x.id !== o.id && x.category === o.category && isActive(x))
    .sort(byDeadline)
    .slice(0, limit);
}
