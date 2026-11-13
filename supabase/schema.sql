-- =========================================================
--  Slack研修サイト 本番用スキーマ
--  ユーザーごとのワークスペースデータを 1 行（JSON）で保存する。
--  RLS により、本人のデータだけを読み書きできる。
-- =========================================================

create table if not exists public.user_states (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  data       jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.user_states enable row level security;

-- 未ログイン（anon）からは一切アクセスさせない
revoke all on public.user_states from anon;
grant select, insert, update, delete on public.user_states to authenticated;

drop policy if exists "own state: select" on public.user_states;
drop policy if exists "own state: insert" on public.user_states;
drop policy if exists "own state: update" on public.user_states;
drop policy if exists "own state: delete" on public.user_states;

create policy "own state: select" on public.user_states
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "own state: insert" on public.user_states
  for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "own state: update" on public.user_states
  for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "own state: delete" on public.user_states
  for delete to authenticated using ((select auth.uid()) = user_id);

-- 更新日時を自動で更新
create or replace function public.touch_updated_at() returns trigger
language plpgsql set search_path = '' as $$
begin new.updated_at := now(); return new; end $$;

drop trigger if exists user_states_touch on public.user_states;
create trigger user_states_touch before update on public.user_states
  for each row execute function public.touch_updated_at();
