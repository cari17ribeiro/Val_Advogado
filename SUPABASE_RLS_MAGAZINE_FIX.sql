-- Correção para quando o painel diz que salvou, mas a revista pública
-- ou o editor não carregam as alterações salvas.
--
-- Como aplicar:
-- 1. Abra o Supabase Dashboard do projeto.
-- 2. Vá em SQL Editor > New query.
-- 3. Cole este arquivo inteiro e clique em Run.
--
-- Importante:
-- UPDATE no Supabase/Postgres com RLS também precisa de SELECT.
-- A revista pública também precisa de SELECT para o papel anon.

alter table public.magazine_pages enable row level security;

grant select on public.magazine_pages to anon;
grant select, insert, update, delete on public.magazine_pages to authenticated;

drop policy if exists "magazine_pages public read published" on public.magazine_pages;
create policy "magazine_pages public read published"
on public.magazine_pages
for select
to anon, authenticated
using (is_published = true);

drop policy if exists "magazine_pages authenticated read all" on public.magazine_pages;
create policy "magazine_pages authenticated read all"
on public.magazine_pages
for select
to authenticated
using (true);

drop policy if exists "magazine_pages authenticated insert" on public.magazine_pages;
create policy "magazine_pages authenticated insert"
on public.magazine_pages
for insert
to authenticated
with check (true);

drop policy if exists "magazine_pages authenticated update" on public.magazine_pages;
create policy "magazine_pages authenticated update"
on public.magazine_pages
for update
to authenticated
using (true)
with check (true);

drop policy if exists "magazine_pages authenticated delete" on public.magazine_pages;
create policy "magazine_pages authenticated delete"
on public.magazine_pages
for delete
to authenticated
using (true);
