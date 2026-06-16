-- Migración para bases de datos ya creadas: añade la columna de fecha/hora.
-- Ejecútala una vez en Supabase → SQL Editor si creaste las tablas antes de
-- la función de calendario. Es segura: los partidos existentes quedan sin fecha.
alter table matches add column if not exists kickoff timestamptz;
