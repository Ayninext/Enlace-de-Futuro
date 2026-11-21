import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import OpportunityForm from "@/components/admin/OpportunityForm";

export default async function NewOpportunityPage() {
  if (!(await isAdmin())) redirect("/admin/login");

  return (
    <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <nav aria-label="Ruta" className="mb-4 text-sm text-ink/60">
        <Link href="/admin" className="hover:text-brand">Panel</Link>
        <span className="mx-2">/</span>
        <span className="text-ink">Nueva oportunidad</span>
      </nav>
      <h1 className="mb-8 text-3xl font-bold">Nueva oportunidad</h1>
      <OpportunityForm />
    </main>
  );
}
