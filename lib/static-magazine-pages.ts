import snapshot from '@/content/magazine-pages.snapshot.json';
import type { MagazinePage } from './editor-types';
import { prepareMagazineEditionPages } from './magazine-edition';

/** Revista versionada localmente para renderização imediata e determinística. */
export const staticMagazinePages = prepareMagazineEditionPages(snapshot as MagazinePage[]);
