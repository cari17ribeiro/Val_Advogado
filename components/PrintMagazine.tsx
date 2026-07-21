'use client';

import { CanvasPage, backgroundStyle } from '@/components/editor/CanvasRenderer';
import { getCanvasDocument } from '@/lib/default-page-layouts';
import type { CanvasDocument, MagazinePage } from '@/lib/editor-types';

function printAssetSource(source: string) {
  if (source.startsWith('/magazine-assets/') || source.startsWith('/media/')) {
    const filename = source.split('/').pop();
    if (!filename) return source;
    return `/print-assets/${filename.replace(/\.[^.]+$/, '')}.webp`;
  }
  if (source.startsWith('https://suwjmyetnifzeehirpxt.supabase.co/')) {
    return `/_next/image?url=${encodeURIComponent(source)}&w=1200&q=75`;
  }
  return source;
}

function optimizeDocumentForPrint(document: CanvasDocument): CanvasDocument {
  return {
    ...document,
    background: document.background.type === 'image'
      ? { ...document.background, value: printAssetSource(document.background.value) }
      : document.background,
    elements: document.elements.map((element) => element.type === 'image'
      ? { ...element, src: printAssetSource(element.src) }
      : element),
  };
}

export function PrintMagazine({ pages, mode = 'proof' }: { pages: MagazinePage[]; mode?: 'proof' | 'bleed' }) {
  const bleed = mode === 'bleed';
  const documents = pages.map((page) => ({ page, document: optimizeDocumentForPrint(getCanvasDocument(page)) }));

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
