import { defaultCanvasForPage } from './default-page-layouts';
import type { CanvasDocument, CanvasElement, MagazinePage, TextElement } from './editor-types';
import { fallbackPages } from './fallback-pages';

/**
 * Edição impressa de 20 páginas.
 *
 * As páginas-fonte 15–20 continuam preservadas no snapshot/Supabase, mas não
 * entram nesta edição. As páginas 21–26 são renumeradas como 15–20 para manter
 * educação, fiscalização, proteção animal, segurança e a contracapa.
 */
export const MAGAZINE_EDITION_SOURCE_PAGES = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 11,
  10, 12, 13, 14, 21, 22, 23, 24, 25, 26,
] as const;

export const MAGAZINE_EDITION_PAGE_COUNT = MAGAZINE_EDITION_SOURCE_PAGES.length;

function renumberCanvas(document: CanvasDocument, displayPageNumber: number): CanvasDocument {
  const pageLabel = String(displayPageNumber).padStart(2, '0');
  const elements = document.elements.map((element): CanvasElement => {
    if (element.type !== 'text') return element;
    const textElement = element as TextElement;
    const normalizedName = textElement.name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
    if (normalizedName.includes('numero da pagina')) {
      return { ...textElement, text: pageLabel };
    }
    if (normalizedName.includes('cabecalho editorial')) {
      return { ...textElement, text: textElement.text.replace(/\d{2}\s*$/, pageLabel) };
    }
    return textElement;
  });
  return { ...document, elements };
}

export function projectMagazinePage(
  sourcePage: MagazinePage,
  displayPageNumber: number,
  sourcePageNumber = sourcePage.source_page_number ?? sourcePage.page_number,
): MagazinePage {
  const storedCanvas = (sourcePage.elements as { canvas?: CanvasDocument } | null)?.canvas;
  const canvas = renumberCanvas(storedCanvas || defaultCanvasForPage(sourcePage), displayPageNumber);

  return {
    ...sourcePage,
    source_page_number: sourcePageNumber,
    page_number: displayPageNumber,
    elements: { ...(sourcePage.elements || {}), canvas },
  };
}

export function prepareMagazineEditionPages(sourcePages: MagazinePage[]): MagazinePage[] {
  const sourceByNumber = new Map(
    sourcePages.map((page) => [page.source_page_number ?? page.page_number, page]),
  );
  const fallbackByNumber = new Map(fallbackPages.map((page) => [page.page_number, page]));

  return MAGAZINE_EDITION_SOURCE_PAGES.map((sourcePageNumber, index) => {
    const sourcePage = sourceByNumber.get(sourcePageNumber) || fallbackByNumber.get(sourcePageNumber);
    if (!sourcePage) throw new Error(`Página-fonte ${sourcePageNumber} não encontrada.`);
    return projectMagazinePage(sourcePage, index + 1, sourcePageNumber);
  });
}
