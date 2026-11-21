import Link from "next/link";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { getAll } from "@/lib/store";
import { getSupabase } from "@/lib/supabase";
import { isActive } from "@/lib/opportunities";
import type { AdminRow } from "@/lib/admin-filter";
import AdminOpportunitiesTable from "@/components/admin/AdminOpportunitiesTable";
import AdminLogoUploader from "@/components/admin/AdminLogoUploader";

export const dynamic = "force-dynamic";

const BUCKET = "branding";
const MAX_BYTES = 3 * 1024 * 1024; // 3 MB

async function getCurrentLogo(): Promise<string> {
  try {
    const { data, error } = await getSupabase()
      .from("site_settings")
      .select("logo_url")
      .eq("id", "main")
      .maybeSingle();

    if (error || !data?.logo_url) return "/logo.jpeg";
    return data.logo_url;
  } catch {
    return "/logo.jpeg";
  }
}

async function updateLogoAction(
  formData: FormData
): Promise<{ ok: boolean; message: string; url?: string }> {
  "use server";

  if (!(await isAdmin())) {
    return { ok: false, message: "No autorizado." };
  }

  const file = formData.get("logo");
  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, message: "Selecciona un archivo de imagen válido." };
  }

  if (!file.type.startsWith("image/")) {
    return { ok: false, message: "El archivo debe ser una imagen." };
  }

  if (file.size > MAX_BYTES) {
    return { ok: false, message: "La imagen no debe superar los 3 MB." };
  }

  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const filePath = `logo-${Date.now()}.${ext}`;
  const arrayBuffer = await file.arrayBuffer();

  const supabase = getSupabase();
  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(filePath, Buffer.from(arrayBuffer), {
      contentType: file.type,
      upsert: true,
    });

  if (uploadError) {
    return { ok: false, message: `Error al subir a Storage: ${uploadError.message}` };
  }

  const { data: publicData } = supabase.storage.from(BUCKET).getPublicUrl(filePath);
  const publicUrl = publicData.publicUrl;

  const { error: dbError } = await supabase
    .from("site_settings")
    .upsert({ id: "main", logo_url: publicUrl, updated_at: new Date().toISOString() });

  if (dbError) {
    return { ok: false, message: `Error al guardar en base de datos: ${dbError.message}` };
  }

  revalidatePath("/");
  revalidatePath("/admin");

  return { ok: true, message: "Logo actualizado correctamente.", url: publicUrl };
}

export default async function AdminPage({
  searchParams,
}: {
  searchParams: { publicada?: string; actualizada?: string; eliminada?: string };
}) {
  if (!(await isAdmin())) redirect("/admin/login");

  const [all, currentLogo] = await Promise.all([getAll(), getCurrentLogo()]);
  const rows: AdminRow[] = [...all]
    .sort((a, b) => (b.createdAt ?? "").localeCompare(a.createdAt ?? "") || Number(b.id) - Number(a.id))
    .map((o) => ({ ...o, active: isActive(o) }));
  const activeCount = rows.filter((r) => r.active).length;

  return (
    <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Panel de administración</h1>
          <p className="mt-1 text-sm text-ink/60">Gestiona las oportunidades publicadas en el sitio.</p>
        </div>
        <Link href="/admin/nueva" className="rounded-xl bg-brand px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-dark">
          Nueva oportunidad
        </Link>
      </div>

      {searchParams.publicada && (
        <p role="status" className="mt-6 rounded-xl border border-line bg-surface px-4 py-3 text-sm font-medium">
          Oportunidad publicada.{" "}
          <Link href={`/oportunidades/${searchParams.publicada}`} className="font-semibold text-brand hover:text-brand-dark">
            Ver en el sitio
          </Link>
        </p>
      )}
      {searchParams.actualizada && (
        <p role="status" className="mt-6 rounded-xl border border-line bg-surface px-4 py-3 text-sm font-medium">
          Cambios guardados.{" "}
          <Link href={`/oportunidades/${searchParams.actualizada}`} className="font-semibold text-brand hover:text-brand-dark">
            Ver en el sitio
          </Link>
        </p>
      )}
      {searchParams.eliminada && (
        <p role="status" className="mt-6 rounded-xl border border-line bg-surface px-4 py-3 text-sm font-medium">
          Oportunidad eliminada.
        </p>
      )}

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {[
          { label: "Total publicadas", value: rows.length },
          { label: "Activas", value: activeCount },
          { label: "Cerradas", value: rows.length - activeCount },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl border border-line bg-surface p-5">
            <p className="text-3xl font-bold text-brand">{s.value}</p>
            <p className="mt-1 text-sm text-ink/60">{s.label}</p>
          </div>
        ))}
      </div>

      <AdminLogoUploader currentLogoUrl={currentLogo} onUploadAction={updateLogoAction} />

      <AdminOpportunitiesTable rows={rows} />
    </main>
  );
}
