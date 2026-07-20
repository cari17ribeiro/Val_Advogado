import type { MagazinePage } from './editor-types';
import { fallbackPages } from './fallback-pages';

export function mergeWithFallback(remotePages: MagazinePage[], publishedOnly = false) {
  const pages = remotePages.filter((page) => !publishedOnly || page.is_published);
  if (!pages.length) return fallbackPages;
  const byNumber = new Map(pages.map((page) => [page.page_number, page]));
  return fallbackPages.map((fallback) => byNumber.get(fallback.page_number) || fallback);
}
