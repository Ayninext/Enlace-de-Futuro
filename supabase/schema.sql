-- Enlace de Futuro · esquema de base de datos (Supabase / PostgreSQL)
-- Ejecutar en: Supabase Dashboard → SQL Editor → New query → Run

create table if not exists public.opportunities (
  id            bigint generated always as identity primary key,
  category      text        not null check (category in ('Becas', 'Empleos', 'Cursos', 'Convocatorias')),
  title         text        not null check (char_length(title) between 1 and 120),
  organization  text        not null check (char_length(organization) between 1 and 100),
  location      text        not null check (char_length(location) between 1 and 80),
  deadline      date        not null,
  description   text        not null check (char_length(description) between 1 and 200),
  details       text                 check (details is null or char_length(details) <= 3000),
  requirements  text[]      not null default '{}',
  benefits      text[]      not null default '{}',
  href          text        not null check (char_length(href) <= 500),
  created_at    timestamptz not null default now()
);

create index if not exists opportunities_deadline_idx
  on public.opportunities (deadline);
create index if not exists opportunities_category_deadline_idx
  on public.opportunities (category, deadline);

-- Seguridad: RLS activado y SIN políticas => la API pública (clave anon) no puede leer ni escribir.
-- La aplicación accede solo desde el servidor con la clave service_role, que ignora RLS.
alter table public.opportunities enable row level security;
