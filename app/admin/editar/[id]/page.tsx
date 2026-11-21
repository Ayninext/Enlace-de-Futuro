import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { isActive } from "@/lib/opportunities";
import { getById } from "@/lib/store";
import OpportunityForm from "@/components/admin/OpportunityForm";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Editar oportunidad" };

export default async function EditOpportunityPage({ params }: { params: { id: string } }) {
  if (!(await isAdmin())) redirect("/admin/login");

  const opportunity = await getById(params.id);
  if (!opportunity) notFound();

  const active = isActive(opportunity);

  return (
    <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <nav aria-label="Ruta" className="mb-4 text-sm text-ink/60">
        <Link href="/admin" className="hover:text-brand">Panel</Link>
        <span className="mx-2">/</span>
        <span className="text-ink">Editar oportunidad</span>
      </nav>

      <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-bold">Editar oportunidad</h1>
        <Link href={`/oportunidades/${opportunity.id}`} className="text-sm font-semibold text-brand hover:text-brand-dark">
          Ver en el sitio
        </Link>
      </div>

      {!active && (
        <p role="status" className="mb-6 rounded-xl bg-accent-soft px-4 py-3 text-sm font-medium text-[#8A6508]">
          Esta convocatoria está cerrada. Cambia la fecha límite a una fecha futura para volver a publicarla como activa.
        </p>
      )}

      <OpportunityForm initial={opportunity} />
    </main>
  );
}
