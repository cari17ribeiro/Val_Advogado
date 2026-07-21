import Link from 'next/link';
import { DynamicMagazine } from '@/components/DynamicMagazine';
import { getInitialMagazinePages } from '@/lib/server-magazine-pages';

export const dynamic = 'force-dynamic';

export default async function RevistaPage() {
  const pages = await getInitialMagazinePages();

  return (
    <main className="reader">
      <div className="readerbar">
        <Link href="/">â† Voltar ao site</Link>
        <span>Revista Digital • Edição 01 • 20 páginas</span>
        <div className="actions">
          <Link className="button ghost" href="/impressao">Modo impressão</Link>
          <Link className="button" href="/admin">Área administrativa</Link>
        </div>
      </div>
      <DynamicMagazine initialPages={pages} />
    </main>
  );
}

