import Link from 'next/link';
import { PrintMagazine } from '@/components/PrintMagazine';
import { PdfButton } from '@/components/PdfButton';
import { getInitialMagazinePages } from '@/lib/server-magazine-pages';

type Props = { searchParams: Promise<{ mode?: string; pdf?: string }> };

export const dynamic = 'force-dynamic';

export default async function Impressao({ searchParams }: Props) {
  const [params, pages] = await Promise.all([searchParams, getInitialMagazinePages()]);
  const mode: 'proof' | 'bleed' = params.mode === 'bleed' || params.pdf === 'bleed' ? 'bleed' : 'proof';

  return (
    <main className="db-print-view print-view-v7">
      <div className="print-toolbar">
        <Link href="/">â† Site</Link>
        <span>Prévia editorial • 20 páginas • A5</span>
        <div className="print-toolbar-actions">
          <PdfButton mode="proof" />
          <PdfButton mode="bleed" />
        </div>
      </div>
      <PrintMagazine pages={pages} mode={mode} />
    </main>
  );
}

