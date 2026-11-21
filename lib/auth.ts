import "server-only";
import { cookies } from "next/headers";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import type { User } from "@supabase/supabase-js";
import { adminEmails, isAllowedAdminEmail } from "./admin-emails";

/**
 * Autenticación de administradores con Supabase Auth (correo + contraseña).
 * La sesión vive en cookies httpOnly gestionadas por @supabase/ssr.
 */

export function authConfigured(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

export function adminEmailsConfigured(): boolean {
  return adminEmails().length > 0;
}

/** Cliente de Supabase Auth ligado a las cookies de la petición (Server Components, acciones y route handlers). */
export function createAuthClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) {
    throw new Error("Faltan NEXT_PUBLIC_SUPABASE_URL y/o NEXT_PUBLIC_SUPABASE_ANON_KEY. Revisa .env.example.");
  }

  const cookieStore = cookies();
  return createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(list: { name: string; value: string; options: CookieOptions }[]) {
        try {
          list.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          // Desde un Server Component no se pueden escribir cookies; el middleware refresca la sesión.
        }
      },
    },
  });
}

/**
 * Usuario administrador de la sesión actual, o null.
 * Usa getUser(), que valida el token con el servidor de Supabase Auth (getSession() no lo hace).
 */
export async function getAdminUser(): Promise<User | null> {
  if (!authConfigured()) return null;
  const supabase = createAuthClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) return null;
  return isAllowedAdminEmail(data.user.email) ? data.user : null;
}

export async function isAdmin(): Promise<boolean> {
  return (await getAdminUser()) !== null;
}
