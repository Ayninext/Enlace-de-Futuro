import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = { title: "Oportunidad no encontrada", robots: { index: false } };

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-xl px-4 py-24 text-center">
        <h1 className="text-3xl font-bold">Oportunidad no encontrada</h1>
        <p className="mt-3 text-ink/70">Es posible que el enlace sea incorrecto o que la publicación haya sido retirada.</p>
        <Link href="/categorias" className="mt-8 inline-block rounded-xl bg-brand px-6 py-3 text-sm font-semibold text-white hover:bg-brand-dark">
          Explorar categorías
        </Link>
      </main>
      <Footer />
    </>
  );
}
