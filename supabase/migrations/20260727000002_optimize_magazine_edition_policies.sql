-- Consolida as policies de leitura para evitar avaliações duplicadas.

drop policy if exists "admin manage editions" on public.magazine_editions;
drop policy if exists "authenticated read online edition" on public.magazine_editions;
drop policy if exists "authenticated read editions" on public.magazine_editions;

create policy "authenticated read editions"
on public.magazine_editions
for select
to authenticated
using (
  status = 'published'
  or (select private.is_admin())
);

drop policy if exists "admin insert editions" on public.magazine_editions;
create policy "admin insert editions"
on public.magazine_editions
for insert
to authenticated
with check ((select private.is_admin()));

drop policy if exists "admin update editions" on public.magazine_editions;
create policy "admin update editions"
on public.magazine_editions
for update
to authenticated
using ((select private.is_admin()))
with check ((select private.is_admin()));

drop policy if exists "admin delete editions" on public.magazine_editions;
create policy "admin delete editions"
on public.magazine_editions
for delete
to authenticated
using ((select private.is_admin()));

drop policy if exists "admin select pages" on public.magazine_pages;
drop policy if exists "authenticated read online edition pages" on public.magazine_pages;
drop policy if exists "authenticated read edition pages" on public.magazine_pages;

create policy "authenticated read edition pages"
on public.magazine_pages
for select
to authenticated
using (
  (
    is_published = true
    and exists (
      select 1
      from public.magazine_editions as edition
      where edition.id = magazine_pages.edition_id
        and edition.status = 'published'
    )
  )
  or (select private.is_admin())
);
