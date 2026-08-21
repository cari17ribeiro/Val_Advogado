'use client';

import { useEffect, useMemo, useState } from 'react';
import { CanvasPage, backgroundStyle } from '@/components/editor/CanvasRenderer';
import { getCanvasDocument } from '@/lib/default-page-layouts';
import { prepareMagazineEditionPages } from '@/lib/magazine-edition';
import { fetchEditionPages } from '@/lib/magazine-sync';
import { readSession } from '@/lib/supabase-rest';
import type { CanvasDocument, MagazinePage } from '@/lib/editor-types';

const LOCAL_PRINT_ASSETS = new Set([
  '09ec8eeccea68ebb.webp',
  '0e8d1326f0da6c60.webp',
  '3be44a63b521291d.webp',
  '3e19e2dbe8947a97.webp',
  '4666f0e87aa65a1f.webp',
  '4d66cb635d1ac7ed.webp',
  '5bf703a2d15f2554.webp',
  '6130ea8f2bc418d6.webp',
  '65b7a51a1da15282.webp',
  '67bf3a98f7cc77f5.webp',
  '6af54c45e1e9765a.webp',
  '6b48bd883f57ec4e.webp',
  '7328a05f22319a4a.webp',
  '7468ab1e1dcb1c1b.webp',
  '787c83163e50dc37.webp',
  '8714dc5f227f511a.webp',
  '8da326f151d9f83d.webp',
  '9817742c902e5e25.webp',
  '99f465c12f9c0b46.webp',
  '9f01f87ec7041b7a.webp',
  '9fc49fd8f643e914.webp',
  'b4934797dc9487d7.webp',
  'b5cd3cf14f1c6dc7.webp',
  'bc8e4dff9da57998.webp',
  'beb99dff6ea71960.webp',
  'c306f5e28e63502b.webp',
  'c740334492be425e.webp',
  'capa-sem-fundo.webp',
  'cbf54abc633df7bf.webp',
  'cdd9c200adc67664.webp',
  'd82c125afbcf1764.webp',
  'esporte-01.webp',
  'esporte-02.webp',
  'familia-01.webp',
  'inclusao-01.webp',
  'referencia-capa.webp',
  'renata-02.webp',
  'val-gabinete.webp',
  'val-logo.webp',
  'val-oficial.webp',
]);

function printAssetSource(source: string, optimizeRemoteImages: boolean) {
  if (source.startsWith('/magazine-assets/') || source.startsWith('/media/')) {
    const filename = source.split('/').pop();
    if (!filename) return source;
    const printFilename = `${filename.replace(/\.[^.]+$/, '')}.webp`;
    return LOCAL_PRINT_ASSETS.has(printFilename) ? `/print-assets/${printFilename}` : source;
  }
  if (source.startsWith('https://suwjmyetnifzeehirpxt.supabase.co/')) {
    if (!optimizeRemoteImages) return source;
    const optimizedSource = new URL(source);
    optimizedSource.pathname = optimizedSource.pathname.replace(
      '/storage/v1/object/public/',
      '/storage/v1/render/image/public/',
    );
    optimizedSource.searchParams.set('width', '1000');
    optimizedSource.searchParams.set('quality', '72');
    optimizedSource.searchParams.set('resize', 'contain');
    return optimizedSource.toString();
  }
  return source;
}

function optimizeDocumentForPrint(document: CanvasDocument, optimizeRemoteImages: boolean): CanvasDocument {
  return {
    ...document,
    background: document.background.type === 'image'
      ? { ...document.background, value: printAssetSource(document.background.value, optimizeRemoteImages) }
      : document.background,
    elements: document.elements.map((element) => element.type === 'image'
      ? { ...element, src: printAssetSource(element.src, optimizeRemoteImages) }
      : element),
  };
}

export function PrintMagazine({
  pages: initialPages,
  mode = 'proof',
  editionId,
  optimizeRemoteImages = false,
}: {
  pages: MagazinePage[];
  mode?: 'proof' | 'bleed';
  editionId?: string;
  optimizeRemoteImages?: boolean;
}) {
  const [pages, setPages] = useState(initialPages);
  const bleed = mode === 'bleed';

  useEffect(() => { setPages(initialPages); }, [initialPages]);

  useEffect(() => {
    const token = readSession()?.access_token;
    if (!editionId || !token) return;
    let active = true;
    void fetchEditionPages(editionId, token)
      .then((editionPages) => {
        if (active && editionPages.length > 0) setPages(prepareMagazineEditionPages(editionPages));
      })
      .catch((error) => console.error('Não foi possível atualizar a prévia da edição selecionada.', error));
    return () => { active = false; };
  }, [editionId]);

  const documents = useMemo(
    () => pages.map((page) => ({
      page,
      document: optimizeDocumentForPrint(getCanvasDocument(page), optimizeRemoteImages),
    })),
    [pages, optimizeRemoteImages],
  );

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
            <CanvasPage document={document} className="canvas-page-print-v7" autoFitText />
          </div>
          {bleed && <div className="print-crop-marks" aria-hidden="true" />}
        </section>
      ))}
    </div>
  );
}
