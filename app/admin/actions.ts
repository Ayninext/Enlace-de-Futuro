"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { adminEmailsConfigured, authConfigured, createAuthClient, isAdmin } from "@/lib/auth";
import { isAllowedAdminEmail } from "@/lib/admin-emails";
import { addOpportunity, getById, removeOpportunity, updateOpportunity } from "@/lib/store";
import { parseOpportunityForm } from "@/lib/validation";

export type ActionResult = { error: string } | undefined;
export type LoginResult = { error: string } | { success: true };

const isValidId = (id: string) => /^\d+$/.test(id);

export async function login(formData: FormData): Promise<LoginResult> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!authConfigured()) return { error: "Falta configurar Supabase Auth en el servidor (ver .env.example)." };
  if (!adminEmailsConfigured()) return { error: "Falta definir ADMIN_EMAILS en el servidor (ver .env.example)." };
  if (!email || !password) return { error: "Ingresa tu correo y tu contraseña." };

  const supabase = createAuthClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error || !data.user) return { error: "Correo o contraseña incorrectos." };

  if (!isAllowedAdminEmail(data.user.email)) {
    await supabase.auth.signOut();
    return { error: "Esta cuenta no tiene acceso al panel de administración." };
  }
  return { success: true }; // el formulario hace una navegación completa a /admin
}

export async function createOpportunity(formData: FormData): Promise<ActionResult> {
  if (!(await isAdmin())) return { error: "Tu sesión expiró. Vuelve a iniciar sesión." };

  const parsed = parseOpportunityForm(formData);
  if ("error" in parsed) return { error: parsed.error };

  const created = await addOpportunity(parsed.data);

  revalidatePath("/", "layout");
  redirect(`/admin?publicada=${created.id}`);
}

export async function editOpportunity(id: string, formData: FormData): Promise<ActionResult> {
  if (!(await isAdmin())) return { error: "Tu sesión expiró. Vuelve a iniciar sesión." };
  if (!isValidId(id)) return { error: "Identificador de oportunidad inválido." };

  const current = await getById(id);
  if (!current) return { error: "Esta oportunidad ya no existe (¿fue eliminada?)." };

  const parsed = parseOpportunityForm(formData, { currentDeadline: current.deadline });
  if ("error" in parsed) return { error: parsed.error };

  const updated = await updateOpportunity(id, parsed.data);
  if (!updated) return { error: "No se pudo guardar: la oportunidad ya no existe." };

  revalidatePath("/", "layout");
  redirect(`/admin?actualizada=${updated.id}`);
}

export async function deleteOpportunity(formData: FormData) {
  if (!(await isAdmin())) redirect("/admin/login");
  const id = String(formData.get("id") ?? "");
  if (isValidId(id)) await removeOpportunity(id);
  revalidatePath("/", "layout");
  redirect("/admin?eliminada=1");
}
