'use client';

import { useEffect, useMemo, useState } from 'react';
import { CanvasPage, backgroundStyle } from '@/components/editor/CanvasRenderer';
import { mergeWithFallback } from '@/lib/client-magazine-pages';
import { getCanvasDocument } from '@/lib/default-page-layouts';
import { fallbackPages } from '@/lib/fallback-pages';
import { fetchPublishedPages } from '@/lib/magazine-sync';
import type { MagazinePage } from '@/lib/editor-types';

export function PrintMagazine({ mode = 'proof' }: { mode?: 'proof' | 'bleed' }) {
  const bleed = mode === 'bleed';
  const [pages, setPages] = useState<MagazinePage[]>(fallbackPages);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    fetchPublishedPages()
      .then((pageData) => setPages(mergeWithFallback(pageData, true)))
      .catch(() => setPages(fallbackPages))
      .finally(() => setLoaded(true));
  }, []);
  const documents = useMemo(() => pages.map((page) => ({ page, document: getCanvasDocument(page) })), [pages]);

  return (
    <div
      className={`print-magazine-v7 ${bleed ? 'with-bleed' : 'proof-a5'}`}
      data-print-ready={loaded && documents.length > 0 ? 'true' : 'false'}
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

