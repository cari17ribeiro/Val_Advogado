export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://suwjmyetnifzeehirpxt.supabase.co';
export const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_6W70-4_IK1zKaT6fr8J2vg_FL8D_RWq';

export type AuthSession = {
  access_token: string;
  refresh_token?: string;
  expires_in?: number;
  token_type?: string;
  user?: { id: string; email?: string };
};

const jsonHeaders = (token?: string) => ({
  apikey: SUPABASE_KEY,
  ...(token ? { Authorization: `Bearer ${token}` } : {}),
  'Content-Type': 'application/json',
});

export async function signIn(email: string, password: string): Promise<AuthSession> {
  const response = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
    method: 'POST', headers: jsonHeaders(), body: JSON.stringify({ email, password }),
  });
  const body = await response.json();
  if (!response.ok) throw new Error(body.error_description || body.msg || body.message || 'Não foi possível entrar.');
  return body;
}

export async function signUp(email: string, password: string): Promise<AuthSession> {
  const response = await fetch(`${SUPABASE_URL}/auth/v1/signup`, {
    method: 'POST', headers: jsonHeaders(), body: JSON.stringify({ email, password, data: { full_name: 'Administrador de teste' } }),
  });
  const body = await response.json();
  if (!response.ok) throw new Error(body.error_description || body.msg || body.message || 'Não foi possível criar o usuário.');
  return body;
}

export async function resendConfirmation(email: string): Promise<void> {
  const response = await fetch(`${SUPABASE_URL}/auth/v1/resend`, {
    method: 'POST',
    headers: jsonHeaders(),
    body: JSON.stringify({ type: 'signup', email }),
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body.error_description || body.msg || body.message || 'Não foi possível reenviar a confirmação.');
}

export function saveSession(session: AuthSession) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('val_admin_session', JSON.stringify(session));
}
export function readSession(): AuthSession | null {
  if (typeof window === 'undefined') return null;
  try { return JSON.parse(localStorage.getItem('val_admin_session') || 'null'); } catch { return null; }
}
export function clearSession() { if (typeof window !== 'undefined') localStorage.removeItem('val_admin_session'); }

export async function rest<T>(path: string, options: RequestInit = {}, token?: string): Promise<T> {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    ...options,
    headers: { ...jsonHeaders(token), Prefer: 'return=representation', ...(options.headers || {}) },
    cache: 'no-store',
  });
  const text = await response.text();
  const body = text ? JSON.parse(text) : null;
  if (!response.ok) throw new Error(body?.message || body?.hint || body?.details || `Erro ${response.status}`);
  return body as T;
}

export async function uploadMedia(file: File, token: string) {
  const safe = file.name.toLowerCase().replace(/[^a-z0-9.]+/g, '-');
  const path = `uploads/${Date.now()}-${safe}`;
  const response = await fetch(`${SUPABASE_URL}/storage/v1/object/val-media/${path}`, {
    method: 'POST',
    headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${token}`, 'Content-Type': file.type || 'application/octet-stream', 'x-upsert': 'true' },
    body: file,
  });
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.message || 'Falha no upload.');
  }
  return { path, publicUrl: `${SUPABASE_URL}/storage/v1/object/public/val-media/${path}` };
}
