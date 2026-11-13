-- =========================================================
--  共有ワークスペース用スキーマ（全員で同じチャンネル・メッセージを使う）
--  user_states（schema.sql）は個人の設定・既読位置・下書きなどに引き続き使う
-- =========================================================

-- プロフィール（全員が閲覧可、本人のみ更新）
create table if not exists public.profiles (
  id         uuid primary key references auth.users (id) on delete cascade,
  data       jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- チャンネル・DM
create table if not exists public.channels (
  id         text primary key,
  type       text not null check (type in ('channel', 'dm')),
  name       text not null default '',
  topic      text not null default '',
  private    boolean not null default false,
  canvas     jsonb not null default '{}'::jsonb,
  created_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.channel_members (
  channel_id text not null references public.channels (id) on delete cascade,
  user_id    uuid not null references auth.users (id) on delete cascade,
  primary key (channel_id, user_id)
);

-- メッセージ（スレッド返信は parent_id 付き）
create table if not exists public.messages (
  id         text primary key,
  channel_id text not null references public.channels (id) on delete cascade,
  parent_id  text,
  user_id    uuid not null references auth.users (id) on delete cascade,
  ts         bigint not null,
  html       text not null default '',
  files      jsonb not null default '[]'::jsonb,
  extra      jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index if not exists messages_channel_idx on public.messages (channel_id, ts);
create index if not exists messages_parent_idx on public.messages (parent_id);

create table if not exists public.reactions (
  message_id text not null references public.messages (id) on delete cascade,
  user_id    uuid not null references auth.users (id) on delete cascade,
  emoji      text not null,
  channel_id text not null references public.channels (id) on delete cascade,
  primary key (message_id, user_id, emoji)
);

-- ---------- 権限チェック用の関数（RLS の再帰を避けるため security definer） ----------
create or replace function public.is_channel_member(cid text) returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.channel_members m where m.channel_id = cid and m.user_id = (select auth.uid()));
$$;
create or replace function public.can_read_channel(cid text) returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.channels c
    where c.id = cid
      and ((c.type = 'channel' and not c.private)
           or c.created_by = (select auth.uid())
           or exists (select 1 from public.channel_members m where m.channel_id = cid and m.user_id = (select auth.uid())))
  );
$$;
create or replace function public.can_manage_members(cid text) returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.channels c
    where c.id = cid
      and (c.created_by = (select auth.uid())
           or exists (select 1 from public.channel_members m where m.channel_id = cid and m.user_id = (select auth.uid())))
  );
$$;
revoke all on function public.is_channel_member(text), public.can_read_channel(text), public.can_manage_members(text) from public, anon;
grant execute on function public.is_channel_member(text), public.can_read_channel(text), public.can_manage_members(text) to authenticated;

-- ---------- RLS ----------
alter table public.profiles        enable row level security;
alter table public.channels        enable row level security;
alter table public.channel_members enable row level security;
alter table public.messages        enable row level security;
alter table public.reactions       enable row level security;

revoke all on public.profiles, public.channels, public.channel_members, public.messages, public.reactions from anon;
grant select, insert, update, delete on public.profiles, public.channels, public.channel_members, public.messages, public.reactions to authenticated;

do $$ declare t text; p record; begin
  foreach t in array array['profiles','channels','channel_members','messages','reactions'] loop
    for p in select policyname from pg_policies where schemaname = 'public' and tablename = t loop
      execute format('drop policy %I on public.%I', p.policyname, t);
    end loop;
  end loop;
end $$;

create policy "profiles: read"   on public.profiles for select to authenticated using (true);
create policy "profiles: insert" on public.profiles for insert to authenticated with check (id = (select auth.uid()));
create policy "profiles: update" on public.profiles for update to authenticated using (id = (select auth.uid())) with check (id = (select auth.uid()));

-- 行そのものの値で判定する（新規作成時、まだ存在しない行もチェックされるため）
create policy "channels: read"   on public.channels for select to authenticated
  using ((type = 'channel' and not private) or created_by = (select auth.uid()) or public.is_channel_member(id));
create policy "channels: insert" on public.channels for insert to authenticated with check (created_by = (select auth.uid()));
create policy "channels: update" on public.channels for update to authenticated using (public.can_read_channel(id)) with check (public.can_read_channel(id));
create policy "channels: delete" on public.channels for delete to authenticated using (created_by = (select auth.uid()));

create policy "members: read"   on public.channel_members for select to authenticated using (public.can_read_channel(channel_id));
create policy "members: insert" on public.channel_members for insert to authenticated
  with check (public.can_manage_members(channel_id) or (user_id = (select auth.uid()) and public.can_read_channel(channel_id)));
create policy "members: delete" on public.channel_members for delete to authenticated
  using (user_id = (select auth.uid()) or public.is_channel_member(channel_id));

create policy "messages: read"   on public.messages for select to authenticated using (public.can_read_channel(channel_id));
create policy "messages: insert" on public.messages for insert to authenticated with check (user_id = (select auth.uid()) and public.can_read_channel(channel_id));
create policy "messages: update" on public.messages for update to authenticated using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create policy "messages: delete" on public.messages for delete to authenticated using (user_id = (select auth.uid()));

create policy "reactions: read"   on public.reactions for select to authenticated using (public.can_read_channel(channel_id));
create policy "reactions: insert" on public.reactions for insert to authenticated with check (user_id = (select auth.uid()) and public.can_read_channel(channel_id));
create policy "reactions: delete" on public.reactions for delete to authenticated using (user_id = (select auth.uid()));

-- ---------- 最初から全員が使える公開チャンネル ----------
insert into public.channels (id, type, name, topic) values
  ('c1', 'channel', '全体', '全体へのお知らせ用チャンネルです'),
  ('c2', 'channel', '雑談', '')
on conflict (id) do nothing;

-- ---------- リアルタイム配信 ----------
do $$ declare t text; begin
  foreach t in array array['profiles','channels','channel_members','messages','reactions'] loop
    if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = t) then
      execute format('alter publication supabase_realtime add table public.%I', t);
    end if;
  end loop;
end $$;
