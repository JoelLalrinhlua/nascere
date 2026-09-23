-- Run once in the Supabase SQL Editor. No credentials belong in this file.
begin;

create table public.studio_editors (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);
alter table public.studio_editors enable row level security;
revoke all on public.studio_editors from anon, authenticated;

create function public.is_studio_editor()
returns boolean language sql stable security definer set search_path = ''
as $$ select exists (select 1 from public.studio_editors where user_id = (select auth.uid())); $$;
revoke all on function public.is_studio_editor() from public;
grant execute on function public.is_studio_editor() to anon, authenticated;

create table public.studio_entries (
  id uuid primary key default gen_random_uuid(),
  kind text not null check (kind in ('post','toy','memory')),
  title text not null check (length(trim(title)) between 1 and 160),
  slug text not null check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$' and length(slug) <= 100),
  category text not null default '' check (length(category) <= 100),
  summary text not null default '' check (length(summary) <= 1200),
  body text not null default '' check (length(body) <= 40000),
  image_path text not null default '' check (
    image_path = '' or image_path ~ '^/assets/[a-zA-Z0-9_-]+\.(jpg|jpeg|png|webp)$'
    or image_path ~ '^[a-f0-9-]{36}/[a-f0-9-]{36}\.webp$'
  ),
  image_alt text not null default '' check (length(image_alt) <= 500),
  status text not null default 'draft' check (status in ('draft','published','archived')),
  sort_order integer not null default 0 check (sort_order between 0 and 9999),
  details jsonb not null default '{}'::jsonb check (jsonb_typeof(details) = 'object' and octet_length(details::text) <= 10000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(kind, slug),
  check (image_path = '' or length(trim(image_alt)) > 0),
  check (status <> 'published' or kind <> 'memory' or image_path <> ''),
  check (status <> 'published' or kind = 'memory' or length(trim(summary)) > 0),
  check (not(details ? 'benefits') or jsonb_typeof(details->'benefits') = 'array'),
  check (not(details ? 'price') or details->>'price' = '' or details->>'price' ~ '^[0-9]{1,8}(\.[0-9]{1,2})?$')
);
create index studio_entries_public on public.studio_entries(status, kind, sort_order);
create index studio_entries_image on public.studio_entries(image_path) where status = 'published';
alter table public.studio_entries enable row level security;
revoke all on public.studio_entries from anon, authenticated;
grant select on public.studio_entries to anon;
grant select, insert, update on public.studio_entries to authenticated;

create policy "Visitors read published content" on public.studio_entries for select to anon, authenticated
using (status = 'published' or (select public.is_studio_editor()));
create policy "Editors add content" on public.studio_entries for insert to authenticated
with check ((select public.is_studio_editor()));
create policy "Editors update content" on public.studio_entries for update to authenticated
using ((select public.is_studio_editor())) with check ((select public.is_studio_editor()));

create function public.stamp_studio_entry()
returns trigger language plpgsql set search_path = '' as $$
begin
  if TG_OP = 'UPDATE' then
    new.id = old.id;
    new.kind = old.kind;
    new.created_at = old.created_at;
  end if;
  new.updated_at = clock_timestamp();
  return new;
end; $$;
create trigger studio_entry_timestamp before insert or update on public.studio_entries
for each row execute function public.stamp_studio_entry();

-- Private bucket: drafts cannot be viewed by the public even with a known path.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('studio-media', 'studio-media', false, 8388608, array['image/webp']);

create policy "Published studio photos are readable" on storage.objects for select to anon, authenticated
using (bucket_id = 'studio-media' and (
  (select public.is_studio_editor()) or exists (
    select 1 from public.studio_entries e where e.image_path = name and e.status = 'published'
  )
));
create policy "Editors upload studio photos" on storage.objects for insert to authenticated
with check (bucket_id = 'studio-media' and (select public.is_studio_editor())
  and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy "Editors remove unused studio photos" on storage.objects for delete to authenticated
using (bucket_id = 'studio-media' and (select public.is_studio_editor())
  and not exists (select 1 from public.studio_entries e where e.image_path = name));

commit;
