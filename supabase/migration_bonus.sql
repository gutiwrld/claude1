-- Puntos manuales / de arrastre por jugador (se suman a los puntos calculados).
-- Útil para registrar puntos de jornadas ya jugadas antes de usar la app.
-- Ejecútalo una vez en Supabase → SQL Editor.
alter table players add column if not exists bonus_pts int not null default 0;
