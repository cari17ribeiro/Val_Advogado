-- Gerenciamento seguro de múltiplas edições da revista.
-- A edição atual e suas páginas não são recriadas nem apagadas.

-- Garante que somente uma edição possa estar online.
with ranked_published as (
  select
    id,
    row_number() over (
      order by published_at desc nulls last, updated_at desc, edition_number desc
    ) as publication_rank
  from public.magazine_editions
  where status = 'published'
)
update public.magazine_editions as edition
set
  status = 'archived',
  updated_at = now()
from ranked_published
where edition.id = ranked_published.id
  and ranked_published.publication_rank > 1;

create unique index if not exists magazine_editions_one_published_idx
on public.magazine_editions ((status))
where status = 'published';

-- Acesso público somente à edição que está online.
drop policy if exists "public read published editions" on public.magazine_editions;
drop policy if exists "public read online edition" on public.magazine_editions;
create policy "public read online edition"
on public.magazine_editions
for select
to anon
using (status = 'published');

drop policy if exists "authenticated read online edition" on public.magazine_editions;
create policy "authenticated read online edition"
on public.magazine_editions
for select
to authenticated
using (status = 'published');

drop policy if exists "public read published pages" on public.magazine_pages;
drop policy if exists "magazine_pages public read published" on public.magazine_pages;
drop policy if exists "public read online edition pages" on public.magazine_pages;
create policy "public read online edition pages"
on public.magazine_pages
for select
to anon
using (
  is_published = true
  and exists (
    select 1
    from public.magazine_editions as edition
    where edition.id = magazine_pages.edition_id
      and edition.status = 'published'
  )
);

drop policy if exists "authenticated read published pages" on public.magazine_pages;
drop policy if exists "authenticated read online edition pages" on public.magazine_pages;
create policy "authenticated read online edition pages"
on public.magazine_pages
for select
to authenticated
using (
  is_published = true
  and exists (
    select 1
    from public.magazine_editions as edition
    where edition.id = magazine_pages.edition_id
      and edition.status = 'published'
  )
);

grant select on public.magazine_editions to anon;
grant select, insert, update, delete on public.magazine_editions to authenticated;
grant select on public.magazine_pages to anon;
grant select, insert, update, delete on public.magazine_pages to authenticated;

-- Cria uma nova edição copiando integralmente a selecionada.
-- A cópia sempre começa como rascunho e não altera a revista online.
create or replace function public.duplicate_magazine_edition(
  source_edition_id uuid,
  new_title text
)
returns setof public.magazine_editions
language plpgsql
security invoker
set search_path = pg_catalog, public, private
as $$
declare
  created_edition_id uuid;
  next_edition_number integer;
  source_edition public.magazine_editions%rowtype;
  normalized_title text;
begin
  if not private.is_admin() then
    raise exception 'Apenas administradores podem criar edições.'
      using errcode = '42501';
  end if;

  select *
  into source_edition
  from public.magazine_editions
  where id = source_edition_id;

  if not found then
    raise exception 'Edição de origem não encontrada.'
      using errcode = 'P0002';
  end if;

  perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtext('val-magazine-edition-number'));

  select coalesce(max(edition_number), 0) + 1
  into next_edition_number
  from public.magazine_editions;

  normalized_title := nullif(pg_catalog.btrim(new_title), '');
  if normalized_title is null then
    normalized_title := pg_catalog.format(
      'Infojornal Val Advogado — Edição %s',
      pg_catalog.lpad(next_edition_number::text, 2, '0')
    );
  end if;

  insert into public.magazine_editions (
    slug,
    title,
    edition_number,
    status,
    cover_image_url,
    published_at,
    settings,
    created_at,
    updated_at
  )
  values (
    pg_catalog.format(
      'edicao-%s-%s',
      pg_catalog.lpad(next_edition_number::text, 2, '0'),
      pg_catalog.substr(pg_catalog.replace(gen_random_uuid()::text, '-', ''), 1, 6)
    ),
    normalized_title,
    next_edition_number,
    'draft',
    source_edition.cover_image_url,
    null,
    source_edition.settings,
    now(),
    now()
  )
  returning id into created_edition_id;

  insert into public.magazine_pages (
    edition_id,
    page_number,
    template,
    title,
    subtitle,
    body,
    quote,
    background,
    elements,
    is_published,
    updated_at
  )
  select
    created_edition_id,
    page_number,
    template,
    title,
    subtitle,
    body,
    quote,
    background,
    elements,
    is_published,
    now()
  from public.magazine_pages
  where edition_id = source_edition_id
  order by page_number;

  return query
  select *
  from public.magazine_editions
  where id = created_edition_id;
end;
$$;

-- Troca a edição online de forma atômica, preservando a anterior arquivada.
create or replace function public.publish_magazine_edition(
  target_edition_id uuid
)
returns setof public.magazine_editions
language plpgsql
security invoker
set search_path = pg_catalog, public, private
as $$
begin
  if not private.is_admin() then
    raise exception 'Apenas administradores podem publicar edições.'
      using errcode = '42501';
  end if;

  if not exists (
    select 1
    from public.magazine_editions
    where id = target_edition_id
  ) then
    raise exception 'Edição não encontrada.'
      using errcode = 'P0002';
  end if;

  perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtext('val-magazine-publication'));

  update public.magazine_editions
  set
    status = 'archived',
    updated_at = now()
  where status = 'published'
    and id <> target_edition_id;

  update public.magazine_editions
  set
    status = 'published',
    published_at = now(),
    updated_at = now()
  where id = target_edition_id;

  return query
  select *
  from public.magazine_editions
  where id = target_edition_id;
end;
$$;

revoke all on function public.duplicate_magazine_edition(uuid, text) from public;
revoke all on function public.publish_magazine_edition(uuid) from public;
revoke all on function public.duplicate_magazine_edition(uuid, text) from anon;
revoke all on function public.publish_magazine_edition(uuid) from anon;
grant execute on function public.duplicate_magazine_edition(uuid, text) to authenticated;
grant execute on function public.publish_magazine_edition(uuid) to authenticated;
