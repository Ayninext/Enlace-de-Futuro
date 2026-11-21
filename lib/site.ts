export const SITE_NAME = "Enlace de Futuro";
export const SITE_DESCRIPTION =
  "Descubre becas, empleos, cursos gratuitos y convocatorias en un solo lugar. Oportunidades verificadas y actualizadas a diario.";
export const SITE_LOCALE = "es_PE";

/**
 * URL pública del sitio (sin barra final). Orden de prioridad:
 * 1. NEXT_PUBLIC_SITE_URL (recomendado: tu dominio propio)
 * 2. VERCEL_PROJECT_PRODUCTION_URL (dominio de producción en Vercel)
 * 3. VERCEL_URL (URL de cada despliegue / preview)
 * 4. http://localhost:3000
 */
function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/+$/, "");
  const prod = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (prod) return `https://${prod}`;
  const vercel = process.env.VERCEL_URL;
  if (vercel) return `https://${vercel}`;
  return "http://localhost:3000";
}

export const SITE_URL = resolveSiteUrl();
