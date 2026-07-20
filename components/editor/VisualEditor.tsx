'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  AlignCenter, AlignLeft, AlignRight, AlertTriangle, ArrowDown, ArrowUp, CheckCircle2, Copy, ImagePlus,
  Info, Layers3, Lock, Maximize, MousePointer2, Palette, Plus, Redo2, RotateCcw,
  ScanLine, Shapes, Sparkles, Trash2, Type, Undo2, Unlock, Upload, ZoomIn, ZoomOut,
} from 'lucide-react';
import { CanvasPage, iconNames } from './CanvasRenderer';
import { clamp, makeId, type CanvasDocument, type CanvasElement, type IconElement, type ImageElement, type MediaItem, type PreflightIssue, type ShapeElement, type TextElement } from '@/lib/editor-types';

const clone = <T,>(value: T): T => JSON.parse(JSON.stringify(value));
const round = (value: number) => Math.round(value * 100) / 100;

const DEFAULT_IMAGE = 'https://i.ibb.co/gZQkNzDq/Capturar.png';

export type VisualEditorProps = {
  pageKey: string;
  document: CanvasDocument;
  onChange: (document: CanvasDocument) => void;
  onUpload: (file: File) => Promise<string>;
  media: MediaItem[];
  onResetTemplate: () => void;
};

type Gesture = {
  action: 'move' | 'resize';
  element: CanvasElement;
  startX: number;
  startY: number;
  rect: DOMRect;
};


function analyzeDocument(document: CanvasDocument): PreflightIssue[] {
  const issues: PreflightIssue[] = [];
  const safe = document.safeArea;
  for (const element of document.elements) {
    if (element.hidden) continue;
    if (!element.allowBleed && (
      element.x < safe || element.y < safe ||
      element.x + element.w > 100 - safe || element.y + element.h > 100 - safe
    )) {
      issues.push({ severity: 'warning', code: 'safe-area', elementId: element.id, message: `${element.name}: parte do elemento está fora da margem segura.` });
    }
    if (element.type === 'text') {
      if (!element.text.trim()) issues.push({ severity: 'error', code: 'empty-text', elementId: element.id, message: `${element.name}: caixa de texto vazia.` });
      if (element.fontSize < 1.15) issues.push({ severity: 'warning', code: 'small-text', elementId: element.id, message: `${element.name}: fonte pode ficar pequena na impressão.` });
      const capacity = Math.max(20, element.w * element.h * 1.15);
      if (element.text.length > capacity) issues.push({ severity: 'warning', code: 'dense-text', elementId: element.id, message: `${element.name}: texto muito denso para a caixa atual.` });
    }
    if (element.type === 'image') {
      if (!element.src.trim()) issues.push({ severity: 'error', code: 'missing-image', elementId: element.id, message: `${element.name}: selecione uma fotografia.` });
      if (element.fit === 'cover' && element.zoom > 145) issues.push({ severity: 'warning', code: 'image-crop', elementId: element.id, message: `${element.name}: zoom alto pode cortar a foto e reduzir a qualidade.` });
    }
  }
  if (!document.elements.some((element) => element.type === 'image')) {
    issues.push({ severity: 'info', code: 'no-image', message: 'Esta página não possui fotografias.' });
  }
  return issues;
}

function ColorControl({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  const safeColor = /^#[0-9a-f]{6}$/i.test(value) ? value : '#0f2744';
  return <label className="ve-field ve-color-field"><span>{label}</span><div><input type="color" value={safeColor} onChange={(event) => onChange(event.target.value)} /><input value={value} onChange={(event) => onChange(event.target.value)} /></div></label>;
}

function NumberControl({ label, value, min, max, step = 1, onChange }: { label: string; value: number; min?: number; max?: number; step?: number; onChange: (value: number) => void }) {
  return <label className="ve-field"><span>{label}</span><input type="number" value={Number.isFinite(value) ? value : 0} min={min} max={max} step={step} onChange={(event) => onChange(Number(event.target.value))} /></label>;
}

export function VisualEditor({ pageKey, document, onChange, onUpload, media, onResetTemplate }: VisualEditorProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [zoom, setZoom] = useState(62);
  const [showSafeArea, setShowSafeArea] = useState(true);
  const [showTrimGuide, setShowTrimGuide] = useState(true);
  const [undoStack, setUndoStack] = useState<CanvasDocument[]>([]);
  const [redoStack, setRedoStack] = useState<CanvasDocument[]>([]);
  const [uploading, setUploading] = useState(false);
  const canvasHostRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const replaceInputRef = useRef<HTMLInputElement>(null);
  const gestureRef = useRef<Gesture | null>(null);
  const docRef = useRef(document);

  useEffect(() => { docRef.current = document; }, [document]);
  useEffect(() => { setSelectedId(null); setUndoStack([]); setRedoStack([]); }, [pageKey]);

  const selected = useMemo(() => document.elements.find((element) => element.id === selectedId) || null, [document.elements, selectedId]);
  const preflight = useMemo(() => analyzeDocument(document), [document]);
  const preflightErrors = preflight.filter((issue) => issue.severity === 'error').length;
  const preflightWarnings = preflight.filter((issue) => issue.severity === 'warning').length;

  const emit = useCallback((next: CanvasDocument, remember = true) => {
    if (remember) {
      setUndoStack((stack) => [...stack.slice(-29), clone(docRef.current)]);
      setRedoStack([]);
    }
    docRef.current = next;
    onChange(next);
  }, [onChange]);

  const updateSelected = useCallback((patch: Partial<CanvasElement>, remember = true) => {
    if (!selectedId) return;
    const next = {
      ...docRef.current,
      elements: docRef.current.elements.map((element) => element.id === selectedId ? ({ ...element, ...patch } as CanvasElement) : element),
    };
    emit(next, remember);
  }, [emit, selectedId]);

  const replaceSelected = useCallback((element: CanvasElement, remember = true) => {
    const next = { ...docRef.current, elements: docRef.current.elements.map((item) => item.id === element.id ? element : item) };
    emit(next, remember);
  }, [emit]);

  const addElement = useCallback((element: CanvasElement) => {
    const highestZ = Math.max(0, ...docRef.current.elements.map((item) => item.z));
    const nextElement = { ...element, z: highestZ + 1 } as CanvasElement;
    emit({ ...docRef.current, elements: [...docRef.current.elements, nextElement] });
    setSelectedId(nextElement.id);
  }, [emit]);

  const addHeading = () => addElement({
    id: makeId('text'), type: 'text', name: 'Novo título', x: 10, y: 12, w: 70, h: 13,
    rotation: 0, opacity: 1, z: 1, text: 'Digite um título', color: '#0f2744',
    fontFamily: 'Playfair Display', fontSize: 6, minFontSize: 3, fontWeight: 800,
    lineHeight: .96, letterSpacing: -.03, align: 'left', padding: 0, borderRadius: 0,
  });
  const addParagraph = () => addElement({
    id: makeId('text'), type: 'text', name: 'Novo texto', x: 10, y: 30, w: 55, h: 18,
    rotation: 0, opacity: 1, z: 1, text: 'Adicione aqui o texto da página.', color: '#526b80',
    fontFamily: 'Inter', fontSize: 2, minFontSize: 1.2, fontWeight: 450,
    lineHeight: 1.45, letterSpacing: 0, align: 'left', padding: 0, borderRadius: 0,
  });
  const addShape = () => addElement({
    id: makeId('shape'), type: 'shape', name: 'Nova forma', x: 15, y: 20, w: 35, h: 18,
    rotation: 0, opacity: 1, z: 1, fill: '#dff6ff', borderColor: '#7dd3fc', borderWidth: 1, borderRadius: 4,
  });
  const addIcon = () => addElement({
    id: makeId('icon'), type: 'icon', name: 'Novo ícone', x: 12, y: 16, w: 10, h: 7,
    rotation: 0, opacity: 1, z: 1, icon: 'Sparkles', color: '#0284c7', background: '#e0f2fe', padding: 18, borderRadius: 24,
  });
  const addImage = (src: string, name = 'Nova fotografia') => addElement({
    id: makeId('image'), type: 'image', name, x: 18, y: 18, w: 45, h: 42,
    rotation: 0, opacity: 1, z: 1, src, alt: name, fit: 'cover', positionX: 50, positionY: 50,
    zoom: 100, borderRadius: 3, borderColor: 'transparent', borderWidth: 0, frameStyle: 'rounded', shadow: '0 10px 24px rgba(15,23,42,.12)',
  });

  const uploadNew = async (file?: File) => {
    if (!file) return;
    setUploading(true);
    try { addImage(await onUpload(file), file.name); }
    finally { setUploading(false); if (fileInputRef.current) fileInputRef.current.value = ''; }
  };
  const replaceImage = async (file?: File) => {
    if (!file || selected?.type !== 'image') return;
    setUploading(true);
    try { updateSelected({ src: await onUpload(file), name: file.name } as Partial<ImageElement>); }
    finally { setUploading(false); if (replaceInputRef.current) replaceInputRef.current.value = ''; }
  };

  const removeSelected = useCallback(() => {
    if (!selectedId) return;
    emit({ ...docRef.current, elements: docRef.current.elements.filter((element) => element.id !== selectedId) });
    setSelectedId(null);
  }, [emit, selectedId]);

  const duplicateSelected = useCallback(() => {
    if (!selected) return;
    const copy = { ...clone(selected), id: makeId(selected.type), name: `${selected.name} (cópia)`, x: clamp(selected.x + 2, 0, 100 - selected.w), y: clamp(selected.y + 2, 0, 100 - selected.h), z: Math.max(...document.elements.map((element) => element.z), 0) + 1 };
    addElement(copy);
  }, [addElement, document.elements, selected]);

  const layer = (direction: 'up' | 'down') => {
    if (!selected) return;
    updateSelected({ z: Math.max(0, selected.z + (direction === 'up' ? 1 : -1)) });
  };

  const undo = useCallback(() => {
    const previous = undoStack.at(-1);
    if (!previous) return;
    setUndoStack((stack) => stack.slice(0, -1));
    setRedoStack((stack) => [...stack.slice(-29), clone(docRef.current)]);
    docRef.current = previous; onChange(previous);
  }, [onChange, undoStack]);
  const redo = useCallback(() => {
    const next = redoStack.at(-1);
    if (!next) return;
    setRedoStack((stack) => stack.slice(0, -1));
    setUndoStack((stack) => [...stack.slice(-29), clone(docRef.current)]);
    docRef.current = next; onChange(next);
  }, [onChange, redoStack]);

  const startGesture = (event: React.PointerEvent<HTMLElement>, element: CanvasElement, action: 'move' | 'resize') => {
    const page = canvasHostRef.current?.querySelector('.canvas-page');
    if (!page) return;
    emit(clone(docRef.current));
    // The snapshot above is only for undo. Restore the visual document immediately.
    onChange(docRef.current);
    gestureRef.current = { action, element: clone(element), startX: event.clientX, startY: event.clientY, rect: page.getBoundingClientRect() };
    (event.currentTarget as HTMLElement).setPointerCapture?.(event.pointerId);
  };

  useEffect(() => {
    const move = (event: PointerEvent) => {
      const gesture = gestureRef.current;
      if (!gesture) return;
      const dx = (event.clientX - gesture.startX) / gesture.rect.width * 100;
      const dy = (event.clientY - gesture.startY) / gesture.rect.height * 100;
      let patch: Partial<CanvasElement>;
      if (gesture.action === 'move') {
        patch = { x: round(clamp(gesture.element.x + dx, 0, 100 - gesture.element.w)), y: round(clamp(gesture.element.y + dy, 0, 100 - gesture.element.h)) };
      } else {
        patch = { w: round(clamp(gesture.element.w + dx, 2, 100 - gesture.element.x)), h: round(clamp(gesture.element.h + dy, 2, 100 - gesture.element.y)) };
      }
      const next = { ...docRef.current, elements: docRef.current.elements.map((element) => element.id === gesture.element.id ? ({ ...element, ...patch } as CanvasElement) : element) };
      docRef.current = next; onChange(next);
    };
    const stop = () => { gestureRef.current = null; };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', stop);
    window.addEventListener('pointercancel', stop);
    return () => { window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', stop); window.removeEventListener('pointercancel', stop); };
  }, [onChange]);

  useEffect(() => {
    const keys = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      const typing = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable;
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'z') { event.preventDefault(); event.shiftKey ? redo() : undo(); return; }
      if (typing || !selected || selected.locked) return;
      if (event.key === 'Delete' || event.key === 'Backspace') { event.preventDefault(); removeSelected(); return; }
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'd') { event.preventDefault(); duplicateSelected(); return; }
      const step = event.shiftKey ? 1 : .25;
      if (event.key === 'ArrowLeft') updateSelected({ x: clamp(selected.x - step, 0, 100 - selected.w) });
      if (event.key === 'ArrowRight') updateSelected({ x: clamp(selected.x + step, 0, 100 - selected.w) });
      if (event.key === 'ArrowUp') updateSelected({ y: clamp(selected.y - step, 0, 100 - selected.h) });
      if (event.key === 'ArrowDown') updateSelected({ y: clamp(selected.y + step, 0, 100 - selected.h) });
    };
    window.addEventListener('keydown', keys);
    return () => window.removeEventListener('keydown', keys);
  }, [duplicateSelected, redo, removeSelected, selected, undo, updateSelected]);

  const elementList = [...document.elements].sort((a, b) => b.z - a.z);

  return (
    <div className="visual-editor">
      <aside className="ve-left-panel">
        <div className="ve-panel-title"><Plus size={16} /> Adicionar</div>
        <div className="ve-add-grid">
          <button type="button" onClick={addHeading}><Type /><span>Título</span></button>
          <button type="button" onClick={addParagraph}><Type /><span>Texto</span></button>
          <button type="button" onClick={() => fileInputRef.current?.click()}><ImagePlus /><span>Foto</span></button>
          <button type="button" onClick={addShape}><Shapes /><span>Forma</span></button>
          <button type="button" onClick={addIcon}><Sparkles /><span>Ícone</span></button>
          <button type="button" onClick={onResetTemplate}><RotateCcw /><span>Modelo</span></button>
        </div>
        <input ref={fileInputRef} hidden type="file" accept="image/*" onChange={(event) => uploadNew(event.target.files?.[0])} />

        <div className="ve-panel-title ve-panel-title-spaced"><ImagePlus size={16} /> Fotos</div>
        <div className="ve-media-grid">
          {media.slice(0, 8).map((item) => <button type="button" key={item.id || item.public_url} onClick={() => addImage(item.public_url, item.name)} title={item.name}>{/* eslint-disable-next-line @next/next/no-img-element */}<img src={item.public_url} alt={item.alt_text || item.name} /></button>)}
          {!media.length && <p>As fotos enviadas aparecerão aqui.</p>}
        </div>

        <div className="ve-panel-title ve-panel-title-spaced"><Layers3 size={16} /> Camadas</div>
        <div className="ve-layer-list">
          {elementList.map((element) => <button type="button" key={element.id} className={selectedId === element.id ? 'active' : ''} onClick={() => setSelectedId(element.id)}><span className={`ve-layer-type type-${element.type}`}>{element.type[0].toUpperCase()}</span><b>{element.name}</b>{element.locked && <Lock size={12} />}</button>)}
        </div>
      </aside>

      <section className="ve-center">
        <div className="ve-canvas-toolbar">
          <div>
            <button type="button" onClick={undo} disabled={!undoStack.length} title="Desfazer"><Undo2 /></button>
            <button type="button" onClick={redo} disabled={!redoStack.length} title="Refazer"><Redo2 /></button>
          </div>
          <div className="ve-guides"><label><input type="checkbox" checked={showSafeArea} onChange={(event) => setShowSafeArea(event.target.checked)} /> Margem segura</label><label><input type="checkbox" checked={showTrimGuide} onChange={(event) => setShowTrimGuide(event.target.checked)} /> Linha de corte</label></div>
          <div className="ve-zoom"><button type="button" onClick={() => setZoom((value) => clamp(value - 5, 30, 105))}><ZoomOut /></button><span>{zoom}%</span><button type="button" onClick={() => setZoom((value) => clamp(value + 5, 30, 105))}><ZoomIn /></button><button type="button" onClick={() => setZoom(62)} title="Ajustar"><Maximize /></button></div>
        </div>
        <div className="ve-stage" ref={canvasHostRef}>
          <div className="ve-page-scale" style={{ width: 744 * zoom / 100, height: 1052 * zoom / 100 }}>
            <div style={{ width: 744, height: 1052, transform: `scale(${zoom / 100})`, transformOrigin: 'top left' }}>
              <CanvasPage
                document={document}
                interactive
                selectedId={selectedId}
                showSafeArea={showSafeArea}
                showTrimGuide={showTrimGuide}
                onSelect={setSelectedId}
                onElementPointerDown={startGesture}
                onElementDoubleClick={(element) => { setSelectedId(element.id); setTimeout(() => window.document.getElementById('ve-text-content')?.focus(), 30); }}
              />
            </div>
          </div>
        </div>
      </section>

      <aside className="ve-right-panel">
        {!selected ? (
          <>
            <div className="ve-panel-title"><Palette size={16} /> Página</div>
            <label className="ve-field"><span>Tipo de fundo</span><select value={document.background.type} onChange={(event) => emit({ ...document, background: { ...document.background, type: event.target.value as CanvasDocument['background']['type'] } })}><option value="color">Cor</option><option value="gradient">Degradê</option><option value="image">Imagem</option></select></label>
            <ColorControl label="Cor rápida" value={document.background.value} onChange={(value) => emit({ ...document, background: { type: 'color', value } })} />
            <label className="ve-field"><span>Cor, degradê ou URL</span><textarea rows={4} value={document.background.value} onChange={(event) => emit({ ...document, background: { ...document.background, value: event.target.value } })} /></label>
            {document.background.type === 'image' && <><label className="ve-field"><span>Ajuste</span><select value={document.background.fit || 'cover'} onChange={(event) => emit({ ...document, background: { ...document.background, fit: event.target.value as 'cover' | 'contain' } })}><option value="cover">Preencher</option><option value="contain">Imagem inteira</option></select></label><label className="ve-field"><span>Sobreposição</span><input value={document.background.overlay || ''} onChange={(event) => emit({ ...document, background: { ...document.background, overlay: event.target.value } })} /></label></>}
            <div className={`ve-preflight ${preflightErrors ? 'has-errors' : preflightWarnings ? 'has-warnings' : 'is-ready'}`}>
              <div className="ve-preflight-title">
                {preflightErrors ? <AlertTriangle /> : preflightWarnings ? <ScanLine /> : <CheckCircle2 />}
                <span><b>{preflightErrors ? `${preflightErrors} erro(s)` : preflightWarnings ? `${preflightWarnings} alerta(s)` : 'Pronta para impressão'}</b><small>Pré-verificação A5 • sangria 3 mm</small></span>
              </div>
              <div className="ve-preflight-list">
                {preflight.slice(0, 6).map((issue, index) => <button type="button" key={`${issue.code}-${index}`} onClick={() => issue.elementId && setSelectedId(issue.elementId)}><span className={`severity-${issue.severity}`}>{issue.severity === 'error' ? <AlertTriangle /> : issue.severity === 'warning' ? <ScanLine /> : <Info />}</span>{issue.message}</button>)}
                {!preflight.length && <p>Nenhum problema básico detectado. Confira as imagens em 100% antes de enviar à gráfica.</p>}
              </div>
            </div>
            <div className="ve-help"><MousePointer2 /><p><b>Selecione um elemento</b> para editar. Arraste para mover e use o ponto azul para redimensionar.</p></div>
          </>
        ) : (
          <>
            <div className="ve-inspector-head"><div><small>{selected.type}</small><input value={selected.name} onChange={(event) => updateSelected({ name: event.target.value })} /></div><button type="button" onClick={() => updateSelected({ locked: !selected.locked })}>{selected.locked ? <Lock /> : <Unlock />}</button></div>
            <div className="ve-inline-actions">
              <button type="button" onClick={duplicateSelected} title="Duplicar"><Copy /></button>
              <button type="button" onClick={() => layer('up')} title="Trazer para frente"><ArrowUp /></button>
              <button type="button" onClick={() => layer('down')} title="Enviar para trás"><ArrowDown /></button>
              <button type="button" onClick={removeSelected} title="Excluir"><Trash2 /></button>
            </div>
            <div className="ve-grid-2">
              <NumberControl label="X (%)" value={selected.x} min={0} max={100} step={.1} onChange={(value) => updateSelected({ x: clamp(value, 0, 100 - selected.w) })} />
              <NumberControl label="Y (%)" value={selected.y} min={0} max={100} step={.1} onChange={(value) => updateSelected({ y: clamp(value, 0, 100 - selected.h) })} />
              <NumberControl label="Largura" value={selected.w} min={2} max={100} step={.1} onChange={(value) => updateSelected({ w: clamp(value, 2, 100 - selected.x) })} />
              <NumberControl label="Altura" value={selected.h} min={2} max={100} step={.1} onChange={(value) => updateSelected({ h: clamp(value, 2, 100 - selected.y) })} />
              <NumberControl label="Rotação" value={selected.rotation} min={-180} max={180} onChange={(value) => updateSelected({ rotation: value })} />
              <NumberControl label="Opacidade" value={Math.round(selected.opacity * 100)} min={0} max={100} onChange={(value) => updateSelected({ opacity: value / 100 })} />
            </div>

            {selected.type === 'text' && <TextInspector element={selected} onChange={(next) => replaceSelected(next)} />}
            {selected.type === 'image' && <ImageInspector element={selected} onChange={(next) => replaceSelected(next)} onReplace={() => replaceInputRef.current?.click()} uploading={uploading} />}
            {selected.type === 'shape' && <ShapeInspector element={selected} onChange={(next) => replaceSelected(next)} />}
            {selected.type === 'icon' && <IconInspector element={selected} onChange={(next) => replaceSelected(next)} />}
            <input ref={replaceInputRef} hidden type="file" accept="image/*" onChange={(event) => replaceImage(event.target.files?.[0])} />
          </>
        )}
        {uploading && <div className="ve-uploading"><Upload className="spin" /> Enviando imagemâ€¦</div>}
      </aside>
    </div>
  );
}

function TextInspector({ element, onChange }: { element: TextElement; onChange: (element: TextElement) => void }) {
  const patch = (value: Partial<TextElement>) => onChange({ ...element, ...value });
  return <div className="ve-type-inspector">
    <label className="ve-field"><span>Texto</span><textarea id="ve-text-content" rows={7} value={element.text} onChange={(event) => patch({ text: event.target.value })} /></label>
    <label className="ve-field"><span>Fonte</span><select value={element.fontFamily} onChange={(event) => patch({ fontFamily: event.target.value as TextElement['fontFamily'] })}><option>Arial Black</option><option>Manrope</option><option>Playfair Display</option><option>Inter</option><option>Georgia</option><option>Arial</option></select></label>
    <div className="ve-grid-2"><NumberControl label="Tamanho" value={element.fontSize} min={.8} max={14} step={.1} onChange={(fontSize) => patch({ fontSize })} /><NumberControl label="Peso" value={element.fontWeight} min={300} max={900} step={50} onChange={(fontWeight) => patch({ fontWeight })} /><NumberControl label="Entrelinhas" value={element.lineHeight} min={.7} max={2.2} step={.05} onChange={(lineHeight) => patch({ lineHeight })} /><NumberControl label="Espaçamento" value={element.letterSpacing} min={-.1} max={.3} step={.01} onChange={(letterSpacing) => patch({ letterSpacing })} /></div>
    <ColorControl label="Cor do texto" value={element.color} onChange={(color) => patch({ color })} />
    <div className="ve-align"><button type="button" className={element.align === 'left' ? 'active' : ''} onClick={() => patch({ align: 'left' })}><AlignLeft /></button><button type="button" className={element.align === 'center' ? 'active' : ''} onClick={() => patch({ align: 'center' })}><AlignCenter /></button><button type="button" className={element.align === 'right' ? 'active' : ''} onClick={() => patch({ align: 'right' })}><AlignRight /></button><button type="button" className={element.italic ? 'active' : ''} onClick={() => patch({ italic: !element.italic })}><i>I</i></button></div>
  </div>;
}

function ImageInspector({ element, onChange, onReplace, uploading }: { element: ImageElement; onChange: (element: ImageElement) => void; onReplace: () => void; uploading: boolean }) {
  const patch = (value: Partial<ImageElement>) => onChange({ ...element, ...value });
  return <div className="ve-type-inspector">
    <button type="button" className="ve-replace-button" onClick={onReplace}><Upload /> {uploading ? 'Enviandoâ€¦' : 'Substituir fotografia'}</button>
    <label className="ve-field"><span>URL</span><textarea rows={3} value={element.src} onChange={(event) => patch({ src: event.target.value })} /></label>
    <label className="ve-field"><span>Ajuste</span><select value={element.fit} onChange={(event) => patch({ fit: event.target.value as ImageElement['fit'] })}><option value="cover">Preencher moldura</option><option value="contain">Mostrar imagem inteira</option></select></label>
    <label className="ve-field"><span>Estilo da foto</span><select value={element.frameStyle || 'rounded'} onChange={(event) => patch({ frameStyle: event.target.value as ImageElement['frameStyle'] })}><option value="none">Sem moldura</option><option value="rounded">Editorial arredondada</option><option value="polaroid">Foto impressa</option><option value="circle">Circular</option><option value="arch">Arco</option><option value="torn">Papel rasgado</option></select></label>
    <label className="ve-range"><span>Posição horizontal <b>{element.positionX}%</b></span><input type="range" min="0" max="100" value={element.positionX} onChange={(event) => patch({ positionX: Number(event.target.value) })} /></label>
    <label className="ve-range"><span>Posição vertical <b>{element.positionY}%</b></span><input type="range" min="0" max="100" value={element.positionY} onChange={(event) => patch({ positionY: Number(event.target.value) })} /></label>
    <label className="ve-range"><span>Zoom <b>{element.zoom}%</b></span><input type="range" min="70" max="180" value={element.zoom} onChange={(event) => patch({ zoom: Number(event.target.value) })} /></label>
    <div className="ve-grid-2"><NumberControl label="Cantos" value={element.borderRadius} min={0} max={50} step={.5} onChange={(borderRadius) => patch({ borderRadius })} /><NumberControl label="Borda" value={element.borderWidth || 0} min={0} max={10} onChange={(borderWidth) => patch({ borderWidth })} /></div>
    <label className="ve-field"><span>Sombra CSS</span><input value={element.shadow || ''} placeholder="0 10px 24px rgba(...)" onChange={(event) => patch({ shadow: event.target.value })} /></label>
  </div>;
}

function ShapeInspector({ element, onChange }: { element: ShapeElement; onChange: (element: ShapeElement) => void }) {
  const patch = (value: Partial<ShapeElement>) => onChange({ ...element, ...value });
  return <div className="ve-type-inspector"><ColorControl label="Preenchimento" value={element.fill} onChange={(fill) => patch({ fill })} /><ColorControl label="Cor da borda" value={element.borderColor} onChange={(borderColor) => patch({ borderColor })} /><div className="ve-grid-2"><NumberControl label="Borda" value={element.borderWidth} min={0} max={12} onChange={(borderWidth) => patch({ borderWidth })} /><NumberControl label="Cantos" value={element.borderRadius} min={0} max={50} step={.5} onChange={(borderRadius) => patch({ borderRadius })} /></div></div>;
}

function IconInspector({ element, onChange }: { element: IconElement; onChange: (element: IconElement) => void }) {
  const patch = (value: Partial<IconElement>) => onChange({ ...element, ...value });
  return <div className="ve-type-inspector"><label className="ve-field"><span>Ícone</span><select value={element.icon} onChange={(event) => patch({ icon: event.target.value })}>{iconNames.map((name) => <option key={name}>{name}</option>)}</select></label><ColorControl label="Cor do ícone" value={element.color} onChange={(color) => patch({ color })} /><ColorControl label="Fundo" value={element.background} onChange={(background) => patch({ background })} /><div className="ve-grid-2"><NumberControl label="Espaço interno" value={element.padding} min={0} max={45} onChange={(padding) => patch({ padding })} /><NumberControl label="Cantos" value={element.borderRadius} min={0} max={50} onChange={(borderRadius) => patch({ borderRadius })} /></div></div>;
}


