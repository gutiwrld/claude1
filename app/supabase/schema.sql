-- Esquema para la app de avisos de alergias (Wizard of Oz).
-- Pega este archivo completo en Supabase → SQL Editor → Run.

create extension if not exists pgcrypto;

-- Restaurantes adheridos.
create table if not exists locales (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  nombre text not null,
  barrio text,
  direccion text,
  pin_sala text not null,
  activo boolean not null default true,
  created_at timestamptz not null default now()
);

-- Avisos de presencia. Sin nombre ni identificador del usuario a propósito
-- (minimización RGPD): solo mesa + alérgenos + gravedad + flags.
create table if not exists avisos (
  id uuid primary key default gen_random_uuid(),
  local_slug text not null references locales(slug) on delete cascade,
  mesa text not null,
  alergenos text[] not null,
  sin_trazas boolean not null default false,
  gravedad text not null check (gravedad in ('intolerancia', 'alergia', 'anafilaxia')),
  elaboracion_separada boolean not null default false,
  estado text not null default 'enviado' check (estado in ('enviado', 'confirmado', 'expirado')),
  -- Pedido que el cliente monta desde la carta: [{dishId, nombre, precio, sin:[alérgenos]}]
  seleccion jsonb not null default '[]'::jsonb,
  enviado_at timestamptz not null default now(),
  confirmado_at timestamptz
);

create index if not exists avisos_local_idx on avisos (local_slug, enviado_at desc);

-- Valoraciones de la comunidad. Cada una responde a: ¿el restaurante preparó
-- el plato de forma segura (elaboración separada, respetando los alérgenos)?
-- Van ligadas a un aviso real (una por visita) como barrera anti-trampa: no
-- se puede valorar un sitio donde no se ha comido. Sin datos personales.
create table if not exists valoraciones (
  id uuid primary key default gen_random_uuid(),
  local_slug text not null references locales(slug) on delete cascade,
  aviso_id uuid unique references avisos(id) on delete set null,
  cumplio boolean not null,
  comentario text,
  created_at timestamptz not null default now()
);

create index if not exists valoraciones_local_idx on valoraciones (local_slug, created_at desc);

-- RLS abiertas a propósito para el piloto Wizard of Oz (igual que un
-- formulario público): el panel de sala se protege con PIN a nivel de
-- aplicación. Antes de escalar: auth real por local y políticas estrictas.
alter table locales enable row level security;
alter table avisos enable row level security;
alter table valoraciones enable row level security;

create policy "locales lectura publica" on locales for select using (true);
create policy "avisos abiertos piloto" on avisos for select using (true);
create policy "avisos insert piloto" on avisos for insert with check (true);
create policy "avisos update piloto" on avisos for update using (true);
create policy "valoraciones lectura publica" on valoraciones for select using (true);
create policy "valoraciones insert piloto" on valoraciones for insert with check (true);

-- Realtime para que el usuario vea la confirmación al instante.
alter publication supabase_realtime add table avisos;

-- Locales de ejemplo para el piloto (cambia nombres y PINs).
insert into locales (slug, nombre, barrio, direccion, pin_sala) values
  ('la-nonna', 'Trattoria La Nonna', 'Chamberí', 'C/ Trafalgar 12', '4271'),
  ('casa-vera', 'Casa Vera', 'Retiro', 'C/ Ibiza 40', '8035'),
  ('alba-brunch', 'Alba Brunch', 'Malasaña', 'C/ del Pez 21', '1968')
on conflict (slug) do nothing;
