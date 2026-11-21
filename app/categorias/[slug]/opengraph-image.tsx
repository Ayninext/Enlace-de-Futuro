import { OG_CONTENT_TYPE, OG_SIZE, categoryImage } from "@/lib/og";

export const alt = "Categoría · Enlace de Futuro";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image({ params }: { params: { slug: string } }) {
  return categoryImage(params.slug);
}
