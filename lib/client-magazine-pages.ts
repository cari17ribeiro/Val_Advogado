import type { MagazinePage } from './editor-types';
import { fallbackPages } from './fallback-pages';
import { prepareMagazineEditionPages } from './magazine-edition';

export function mergeWithFallback(remotePages: MagazinePage[], publishedOnly = false) {
  const pages = remotePages.filter((page) => !publishedOnly || page.is_published);
  if (!pages.length) return prepareMagazineEditionPages(fallbackPages);
  const editionId = pages[0]?.edition_id;
  const editionPages = editionId ? pages.filter((page) => page.edition_id === editionId) : pages;
  const byNumber = new Map(editionPages.map((page) => [page.page_number, page]));
  const completed = fallbackPages.map((fallback) => byNumber.get(fallback.page_number) || fallback);
  return prepareMagazineEditionPages(completed);
}
