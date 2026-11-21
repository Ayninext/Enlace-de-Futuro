import { redirect } from "next/navigation";
import { adminEmailsConfigured, authConfigured, isAdmin } from "@/lib/auth";
import LoginForm from "@/components/admin/LoginForm";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  if (await isAdmin()) redirect("/admin");

  const missing = !authConfigured() ? "Supabase Auth" : !adminEmailsConfigured() ? "ADMIN_EMAILS" : null;

  return (
    <main className="mx-auto max-w-md px-4 py-20">
      <div className="rounded-2xl border border-line bg-surface p-8">
        <h1 className="text-2xl font-bold">Acceso de administrador</h1>
        <p className="mt-2 text-sm text-ink/70">Inicia sesión con tu cuenta para gestionar las oportunidades.</p>
        {missing && (
          <p role="status" className="mt-4 rounded-xl bg-accent-soft px-4 py-3 text-sm font-medium text-[#8A6508]">
            Configuración pendiente en el servidor: {missing}. Revisa <code>.env.example</code> y <code>SUPABASE_SETUP.md</code>.
          </p>
        )}
        <LoginForm />
      </div>
    </main>
  );
}
