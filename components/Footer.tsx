export default function Footer() {
  return (
    <footer className="border-t border-line bg-surface-muted">
      <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-ink/60 sm:px-6">
        © {new Date().getFullYear()} Enlace de Futuro. Todos los derechos reservados.
      </div>
    </footer>
  );
}
