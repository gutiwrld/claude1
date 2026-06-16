-- Porra Mundial 2026 — esquema de Supabase
-- Ejecuta TODO este archivo en: Supabase → SQL Editor → New query → Run.

create extension if not exists "pgcrypto";

create table pools (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  admin_pin text not null,
  exact_pts int not null default 3,
  outcome_pts int not null default 1,
  created_at timestamptz default now()
);

create table players (
  id uuid primary key default gen_random_uuid(),
  pool_id uuid not null references pools(id) on delete cascade,
  name text not null,
  created_at timestamptz default now(),
  unique (pool_id, name)
);

create table matches (
  id uuid primary key default gen_random_uuid(),
  pool_id uuid not null references pools(id) on delete cascade,
  jornada text not null,            -- 'J1','J2','J3' o 'Octavos','Cuartos','Semifinal','Final', etc.
  grp text,                          -- 'A'..'L' o null en eliminatorias
  knockout boolean not null default false,
  home_name text not null,
  home_flag text not null,
  away_name text not null,
  away_flag text not null,
  locked boolean not null default false,
  result_home int,                   -- null mientras no haya resultado
  result_away int,
  sort_order int not null default 0,
  created_at timestamptz default now()
);

create table predictions (
  id uuid primary key default gen_random_uuid(),
  pool_id uuid not null references pools(id) on delete cascade,
  player_id uuid not null references players(id) on delete cascade,
  match_id uuid not null references matches(id) on delete cascade,
  home int not null,
  away int not null,
  updated_at timestamptz default now(),
  unique (player_id, match_id)
);

alter table pools enable row level security;
alter table players enable row level security;
alter table matches enable row level security;
alter table predictions enable row level security;

-- App de amigos: acceso abierto con la anon key. Políticas permisivas explícitas.
create policy "open pools"       on pools       for all using (true) with check (true);
create policy "open players"     on players     for all using (true) with check (true);
create policy "open matches"     on matches     for all using (true) with check (true);
create policy "open predictions" on predictions for all using (true) with check (true);

-- Habilita Realtime para que los cambios se propaguen entre dispositivos.
-- (Equivalente a Database → Replication → activar matches y predictions.)
alter publication supabase_realtime add table matches, predictions;
