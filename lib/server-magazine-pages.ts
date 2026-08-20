import 'server-only';

import type { MagazineEdition, MagazinePage } from './editor-types';
import { prepareMagazineEditionPages } from './magazine-edition';
import { fetchEditionById, fetchEditionPages, fetchOnlineEdition } from './magazine-sync';
import { staticMagazinePages } from './static-magazine-pages';

export type MagazineEditionResult = {
  edition: MagazineEdition | null;
  pages: MagazinePage[];
};

export async function getInitialMagazineEdition(token?: string, editionId?: string): Promise<MagazineEditionResult> {
  try {
    const edition = editionId ? await fetchEditionById(editionId, token) : await fetchOnlineEdition(token);
    if (!edition) return { edition: null, pages: staticMagazinePages };
    const publishedPages = (await fetchEditionPages(edition.id, token)).filter((page) => page.is_published);
    return {
      edition,
      pages: publishedPages.length > 0 ? prepareMagazineEditionPages(publishedPages) : staticMagazinePages,
    };
  } catch (error) {
    console.error('Não foi possível carregar a revista do Supabase.', error);
    return { edition: null, pages: staticMagazinePages };
  }
}

export async function getInitialMagazinePages(token?: string, editionId?: string): Promise<MagazinePage[]> {
  return (await getInitialMagazineEdition(token, editionId)).pages;
}
