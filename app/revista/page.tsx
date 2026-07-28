import Link from 'next/link';
import { DynamicMagazine } from '@/components/DynamicMagazine';
import { getInitialMagazineEdition } from '@/lib/server-magazine-pages';

export const dynamic = 'force-dynamic';

export default async function RevistaPage() {
  const { edition, pages } = await getInitialMagazineEdition();
  const editionLabel = edition
    ? `Edição ${String(edition.edition_number).padStart(2, '0')} • ${edition.title}`
    : 'Edição atual';

  return (
    <main className="reader">
      <div className="readerbar">
        <Link href="/">â† Voltar ao site</Link>
        <span>Revista Digital • {editionLabel} • {pages.length} páginas</span>
        <div className="actions">
          <Link className="button ghost" href="/impressao">Modo impressão</Link>
          <Link className="button" href="/admin">Área administrativa</Link>
        </div>
      </div>
      <DynamicMagazine initialPages={pages} />
    </main>
  );
}

