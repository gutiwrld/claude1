-- Mi Carrera — Organizador Personal
-- Ejecuta TODO este bloque en: Supabase → SQL Editor → New query → Run

-- Proyectos
create table if not exists organizer_projects (
  id          uuid        primary key default gen_random_uuid(),
  user_id     uuid        not null references auth.users(id) on delete cascade,
  name        text        not null,
  color       text        not null default '#7c3aed',
  emoji       text        not null default '🚀',
  description text        not null default '',
  created_at  timestamptz not null default now()
);

-- Tareas (OBVs, LPs, Bookpoints)
create table if not exists organizer_tasks (
  id         uuid        primary key default gen_random_uuid(),
  user_id    uuid        not null references auth.users(id) on delete cascade,
  category   text        not null check (category in ('obvs', 'lps', 'bookpoints')),
  text       text        not null,
  done       boolean     not null default false,
  done_at    timestamptz,
  project_id uuid        references organizer_projects(id) on delete set null,
  -- OBV extended fields
  tipo       text,
  persona    text,
  fecha      date,
  notas      text,
  created_at timestamptz not null default now()
);

-- Índices para rendimiento
create index if not exists organizer_tasks_user_cat on organizer_tasks (user_id, category);
create index if not exists organizer_projects_user  on organizer_projects (user_id);

-- Row Level Security — cada usuario solo ve sus propios datos
alter table organizer_projects enable row level security;
alter table organizer_tasks     enable row level security;

create policy "own projects" on organizer_projects
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "own tasks" on organizer_tasks
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
