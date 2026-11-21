import type { CategorySlug } from "@/lib/categories";

const paths: Record<CategorySlug, React.ReactNode> = {
  becas: (
    <>
      <path d="M2 9l10-5 10 5-10 5L2 9z" />
      <path d="M6 11.5V16c0 1.5 2.7 3 6 3s6-1.5 6-3v-4.5" />
    </>
  ),
  empleos: (
    <>
      <rect x="3" y="7" width="18" height="13" rx="2" />
      <path d="M9 7V5a1 1 0 011-1h4a1 1 0 011 1v2" />
    </>
  ),
  cursos: (
    <>
      <path d="M4 5a1 1 0 011-1h6v16H5a1 1 0 01-1-1V5z" />
      <path d="M20 5a1 1 0 00-1-1h-6v16h6a1 1 0 001-1V5z" />
    </>
  ),
  convocatorias: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v10M9.5 9.5C9.5 8.5 10.6 8 12 8s2.5.6 2.5 1.6S13.4 11 12 11s-2.5.6-2.5 1.7S10.6 15 12 15s2.5-.5 2.5-1.5" />
    </>
  ),
};

export default function CategoryIcon({ slug, size = 22 }: { slug: CategorySlug; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[slug]}
    </svg>
  );
}
