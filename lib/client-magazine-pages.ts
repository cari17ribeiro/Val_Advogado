import type { MagazinePage } from './editor-types';
import { fallbackPages } from './fallback-pages';
import { prepareMagazineEditionPages } from './magazine-edition';

export function mergeWithFallback(remotePages: MagazinePage[], publishedOnly = false) {
  const pages = remotePages.filter((page) => !publishedOnly || page.is_published);
  if (!pages.length) return prepareMagazineEditionPages(fallbackPages);
  const byNumber = new Map(pages.map((page) => [page.page_number, page]));
  const completed = fallbackPages.map((fallback) => byNumber.get(fallback.page_number) || fallback);
  return prepareMagazineEditionPages(completed);
}
