import Link from 'next/link';
import { PrintMagazine } from '@/components/PrintMagazine';
import { PdfButton } from '@/components/PdfButton';

type Props = { searchParams: Promise<{ mode?: string; pdf?: string }> };

export default async function Impressao({ searchParams }: Props) {
  const params = await searchParams;
  const mode: 'proof' | 'bleed' = params.mode === 'bleed' || params.pdf === 'bleed' ? 'bleed' : 'proof';

  return (
    <main className="db-print-view print-view-v7">
      <div className="print-toolbar">
        <Link href="/">â† Site</Link>
        <span>Prévia editorial • 26 páginas • A5</span>
        <div className="print-toolbar-actions">
          <PdfButton mode="proof" />
          <PdfButton mode="bleed" />
        </div>
      </div>
      <PrintMagazine mode={mode} />
    </main>
  );
}

