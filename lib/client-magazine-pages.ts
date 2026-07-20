import type { MagazinePage } from './editor-types';
import { fallbackPages } from './fallback-pages';

const LOCAL_KEY = 'val_magazine_pages_draft_v1';

export function mergeWithFallback(remotePages: MagazinePage[], localPages: MagazinePage[] = [], publishedOnly = false) {
  const pages = [...remotePages, ...localPages].filter((page) => !publishedOnly || page.is_published);
  if (!pages.length) return fallbackPages;
  const byNumber = new Map(pages.map((page) => [page.page_number, page]));
  return fallbackPages.map((fallback) => byNumber.get(fallback.page_number) || fallback);
}

export function readLocalMagazinePages() {
  if (typeof window === 'undefined') return [];
  try {
    const pages = JSON.parse(window.localStorage.getItem(LOCAL_KEY) || '[]');
    return Array.isArray(pages) ? pages as MagazinePage[] : [];
  } catch {
    return [];
  }
}

export function writeLocalMagazinePages(pages: MagazinePage[]) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(LOCAL_KEY, JSON.stringify(pages));
}
