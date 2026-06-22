-- ============================================================
--  Captación · Negocios locales
--  Esquema de base de datos para Supabase (Postgres)
--
--  Cómo usarlo:
--  1. supabase.com → tu proyecto → SQL Editor → New query
--  2. Pega TODO este archivo y pulsa "Run".
--
--  Crea las tablas, índices, un trigger de updated_at, las
--  políticas RLS (abiertas: ver nota de seguridad del README)
--  y activa Realtime para sincronizar el panel entre dispositivos.
-- ============================================================

-- Extensión para gen_random_uuid()
create extension if not exists "pgcrypto";

-- ------------------------------------------------------------
--  NEGOCIOS  (prospectos + clientes, todo el pipeline)
-- ------------------------------------------------------------
create table if not exists businesses (
  id             uuid primary key default gen_random_uuid(),
  name           text not null,
  sector         text,                 -- restaurante, peluquería, taller, etc.
  province       text,                 -- provincia de España
  city           text,
  address        text,
  phone          text,
  email          text,
  website        text,                 -- web actual del negocio (si tiene)
  has_website    boolean not null default false,
  instagram      text,
  contact_person text,                 -- persona de contacto
  status         text not null default 'nuevo',
                 -- nuevo | contactado | interesado | propuesta | cliente | descartado
  priority       text not null default 'media',     -- alta | media | baja
  source         text not null default 'prospeccion', -- prospeccion | web | referido
  owner          text,                 -- quién lo gestiona (p. ej. Guz / Luis)
  notes          text,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create index if not exists businesses_status_idx   on businesses (status);
create index if not exists businesses_province_idx on businesses (province);
create index if not exists businesses_owner_idx    on businesses (owner);

-- ------------------------------------------------------------
--  INTERACCIONES  (historial de seguimiento de cada negocio)
-- ------------------------------------------------------------
create table if not exists interactions (
  id          uuid primary key default gen_random_uuid(),
  business_id uuid not null references businesses(id) on delete cascade,
  kind        text not null default 'nota',  -- llamada | email | whatsapp | reunion | nota
  body        text,
  created_by  text,
  created_at  timestamptz not null default now()
);

create index if not exists interactions_business_idx on interactions (business_id);

-- ------------------------------------------------------------
--  TAREAS  (to-do list, opcionalmente ligada a un negocio)
-- ------------------------------------------------------------
create table if not exists tasks (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  business_id uuid references businesses(id) on delete set null,
  due_date    date,
  done        boolean not null default false,
  priority    text not null default 'media',  -- alta | media | baja
  assigned_to text,
  created_at  timestamptz not null default now()
);

create index if not exists tasks_done_idx on tasks (done);
create index if not exists tasks_due_idx  on tasks (due_date);

-- ------------------------------------------------------------
--  LEADS  (los que entran por el formulario de la web pública)
-- ------------------------------------------------------------
create table if not exists leads (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  business_name text,
  email         text,
  phone         text,
  sector        text,
  message       text,
  processed     boolean not null default false, -- ya convertido en negocio
  created_at    timestamptz not null default now()
);

-- ------------------------------------------------------------
--  TRIGGER: mantener businesses.updated_at al día
-- ------------------------------------------------------------
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists businesses_set_updated_at on businesses;
create trigger businesses_set_updated_at
  before update on businesses
  for each row execute function set_updated_at();

-- ------------------------------------------------------------
--  RLS (Row Level Security)
--  Políticas ABIERTAS a propósito: el acceso al panel se
--  protege con un PIN en la app, no con autenticación real.
--  La anon key es pública por diseño. Ver nota del README.
-- ------------------------------------------------------------
alter table businesses   enable row level security;
alter table interactions enable row level security;
alter table tasks        enable row level security;
alter table leads        enable row level security;

do $$
begin
  -- businesses
  if not exists (select 1 from pg_policies where tablename='businesses' and policyname='businesses_all') then
    create policy businesses_all on businesses for all using (true) with check (true);
  end if;
  -- interactions
  if not exists (select 1 from pg_policies where tablename='interactions' and policyname='interactions_all') then
    create policy interactions_all on interactions for all using (true) with check (true);
  end if;
  -- tasks
  if not exists (select 1 from pg_policies where tablename='tasks' and policyname='tasks_all') then
    create policy tasks_all on tasks for all using (true) with check (true);
  end if;
  -- leads: cualquiera (anon) puede INSERTAR desde la web pública...
  if not exists (select 1 from pg_policies where tablename='leads' and policyname='leads_insert') then
    create policy leads_insert on leads for insert with check (true);
  end if;
  -- ...y el panel puede leer/actualizar/borrar.
  if not exists (select 1 from pg_policies where tablename='leads' and policyname='leads_manage') then
    create policy leads_manage on leads for all using (true) with check (true);
  end if;
end $$;

-- ------------------------------------------------------------
--  REALTIME: sincroniza cambios entre dispositivos en vivo
-- ------------------------------------------------------------
do $$
begin
  alter publication supabase_realtime add table businesses;
exception when duplicate_object then null;
end $$;
do $$
begin
  alter publication supabase_realtime add table interactions;
exception when duplicate_object then null;
end $$;
do $$
begin
  alter publication supabase_realtime add table tasks;
exception when duplicate_object then null;
end $$;
do $$
begin
  alter publication supabase_realtime add table leads;
exception when duplicate_object then null;
end $$;
