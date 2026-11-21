import { NextResponse, type NextRequest } from "next/server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { isAllowedAdminEmail } from "@/lib/admin-emails";

/**
 * Protege /admin/**: refresca la sesión de Supabase y redirige al login si no hay un administrador.
 * Es la primera barrera; cada página y acción del panel vuelve a comprobarlo en el servidor.
 */
export async function middleware(request: NextRequest) {
  const isLogin = request.nextUrl.pathname === "/admin/login";
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const redirectTo = (path: string, from?: NextResponse) => {
    const target = request.nextUrl.clone();
    target.pathname = path;
    target.search = "";
    const res = NextResponse.redirect(target, 303); // 303: un POST (p. ej. cerrar sesión) pasa a GET
    from?.cookies.getAll().forEach((c) => res.cookies.set(c)); // conserva cookies refrescadas o borradas
    return res;
  };

  if (!url || !anonKey) return isLogin ? NextResponse.next() : redirectTo("/admin/login");

  let response = NextResponse.next({ request });

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(list: { name: string; value: string; options: CookieOptions }[]) {
        list.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        list.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });

  const { data } = await supabase.auth.getUser();
  const allowed = isAllowedAdminEmail(data.user?.email);

  if (!allowed && !isLogin) return redirectTo("/admin/login", response);
  if (allowed && isLogin) return redirectTo("/admin", response);
  return response;
}

export const config = { matcher: ["/admin/:path*"] };
