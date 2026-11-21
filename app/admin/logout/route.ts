import { NextResponse } from "next/server";
import { authConfigured, createAuthClient } from "@/lib/auth";

// POST /admin/logout — cierra la sesión de Supabase y vuelve al login con una navegación completa.
export async function POST(request: Request) {
  if (authConfigured()) await createAuthClient().auth.signOut();
  return NextResponse.redirect(new URL("/admin/login", request.url), 303);
}
