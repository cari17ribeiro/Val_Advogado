'use client';

import { useEffect, useMemo } from 'react';
import { CanvasPage } from '@/components/editor/CanvasRenderer';
import { getCanvasDocument } from '@/lib/default-page-layouts';
import { staticMagazinePages } from '@/lib/static-magazine-pages';

export function HomeMagazinePreview() {
  const previewPages = useMemo(
    () => staticMagazinePages.slice(0, 2).map((page) => ({ page, document: getCanvasDocument(page) })),
    [],
  );

  useEffect(() => {
    const sources = previewPages.flatMap(({ document }) => [
      document.background.type === 'image' ? document.background.value : '',
      ...document.elements
        .filter((element) => element.type === 'image')
        .map((element) => (element.type === 'image' ? element.src : '')),
    ]).filter(Boolean);

    sources.forEach((source) => {
      const img = new Image();
      img.src = source;
    });
  }, [previewPages]);

  return (
    <div className="home-magazine-live-preview" aria-label="Prévia da revista digital">
      {previewPages.map(({ page, document }, index) => (
        <div className={`home-live-page home-live-page-${index === 0 ? 'left' : 'right'}`} key={page.id}>
          <CanvasPage document={document} />
        </div>
      ))}
      <div className="home-live-spine" aria-hidden="true" />
    </div>
  );
}
