import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { getAll } from "@/lib/store";
import { isActive } from "@/lib/opportunities";
import type { AdminRow } from "@/lib/admin-filter";
import AdminOpportunitiesTable from "@/components/admin/AdminOpportunitiesTable";

export const dynamic = "force-dynamic";

export default async function AdminPage({
  searchParams,
}: {
  searchParams: { publicada?: string; actualizada?: string; eliminada?: string };
}) {
  if (!(await isAdmin())) redirect("/admin/login");

  const all = await getAll();
  const rows: AdminRow[] = [...all]
    .sort((a, b) => (b.createdAt ?? "").localeCompare(a.createdAt ?? "") || Number(b.id) - Number(a.id))
    .map((o) => ({ ...o, active: isActive(o) })); // el estado se calcula aquí, en el servidor
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

      <AdminOpportunitiesTable rows={rows} />
    </main>
  );
}
