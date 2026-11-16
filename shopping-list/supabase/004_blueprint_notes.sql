-- =====================================================================
-- 004: notes on base-list items (e.g. "תמיד חשוב גיבוי!").
-- Run after 003. Safe to re-run.
-- =====================================================================
alter table public.blueprint_items add column if not exists note text;
