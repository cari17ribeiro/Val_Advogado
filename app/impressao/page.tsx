import Link from 'next/link';
import { headers } from 'next/headers';
import { PrintMagazine } from '@/components/PrintMagazine';
import { PdfButton } from '@/components/PdfButton';
import { getInitialMagazineEdition } from '@/lib/server-magazine-pages';

type Props = { searchParams: Promise<{ mode?: string; pdf?: string; edition?: string }> };

export const dynamic = 'force-dynamic';

export default async function Impressao({ searchParams }: Props) {
  const params = await searchParams;
  const requestHeaders = await headers();
  const authorization = requestHeaders.get('authorization');
  const token = authorization?.replace(/^Bearer\s+/i, '');
  const magazine = await getInitialMagazineEdition(token, params.edition);
  const { edition, pages } = magazine;
  const mode: 'proof' | 'bleed' = params.mode === 'bleed' || params.pdf === 'bleed' ? 'bleed' : 'proof';

  return (
    <main className="db-print-view print-view-v7">
      <div className="print-toolbar">
        <Link href="/">← Site</Link>
        <span>{edition?.title || 'Prévia editorial'} • {pages.length} páginas • A5</span>
        <div className="print-toolbar-actions">
          <PdfButton mode="proof" editionId={params.edition || edition?.id} />
          <PdfButton mode="bleed" editionId={params.edition || edition?.id} />
        </div>
      </div>
      <PrintMagazine
        pages={pages}
        mode={mode}
        editionId={params.edition}
        optimizeRemoteImages={Boolean(params.pdf)}
      />
    </main>
  );
}

