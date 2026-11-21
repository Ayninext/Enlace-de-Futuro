import type { Metadata } from "next";
import { SITE_LOCALE, SITE_NAME } from "./site";

export function clip(text: string, max: number): string {
  const t = text.replace(/\s+/g, " ").trim();
  return t.length <= max ? t : t.slice(0, max - 1).trimEnd() + "…";
}

interface PageMetaInput {
  title: string; // sin el sufijo del sitio (lo añade la plantilla del layout)
  description: string;
  path: string; // ruta relativa, p. ej. "/categorias/becas"
  type?: "website" | "article";
  publishedTime?: string;
  noindex?: boolean;
}

/**
 * Metadatos completos de una página. Next.js NO hereda campos dentro de `openGraph` / `twitter`
 * entre layout y páginas (se reemplazan), por eso cada página los define completos aquí.
 * La imagen la aportan los archivos opengraph-image / twitter-image de cada ruta.
 */
export function pageMetadata({
  title,
  description,
  path,
  type = "website",
  publishedTime,
  noindex = false,
}: PageMetaInput): Metadata {
  const fullTitle = `${title} | ${SITE_NAME}`;
  const desc = clip(description, 200);

  return {
    title,
    description: desc,
    alternates: { canonical: path },
    openGraph: {
      type,
      siteName: SITE_NAME,
      locale: SITE_LOCALE,
      url: path,
      title: fullTitle,
      description: desc,
      ...(publishedTime ? { publishedTime } : {}),
    } as NonNullable<Metadata["openGraph"]>,
    twitter: { card: "summary_large_image", title: fullTitle, description: desc },
    ...(noindex ? { robots: { index: false, follow: true } } : {}),
  };
}
