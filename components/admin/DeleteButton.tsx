"use client";

export default function DeleteButton({ title }: { title: string }) {
  return (
    <button
      type="submit"
      onClick={(e) => {
        if (!confirm(`¿Eliminar "${title}"? Esta acción no se puede deshacer.`)) e.preventDefault();
      }}
      className="text-sm font-semibold text-ink/60 hover:text-ink"
    >
      Eliminar
    </button>
  );
}
