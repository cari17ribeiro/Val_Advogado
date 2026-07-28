'use client';

import { useEffect, useMemo, useState } from 'react';
import { CanvasPage } from '@/components/editor/CanvasRenderer';
import { getCanvasDocument } from '@/lib/default-page-layouts';
import type { MagazinePage } from '@/lib/editor-types';
import { prepareMagazineEditionPages } from '@/lib/magazine-edition';
import { fetchPublishedPages, subscribeToMagazineUpdates } from '@/lib/magazine-sync';

export function HomeMagazinePreview() {
  const [pages, setPages] = useState<MagazinePage[]>([]);
  const previewPages = useMemo(
    () => pages.slice(0, 2).map((page) => ({ page, document: getCanvasDocument(page) })),
    [pages],
  );

  useEffect(() => {
    let active = true;
    const refresh = () => {
      void fetchPublishedPages()
        .then((onlinePages) => {
          if (active && onlinePages.length) setPages(prepareMagazineEditionPages(onlinePages));
        })
        .catch((error) => console.error('Não foi possível carregar a prévia da edição online.', error));
    };
    refresh();
    const unsubscribe = subscribeToMagazineUpdates(refresh);
    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

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

  if (!previewPages.length) {
    return (
      <div className="home-magazine-live-preview is-loading" aria-label="Carregando prévia da revista digital">
        <span className="ve-loader" />
      </div>
    );
  }

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
