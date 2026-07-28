import type { MagazineEdition, MagazinePage } from './editor-types';
import { rest } from './supabase-rest';

const CHANNEL_NAME = 'val-magazine-updates';
const STORAGE_KEY = 'val_magazine_updated_at';

const EDITION_FIELDS = 'id,slug,title,edition_number,status,cover_image_url,published_at,settings,created_at,updated_at';

export async function fetchOnlineEdition(token?: string) {
  const editions = await rest<MagazineEdition[]>(
    `magazine_editions?select=${EDITION_FIELDS}&status=eq.published&order=published_at.desc.nullslast,edition_number.desc&limit=1`,
    {},
    token,
  );
  return editions[0] || null;
}

export async function fetchEditionPages(editionId: string, token?: string) {
  return rest<MagazinePage[]>(
    `magazine_pages?select=*&edition_id=eq.${encodeURIComponent(editionId)}&order=page_number.asc`,
    {},
    token,
  );
}

export async function fetchPublishedPages() {
  const edition = await fetchOnlineEdition();
  if (!edition) return [];
  const pages = await fetchEditionPages(edition.id);
  return pages.filter((page) => page.is_published);
}

function broadcastMagazineUpdate(message: Record<string, unknown>) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...message, notifiedAt: new Date().toISOString() }));
  if ('BroadcastChannel' in window) {
    const channel = new BroadcastChannel(CHANNEL_NAME);
    channel.postMessage(message);
    channel.close();
  }
}

export function notifyMagazineUpdated(page: MagazinePage) {
  broadcastMagazineUpdate({
    pageId: page.id,
    editionId: page.edition_id,
    pageNumber: page.page_number,
    updatedAt: page.updated_at || new Date().toISOString(),
  });
}

export function notifyMagazineEditionUpdated(editionId: string) {
  broadcastMagazineUpdate({ editionId, publishedAt: new Date().toISOString() });
}

export function subscribeToMagazineUpdates(refresh: () => void) {
  if (typeof window === 'undefined') return () => undefined;

  const onStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) refresh();
  };
  const onVisibility = () => {
    if (document.visibilityState === 'visible') refresh();
  };
  const channel = 'BroadcastChannel' in window ? new BroadcastChannel(CHANNEL_NAME) : null;
  if (channel) channel.onmessage = refresh;

  window.addEventListener('storage', onStorage);
  window.addEventListener('focus', refresh);
  document.addEventListener('visibilitychange', onVisibility);
  const interval = window.setInterval(refresh, 15_000);

  return () => {
    window.removeEventListener('storage', onStorage);
    window.removeEventListener('focus', refresh);
    document.removeEventListener('visibilitychange', onVisibility);
    window.clearInterval(interval);
    channel?.close();
  };
}
