import 'server-only';

import type { MagazineEdition, MagazinePage } from './editor-types';
import { prepareMagazineEditionPages } from './magazine-edition';
import { fetchEditionPages, fetchOnlineEdition } from './magazine-sync';
import { staticMagazinePages } from './static-magazine-pages';

export type MagazineEditionResult = {
  edition: MagazineEdition | null;
  pages: MagazinePage[];
};

export async function getInitialMagazineEdition(token?: string): Promise<MagazineEditionResult> {
  try {
    const edition = await fetchOnlineEdition(token);
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

export async function getInitialMagazinePages(token?: string): Promise<MagazinePage[]> {
  return (await getInitialMagazineEdition(token)).pages;
}
