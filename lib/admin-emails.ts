/**
 * Lista de correos autorizados como administradores (variable ADMIN_EMAILS, separados por comas).
 * Segunda barrera además de Supabase Auth: aunque alguien lograra crear una cuenta, no entraría al panel.
 * Sin dependencias de Node: se usa también en el middleware (Edge). Si no está definida, nadie entra.
 */
export function adminEmails(): string[] {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

export function isAllowedAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return adminEmails().includes(email.trim().toLowerCase());
}
