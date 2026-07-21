import snapshot from '@/content/magazine-pages.snapshot.json';
import type { MagazinePage } from './editor-types';

/** Revista versionada localmente para renderização imediata e determinística. */
export const staticMagazinePages = snapshot as MagazinePage[];
