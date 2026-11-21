import type { Category } from "./opportunities";

export type CategorySlug = "becas" | "empleos" | "cursos" | "convocatorias";

export interface CategoryInfo {
  slug: CategorySlug;
  category: Category; // valor usado en los datos
  label: string; // nombre visible
  tagline: string;
  description: string;
}

export const categories: CategoryInfo[] = [
  {
    slug: "becas",
    category: "Becas",
    label: "Becas",
    tagline: "Financia tu formación",
    description: "Becas de pregrado, posgrado e intercambio, nacionales e internacionales.",
  },
  {
    slug: "empleos",
    category: "Empleos",
    label: "Empleos",
    tagline: "Da el siguiente paso profesional",
    description: "Ofertas laborales y prácticas para todos los perfiles y niveles de experiencia.",
  },
  {
    slug: "cursos",
    category: "Cursos",
    label: "Cursos",
    tagline: "Aprende nuevas habilidades",
    description: "Cursos gratuitos y certificaciones, en línea y presenciales.",
  },
  {
    slug: "convocatorias",
    category: "Convocatorias",
    label: "Fondos y Convocatorias",
    tagline: "Impulsa tus proyectos",
    description: "Fondos concursables, voluntariados y convocatorias abiertas.",
  },
];

export function getCategoryBySlug(slug: string): CategoryInfo | undefined {
  return categories.find((c) => c.slug === slug);
}
