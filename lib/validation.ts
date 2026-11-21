import { CATEGORY_VALUES, type Category, type Opportunity } from "./opportunities";

export type NewOpportunityData = Omit<Opportunity, "id" | "createdAt">;
export type ParseResult = { data: NewOpportunityData } | { error: string };

const text = (fd: FormData, key: string) => String(fd.get(key) ?? "").trim();

const toLines = (value: string) =>
  value
    .split("\n")
    .map((l) => l.trim().replace(/^[-•*]\s*/, ""))
    .filter(Boolean);

interface Options {
  /** Al editar: fecha límite guardada. Si no cambia, se permite aunque ya haya pasado. */
  currentDeadline?: string;
  /** Solo para pruebas. */
  today?: string;
}

/** Valida y normaliza el formulario de alta/edición. Se usa siempre en el servidor. */
export function parseOpportunityForm(fd: FormData, { currentDeadline, today }: Options = {}): ParseResult {
  const now = today ?? new Date().toISOString().slice(0, 10);

  const title = text(fd, "title");
  const organization = text(fd, "organization");
  const category = text(fd, "category") as Category;
  const location = text(fd, "location");
  const description = text(fd, "description");
  const details = text(fd, "details");
  const requirements = toLines(text(fd, "requirements"));
  const benefits = toLines(text(fd, "benefits"));
  const deadline = text(fd, "deadline");
  const href = text(fd, "href");

  if (!title || title.length > 120) return { error: "El título es obligatorio (máx. 120 caracteres)." };
  if (!organization || organization.length > 100) return { error: "La organización es obligatoria (máx. 100 caracteres)." };
  if (!CATEGORY_VALUES.includes(category)) return { error: "Selecciona una categoría válida." };
  if (!location || location.length > 80) return { error: "La ubicación es obligatoria (máx. 80 caracteres)." };
  if (!description || description.length > 200) return { error: "El resumen es obligatorio (máx. 200 caracteres)." };
  if (details.length > 3000) return { error: "La descripción detallada es demasiado larga (máx. 3000 caracteres)." };
  if (requirements.length > 20 || benefits.length > 20) return { error: "Máximo 20 líneas en requisitos y en beneficios." };
  if ([...requirements, ...benefits].some((l) => l.length > 200)) {
    return { error: "Cada requisito o beneficio debe tener máx. 200 caracteres." };
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(deadline) || Number.isNaN(Date.parse(deadline))) {
    return { error: "Ingresa una fecha límite válida." };
  }
  if (deadline < now && deadline !== currentDeadline) {
    return { error: "La fecha límite no puede ser anterior a hoy." };
  }

  // Solo http(s): evita enlaces tipo javascript: en el botón de postulación.
  let url: URL;
  try {
    url = new URL(href);
  } catch {
    return { error: "Ingresa un enlace externo válido (https://…)." };
  }
  if (!["http:", "https:"].includes(url.protocol) || href.length > 500) {
    return { error: "El enlace debe empezar con http:// o https:// (máx. 500 caracteres)." };
  }

  return {
    data: {
      title,
      organization,
      category,
      location,
      description,
      details: details || undefined,
      requirements: requirements.length ? requirements : undefined,
      benefits: benefits.length ? benefits : undefined,
      deadline,
      href: url.toString(),
    },
  };
}
