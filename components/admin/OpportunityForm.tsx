"use client";

import { useState, useTransition } from "react";
import { createOpportunity, editOpportunity } from "@/app/admin/actions";
import { CATEGORY_VALUES, type Opportunity } from "@/lib/opportunities";

const input =
  "w-full rounded-xl border border-line bg-surface px-4 py-3 text-sm text-ink placeholder:text-ink/40 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20";

function Field({
  label,
  htmlFor,
  hint,
  children,
}: {
  label: string;
  htmlFor: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-medium">{label}</label>
      {children}
      {hint && <p className="mt-1.5 text-xs text-ink/50">{hint}</p>}
    </div>
  );
}

/** Formulario reutilizable: sin `initial` crea una oportunidad; con `initial` edita la existente. */
export default function OpportunityForm({ initial }: { initial?: Opportunity }) {
  const editing = Boolean(initial);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const today = new Date().toISOString().slice(0, 10);
  // Al editar una convocatoria ya cerrada se permite conservar su fecha original.
  const minDate = initial && initial.deadline < today ? initial.deadline : today;

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setError(null);
    startTransition(async () => {
      const res = initial ? await editOpportunity(initial.id, fd) : await createOpportunity(fd);
      if (res?.error) {
        setError(res.error);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    });
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6 rounded-2xl border border-line bg-surface p-6 sm:p-8">
      {error && (
        <p role="alert" className="rounded-xl bg-accent-soft px-4 py-3 text-sm font-medium text-[#8A6508]">
          {error}
        </p>
      )}

      <Field label="Título" htmlFor="title">
        <input id="title" name="title" required maxLength={120} defaultValue={initial?.title} className={input} placeholder="Ej. Beca de Posgrado en el Extranjero" />
      </Field>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Organización" htmlFor="organization">
          <input id="organization" name="organization" required maxLength={100} defaultValue={initial?.organization} className={input} placeholder="Ej. Fundación Educativa Global" />
        </Field>
        <Field label="Categoría" htmlFor="category">
          <select id="category" name="category" required defaultValue={initial?.category ?? ""} className={input}>
            <option value="" disabled>Selecciona una categoría</option>
            {CATEGORY_VALUES.map((c) => (
              <option key={c} value={c}>{c === "Convocatorias" ? "Fondos y Convocatorias" : c}</option>
            ))}
          </select>
        </Field>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Ubicación / país" htmlFor="location" hint="Se usa en el filtro de ubicación. Ej. Lima, Perú · Nacional · 100% en línea">
          <input id="location" name="location" required maxLength={80} defaultValue={initial?.location} className={input} />
        </Field>
        <Field label="Fecha límite" htmlFor="deadline">
          <input id="deadline" name="deadline" type="date" required min={minDate} defaultValue={initial?.deadline} className={input} />
        </Field>
      </div>

      <Field label="Resumen" htmlFor="description" hint="Aparece en las tarjetas. Máx. 200 caracteres.">
        <textarea id="description" name="description" required maxLength={200} rows={2} defaultValue={initial?.description} className={input} />
      </Field>

      <Field label="Descripción detallada (opcional)" htmlFor="details" hint="Aparece en la página de detalle.">
        <textarea id="details" name="details" maxLength={3000} rows={5} defaultValue={initial?.details} className={input} />
      </Field>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Requisitos (opcional)" htmlFor="requirements" hint="Uno por línea.">
          <textarea id="requirements" name="requirements" rows={5} defaultValue={initial?.requirements?.join("\n")} className={input} />
        </Field>
        <Field label="Beneficios (opcional)" htmlFor="benefits" hint="Uno por línea.">
          <textarea id="benefits" name="benefits" rows={5} defaultValue={initial?.benefits?.join("\n")} className={input} />
        </Field>
      </div>

      <Field label="Enlace externo para postular" htmlFor="href" hint="Debe empezar con https://">
        <input id="href" name="href" type="url" required maxLength={500} defaultValue={initial?.href} className={input} placeholder="https://" />
      </Field>

      <div className="flex items-center justify-end gap-3 border-t border-line pt-6">
        <a href="/admin" className="text-sm font-semibold text-ink/60 hover:text-ink">Cancelar</a>
        <button
          type="submit"
          disabled={pending}
          className="rounded-xl bg-brand px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-dark disabled:opacity-60"
        >
          {pending ? (editing ? "Guardando…" : "Publicando…") : editing ? "Guardar cambios" : "Publicar oportunidad"}
        </button>
      </div>
    </form>
  );
}
