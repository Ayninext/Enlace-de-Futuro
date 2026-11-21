import { OG_CONTENT_TYPE, OG_SIZE, defaultImage } from "@/lib/og";

export const alt = "Enlace de Futuro · Becas, empleos y cursos";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return defaultImage();
}
