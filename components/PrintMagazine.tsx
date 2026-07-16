'use client';

import { useEffect, useMemo, useState } from 'react';
import { AlertTriangle, LoaderCircle } from 'lucide-react';
import { CanvasPage, backgroundStyle } from '@/components/editor/CanvasRenderer';
import { getCanvasDocument } from '@/lib/default-page-layouts';
import { fallbackPages } from '@/lib/fallback-pages';
import type { MagazinePage } from '@/lib/editor-types';
import { rest } from '@/lib/supabase-rest';

export function PrintMagazine({ mode = 'proof' }: { mode?: 'proof' | 'bleed' }) {
  const bleed = mode === 'bleed';
  const [pages, setPages] = useState<MagazinePage[]>(fallbackPages);
  const [loading, setLoading] = useState(true);
  const [warning, setWarning] = useState('');

  useEffect(() => {
    rest<MagazinePage[]>('magazine_pages?select=*&is_published=eq.true&order=page_number.asc')
      .then((data) => { if (data?.length) setPages(data); else setWarning('Usando a versão local das páginas.'); })
      .catch(() => setWarning('Não foi possível sincronizar; usando a versão local das páginas.'))
      .finally(() => setLoading(false));
  }, []);

  const documents = useMemo(() => pages.map((page) => ({ page, document: getCanvasDocument(page) })), [pages]);

  if (loading) return <div className="db-loading"><LoaderCircle className="spin" /> Preparando páginas para impressão…</div>;

  return (
    <div
      className={`print-magazine-v7 ${bleed ? 'with-bleed' : 'proof-a5'}`}
      data-print-ready={documents.length > 0 ? 'true' : 'false'}
      data-page-count={documents.length}
    >
      {warning && <div className="db-sync-warning print-sync-warning"><AlertTriangle size={16} />{warning}</div>}
      {documents.map(({ page, document }) => (
        <section
          className="print-sheet-v7"
          key={page.id}
          style={bleed ? backgroundStyle(document.background) : undefined}
          data-page={page.page_number}
        >
          <div className="print-trim-v7">
            <CanvasPage document={document} className="canvas-page-print-v7" />
          </div>
          {bleed && <div className="print-crop-marks" aria-hidden="true" />}
        </section>
      ))}
    </div>
  );
}
