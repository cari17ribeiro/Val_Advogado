export type ElementType = 'text' | 'image' | 'shape' | 'icon';
export type TextAlign = 'left' | 'center' | 'right';
export type ImageFit = 'cover' | 'contain';
export type ImageFrameStyle = 'none' | 'rounded' | 'polaroid' | 'circle' | 'arch' | 'torn';

export type CanvasBackground = {
  type: 'color' | 'gradient' | 'image';
  value: string;
  fit?: ImageFit;
  positionX?: number;
  positionY?: number;
  overlay?: string;
};

export type CanvasElementBase = {
  id: string;
  type: ElementType;
  name: string;
  x: number;
  y: number;
  w: number;
  h: number;
  rotation: number;
  opacity: number;
  z: number;
  locked?: boolean;
  hidden?: boolean;
  allowBleed?: boolean;
};

export type TextElement = CanvasElementBase & {
  type: 'text';
  text: string;
  color: string;
  fontFamily: 'Inter' | 'Manrope' | 'Playfair Display' | 'Georgia' | 'Arial' | 'Arial Black';
  fontSize: number;
  minFontSize?: number;
  fontWeight: number;
  lineHeight: number;
  letterSpacing: number;
  align: TextAlign;
  italic?: boolean;
  uppercase?: boolean;
  background?: string;
  padding?: number;
  borderRadius?: number;
  strokeColor?: string;
  strokeWidth?: number;
};

export type ImageElement = CanvasElementBase & {
  type: 'image';
  src: string;
  alt?: string;
  fit: ImageFit;
  positionX: number;
  positionY: number;
  zoom: number;
  borderRadius: number;
  borderColor?: string;
  borderWidth?: number;
  frameStyle?: ImageFrameStyle;
  shadow?: string;
  filter?: string;
};

export type ShapeElement = CanvasElementBase & {
  type: 'shape';
  fill: string;
  borderColor: string;
  borderWidth: number;
  borderRadius: number;
  shadow?: string;
  clipPath?: string;
};

export type IconElement = CanvasElementBase & {
  type: 'icon';
  icon: string;
  color: string;
  background: string;
  padding: number;
  borderRadius: number;
};

export type CanvasElement = TextElement | ImageElement | ShapeElement | IconElement;

export type CanvasDocument = {
  version: 3;
  background: CanvasBackground;
  elements: CanvasElement[];
  safeArea: number;
  bleedMm: number;
  trim: { widthMm: 148; heightMm: 210 };
  designFamily?: string;
};

export type MagazinePage = {
  id: string;
  page_number: number;
  template: string;
  title: string | null;
  subtitle: string | null;
  body: string | null;
  quote: string | null;
  background: string | null;
  elements: Record<string, unknown> | null;
  is_published: boolean;
};

export type MediaItem = {
  id?: string;
  name: string;
  public_url: string;
  storage_path?: string;
  alt_text?: string | null;
};

export type PreflightIssue = {
  severity: 'error' | 'warning' | 'info';
  code: string;
  message: string;
  elementId?: string;
};

export const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
export const makeId = (prefix = 'el') => `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
