'use client';

import { useCallback, useEffect, useMemo, useRef, useState, type TouchEvent } from 'react';
import { BookOpen, ChevronLeft, ChevronRight, Columns2, Maximize2 } from 'lucide-react';
import { CanvasPage } from '@/components/editor/CanvasRenderer';
import { getCanvasDocument } from '@/lib/default-page-layouts';
import type { MagazinePage } from '@/lib/editor-types';
import { prepareMagazineEditionPages } from '@/lib/magazine-edition';
import { fetchPublishedPages, subscribeToMagazineUpdates } from '@/lib/magazine-sync';

type ViewMode = 'single' | 'spread';
type TurnPhase = 'idle' | 'out-next' | 'in-next' | 'out-previous' | 'in-previous';

export function DynamicMagazine({ initialPages, print = false }: { initialPages: MagazinePage[]; print?: boolean }) {
  const [index, setIndex] = useState(0);
  const [pages, setPages] = useState(initialPages);
  const [viewMode, setViewMode] = useState<ViewMode>('spread');
  const [narrowViewport, setNarrowViewport] = useState(false);
  const [turnPhase, setTurnPhase] = useState<TurnPhase>('idle');
  const animationTimers = useRef<number[]>([]);
  const touchStart = useRef<{ x: number; y: number; at: number } | null>(null);

  const documents = useMemo(
    () => pages.map((page) => ({ page, document: getCanvasDocument(page) })),
    [pages],
  );
  const single = narrowViewport || viewMode === 'single';
  const max = single ? documents.length - 1 : Math.max(0, Math.ceil(documents.length / 2) - 1);
  const visible = useMemo(
    () => single ? documents.slice(index, index + 1) : documents.slice(index * 2, index * 2 + 2),
    [documents, index, single],
  );

  useEffect(() => {
    const update = () => setNarrowViewport(window.innerWidth < 900);
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  useEffect(() => {
    setPages(initialPages);
  }, [initialPages]);

  useEffect(() => {
    let active = true;
    const refresh = () => {
      void fetchPublishedPages()
        .then((publishedPages) => {
          if (active && publishedPages.length > 0) setPages(prepareMagazineEditionPages(publishedPages));
        })
        .catch((error) => console.error('Não foi possível atualizar a visualização da revista.', error));
    };
    const unsubscribe = subscribeToMagazineUpdates(refresh);

    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    setIndex((current) => Math.min(current, max));
  }, [max]);

  useEffect(() => () => {
    animationTimers.current.forEach((timer) => window.clearTimeout(timer));
  }, []);

  useEffect(() => {
    const sources = documents.flatMap(({ document }) => [
      document.background.type === 'image' ? document.background.value : '',
      ...document.elements
        .filter((element) => element.type === 'image')
        .map((element) => element.type === 'image' ? element.src : ''),
    ]).filter(Boolean);
    sources.forEach((source) => { const img = new Image(); img.src = source; });
  }, [documents]);

  const go = useCallback((direction: number) => {
    const next = Math.max(0, Math.min(max, index + direction));
    if (next === index || turnPhase !== 'idle') return;

    const directionName = direction > 0 ? 'next' : 'previous';
    setTurnPhase(`out-${directionName}` as TurnPhase);
    animationTimers.current.push(window.setTimeout(() => {
      setIndex(next);
      setTurnPhase(`in-${directionName}` as TurnPhase);
      animationTimers.current.push(window.setTimeout(() => setTurnPhase('idle'), 300));
    }, 260));
  }, [index, max, turnPhase]);

  const startSwipe = useCallback((event: TouchEvent<HTMLDivElement>) => {
    if (!narrowViewport || turnPhase !== 'idle' || event.touches.length !== 1) {
      touchStart.current = null;
      return;
    }
    const touch = event.touches[0];
    touchStart.current = { x: touch.clientX, y: touch.clientY, at: Date.now() };
  }, [narrowViewport, turnPhase]);

  const finishSwipe = useCallback((event: TouchEvent<HTMLDivElement>) => {
    const start = touchStart.current;
    touchStart.current = null;
    if (!narrowViewport || !start || event.changedTouches.length !== 1) return;

    const touch = event.changedTouches[0];
    const deltaX = touch.clientX - start.x;
    const deltaY = touch.clientY - start.y;
    const elapsed = Date.now() - start.at;
    const horizontalSwipe = Math.abs(deltaX) >= 50 && Math.abs(deltaX) > Math.abs(deltaY) * 1.2;

    if (horizontalSwipe && elapsed <= 900) go(deltaX < 0 ? 1 : -1);
  }, [go, narrowViewport]);

  useEffect(() => {
    const keyboard = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') go(1);
      if (event.key === 'ArrowLeft') go(-1);
    };
    window.addEventListener('keydown', keyboard);
    return () => window.removeEventListener('keydown', keyboard);
  }, [go]);

  const changeView = (nextMode: ViewMode) => {
    if (narrowViewport || nextMode === viewMode || turnPhase !== 'idle') return;
    const currentPageIndex = viewMode === 'single' ? index : index * 2;
    setViewMode(nextMode);
    setIndex(nextMode === 'single' ? currentPageIndex : Math.floor(currentPageIndex / 2));
  };

  if (print) {
    return <div className="canvas-print-magazine">{documents.map(({ page, document }) => <CanvasPage key={page.id} document={document} className="canvas-page-print" />)}</div>;
  }

  return (
    <div className="canvas-reader">
      <div className="canvas-reader-stage">
        <button type="button" className="reader-arrow previous" onClick={() => go(-1)} disabled={index === 0 || turnPhase !== 'idle'} aria-label="Página anterior"><ChevronLeft /></button>
        <div
          className={`canvas-book ${single ? 'single' : 'spread'} turn-${turnPhase}`}
          aria-live="polite"
          onTouchStart={startSwipe}
          onTouchEnd={finishSwipe}
          onTouchCancel={() => { touchStart.current = null; }}
        >
          {visible.map(({ page, document }) => <div className="canvas-reader-page" key={page.id}><CanvasPage document={document} /></div>)}
        </div>
        <button type="button" className="reader-arrow next" onClick={() => go(1)} disabled={index === max || turnPhase !== 'idle'} aria-label="Próxima página"><ChevronRight /></button>
      </div>

      <div className="canvas-reader-controls">
        <span>{single ? `Página ${visible[0]?.page.page_number} de ${pages.length}` : `Páginas ${visible[0]?.page.page_number}-${visible.at(-1)?.page.page_number} de ${pages.length}`}</span>
        <div className="canvas-reader-progress"><i style={{ width: `${((index + 1) / (max + 1)) * 100}%` }} /></div>
        <div className="canvas-reader-actions">
          <div className="canvas-view-toggle" role="group" aria-label="Modo de visualização">
            <button type="button" className={single ? 'active' : ''} onClick={() => changeView('single')} disabled={narrowViewport} aria-pressed={single}><BookOpen /> Uma página</button>
            <button type="button" className={!single ? 'active' : ''} onClick={() => changeView('spread')} disabled={narrowViewport} aria-pressed={!single}><Columns2 /> Duas páginas</button>
          </div>
          <button type="button" className="canvas-fullscreen" onClick={() => document.documentElement.requestFullscreen?.()}><Maximize2 /> Tela cheia</button>
        </div>
      </div>

      <div className="canvas-reader-thumbs">
        {documents.map(({ page, document }, pageIndex) => {
          const target = single ? pageIndex : Math.floor(pageIndex / 2);
          return <button type="button" key={page.id} className={target === index ? 'active' : ''} onClick={() => turnPhase === 'idle' && setIndex(target)} aria-label={`Ir para a página ${page.page_number}`}><span><CanvasPage document={document} /></span><b>{page.page_number}</b></button>;
        })}
      </div>
    </div>
  );
}
