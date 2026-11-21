import { OG_CONTENT_TYPE, OG_SIZE, opportunityImage } from "@/lib/og";

export const alt = "Oportunidad · Enlace de Futuro";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image({ params }: { params: { id: string } }) {
  return opportunityImage(params.id);
}
