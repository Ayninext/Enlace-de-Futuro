"use client";

import { useState, useTransition } from "react";
import { login } from "@/app/admin/actions";

const input =
  "w-full rounded-xl border border-line bg-surface px-4 py-3 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20";

export default function LoginForm() {
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setError(null);
    startTransition(async () => {
      const res = await login(fd);
      if ("error" in res) {
        setError(res.error);
      } else {
        window.location.assign("/admin"); // navegación completa: la sesión recién creada se aplica a todo el panel
      }
    });
  }

  return (
    <form onSubmit={onSubmit} className="mt-6 space-y-4">
      <div>
        <label htmlFor="email" className="mb-1.5 block text-sm font-medium">Correo electrónico</label>
        <input id="email" name="email" type="email" required autoComplete="username" className={input} />
      </div>
      <div>
        <label htmlFor="password" className="mb-1.5 block text-sm font-medium">Contraseña</label>
        <input id="password" name="password" type="password" required autoComplete="current-password" className={input} />
      </div>
      {error && (
        <p role="alert" className="rounded-xl bg-accent-soft px-4 py-3 text-sm font-medium text-[#8A6508]">
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-xl bg-brand px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-dark disabled:opacity-60"
      >
        {pending ? "Ingresando…" : "Ingresar"}
      </button>
    </form>
  );
}
