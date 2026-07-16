'use client';

import { useEffect, useMemo, useState } from 'react';
import { AlertTriangle, ChevronLeft, ChevronRight, LoaderCircle, Maximize2 } from 'lucide-react';
import { CanvasPage } from '@/components/editor/CanvasRenderer';
import { getCanvasDocument } from '@/lib/default-page-layouts';
import { fallbackPages } from '@/lib/fallback-pages';
import type { MagazinePage } from '@/lib/editor-types';
import { rest } from '@/lib/supabase-rest';

export function DynamicMagazine({ print = false }: { print?: boolean }) {
  const [pages, setPages] = useState<MagazinePage[]>(fallbackPages);
  const [index, setIndex] = useState(0);
  const [single, setSingle] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [transitioning, setTransitioning] = useState(false);

  useEffect(() => {
    rest<MagazinePage[]>('magazine_pages?select=*&is_published=eq.true&order=page_number.asc')
      .then((data) => {
        if (data?.length) setPages(data);
        else setLoadError('O banco não retornou páginas; exibindo a versão de segurança.');
      })
      .catch((error) => {
        console.error(error);
        setLoadError('Não foi possível sincronizar agora; exibindo a versão de segurança.');
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const update = () => setSingle(window.innerWidth < 900);
    update(); window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const documents = useMemo(() => pages.map((page) => ({ page, document: getCanvasDocument(page) })), [pages]);
  const max = single ? documents.length - 1 : Math.max(0, Math.ceil(documents.length / 2) - 1);
  const visible = useMemo(() => single ? [documents[index]] : [documents[index * 2], documents[index * 2 + 1]].filter(Boolean), [documents, index, single]);

  useEffect(() => {
    const sources = documents.flatMap(({ document }) => [
      document.background.type === 'image' ? document.background.value : '',
      ...document.elements.filter((element) => element.type === 'image').map((element) => element.type === 'image' ? element.src : ''),
    ]).filter(Boolean);
    sources.forEach((source) => { const img = new Image(); img.src = source; });
  }, [documents]);

  const go = (direction: number) => {
    const next = Math.max(0, Math.min(max, index + direction));
    if (next === index || transitioning) return;
    setTransitioning(true);
    window.setTimeout(() => { setIndex(next); window.setTimeout(() => setTransitioning(false), 40); }, 120);
  };

  useEffect(() => {
    const keyboard = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') go(1);
      if (event.key === 'ArrowLeft') go(-1);
    };
    window.addEventListener('keydown', keyboard);
    return () => window.removeEventListener('keydown', keyboard);
  });

  if (loading) return <div className="db-loading"><LoaderCircle className="spin" /> Carregando revista…</div>;
  if (print) return <div className="canvas-print-magazine">{documents.map(({ page, document }) => <CanvasPage key={page.id} document={document} className="canvas-page-print" />)}</div>;

  return (
    <div className="canvas-reader">
      {loadError && <div className="db-sync-warning"><AlertTriangle size={16} />{loadError}</div>}
      <div className="canvas-reader-stage">
        <button type="button" className="reader-arrow previous" onClick={() => go(-1)} disabled={index === 0} aria-label="Página anterior"><ChevronLeft /></button>
        <div className={`canvas-book ${single ? 'single' : 'spread'} ${transitioning ? 'is-transitioning' : ''}`}>
          {visible.map(({ page, document }) => <div className="canvas-reader-page" key={page.id}><CanvasPage document={document} /></div>)}
        </div>
        <button type="button" className="reader-arrow next" onClick={() => go(1)} disabled={index === max} aria-label="Próxima página"><ChevronRight /></button>
      </div>
      <div className="canvas-reader-controls">
        <span>{single ? `Página ${visible[0]?.page.page_number} de ${pages.length}` : `Páginas ${visible[0]?.page.page_number}–${visible.at(-1)?.page.page_number} de ${pages.length}`}</span>
        <div className="canvas-reader-progress"><i style={{ width: `${((index + 1) / (max + 1)) * 100}%` }} /></div>
        <button type="button" onClick={() => document.documentElement.requestFullscreen?.()}><Maximize2 /> Tela cheia</button>
      </div>
      <div className="canvas-reader-thumbs">{documents.map(({ page, document }, pageIndex) => <button type="button" key={page.id} className={(single ? pageIndex : Math.floor(pageIndex / 2)) === index ? 'active' : ''} onClick={() => setIndex(single ? pageIndex : Math.floor(pageIndex / 2))}><span><CanvasPage document={document} /></span><b>{page.page_number}</b></button>)}</div>
    </div>
  );
}
