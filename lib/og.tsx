import { ImageResponse } from "next/og";
import { categories, getCategoryBySlug } from "./categories";
import { isActive } from "./opportunities";
import { clip } from "./seo";
import { getById } from "./store";

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

interface CardProps {
  badge?: string;
  title: string;
  subtitle?: string;
  footer?: string;
}

/** Tarjeta 1200×630 con identidad institucional: plana, sin degradados ni sombras. */
function render({ badge, title, subtitle, footer }: CardProps) {
  const fontSize = title.length > 70 ? 52 : title.length > 40 ? 60 : 68;

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", background: "#FFFFFF", color: "#1E293B" }}>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "56px 72px 44px 72px" }}>
          {/* Marca */}
          <div style={{ display: "flex", alignItems: "center" }}>
            <svg width="56" height="56" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="8" fill="#2448D8" />
              <path d="M9 21l7-10 7 10" stroke="#F2BD38" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div style={{ display: "flex", marginLeft: 16, fontSize: 34 }}>
              <span style={{ marginRight: 10 }}>Enlace de</span>
              <span style={{ color: "#2448D8" }}>Futuro</span>
            </div>
          </div>

          {/* Contenido */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            {badge ? (
              <div style={{ display: "flex", alignSelf: "flex-start", padding: "8px 22px", borderRadius: 999, background: "#EEF2FD", color: "#2448D8", fontSize: 26, marginBottom: 28 }}>
                {badge}
              </div>
            ) : null}
            <div style={{ display: "flex", fontSize, lineHeight: 1.15, letterSpacing: -1 }}>{title}</div>
            {subtitle ? (
              <div style={{ display: "flex", marginTop: 24, fontSize: 34, color: "#2448D8" }}>{subtitle}</div>
            ) : null}
          </div>

          {/* Pie */}
          <div style={{ display: "flex", fontSize: 26, color: "#475569", minHeight: 32 }}>{footer ?? ""}</div>
        </div>

        {/* Franja de marca */}
        <div style={{ display: "flex", height: 18, width: "100%" }}>
          <div style={{ display: "flex", width: "78%", background: "#2448D8" }} />
          <div style={{ display: "flex", width: "22%", background: "#F2BD38" }} />
        </div>
      </div>
    ),
    { ...OG_SIZE }
  );
}

export function defaultImage() {
  return render({
    badge: "Plataforma de oportunidades",
    title: "Becas, empleos y cursos para impulsar tu futuro",
    footer: "Becas · Empleos · Cursos · Fondos y Convocatorias",
  });
}

export function categoryImage(slug: string) {
  const info = getCategoryBySlug(slug);
  if (!info) return defaultImage();
  return render({
    badge: "Categoría",
    title: info.label,
    subtitle: info.tagline,
    footer: clip(info.description, 90),
  });
}

export async function opportunityImage(id: string) {
  try {
    const o = await getById(id);
    if (!o) return defaultImage();
    const cat = categories.find((c) => c.category === o.category);
    const date = new Date(o.deadline + "T00:00:00").toLocaleDateString("es-PE", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    return render({
      badge: cat?.label ?? o.category,
      title: clip(o.title, 90),
      subtitle: clip(o.organization, 50),
      footer: `${isActive(o) ? "Cierra" : "Cerró"}: ${date} · ${clip(o.location, 40)}`,
    });
  } catch {
    return defaultImage(); // si Supabase falla, la vista previa genérica sigue funcionando
  }
}
