"use client";

import { useState, useTransition } from "react";

interface Props {
  currentLogoUrl: string;
  onUploadAction: (formData: FormData) => Promise<{ ok: boolean; message: string; url?: string }>;
}

export default function AdminLogoUploader({ currentLogoUrl, onUploadAction }: Props) {
  const [logoUrl, setLogoUrl] = useState(currentLogoUrl);
  const [status, setStatus] = useState<{ type: "ok" | "error"; text: string } | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    setStatus(null);

    startTransition(async () => {
      const res = await onUploadAction(formData);
      if (res.ok) {
        if (res.url) setLogoUrl(res.url);
        setStatus({ type: "ok", text: res.message });
      } else {
        setStatus({ type: "error", text: res.message });
      }
    });
  }

  return (
    <section className="mt-8 rounded-2xl border border-line bg-surface p-6">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-line bg-surface-muted p-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={logoUrl}
              alt="Logo actual de Enlace de Futuro"
              className="h-full w-full object-contain"
            />
          </div>
          <div>
            <h2 className="text-lg font-bold text-ink">Logo de la plataforma</h2>
            <p className="mt-0.5 text-sm text-ink/60">
              Sube una imagen (PNG, JPG o WEBP) para actualizar el logo de la portada.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <input
            type="file"
            name="logo"
            accept="image/png,image/jpeg,image/webp,image/svg+xml"
            required
            className="block w-full text-xs text-ink/75 file:mr-3 file:rounded-xl file:border file:border-line file:bg-surface-muted file:px-3.5 file:py-2 file:text-xs file:font-semibold file:text-ink hover:file:border-brand sm:w-auto"
          />
          <button
            type="submit"
            disabled={isPending}
            className="rounded-xl bg-brand px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-brand-dark disabled:opacity-50"
          >
            {isPending ? "Subiendo..." : "Actualizar logo"}
          </button>
        </form>
      </div>

      {status && (
        <p
          role="status"
          className={`mt-4 rounded-xl px-4 py-2.5 text-xs font-medium ${
            status.type === "ok"
              ? "border border-line bg-surface-muted text-ink"
              : "border border-red-300 bg-red-50 text-red-700"
          }`}
        >
          {status.text}
        </p>
      )}
    </section>
  );
}
