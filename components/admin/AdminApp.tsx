'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  BookOpen, CheckCircle2, ExternalLink, FileDown, Home, LogOut, Save,
  Settings, ShieldCheck,
} from 'lucide-react';
import { VisualEditor } from '@/components/editor/VisualEditor';
import { defaultCanvasForPage, getCanvasDocument } from '@/lib/default-page-layouts';
import { fallbackPages } from '@/lib/fallback-pages';
import type { CanvasDocument, MagazinePage, MediaItem } from '@/lib/editor-types';
import { clearSession, readSession, rest, uploadMedia } from '@/lib/supabase-rest';

function completePages(remotePages: MagazinePage[]) {
  if (!remotePages.length) return fallbackPages;
  const byNumber = new Map(remotePages.map((page) => [page.page_number, page]));
  return fallbackPages.map((fallback) => byNumber.get(fallback.page_number) || fallback);
}

export function AdminApp() {
  const [pages, setPages] = useState<MagazinePage[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [status, setStatus] = useState('');
  const [statusType, setStatusType] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [dirty, setDirty] = useState(false);
  const [loading, setLoading] = useState(true);
  const session = useMemo(() => readSession(), []);
  const page = pages[selectedIndex];
  const canvas = page ? getCanvasDocument(page) : null;

  useEffect(() => {
    if (!session?.access_token) { location.href = '/admin/login'; return; }
    Promise.all([
      rest<MagazinePage[]>('magazine_pages?select=*&order=page_number.asc', {}, session.access_token),
      rest<MediaItem[]>('media_library?select=id,name,public_url,storage_path,alt_text&order=created_at.desc&limit=40', {}, session.access_token).catch(() => []),
    ]).then(([pageData, mediaData]) => {
      setPages(completePages(pageData));
      setMedia(mediaData);
    }).catch((error: Error) => {
      setStatus(error.message);
      setStatusType('error');
      if (/JWT|token|401/i.test(error.message)) setTimeout(() => { location.href = '/admin/login'; }, 700);
    }).finally(() => setLoading(false));
  }, [session?.access_token]);

  useEffect(() => {
    const saveKeys = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 's') {
        event.preventDefault(); void savePage();
      }
    };
    window.addEventListener('keydown', saveKeys);
    return () => window.removeEventListener('keydown', saveKeys);
  });

  const updateCanvas = useCallback((next: CanvasDocument) => {
    setPages((current) => current.map((item, index) => index === selectedIndex
      ? { ...item, elements: { ...(item.elements || {}), canvas: next } }
      : item));
    setDirty(true);
  }, [selectedIndex]);

  const resetTemplate = () => {
    if (!page || !confirm('Restaurar o modelo desta página? Os elementos personalizados da página serão substituídos.')) return;
    updateCanvas(defaultCanvasForPage(page));
  };

  const savePage = useCallback(async () => {
    const current = pages[selectedIndex];
    if (!current || !session?.access_token) return;
    setStatus('Salvando página...'); setStatusType('saving');
    try {
      const payload = {
        page_number: current.page_number,
        template: current.template,
        title: current.title,
        subtitle: current.subtitle,
        body: current.body,
        quote: current.quote,
        background: current.background,
        elements: current.elements,
        is_published: current.is_published,
        updated_at: new Date().toISOString(),
      };
      const saved = current.id.startsWith('fallback-')
        ? await rest<MagazinePage[]>('magazine_pages', {
          method: 'POST',
          body: JSON.stringify(payload),
        }, session.access_token)
        : await rest<MagazinePage[]>(`magazine_pages?id=eq.${current.id}`, {
          method: 'PATCH',
          body: JSON.stringify(payload),
        }, session.access_token);
      if (saved?.[0]) {
        setPages((currentPages) => currentPages.map((item, index) => index === selectedIndex ? saved[0] : item));
      }
      setDirty(false); setStatus('Página salva e sincronizada.'); setStatusType('success');
      setTimeout(() => setStatusType('idle'), 2600);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Não foi possível salvar.'); setStatusType('error');
    }
  }, [pages, selectedIndex, session?.access_token]);

  const handleUpload = async (file: File) => {
    if (!session?.access_token) throw new Error('Sessão expirada.');
    const uploaded = await uploadMedia(file, session.access_token);
    const item: MediaItem = { name: file.name, public_url: uploaded.publicUrl, storage_path: uploaded.path, alt_text: file.name };
    setMedia((current) => [item, ...current]);
    return uploaded.publicUrl;
  };

  const choosePage = (index: number) => {
    if (dirty && !confirm('Há alterações ainda não salvas. Deseja mudar de página mesmo assim?')) return;
    setSelectedIndex(index); setDirty(false); setStatusType('idle');
  };

  if (loading) return <div className="admin-loading"><span className="ve-loader" /> Carregando editor visual...</div>;
  if (!page || !canvas) return <div className="admin-loading">Não foi possível carregar as páginas da revista.</div>;

  return (
    <main className="canva-admin-shell">
      <header className="canva-admin-topbar">
        <div className="canva-brand"><span>VA</span><div><b>VAL STUDIO</b><small>Editor da revista</small></div></div>
        <div className="canva-page-name"><small>Página {String(page.page_number).padStart(2, '0')}</small><strong>{page.title || page.template}</strong>{dirty && <em>Alterações não salvas</em>}</div>
        <nav>
          <a href="/" target="_blank"><Home /> Site</a>
          <a href="/revista" target="_blank"><BookOpen /> Visualizar</a>
          <a href="/impressao" target="_blank"><FileDown /> PDF</a>
          <button type="button" className="canva-save" onClick={() => void savePage()}><Save /> Salvar</button>
          <button type="button" className="canva-logout" onClick={() => { clearSession(); location.href = '/admin/login'; }} title="Sair"><LogOut /></button>
        </nav>
      </header>

      <VisualEditor
        pageKey={page.id}
        document={canvas}
        onChange={updateCanvas}
        onUpload={handleUpload}
        media={media}
        onResetTemplate={resetTemplate}
      />

      <footer className="canva-page-strip">
        <div className="canva-page-strip-title"><Settings /><span><b>20 páginas</b><small>Clique para editar</small></span></div>
        <div className="canva-page-thumbnails">
          {pages.map((item, index) => <button type="button" key={item.id} className={selectedIndex === index ? 'active' : ''} onClick={() => choosePage(index)}><span>{String(item.page_number).padStart(2, '0')}</span><b>{item.title || item.template}</b></button>)}
        </div>
        <div className={`canva-save-status status-${statusType}`}>
          {statusType === 'success' ? <CheckCircle2 /> : statusType === 'error' ? <ShieldCheck /> : <ExternalLink />}
          <span>{status || 'Editor visual A5'}</span>
        </div>
      </footer>
    </main>
  );
}


