-- Correção para erro:
-- "new row violates row-level security policy" ao substituir/enviar imagens.
--
-- Como aplicar:
-- 1. Abra o Supabase Dashboard do projeto.
-- 2. Vá em SQL Editor > New query.
-- 3. Cole este arquivo inteiro e clique em Run.
--
-- O painel administrativo usa:
-- - bucket: val-media
-- - pasta: uploads/
-- - tabela: public.media_library
--
-- Observação importante:
-- O upload com upsert no Supabase Storage precisa de INSERT, SELECT e UPDATE
-- em storage.objects. Sem SELECT, o Storage não consegue retornar a linha criada.

insert into storage.buckets (id, name, public)
values ('val-media', 'val-media', true)
on conflict (id) do update set public = true;

create table if not exists public.media_library (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  public_url text not null,
  storage_path text,
  mime_type text,
  alt_text text,
  focal_x integer default 50,
  focal_y integer default 50,
  fit text default 'cover',
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

alter table public.media_library enable row level security;

grant select, insert, update, delete on public.media_library to authenticated;
grant select on public.media_library to anon;

drop policy if exists "media_library public read" on public.media_library;
create policy "media_library public read"
on public.media_library
for select
to anon, authenticated
using (true);

drop policy if exists "media_library authenticated insert" on public.media_library;
create policy "media_library authenticated insert"
on public.media_library
for insert
to authenticated
with check (true);

drop policy if exists "media_library authenticated update" on public.media_library;
create policy "media_library authenticated update"
on public.media_library
for update
to authenticated
using (true)
with check (true);

drop policy if exists "media_library authenticated delete" on public.media_library;
create policy "media_library authenticated delete"
on public.media_library
for delete
to authenticated
using (true);

drop policy if exists "val-media public read" on storage.objects;
create policy "val-media public read"
on storage.objects
for select
to anon, authenticated
using (bucket_id = 'val-media');

drop policy if exists "val-media authenticated upload" on storage.objects;
create policy "val-media authenticated upload"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'val-media'
  and lower((storage.foldername(name))[1]) = 'uploads'
);

drop policy if exists "val-media authenticated replace" on storage.objects;
create policy "val-media authenticated replace"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'val-media'
  and lower((storage.foldername(name))[1]) = 'uploads'
)
with check (
  bucket_id = 'val-media'
  and lower((storage.foldername(name))[1]) = 'uploads'
);

drop policy if exists "val-media authenticated delete" on storage.objects;
create policy "val-media authenticated delete"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'val-media'
  and lower((storage.foldername(name))[1]) = 'uploads'
);
