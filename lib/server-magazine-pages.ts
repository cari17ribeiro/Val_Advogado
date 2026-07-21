import 'server-only';

import type { MagazinePage } from './editor-types';
import { fetchPublishedPages } from './magazine-sync';
import { staticMagazinePages } from './static-magazine-pages';

export async function getInitialMagazinePages(): Promise<MagazinePage[]> {
  try {
    const publishedPages = await fetchPublishedPages();
    return publishedPages.length > 0 ? publishedPages : staticMagazinePages;
  } catch (error) {
    console.error('Não foi possível carregar a revista do Supabase.', error);
    return staticMagazinePages;
  }
}
