import type { MagazinePage } from './editor-types';
import { rest } from './supabase-rest';

const CHANNEL_NAME = 'val-magazine-updates';
const STORAGE_KEY = 'val_magazine_updated_at';

export async function fetchPublishedPages() {
  return rest<MagazinePage[]>('magazine_pages?select=*&is_published=eq.true&order=page_number.asc');
}

export function notifyMagazineUpdated(page: MagazinePage) {
  if (typeof window === 'undefined') return;
  const message = {
    pageId: page.id,
    pageNumber: page.page_number,
    updatedAt: page.updated_at || new Date().toISOString(),
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(message));
  if ('BroadcastChannel' in window) {
    const channel = new BroadcastChannel(CHANNEL_NAME);
    channel.postMessage(message);
    channel.close();
  }
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
