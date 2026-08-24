'use client';

import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import {
  Accessibility, BookOpen, CalendarDays, Download, Dumbbell, GraduationCap,
  HeartHandshake, HeartPulse, Layers3, MapPinned, Medal, MessageCircle,
  PawPrint, PhoneCall, QrCode, Scale, School, Share2, ShieldCheck, Sparkles,
  Swords, Users, type LucideIcon,
} from 'lucide-react';
import { hyphenateSync } from 'hyphen/pt';
import type { CanvasDocument, CanvasElement, IconElement, ImageElement, TextElement } from '@/lib/editor-types';

const ICONS: Record<string, LucideIcon> = {
  Accessibility, BookOpen, CalendarDays, Download, Dumbbell, GraduationCap,
  HeartHandshake, HeartPulse, Layers3, MapPinned, Medal, MessageCircle,
  PawPrint, PhoneCall, QrCode, Scale, School, Share2, ShieldCheck, Sparkles,
  Swords, Users,
};

const PRINT_FONT_STACKS: Record<string, string> = {
  'Arial Black': 'Manrope, var(--font-manrope), Arial Black, Arial, sans-serif',
  Inter: 'Inter, var(--font-inter), Arial, sans-serif',
  Georgia: '"Playfair Display", var(--font-playfair), Georgia, serif',
  Manrope: 'Manrope, var(--font-manrope), Arial, sans-serif',
  'DM Sans': '"DM Sans", var(--font-dm-sans), Arial, sans-serif',
};

export const iconNames = Object.keys(ICONS);

export function backgroundStyle(background: CanvasDocument['background']): React.CSSProperties {
  if (background.type === 'image') {
    return {
      backgroundColor: '#f7fbff',
      backgroundImage: `${background.overlay ? `${background.overlay},` : ''}url("${background.value}")`,
      backgroundSize: background.fit || 'cover',
      backgroundPosition: `${background.positionX ?? 50}% ${background.positionY ?? 50}%`,
      backgroundRepeat: 'no-repeat',
    };
  }
  return { background: background.value };
}

export function elementBoxStyle(element: CanvasElement): React.CSSProperties {
  return {
    '--canvas-x': `${element.x}%`, '--canvas-y': `${element.y}%`, '--canvas-w': `${element.w}%`, '--canvas-h': `${element.h}%`,
    left: 'var(--canvas-x)', top: 'var(--canvas-y)', width: 'var(--canvas-w)', height: 'var(--canvas-h)',
    opacity: element.opacity, transform: `rotate(${element.rotation}deg)`, zIndex: element.z,
    display: element.hidden ? 'none' : undefined,
  } as React.CSSProperties;
}

function CanvasText({ element, autoFit = false }: { element: TextElement; autoFit?: boolean }) {
  const textRef = useRef<HTMLDivElement>(null);
  const [fontSize, setFontSize] = useState(element.fontSize);
  const [lineHeight, setLineHeight] = useState(element.lineHeight);
  const [fitReady, setFitReady] = useState(false);
  const [fitOverflow, setFitOverflow] = useState(false);
  const isJustified = element.align === 'justify';
  const renderedText = useMemo(
    () => (isJustified ? hyphenateSync(element.text) : element.text),
    [element.text, isJustified],
  );

  useLayoutEffect(() => {
    const node = textRef.current;
    if (!node) return;

    let cancelled = false;
    const fitText = async () => {
      setFitReady(false);
      setFitOverflow(false);
      setFontSize(element.fontSize);
      setLineHeight(element.lineHeight);

      if (!autoFit) {
        node.style.fontSize = `${element.fontSize}cqw`;
        node.style.lineHeight = String(element.lineHeight);
        setFitReady(true);
        return;
      }

      await Promise.race([
        document.fonts.ready,
        new Promise<void>((resolve) => { window.setTimeout(resolve, 4000); }),
      ]);
      if (cancelled) return;

      const frame = () => new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
      const overflows = () => node.scrollHeight > node.clientHeight + 1 || node.scrollWidth > node.clientWidth + 1;
      const applySize = (size: number) => { node.style.fontSize = `${size}cqw`; };
      const configuredMinimum = element.minFontSize ?? element.fontSize * 0.72;
      const minimum = Math.min(
        element.fontSize,
        Math.max(1.48, Math.min(configuredMinimum, element.fontSize * 0.72)),
      );
      let fittedSize = element.fontSize;
      let fittedLineHeight = element.lineHeight;

      applySize(fittedSize);
      node.style.lineHeight = String(fittedLineHeight);
      await frame();

      if (overflows()) {
        applySize(minimum);
        await frame();

        if (overflows()) {
          fittedLineHeight = Math.max(1, Math.min(element.lineHeight, 1.05));
          node.style.lineHeight = String(fittedLineHeight);
          await frame();
          fittedSize = minimum;
          if (overflows()) setFitOverflow(true);
        } else {
          let low = minimum;
          let high = element.fontSize;
          for (let attempt = 0; attempt < 12; attempt += 1) {
            const candidate = (low + high) / 2;
            applySize(candidate);
            await frame();
            if (cancelled) return;
            if (overflows()) high = candidate;
            else low = candidate;
          }
          fittedSize = low;
        }
      }

      if (!cancelled) {
        applySize(fittedSize);
        setFontSize(fittedSize);
        setLineHeight(fittedLineHeight);
        setFitReady(true);
      }
    };

    void fitText();

    return () => {
      cancelled = true;
    };
  }, [
    element.text,
    element.fontFamily,
    element.fontSize,
    element.fontWeight,
    element.lineHeight,
    element.letterSpacing,
    element.w,
    element.h,
    element.minFontSize,
    element.align,
    autoFit,
  ]);

  return (
    <div
      ref={textRef}
      lang="pt-BR"
      className="canvas-text-autofit"
      data-align={element.align}
      data-fit-ready={fitReady ? 'true' : 'false'}
      data-fit-overflow={fitOverflow ? 'true' : 'false'}
      data-original-font-size={element.fontSize}
      data-fitted-font-size={fontSize}
      style={{
        color: element.color,
        fontFamily: PRINT_FONT_STACKS[element.fontFamily] || `'${element.fontFamily}', Arial, sans-serif`,
        fontSize: `${fontSize}cqw`,
        fontWeight: element.fontWeight,
        lineHeight,
        letterSpacing: `${element.letterSpacing}em`,
        textAlign: element.align,
        textAlignLast: isJustified ? 'left' : undefined,
        textJustify: isJustified ? 'inter-word' : undefined,
        textWrap: isJustified ? 'pretty' : undefined,
        wordBreak: isJustified ? 'normal' : undefined,
        overflowWrap: 'break-word',
        hyphens: isJustified ? 'auto' : undefined,
        fontStyle: element.italic ? 'italic' : 'normal',
        textTransform: element.uppercase ? 'uppercase' : 'none',
        background: element.background || 'transparent',
        padding: `${element.padding ?? 0}cqw`,
        borderRadius: `${element.borderRadius ?? 0}cqw`,
        WebkitTextStroke: element.strokeWidth ? `${element.strokeWidth}px ${element.strokeColor || '#000000'}` : undefined,
        overflow: fitOverflow ? 'visible' : undefined,
      } as React.CSSProperties}
    >{renderedText}</div>
  );
}

function imageFrameStyle(element: ImageElement): React.CSSProperties {
  const frame = element.frameStyle || 'rounded';
  const base: React.CSSProperties = {
    borderRadius: `${element.borderRadius}cqw`,
    border: `${element.borderWidth ?? 0}px solid ${element.borderColor || 'transparent'}`,
    boxShadow: element.shadow,
  };
  if (frame === 'polaroid') return { ...base, background: '#fff', padding: '2.2%', borderRadius: '1.1cqw', boxShadow: element.shadow || '0 1.2cqw 2.4cqw rgba(15,23,42,.18)' };
  if (frame === 'circle') return { ...base, borderRadius: '50%' };
  if (frame === 'arch') return { ...base, borderRadius: '50% 50% 6% 6% / 35% 35% 6% 6%' };
  if (frame === 'torn') return { ...base, borderRadius: 0, clipPath: 'polygon(1% 2%,10% 0,18% 2%,28% 0,39% 2%,49% 0,59% 2%,70% 0,81% 2%,91% 0,99% 2%,100% 96%,92% 98%,83% 96%,73% 100%,62% 97%,51% 100%,40% 97%,29% 100%,18% 97%,8% 100%,0 97%)' };
  if (frame === 'none') return { ...base, borderRadius: 0 };
  return base;
}

export function CanvasElementView({ element, autoFitText = false }: { element: CanvasElement; autoFitText?: boolean }) {
  if (element.type === 'text') return <CanvasText element={element} autoFit={autoFitText} />;
  if (element.type === 'image') {
    return (
      <div className={`canvas-image-frame frame-${element.frameStyle || 'rounded'}`} style={imageFrameStyle(element)}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={element.src}
          alt={element.alt || ''}
          draggable={false}
          loading="eager"
          decoding="async"
          style={{
            objectFit: element.fit,
            objectPosition: `${element.positionX}% ${element.positionY}%`,
            transform: `scale(${element.zoom / 100})`,
            filter: element.filter,
          }}
        />
      </div>
    );
  }
  if (element.type === 'shape') {
    return <div className="canvas-shape" style={{ background: element.fill, border: `${element.borderWidth}px solid ${element.borderColor}`, borderRadius: `${element.borderRadius}cqw`, boxShadow: element.shadow, clipPath: element.clipPath }} />;
  }
  const Icon = ICONS[(element as IconElement).icon] || Sparkles;
  return (
    <div
      className="canvas-icon"
      style={{ color: element.color, background: element.background, padding: `${element.padding}%`, borderRadius: `${element.borderRadius}%` }}
    ><Icon strokeWidth={1.8} /></div>
  );
}

export type CanvasPageProps = {
  document: CanvasDocument;
  className?: string;
  selectedId?: string | null;
  interactive?: boolean;
  autoFitText?: boolean;
  showSafeArea?: boolean;
  showTrimGuide?: boolean;
  onSelect?: (id: string | null) => void;
  onElementPointerDown?: (event: React.PointerEvent<HTMLElement>, element: CanvasElement, action: 'move' | 'resize') => void;
  onElementDoubleClick?: (element: CanvasElement) => void;
};

export function CanvasPage({
  document, className = '', selectedId, interactive = false, autoFitText = false, showSafeArea = false, showTrimGuide = false,
  onSelect, onElementPointerDown, onElementDoubleClick,
}: CanvasPageProps) {
  const sorted = useMemo(() => [...document.elements].sort((a, b) => a.z - b.z), [document.elements]);
  return (
    <div
      className={`canvas-page ${className}`}
      style={backgroundStyle(document.background)}
      onPointerDown={(event) => { if (event.target === event.currentTarget) onSelect?.(null); }}
    >
      {sorted.map((element) => (
        <div
          key={element.id}
          className={`canvas-element canvas-element-${element.type} ${selectedId === element.id ? 'is-selected' : ''} ${element.locked ? 'is-locked' : ''}`}
          style={elementBoxStyle(element)}
          data-allow-bleed={element.allowBleed ? 'true' : 'false'}
          data-bleed-left={element.allowBleed && element.x <= .5 ? 'true' : 'false'}
          data-bleed-right={element.allowBleed && element.x + element.w >= 99.5 ? 'true' : 'false'}
          data-bleed-top={element.allowBleed && element.y <= .5 ? 'true' : 'false'}
          data-bleed-bottom={element.allowBleed && element.y + element.h >= 99.5 ? 'true' : 'false'}
          onPointerDown={(event) => {
            if (!interactive) return;
            event.stopPropagation();
            onSelect?.(element.id);
            if (!element.locked) onElementPointerDown?.(event, element, 'move');
          }}
          onDoubleClick={(event) => { event.stopPropagation(); onElementDoubleClick?.(element); }}
        >
          <CanvasElementView element={element} autoFitText={autoFitText} />
          {interactive && selectedId === element.id && !element.locked && (
            <>
              <span className="canvas-selection-label">{element.name}</span>
              <button
                type="button"
                className="canvas-resize-handle"
                aria-label="Redimensionar elemento"
                onPointerDown={(event) => {
                  event.stopPropagation();
                  onElementPointerDown?.(event, element, 'resize');
                }}
              />
            </>
          )}
        </div>
      ))}
      {showTrimGuide && <div className="canvas-trim-guide" />}
      {showSafeArea && <div className="canvas-safe-area" style={{ inset: `${document.safeArea}%` }} />}
    </div>
  );
}
