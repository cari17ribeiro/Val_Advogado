'use client';

import { useEffect, useMemo, useState } from 'react';
import { CanvasPage } from '@/components/editor/CanvasRenderer';
import { mergeWithFallback } from '@/lib/client-magazine-pages';
import { getCanvasDocument } from '@/lib/default-page-layouts';
import { fallbackPages } from '@/lib/fallback-pages';
import { readSession, rest } from '@/lib/supabase-rest';
import type { MagazinePage } from '@/lib/editor-types';

export function HomeMagazinePreview() {
  const [pages, setPages] = useState<MagazinePage[]>(fallbackPages);

  useEffect(() => {
    const token = readSession()?.access_token;
    rest<MagazinePage[]>('magazine_pages?select=*&order=page_number.asc', {}, token)
      .then((pageData) => setPages(mergeWithFallback(pageData)))
      .catch(() => setPages(fallbackPages));
  }, []);

  const previewPages = useMemo(
    () => pages.slice(0, 2).map((page) => ({ page, document: getCanvasDocument(page) })),
    [pages],
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
    <div className="home-magazine-live-preview" aria-label="Prévia atualizada da revista digital">
      {previewPages.map(({ page, document }, index) => (
        <div className={`home-live-page home-live-page-${index === 0 ? 'left' : 'right'}`} key={page.id}>
          <CanvasPage document={document} />
        </div>
      ))}
      <div className="home-live-spine" aria-hidden="true" />
    </div>
  );
}
