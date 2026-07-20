'use client';

import { useMemo } from 'react';
import { CanvasPage, backgroundStyle } from '@/components/editor/CanvasRenderer';
import { getCanvasDocument } from '@/lib/default-page-layouts';
import { fallbackPages } from '@/lib/fallback-pages';

export function PrintMagazine({ mode = 'proof' }: { mode?: 'proof' | 'bleed' }) {
  const bleed = mode === 'bleed';
  const documents = useMemo(() => fallbackPages.map((page) => ({ page, document: getCanvasDocument(page) })), []);

  return (
    <div
      className={`print-magazine-v7 ${bleed ? 'with-bleed' : 'proof-a5'}`}
      data-print-ready={documents.length > 0 ? 'true' : 'false'}
      data-page-count={documents.length}
    >
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
