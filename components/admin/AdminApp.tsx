'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  BookOpen, CheckCircle2, ExternalLink, FileDown, Home, LogOut, Plus,
  RadioTower, Save, Settings, ShieldCheck,
} from 'lucide-react';
import { VisualEditor } from '@/components/editor/VisualEditor';
import { defaultCanvasForPage, getCanvasDocument } from '@/lib/default-page-layouts';
import { fallbackPages } from '@/lib/fallback-pages';
import { prepareMagazineEditionPages, projectMagazinePage } from '@/lib/magazine-edition';
import { notifyMagazineEditionUpdated, notifyMagazineUpdated } from '@/lib/magazine-sync';
import type { CanvasDocument, MagazineEdition, MagazinePage, MediaItem } from '@/lib/editor-types';
import { clearSession, readSession, rest, uploadMedia } from '@/lib/supabase-rest';

const clone = <T,>(value: T): T => JSON.parse(JSON.stringify(value));

function completePages(remotePages: MagazinePage[], editionId: string) {
  if (!remotePages.length) {
    return prepareMagazineEditionPages(fallbackPages.map((page) => ({ ...page, edition_id: editionId })));
  }
  const byNumber = new Map(remotePages.map((page) => [page.page_number, page]));
  const completed = fallbackPages.map((fallback) => {
    const page = byNumber.get(fallback.page_number) || { ...fallback, edition_id: editionId };
    const canvas = (page.elements as { canvas?: CanvasDocument } | null)?.canvas;
    const expectedFamily = page.page_number === 1 ? 'capa-infojornal-moderna' : page.page_number === 2 ? 'sumario-infojornal-moderno' : null;
    if (expectedFamily && canvas?.designFamily !== expectedFamily) {
      return { ...page, elements: { ...(page.elements || {}), canvas: defaultCanvasForPage(page) } };
    }
    return page;
  });
  return prepareMagazineEditionPages(completed);
}

export function AdminApp() {
  const [editions, setEditions] = useState<MagazineEdition[]>([]);
  const [selectedEditionId, setSelectedEditionId] = useState('');
  const [pages, setPages] = useState<MagazinePage[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [status, setStatus] = useState('');
  const [statusType, setStatusType] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [dirty, setDirty] = useState(false);
  const [loading, setLoading] = useState(true);
  const pagesRef = useRef<MagazinePage[]>([]);
  const savedPagesRef = useRef<MagazinePage[]>([]);
  const selectedIndexRef = useRef(0);
  const session = useMemo(() => readSession(), []);
  const selectedEdition = editions.find((edition) => edition.id === selectedEditionId) || null;
  const page = pages[selectedIndex];
  const canvas = page ? getCanvasDocument(page) : null;

  useEffect(() => { pagesRef.current = pages; }, [pages]);
  useEffect(() => { selectedIndexRef.current = selectedIndex; }, [selectedIndex]);

  const loadEditionPages = useCallback(async (editionId: string) => {
    if (!session?.access_token) return;
    const pageData = await rest<MagazinePage[]>(
      `magazine_pages?select=*&edition_id=eq.${encodeURIComponent(editionId)}&order=page_number.asc`,
      {},
      session.access_token,
    );
    const nextPages = completePages(pageData, editionId);
    pagesRef.current = nextPages;
    savedPagesRef.current = clone(nextPages);
    selectedIndexRef.current = 0;
    setPages(nextPages);
    setSelectedIndex(0);
    setSelectedEditionId(editionId);
    setDirty(false);
  }, [session?.access_token]);

  useEffect(() => {
    if (!session?.access_token) { location.href = '/admin/login'; return; }
    Promise.all([
      rest<MagazineEdition[]>(
        'magazine_editions?select=id,slug,title,edition_number,status,cover_image_url,published_at,settings,created_at,updated_at&order=edition_number.asc',
        {},
        session.access_token,
      ),
      rest<MediaItem[]>('media_library?select=id,name,public_url,storage_path,alt_text&order=created_at.desc&limit=40', {}, session.access_token).catch(() => []),
    ]).then(async ([editionData, mediaData]) => {
      if (!editionData.length) throw new Error('Nenhuma edição foi encontrada no Supabase.');
      const initialEdition = editionData.find((edition) => edition.status === 'published') || editionData[0];
      setEditions(editionData);
      setMedia(mediaData);
      await loadEditionPages(initialEdition.id);
    }).catch((error: Error) => {
      setStatus(error.message);
      setStatusType('error');
      if (/JWT|token|401/i.test(error.message)) setTimeout(() => { location.href = '/admin/login'; }, 700);
    }).finally(() => setLoading(false));
  }, [loadEditionPages, session?.access_token]);

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
    setPages((current) => {
      const nextPages = current.map((item, index) => index === selectedIndex
        ? { ...item, elements: { ...(item.elements || {}), canvas: next } }
        : item);
      pagesRef.current = nextPages;
      return nextPages;
    });
    setDirty(true);
  }, [selectedIndex]);

  const resetTemplate = () => {
    const savedPage = savedPagesRef.current[selectedIndexRef.current];
    if (!page || !savedPage || !confirm('Restaurar esta página para a última versão salva? As alterações ainda não salvas serão descartadas.')) return;
    updateCanvas(clone(getCanvasDocument(savedPage)));
  };

  const savePage = useCallback(async () => {
    const activeIndex = selectedIndexRef.current;
    const current = pagesRef.current[activeIndex];
    if (!current) return;
    if (!session?.access_token) {
      setStatus('Sessão expirada. Entre novamente para salvar no Supabase.');
      setStatusType('error');
      return;
    }
    setStatus('Salvando página...'); setStatusType('saving');
    try {
      const sourcePageNumber = current.source_page_number ?? current.page_number;
      const editionId = current.edition_id || selectedEditionId;
      if (!editionId) throw new Error('Selecione uma edição antes de salvar.');
      const payload = {
        edition_id: editionId,
        page_number: sourcePageNumber,
        template: current.template,
        title: current.title,
        subtitle: current.subtitle,
        body: current.body,
        quote: current.quote,
        background: current.background,
        elements: current.elements,
        is_published: true,
        updated_at: new Date().toISOString(),
      };
      let saved: MagazinePage[] | null = null;
      if (current.id.startsWith('fallback-')) {
        try {
          saved = await rest<MagazinePage[]>('magazine_pages', {
            method: 'POST',
            body: JSON.stringify(payload),
          }, session.access_token);
        } catch {
          saved = await rest<MagazinePage[]>(
            `magazine_pages?edition_id=eq.${encodeURIComponent(editionId)}&page_number=eq.${sourcePageNumber}`,
            {
            method: 'PATCH',
            body: JSON.stringify(payload),
            },
            session.access_token,
          );
        }
      } else {
        saved = await rest<MagazinePage[]>(`magazine_pages?id=eq.${current.id}`, {
          method: 'PATCH',
          body: JSON.stringify(payload),
        }, session.access_token);
      }
      if (!saved?.[0] && !current.id.startsWith('fallback-')) {
        saved = await rest<MagazinePage[]>(
          `magazine_pages?edition_id=eq.${encodeURIComponent(editionId)}&page_number=eq.${sourcePageNumber}`,
          {
            method: 'PATCH',
            body: JSON.stringify(payload),
          },
          session.access_token,
        );
      }
      if (!saved?.[0]) {
        throw new Error('O Supabase não atualizou nenhuma linha. Verifique as policies de INSERT/UPDATE/SELECT da tabela magazine_pages para usuários autenticados.');
      }
      if (saved?.[0]) {
        const savedPage = saved[0];
        const projectedPage = projectMagazinePage(savedPage, activeIndex + 1, sourcePageNumber);
        setPages((currentPages) => {
          const nextPages = currentPages.map((item, index) => index === activeIndex ? projectedPage : item);
          pagesRef.current = nextPages;
          return nextPages;
        });
        savedPagesRef.current = savedPagesRef.current.map((item, index) =>
          index === activeIndex ? clone(projectedPage) : item);
        notifyMagazineUpdated(savedPage);
      }
      setDirty(false); setStatus('Página salva e sincronizada.'); setStatusType('success');
      setTimeout(() => setStatusType('idle'), 2600);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Não foi possível salvar.'); setStatusType('error');
    }
  }, [selectedEditionId, session?.access_token]);

  const handleUpload = async (file: File) => {
    if (!session?.access_token) throw new Error('Sessão expirada. Entre novamente para enviar imagens.');
    const uploaded = await uploadMedia(file, session.access_token);
    const item: MediaItem = { name: file.name, public_url: uploaded.publicUrl, storage_path: uploaded.path, alt_text: file.name };
    setMedia((current) => [item, ...current]);
    setStatus('Imagem enviada. Clique em Salvar para publicar a alteração.'); setStatusType('success');
    return uploaded.publicUrl;
  };
  const choosePage = (index: number) => {
    if (dirty && !confirm('Há alterações ainda não salvas. Deseja mudar de página mesmo assim?')) return;
    setSelectedIndex(index); setDirty(false); setStatusType('idle');
  };

  const chooseEdition = async (editionId: string) => {
    if (editionId === selectedEditionId) return;
    if (dirty && !confirm('Há alterações ainda não salvas. Deseja mudar de edição mesmo assim?')) return;
    setStatus('Carregando edição...'); setStatusType('saving');
    try {
      await loadEditionPages(editionId);
      setStatus('Edição carregada.'); setStatusType('success');
      setTimeout(() => setStatusType('idle'), 1800);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Não foi possível carregar a edição.');
      setStatusType('error');
    }
  };

  const refreshEditions = async (preferredEditionId?: string) => {
    if (!session?.access_token) return;
    const editionData = await rest<MagazineEdition[]>(
      'magazine_editions?select=id,slug,title,edition_number,status,cover_image_url,published_at,settings,created_at,updated_at&order=edition_number.asc',
      {},
      session.access_token,
    );
    setEditions(editionData);
    if (preferredEditionId) setSelectedEditionId(preferredEditionId);
  };

  const createEdition = async () => {
    if (!selectedEdition || !session?.access_token) return;
    if (dirty && !confirm('Há alterações ainda não salvas. Deseja criar outra edição sem salvá-las?')) return;
    const suggestedTitle = `Infojornal Val Advogado — Edição ${String(editions.length + 1).padStart(2, '0')}`;
    const title = prompt('Nome da nova edição:', suggestedTitle)?.trim();
    if (!title) return;
    setStatus('Criando nova edição com uma cópia segura da atual...'); setStatusType('saving');
    try {
      const created = await rest<MagazineEdition[]>('rpc/duplicate_magazine_edition', {
        method: 'POST',
        body: JSON.stringify({ source_edition_id: selectedEdition.id, new_title: title }),
      }, session.access_token);
      const nextEdition = created[0];
      if (!nextEdition) throw new Error('O Supabase não retornou a nova edição.');
      await refreshEditions(nextEdition.id);
      await loadEditionPages(nextEdition.id);
      setStatus('Nova edição criada como rascunho. A edição online não foi alterada.');
      setStatusType('success');
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Não foi possível criar a edição.');
      setStatusType('error');
    }
  };

  const publishEdition = async () => {
    if (!selectedEdition || !session?.access_token || selectedEdition.status === 'published') return;
    if (dirty) {
      setStatus('Salve as alterações desta página antes de publicar a edição.');
      setStatusType('error');
      return;
    }
    if (!confirm(`Colocar “${selectedEdition.title}” online? A edição atual será arquivada, mas continuará salva.`)) return;
    setStatus('Publicando edição...'); setStatusType('saving');
    try {
      const published = await rest<MagazineEdition[]>('rpc/publish_magazine_edition', {
        method: 'POST',
        body: JSON.stringify({ target_edition_id: selectedEdition.id }),
      }, session.access_token);
      if (!published[0]) throw new Error('O Supabase não confirmou a publicação.');
      await refreshEditions(selectedEdition.id);
      notifyMagazineEditionUpdated(selectedEdition.id);
      setStatus('Edição publicada. A revista online já foi atualizada.');
      setStatusType('success');
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Não foi possível publicar a edição.');
      setStatusType('error');
    }
  };

  if (loading) return <div className="admin-loading"><span className="ve-loader" /> Carregando editor visual...</div>;
  if (!page || !canvas) return <div className="admin-loading">Não foi possível carregar as páginas da revista.</div>;

  return (
    <main className="canva-admin-shell">
      <header className="canva-admin-topbar">
        <div className="canva-brand"><span>VA</span><div><b>VAL STUDIO</b><small>Editor da revista</small></div></div>
        <div className="canva-page-name">
          <label className="canva-edition-picker">
            <span>Edição</span>
            <select value={selectedEditionId} onChange={(event) => void chooseEdition(event.target.value)} disabled={statusType === 'saving'}>
              {editions.map((edition) => (
                <option value={edition.id} key={edition.id}>
                  {String(edition.edition_number).padStart(2, '0')} — {edition.title}{edition.status === 'published' ? ' • ONLINE' : ''}
                </option>
              ))}
            </select>
          </label>
          <small>Página {String(page.page_number).padStart(2, '0')}</small>
          <strong>{page.title || page.template}</strong>
          {selectedEdition?.status === 'published' && <span className="canva-online-badge">Online</span>}
          {dirty && <em>Alterações não salvas</em>}
        </div>
        <nav>
          <a href="/" target="_blank"><Home /> Site</a>
          <a href="/revista" target="_blank"><BookOpen /> Visualizar</a>
          <a href={`/impressao?edition=${encodeURIComponent(selectedEditionId)}`} target="_blank"><FileDown /> PDF</a>
          <button type="button" onClick={() => void createEdition()} disabled={statusType === 'saving'} title="Criar uma nova edição a partir desta"><Plus /> Nova edição</button>
          <button type="button" className="canva-publish" onClick={() => void publishEdition()} disabled={statusType === 'saving' || selectedEdition?.status === 'published'} title={selectedEdition?.status === 'published' ? 'Esta edição já está online' : 'Colocar esta edição online'}><RadioTower /> {selectedEdition?.status === 'published' ? 'Online' : 'Colocar online'}</button>
          <button type="button" className="canva-save" onClick={() => void savePage()} disabled={statusType === 'saving'}><Save /> {statusType === 'saving' ? 'Salvando...' : 'Salvar'}</button>
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
        onUploadError={(message) => { setStatus(message); setStatusType('error'); }}
      />

      <footer className="canva-page-strip">
        <div className="canva-page-strip-title"><Settings /><span><b>{pages.length} páginas</b><small>{selectedEdition?.status === 'published' ? 'Edição online' : 'Rascunho preservado'}</small></span></div>
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



