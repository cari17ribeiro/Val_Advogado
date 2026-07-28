import Link from 'next/link';
import { PrintMagazine } from '@/components/PrintMagazine';
import { PdfButton } from '@/components/PdfButton';
import { getInitialMagazineEdition } from '@/lib/server-magazine-pages';

type Props = { searchParams: Promise<{ mode?: string; pdf?: string }> };

export const dynamic = 'force-dynamic';

export default async function Impressao({ searchParams }: Props) {
  const [params, magazine] = await Promise.all([searchParams, getInitialMagazineEdition()]);
  const { edition, pages } = magazine;
  const mode: 'proof' | 'bleed' = params.mode === 'bleed' || params.pdf === 'bleed' ? 'bleed' : 'proof';

  return (
    <main className="db-print-view print-view-v7">
      <div className="print-toolbar">
        <Link href="/">â† Site</Link>
        <span>{edition?.title || 'Prévia editorial'} • {pages.length} páginas • A5</span>
        <div className="print-toolbar-actions">
          <PdfButton mode="proof" />
          <PdfButton mode="bleed" />
        </div>
      </div>
      <PrintMagazine pages={pages} mode={mode} />
    </main>
  );
}

