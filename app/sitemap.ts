import type { MetadataRoute } from "next";
import { categories } from "@/lib/categories";
import { SITE_URL } from "@/lib/site";
import { getActive } from "@/lib/store";

export const dynamic = "force-dynamic"; // lee Supabase en cada petición; no se genera en el build

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const pages: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/categorias`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    ...categories.map((c) => ({
      url: `${SITE_URL}/categorias/${c.slug}`,
      lastModified: now,
      changeFrequency: "daily" as const,
      priority: 0.8,
    })),
  ];

  // Solo oportunidades activas. Si Supabase falla, el sitemap sigue sirviendo las páginas fijas.
  let opportunities: MetadataRoute.Sitemap = [];
  try {
    const active = await getActive();
    opportunities = active.map((o) => ({
      url: `${SITE_URL}/oportunidades/${o.id}`,
      lastModified: o.createdAt ? new Date(o.createdAt) : now,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }));
  } catch (error) {
    console.error("[sitemap] No se pudieron leer las oportunidades:", error);
  }

  return [...pages, ...opportunities];
}
