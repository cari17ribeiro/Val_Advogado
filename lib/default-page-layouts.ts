import type {
  CanvasDocument, CanvasElement, ImageElement, MagazinePage, ShapeElement, TextElement,
} from './editor-types';

export const ASSETS = {
  portrait: '/media/val/capa-sem-fundo.png',
  mosaic: '/media/val/referencia-capa.png',
  logo: '/media/val-logo.jpg',
  gabinete: '/media/val/val-gabinete.jpg',
  luvas: '/media/val/esporte-02.jpg',
  acao: '/media/val/val-rua.jpg',
  familia: '/media/val/familia-01.jpg',
  inclusao: '/media/val/inclusao-01.jpg',
  autismTexture: 'https://suwjmyetnifzeehirpxt.supabase.co/storage/v1/object/public/val-media/uploads/1784590506572-um-close-up-de-um-fundo-colorido-com-pecas-de-quebra-cabeca-generativo-ai-1034560-78805.jpg',
  renata: '/media/val/renata-01.jpg',
  demoMeeting: '/media/val/val-gabinete.jpg',
  demoMartialArts: '/media/val/esporte-02.jpg',
  demoBoxing: '/media/val/esporte-01.jpg',
  demoFamily: '/media/val/familia-01.jpg',
  demoChild: '/media/val/inclusao-02.jpg',
  demoHealthcare: '/media/val/renata-02.jpg',
  demoEducation: '/media/val/inclusao-01.jpg',
  demoAnimalCare: '/media/val/val-oficial.jpg',
};

const COLORS = {
  navy: '#071f38',
  blue: '#075985',
  royal: '#0369a1',
  cyan: '#06b6d4',
  light: '#edf8fc',
  paper: '#f8fbfc',
  ink: '#0b2745',
  muted: '#263f55',
  green: '#16a34a',
};

const base = (id: string, name: string, x: number, y: number, w: number, h: number, z = 1) => ({
  id, name, x, y, w, h, z, rotation: 0, opacity: 1,
});

const text = (
  id: string,
  name: string,
  value: string,
  x: number,
  y: number,
  w: number,
  h: number,
  fontSize: number,
  options: Partial<TextElement> = {},
): TextElement => ({
  ...base(id, name, x, y, w, h, options.z ?? 10),
  type: 'text',
  text: value,
  color: options.color ?? COLORS.ink,
  fontFamily: options.fontFamily ?? 'Arial Black',
  fontSize,
  minFontSize: options.minFontSize ?? Math.max(1.45, fontSize * 0.72),
  fontWeight: options.fontWeight ?? 800,
  lineHeight: options.lineHeight ?? .94,
  letterSpacing: options.letterSpacing ?? 0,
  align: options.align ?? 'left',
  italic: options.italic ?? false,
  uppercase: options.uppercase ?? false,
  background: options.background ?? 'transparent',
  padding: options.padding ?? 0,
  borderRadius: options.borderRadius ?? 0,
  strokeColor: options.strokeColor,
  strokeWidth: options.strokeWidth,
  opacity: options.opacity ?? 1,
  rotation: options.rotation ?? 0,
  locked: options.locked,
  hidden: options.hidden,
  allowBleed: options.allowBleed,
});

const image = (
  id: string,
  name: string,
  src: string,
  x: number,
  y: number,
  w: number,
  h: number,
  options: Partial<ImageElement> = {},
): ImageElement => ({
  ...base(id, name, x, y, w, h, options.z ?? 3),
  type: 'image', src,
  alt: options.alt ?? name,
  fit: options.fit ?? 'cover',
  positionX: options.positionX ?? 50,
  positionY: options.positionY ?? 50,
  zoom: options.zoom ?? 100,
  borderRadius: options.borderRadius ?? 2,
  borderColor: options.borderColor ?? 'transparent',
  borderWidth: options.borderWidth ?? 0,
  frameStyle: options.frameStyle ?? 'rounded',
  shadow: options.shadow,
  filter: options.filter,
  opacity: options.opacity ?? 1,
  rotation: options.rotation ?? 0,
  locked: options.locked,
  hidden: options.hidden,
  allowBleed: options.allowBleed,
});

const shape = (
  id: string,
  name: string,
  x: number,
  y: number,
  w: number,
  h: number,
  fill: string,
  options: Partial<ShapeElement> = {},
): ShapeElement => ({
  ...base(id, name, x, y, w, h, options.z ?? 1),
  type: 'shape', fill,
  borderColor: options.borderColor ?? 'transparent',
  borderWidth: options.borderWidth ?? 0,
  borderRadius: options.borderRadius ?? 0,
  shadow: options.shadow,
  clipPath: options.clipPath,
  opacity: options.opacity ?? 1,
  rotation: options.rotation ?? 0,
  locked: options.locked,
  hidden: options.hidden,
  allowBleed: options.allowBleed,
});

const icon = (
  id: string,
  name: string,
  iconName: string,
  x: number,
  y: number,
  w: number,
  h: number,
  color = COLORS.cyan,
  background = '#ffffff',
): CanvasElement => ({
  ...base(id, name, x, y, w, h, 12),
  type: 'icon', icon: iconName, color, background, padding: 18, borderRadius: 22,
});

const body = (id: string, value: string, x: number, y: number, w: number, h: number, options: Partial<TextElement> = {}) =>
  text(id, 'Texto', value, x, y, w, h, options.fontSize ?? 2.28, {
    fontFamily: 'Inter', fontWeight: 650, lineHeight: 1.3, letterSpacing: 0, color: COLORS.muted, minFontSize: options.minFontSize ?? 1.82, ...options,
  });

const label = (page: MagazinePage, color = COLORS.blue) => text(
  `p${page.page_number}-label`, 'Cabeçalho editorial', `VAL ADVOGADO  •  INFOJORNAL  •  ${String(page.page_number).padStart(2, '0')}`,
  5.5, 3.4, 58, 2.8, 1.22,
  { color, fontFamily: 'Inter', fontWeight: 900, letterSpacing: .08, lineHeight: 1, uppercase: true },
);

const rule = (id: string, y = 7.2, fill = COLORS.blue) => shape(id, 'Linha editorial', 5.5, y, 89, .35, fill, { locked: true, z: 30 });
const pageNumber = (page: MagazinePage, color = '#64748b') => text(
  `p${page.page_number}-number`, 'Número da página', String(page.page_number).padStart(2, '0'), 88.5, 95.2, 5.5, 2.2, 1.15,
  { color, fontFamily: 'Inter', fontWeight: 800, align: 'right', letterSpacing: .04 },
);

const document = (page: MagazinePage, elements: CanvasElement[], background: CanvasDocument['background'], family: string, numbered = true): CanvasDocument => ({
  version: 3,
  background,
  safeArea: 5.4,
  bleedMm: 3,
  trim: { widthMm: 148, heightMm: 210 },
  designFamily: family,
  elements: numbered ? [...elements, pageNumber(page)] : elements,
});

const quote = (id: string, value: string, x: number, y: number, w: number, h: number, color = COLORS.blue) => [
  text(`${id}-mark`, 'Aspas', 'â€œ', x, y - 1, 8, 8, 6.5, { color, fontFamily: 'Georgia', fontWeight: 900, lineHeight: .9 }),
  text(id, 'Frase de destaque', value, x + 5, y, w - 5, h, 2.45, { color, fontFamily: 'Georgia', fontWeight: 800, lineHeight: 1.12, italic: true, letterSpacing: 0, minFontSize: 1.75 }),
];

function page1(page: MagazinePage) {
  return document(page, [
    shape('p1-bg-new', 'Fundo da capa', 0, 0, 100, 100, 'linear-gradient(145deg,#06172a 0%,#0b3458 55%,#0784a7 100%)', { allowBleed: true, locked: true, z: 1 }),
    image('p1-texture-new', 'Foto de textura editorial', ASSETS.mosaic, 0, 0, 100, 100, { frameStyle: 'none', borderRadius: 0, fit: 'cover', filter: 'grayscale(1) contrast(1.05)', opacity: .16, allowBleed: true, locked: true, z: 2 }),
    shape('p1-cut-top-new', 'Plano claro superior', 0, 0, 100, 21, '#f8fcfd', { allowBleed: true, locked: true, z: 4, clipPath: 'polygon(0 0,100% 0,100% 62%,0 100%)' }),
    shape('p1-cut-bottom-new', 'Plano editorial inferior', 0, 70, 100, 30, '#f8fcfd', { allowBleed: true, locked: true, z: 4, clipPath: 'polygon(0 26%,100% 0,100% 100%,0 100%)' }),
    shape('p1-cyan-bar-new', 'Barra de capa', 5.5, 23.5, 3.2, 34, COLORS.cyan, { z: 8 }),
    image('p1-portrait-new', 'Retrato principal em destaque', ASSETS.portrait, 35, 16, 63, 84, { fit: 'contain', frameStyle: 'none', borderRadius: 0, positionX: 52, positionY: 100, allowBleed: true, z: 12 }),
    shape('p1-name-plate-new', 'Faixa do nome', 5.5, 8.4, 63, 10.6, '#ffffff', { borderRadius: 1.8, shadow: '0 14px 30px rgba(7,31,56,.16)', z: 15 }),
    image('p1-logo-new', 'Logotipo', ASSETS.logo, 7.5, 10, 29, 6.8, { fit: 'contain', frameStyle: 'none', z: 18 }),
    text('p1-issue-new', 'Edição', 'INFOJORNAL 01 | 2026', 39, 11.4, 27, 4.1, 1.35, { color: COLORS.blue, fontFamily: 'Inter', fontWeight: 900, align: 'right', letterSpacing: .04, z: 18 }),
    text('p1-title-new', 'Título da capa', 'VAL\nADVOGADO', 11.5, 25, 43, 18, 6.15, { color: '#ffffff', minFontSize: 4.7, lineHeight: .88, z: 18 }),
    text('p1-slogan-new', 'Chamada principal', page.body || 'Presença que cuida. Trabalho que transforma.', 11.5, 45.5, 43, 15, 3.8, { color: '#bff4ff', minFontSize: 3.15, lineHeight: 1, z: 18 }),
    body('p1-deck-new', 'Uma vida transformada pela educação. Um mandato dedicado a ouvir, fiscalizar e buscar recursos para melhorar a vida de quem mora em Guarujá.', 11.7, 61.8, 36, 10.8, { color: '#e7fbff', fontSize: 1.6, minFontSize: 1.35, lineHeight: 1.26, fontWeight: 700, z: 18 }),
    shape('p1-metric-a-new', 'Destaque inclusão', 6, 79, 25, 10.2, '#ffffff', { borderRadius: 2.2, z: 18, shadow: '0 10px 24px rgba(7,31,56,.16)' }),
    shape('p1-metric-b-new', 'Destaque esporte', 33, 79, 25, 10.2, '#ffffff', { borderRadius: 2.2, z: 18, shadow: '0 10px 24px rgba(7,31,56,.16)' }),
    shape('p1-metric-c-new', 'Destaque segurança', 60, 79, 28, 10.2, '#ffffff', { borderRadius: 2.2, z: 18, shadow: '0 10px 24px rgba(7,31,56,.16)' }),
    text('p1-metric-a-no-new', 'Valor inclusão', 'R$ 1 mi+', 8, 81, 19, 3.4, 1.85, { color: COLORS.blue, fontFamily: 'Arial Black', fontWeight: 900, z: 20 }),
    text('p1-metric-a-txt-new', 'Legenda inclusão', 'Inclusão e TEA', 8, 85, 19, 2.3, 1.05, { color: COLORS.muted, fontFamily: 'Inter', fontWeight: 800, z: 20 }),
    text('p1-metric-b-no-new', 'Valor esporte', 'R$ 710 mil+', 35, 81, 20, 3.4, 1.85, { color: COLORS.blue, fontFamily: 'Arial Black', fontWeight: 900, z: 20 }),
    text('p1-metric-b-txt-new', 'Legenda esporte', 'Esporte social', 35, 85, 19, 2.3, 1.05, { color: COLORS.muted, fontFamily: 'Inter', fontWeight: 800, z: 20 }),
    text('p1-metric-c-no-new', 'Valor segurança', 'R$ 2 mi', 62, 81, 20, 3.4, 1.85, { color: COLORS.blue, fontFamily: 'Arial Black', fontWeight: 900, z: 20 }),
    text('p1-metric-c-txt-new', 'Legenda segurança', 'Segurança pública', 62, 85, 22, 2.3, 1.05, { color: COLORS.muted, fontFamily: 'Inter', fontWeight: 800, z: 20 }),
  ], { type: 'color', value: '#06172a' }, 'capa-infojornal-moderna', false);

  return document(page, [
    image('p1-collage', 'Mosaico de fundo', ASSETS.mosaic, 0, 0, 46, 100, { frameStyle: 'none', borderRadius: 0, filter: 'grayscale(1) contrast(.9)', opacity: .44, allowBleed: true, locked: true, z: 1 }),
    shape('p1-wash', 'Banho azul', 0, 0, 46, 100, 'linear-gradient(180deg,rgba(3,105,161,.86),rgba(7,31,56,.94))', { allowBleed: true, locked: true, z: 2 }),
    shape('p1-white', 'Painel branco', 42, 0, 58, 100, '#f9fcfd', { allowBleed: true, locked: true, z: 2 }),
    shape('p1-orbit', 'Circulo editorial', 80, -5, 28, 20, 'radial-gradient(circle,rgba(6,182,212,.20) 0 32%,transparent 33%),radial-gradient(circle,transparent 0 51%,rgba(7,89,133,.12) 52% 54%,transparent 55%)', { allowBleed: true, locked: true, z: 3 }),
    shape('p1-grid', 'Textura editorial', 45, 73, 55, 27, 'linear-gradient(rgba(7,89,133,.055) 1px,transparent 1px),linear-gradient(90deg,rgba(7,89,133,.055) 1px,transparent 1px)', { allowBleed: true, locked: true, z: 3 }),
    image('p1-portrait', 'Retrato principal', ASSETS.portrait, 2, 35, 63, 65, { fit: 'cover', frameStyle: 'none', borderRadius: 0, positionX: 50, positionY: 50, allowBleed: true, z: 8 }),
    image('p1-logo', 'Logotipo', ASSETS.logo, 56, 6, 31, 10, { fit: 'contain', frameStyle: 'none', z: 15 }),
    text('p1-issue', 'Numero da edicao', '01', 91, 18, 6, 8, 3.9, { color: '#d8eef5', fontFamily: 'Manrope', fontWeight: 800, align: 'right', z: 12 }),
    text('p1-kicker', 'Edição', 'INFOJORNAL • EDIÇÃO 01 • 2026', 52, 21, 40, 4, .94, { color: COLORS.cyan, fontFamily: 'Inter', fontWeight: 900, letterSpacing: .09 }),
    text('p1-title', 'Título da capa', page.title || 'VAL ADVOGADO', 52, 27, 40, 14, 5.7, { color: COLORS.navy, minFontSize: 4.1 }),
    text('p1-slogan', 'Chamada principal', page.body || 'Presença que cuida. Trabalho que transforma.', 52, 42, 40, 17, 4.25, { color: COLORS.blue, minFontSize: 3.0, lineHeight: .98 }),
    shape('p1-band', 'Faixa editorial', 50, 61, 45, 14, 'linear-gradient(135deg,#0369a1,#06b6d4)', { clipPath: 'polygon(0 0,100% 0,92% 100%,0 100%)', z: 5 }),
    text('p1-band-text', 'Resumo da capa', 'PRESENÇA, TRANSPARÊNCIA E AÇÃO PARA TRANSFORMAR VIDAS.', 54, 64.2, 34, 8, 1.55, { color: '#fff', fontFamily: 'Arial Black', fontWeight: 900, lineHeight: 1.05, letterSpacing: .02, z: 12 }),
    shape('p1-qr', 'Área QR Code', 68, 80, 20, 14, '#ffffff', { borderColor: COLORS.blue, borderWidth: 2, shadow: '0 8px 18px rgba(7,31,56,.16)', z: 10 }),
    icon('p1-qr-icon', 'QR Code', 'QrCode', 72.5, 81.5, 10.5, 10.5, COLORS.navy, '#fff'),
    text('p1-qr-label', 'Legenda QR', 'FALE COM O GABINETE', 52, 83.3, 16, 5, 1.15, { color: COLORS.navy, fontFamily: 'Arial Black', fontWeight: 900, lineHeight: 1.05 }),
  ], { type: 'color', value: '#f9fcfd' }, 'capa-editorial', false);
}

function page2(page: MagazinePage) {
  const newItems = [
    ['03', 'Trajetória', 'Origem em Guarujá, educação como virada de vida e experiência acumulada no serviço público.'],
    ['04', 'Guarujá e Brasília', 'Parceria institucional que aproxima demandas locais de recursos e decisões federais.'],
    ['06', 'Inclusão e TEA', 'Emendas, atendimento especializado, famílias atípicas, acessibilidade e educação inclusiva.'],
    ['11', 'Esporte social', 'Projetos, atletas e entidades que usam disciplina e convivência como política pública.'],
    ['14', 'Serviços públicos', 'Saúde, proteção animal, água, saneamento, segurança e desenvolvimento econômico.'],
    ['19', 'Participação', 'Como a demanda chega, vira encaminhamento e volta para a população em prestação de contas.'],
  ];
  const newElements: CanvasElement[] = [
    shape('p2-bg-new', 'Fundo do sumário', 0, 0, 100, 100, '#f6fbfd', { allowBleed: true, locked: true }),
    shape('p2-top-new', 'Faixa superior', 0, 0, 100, 25, COLORS.navy, { allowBleed: true, locked: true, z: 2, clipPath: 'polygon(0 0,100% 0,100% 76%,0 100%)' }),
    image('p2-photo-new', 'Retrato em destaque', ASSETS.portrait, 60, 0, 38, 40, { fit: 'contain', frameStyle: 'none', borderRadius: 0, positionY: 100, z: 7 }),
    image('p2-logo-new', 'Logotipo', ASSETS.logo, 6, 5.8, 24, 6.5, { fit: 'contain', frameStyle: 'none', z: 8 }),
    text('p2-index-title-new', 'Título sumário', 'NESTA\nEDIÇÃO', 6, 16, 44, 17, 5.2, { color: '#ffffff', lineHeight: .9, minFontSize: 4.1, z: 8 }),
    body('p2-editorial-new', page.body || 'Esta edição reúne trajetória, prioridades, emendas e ações do mandato em formato de jornal informativo: leitura clara, números em destaque e prestação de contas para a população de Guarujá.', 6, 35, 38, 19, { color: COLORS.ink, fontSize: 1.85, minFontSize: 1.55, lineHeight: 1.3, z: 8 }),
    shape('p2-note-new', 'Nota editorial', 6, 58, 38, 20, '#ffffff', { borderColor: '#bdeaf4', borderWidth: 1, borderRadius: 2.2, shadow: '0 10px 26px rgba(7,89,133,.10)', z: 5 }),
    text('p2-note-title-new', 'Nota título', 'INFOJORNAL DO MANDATO', 9, 62, 31, 3, 1.25, { color: COLORS.blue, fontFamily: 'Inter', fontWeight: 900, letterSpacing: .04, z: 8 }),
    body('p2-note-body-new', 'O objetivo é mostrar não só o que foi proposto, mas por que cada pauta importa na vida real: inclusão, saúde, esporte, segurança, proteção animal, serviços públicos e desenvolvimento local.', 9, 66, 31, 8.5, { color: '#304c63', fontSize: 1.34, minFontSize: 1.18, lineHeight: 1.28, z: 8 }),
    text('p2-expediente-new', 'Expediente', 'VAL ADVOGADO | GUARUJÁ | EDIÇÃO 01 | 2026', 6, 91.8, 38, 3, 1.0, { color: COLORS.blue, fontFamily: 'Inter', fontWeight: 900, letterSpacing: .04, z: 8 }),
  ];
  newItems.forEach((item, i) => {
    const y = 31 + i * 10.1;
    newElements.push(shape(`p2-index-card-new-${i}`, 'Linha do sumário', 49, y, 42, 8.3, i % 2 === 0 ? '#ffffff' : '#e8f6fb', { borderColor: '#caeaf3', borderWidth: 1, borderRadius: 1.6, z: 5 }));
    newElements.push(text(`p2-index-no-new-${i}`, `Página ${item[0]}`, item[0], 51.2, y + 1.45, 6, 4.3, 2.05, { color: COLORS.cyan, fontFamily: 'Arial Black', fontWeight: 900, align: 'center', z: 8 }));
    newElements.push(text(`p2-index-title-new-${i}`, item[1], item[1].toUpperCase(), 59, y + 1.1, 28, 2.2, 1.23, { color: COLORS.navy, fontFamily: 'Inter', fontWeight: 900, letterSpacing: .03, z: 8 }));
    newElements.push(body(`p2-index-desc-new-${i}`, item[2], 59, y + 3.8, 28.6, 3.1, { color: '#3d596d', fontSize: .98, minFontSize: .86, lineHeight: 1.15, z: 8 }));
  });
  return document(page, newElements, { type: 'color', value: COLORS.paper }, 'sumario-infojornal-moderno', false);

  const items = ['Quem é Val', 'Mandato presente', 'Escolas de luta', 'Autismo e famílias', 'Projetos e compromissos'];
  const elements: CanvasElement[] = [
    shape('p2-index-bg', 'Fundo do sumário', 0, 0, 33, 100, 'linear-gradient(180deg,#075985,#063452)', { allowBleed: true, locked: true }),
    text('p2-index-title', 'Título sumário', 'SUMÁRIO', 6, 8, 22, 7, 3.4, { color: '#fff', lineHeight: 1 }),
    text('p2-index-kicker', 'Navegacao', 'LEIA  •  DESCUBRA  •  PARTICIPE', 6, 16, 23, 3, .84, { color: '#8fe8f5', fontFamily: 'Inter', fontWeight: 800, letterSpacing: .1 }),
    image('p2-photo', 'Retrato', ASSETS.portrait, 36, 4, 29, 36, { fit: 'contain', frameStyle: 'arch', borderColor: '#dbeafe', borderWidth: 1, positionY: 100 }),
    shape('p2-title-bg', 'Fundo do título', 67, 10, 28, 24, COLORS.navy, { z: 5 }),
    text('p2-title', 'Título', 'QUEM É\nVAL?', 70, 13, 22, 18, 5.2, { color: '#fff', lineHeight: .9, z: 12 }),
    body('p2-body', page.body || 'Advogado por formação e servidor por vocação. Sua história é construída com presença, escuta e trabalho próximo das pessoas.', 37, 45, 56, 17, { color: '#263f55', fontSize: 1.8 }),
    image('p2-family', 'Família demonstrativa', ASSETS.demoFamily, 37, 65, 30, 26, { frameStyle: 'polaroid', positionY: 42, rotation: -1.2 }),
    body('p2-family-text', 'Família, valores e compromisso com uma política mais humana.', 70, 69, 23, 18, { color: '#263f55', fontSize: 1.55 }),
    text('p2-expediente', 'Expediente', 'INFOJORNAL VAL ADVOGADO • PROJETO EDITORIAL • EDIÇÃO 01', 5.5, 91, 23, 6, .92, { color: '#d8f3fc', fontFamily: 'Inter', fontWeight: 500, lineHeight: 1.25, letterSpacing: .04 }),
  ];
  items.forEach((item, i) => {
    const y = 22 + i * 11.4;
    elements.push(text(`p2-index-${i}`, item, item.toUpperCase(), 6, y, 19, 6, 1.24, { color: '#fff', fontFamily: 'Inter', fontWeight: 800, lineHeight: 1.05, letterSpacing: .03 }));
    elements.push(text(`p2-index-no-${i}`, `Página ${i}`, String([2, 4, 6, 8, 10][i]).padStart(2, '0'), 25, y, 4, 3, 1.6, { color: '#67e8f9', fontFamily: 'Inter', fontWeight: 900, align: 'right' }));
  });
  return document(page, elements, { type: 'color', value: COLORS.paper }, 'sumario-biografia', false);
}

function page3(page: MagazinePage) {
  return document(page, [
    label(page), rule('p3-rule'),
    text('p3-title', 'Título', page.title || 'História feita de presença.', 6, 11, 55, 13, 4.8, { color: COLORS.navy, minFontSize: 3.2 }),
    body('p3-intro', page.body || 'Família, atuação pública e projetos sociais.', 6, 25, 37, 11, { color: '#29475d', fontSize: 1.62 }),
    image('p3-photo1', 'Família demonstrativa', ASSETS.demoFamily, 6, 39, 38, 25, { frameStyle: 'polaroid', rotation: -2, positionY: 42 }),
    image('p3-photo2', 'Reunião demonstrativa', ASSETS.demoMeeting, 52, 10, 40, 28, { frameStyle: 'polaroid', rotation: 1.7, positionY: 36 }),
    image('p3-photo3', 'Atendimento demonstrativo', ASSETS.demoHealthcare, 55, 43, 35, 26, { frameStyle: 'polaroid', rotation: -1.3, positionY: 42 }),
    image('p3-photo4', 'Educação demonstrativa', ASSETS.demoEducation, 7, 70, 32, 20, { frameStyle: 'polaroid', rotation: 1.6, positionX: 45 }),
    ...quote('p3-quote', page.quote || 'A política transforma quando escuta, acolhe e permanece perto das pessoas.', 43, 73, 47, 17, COLORS.blue),
  ], { type: 'image', value: ASSETS.mosaic, fit: 'cover', overlay: 'linear-gradient(rgba(248,251,252,.94),rgba(248,251,252,.96))' }, 'memoria-scrapbook');
}

function page4(page: MagazinePage) {
  const cards = [
    ['MapPinned', 'Presença nos bairros', 'Visitas, escuta ativa e acompanhamento das demandas.'],
    ['ShieldCheck', 'Fiscalização', 'Cobrança de soluções e transparência sobre cada etapa.'],
    ['HeartHandshake', 'Apoio comunitário', 'Parcerias e encaminhamentos para quem mais precisa.'],
    ['MessageCircle', 'Gabinete aberto', 'Contato permanente, sugestões e participação popular.'],
  ];
  const elements: CanvasElement[] = [
    shape('p4-bg', 'Fundo editorial claro', 0, 0, 100, 100, 'linear-gradient(145deg,#f8fcfd 0%,#e1f5fb 100%)', { allowBleed: true, locked: true }),
    image('p4-photo', 'Foto institucional', ASSETS.renata, 52, 0, 48, 44, { frameStyle: 'none', borderRadius: 0, positionX: 50, positionY: 38, allowBleed: true, locked: true, opacity: .24 }),
    shape('p4-photo-wash', 'Lavagem da foto', 50, 0, 50, 47, 'linear-gradient(90deg,rgba(248,252,253,.95),rgba(248,252,253,.38))', { allowBleed: true, locked: true, z: 2 }),
    label(page, COLORS.blue), rule('p4-rule', 7.2, COLORS.cyan),
    text('p4-title', 'Título', page.title || 'O mandato acontece perto das pessoas.', 6, 13, 67, 22, 5.3, { color: COLORS.navy, minFontSize: 3.8, z: 12 }),
    body('p4-body', page.body || 'Visitas, escuta ativa e fiscalização.', 6, 39, 58, 15, { color: '#263f55', fontSize: 2.05, minFontSize: 1.7, z: 12 }),
  ];
  cards.forEach(([iconName, titleValue, description], i) => {
    const x = i % 2 === 0 ? 6 : 29;
    const y = i < 2 ? 59 : 78;
    elements.push(shape(`p4-card-${i}`, 'Cartão de ação', x, y, 21, 15.5, '#ffffff', { borderColor: '#b7e5f1', borderWidth: 1, borderRadius: 3, shadow: '0 10px 24px rgba(7,89,133,.12)', z: 6 }));
    elements.push(icon(`p4-icon-${i}`, titleValue, iconName, x + 2, y + 2, 5.4, 4.8, '#fff', COLORS.blue));
    elements.push(text(`p4-card-title-${i}`, titleValue, titleValue.toUpperCase(), x + 8, y + 2, 11.5, 4.2, 1.12, { color: COLORS.navy, fontFamily: 'Arial Black', lineHeight: 1.05, z: 12, minFontSize: .95 }));
    elements.push(body(`p4-card-body-${i}`, description, x + 2, y + 8, 17, 5.8, { color: '#38556a', fontSize: 1.08, minFontSize: .95, lineHeight: 1.16, z: 12 }));
  });
  return document(page, elements, { type: 'color', value: '#f8fcfd' }, 'hero-mandato');
}

function page5(page: MagazinePage) {
  const paragraphOne = 'A inclusão não acontece somente quando uma criança consegue uma vaga na escola. Ela acontece quando encontra professores preparados, ambiente adequado, tratamento contínuo, acesso a medicamentos e uma rede capaz de acolher também sua família.';
  const paragraphTwo = 'Por isso, a defesa das pessoas com Transtorno do Espectro Autista não aparece no mandato de Val como uma ação isolada. Ela está presente em projetos voltados à educação, saúde, assistência social, acessibilidade e planejamento das políticas públicas.';
  const paragraphThree = 'O objetivo é construir uma cidade que reconheça as diferentes necessidades existentes dentro do espectro e ofereça condições para que cada pessoa desenvolva suas potencialidades com dignidade.';
  const highlight = page.quote || 'Inclusão de verdade exige acolhimento, conhecimento, estrutura e investimento.';
  const elements: CanvasElement[] = [
    image('p5-autism-texture', 'Textura temática de quebra-cabeças', ASSETS.autismTexture, 0, 0, 100, 100, { frameStyle: 'none', borderRadius: 0, fit: 'cover', opacity: .3, allowBleed: true, locked: true, z: 1 }),
    shape('p5-spectrum', 'Faixa do espectro', 6, 18.8, 40, 1.1, 'linear-gradient(90deg,#38bdf8,#6366f1,#a855f7,#f59e0b,#22c55e)', { locked: true, z: 6, clipPath: 'polygon(0 20%,98% 0,100% 75%,2% 100%)' }),
    label(page), rule('p5-rule'),
    image('p5-logo', 'Logotipo', ASSETS.logo, 77, 2.2, 17, 5.2, { fit: 'contain', frameStyle: 'none', z: 20 }),
    text('p5-title', 'Título', page.title || 'Autismo: uma causa permanente do mandato', 6, 9.2, 78, 10.5, 5.15, { color: '#062f5b', minFontSize: 3.45, lineHeight: .92, z: 12 }),
    text('p5-infinity', 'Símbolo da neurodiversidade', '∞', 83, 8.2, 11, 10, 6.8, { color: '#06a6c8', fontFamily: 'Georgia', fontWeight: 800, align: 'center', lineHeight: .8, z: 12 }),
    shape('p5-ribbon', 'Faixa orgânica azul', 3.5, 21, 57, 15.5, '#062f5b', { clipPath: 'polygon(2% 8%,98% 0,95% 18%,100% 31%,96% 45%,99% 61%,94% 74%,97% 92%,1% 100%,4% 79%,0 64%,4% 47%,0 29%,5% 17%)', z: 7 }),
    body('p5-paragraph-one', paragraphOne, 7.5, 24, 47.5, 10.5, { color: '#ffffff', fontSize: 1.72, minFontSize: 1.4, fontWeight: 500, lineHeight: 1.22, z: 12 }),
    image('p5-photo-one', 'Inclusão e acolhimento', ASSETS.inclusao, 61, 20.5, 31, 23.5, { frameStyle: 'polaroid', rotation: 2, positionY: 45, shadow: '0 10px 18px rgba(7,31,56,.18)', z: 10 }),
    image('p5-photo-two', 'Família e cuidado', ASSETS.demoChild, 7.5, 40.5, 33, 26, { frameStyle: 'polaroid', rotation: -3.5, positionY: 45, shadow: '0 10px 18px rgba(7,31,56,.18)', z: 10 }),
    shape('p5-note', 'Quadro de políticas públicas', 46, 43, 47, 19.8, 'rgba(255,255,255,.92)', { borderColor: '#062f5b', borderWidth: 1.3, borderRadius: .8, shadow: '4px 4px 0 rgba(7,89,133,.16)', z: 7, rotation: .4 }),
    icon('p5-note-icon', 'Direitos e políticas públicas', 'Accessibility', 43.2, 41.1, 7, 6, '#062f5b', '#f8fbfc'),
    body('p5-paragraph-two', paragraphTwo, 49.5, 46, 39.5, 14.5, { color: '#062f5b', fontSize: 1.7, minFontSize: 1.36, fontWeight: 480, lineHeight: 1.22, z: 12 }),
    body('p5-paragraph-three', paragraphThree, 9, 66.3, 82, 10.2, { color: '#062f5b', fontSize: 1.82, minFontSize: 1.48, fontWeight: 500, lineHeight: 1.24, align: 'center', z: 12 }),
    shape('p5-callout', 'Compromisso permanente', 8, 77.2, 42, 9.5, '#ffffff', { borderColor: '#062f5b', borderWidth: 1.2, borderRadius: 4, z: 9 }),
    icon('p5-callout-icon', 'Rede de cuidado', 'HeartHandshake', 9.5, 79, 6, 5.5, '#ffffff', '#06a6c8'),
    text('p5-callout-text', 'Chamada', 'ACOLHIMENTO + CONHECIMENTO\n+ ESTRUTURA + INVESTIMENTO', 17, 79, 30, 6, 1.45, { color: '#062f5b', fontFamily: 'Inter', fontWeight: 900, align: 'center', lineHeight: 1.08, z: 12 }),
    image('p5-photo-three', 'Inclusão na comunidade', ASSETS.demoEducation, 56, 76.5, 35, 16.5, { frameStyle: 'polaroid', rotation: 2, positionY: 42, shadow: '0 10px 18px rgba(7,31,56,.18)', z: 10 }),
    shape('p5-footer', 'Rodapé editorial', 0, 83, 100, 17, '#062f5b', { allowBleed: true, clipPath: 'polygon(0 18%,18% 34%,39% 10%,61% 31%,82% 8%,100% 24%,100% 100%,0 100%)', z: 6 }),
    text('p5-quote-mark', 'Aspas', '“', 6.5, 87, 6, 5, 4.8, { color: '#ffffff', fontFamily: 'Georgia', fontWeight: 900, z: 13 }),
    text('p5-highlight-text', 'Frase de destaque', highlight, 11, 87.8, 43, 7.2, 1.68, { color: '#ffffff', fontFamily: 'Manrope', fontWeight: 800, italic: true, lineHeight: 1.12, letterSpacing: 0, minFontSize: 1.35, z: 12 }),
    pageNumber(page, '#d9f5ff'),
  ];
  return document(page, elements, { type: 'color', value: '#f8fbfc' }, 'autismo-scrapbook', false);
}

function page6(page: MagazinePage) {
  const paragraphOne = 'Para Val, uma escola de luta não é apenas um espaço onde se aprende a chutar, defender ou competir. É um ambiente de convivência, disciplina, respeito e construção de oportunidades.';
  const paragraphTwo = 'Em muitos bairros, esses projetos acolhem crianças e adolescentes no período em que estariam expostos à ociosidade e a diferentes situações de vulnerabilidade. Os professores tornam-se referências, os colegas formam uma rede de apoio e cada avanço dentro do esporte ajuda a desenvolver confiança para enfrentar os desafios fora dele.';
  const paragraphThree = 'Por isso, o mandato adotou como prioridade o acompanhamento e o apadrinhamento das escolas de luta e de projetos esportivos. O apoio envolve divulgação, articulação de recursos, incentivo aos atletas, aquisição de materiais e aproximação das iniciativas com o poder público.';
  const highlight = page.quote || 'A luta ensina muito mais do que competir: ensina a cair, levantar e continuar.';
  return document(page, [
    shape('p6-paper', 'Fundo editorial claro', 0, 0, 100, 100, '#f8fbfc', { allowBleed: true, locked: true, z: 1 }),
    image('p6-texture', 'Textura editorial', ASSETS.mosaic, 0, 0, 100, 100, { frameStyle: 'none', borderRadius: 0, fit: 'cover', opacity: .065, filter: 'grayscale(1)', allowBleed: true, locked: true, z: 2 }),
    label(page), rule('p6-rule'),
    image('p6-logo', 'Logotipo', ASSETS.logo, 77, 2.2, 17, 5.2, { fit: 'contain', frameStyle: 'none', z: 20 }),
    text('p6-title', 'Título', page.title || 'Apadrinhar projetos é acreditar em futuros', 6, 9.2, 79, 10.7, 5.1, { color: '#062f5b', minFontSize: 3.35, lineHeight: .92, z: 12 }),
    icon('p6-title-icon', 'Artes marciais', 'Swords', 85.5, 10.2, 8, 7, '#ffffff', '#075985'),
    shape('p6-ribbon', 'Faixa orgânica azul', 3.5, 21, 55, 14.5, '#062f5b', { clipPath: 'polygon(2% 8%,98% 0,95% 18%,100% 31%,96% 45%,99% 61%,94% 74%,97% 92%,1% 100%,4% 79%,0 64%,4% 47%,0 29%,5% 17%)', z: 7 }),
    body('p6-paragraph-one', paragraphOne, 7.5, 24.1, 45.5, 9.2, { color: '#ffffff', fontSize: 1.78, minFontSize: 1.46, fontWeight: 500, lineHeight: 1.22, z: 12 }),
    image('p6-photo-one', 'Treino de luta', ASSETS.demoMartialArts, 60, 20.5, 32, 24, { frameStyle: 'polaroid', rotation: 2.2, positionY: 44, shadow: '0 10px 18px rgba(7,31,56,.18)', z: 10 }),
    image('p6-photo-two', 'Projeto esportivo', ASSETS.demoBoxing, 7, 40.5, 34, 27, { frameStyle: 'polaroid', rotation: -3.2, positionY: 44, shadow: '0 10px 18px rgba(7,31,56,.18)', z: 10 }),
    shape('p6-note', 'Quadro de impacto social', 45.5, 43, 48, 21.5, 'rgba(255,255,255,.94)', { borderColor: '#062f5b', borderWidth: 1.3, borderRadius: .8, shadow: '4px 4px 0 rgba(7,89,133,.16)', z: 7, rotation: .35 }),
    icon('p6-note-icon', 'Disciplina e convivência', 'Users', 42.8, 41.1, 7, 6, '#062f5b', '#f8fbfc'),
    body('p6-paragraph-two', paragraphTwo, 49, 45.5, 40.5, 16.8, { color: '#062f5b', fontSize: 1.62, minFontSize: 1.32, fontWeight: 470, lineHeight: 1.2, z: 12 }),
    body('p6-paragraph-three', paragraphThree, 8.5, 66.3, 83, 10.8, { color: '#062f5b', fontSize: 1.72, minFontSize: 1.4, fontWeight: 500, lineHeight: 1.22, align: 'center', z: 12 }),
    shape('p6-callout', 'Rede de apoio', 8, 77.2, 43, 9.5, '#ffffff', { borderColor: '#062f5b', borderWidth: 1.2, borderRadius: 4, z: 9 }),
    icon('p6-callout-icon', 'Apoio aos projetos', 'Medal', 10, 79, 6, 5.5, '#ffffff', '#075985'),
    text('p6-callout-text', 'Chamada', 'DIVULGAÇÃO  •  RECURSOS\nMATERIAIS  •  INCENTIVO', 18, 79.1, 30, 5.2, 1.36, { color: '#062f5b', fontFamily: 'Inter', fontWeight: 900, align: 'center', lineHeight: 1.08, z: 12 }),
    image('p6-photo-three', 'Atletas e futuro', ASSETS.luvas, 57, 76.5, 34, 16, { frameStyle: 'polaroid', rotation: 1.8, positionY: 45, shadow: '0 10px 18px rgba(7,31,56,.18)', z: 10 }),
    shape('p6-footer', 'Rodapé editorial', 0, 83, 100, 17, '#062f5b', { allowBleed: true, clipPath: 'polygon(0 20%,18% 34%,39% 10%,61% 31%,82% 8%,100% 24%,100% 100%,0 100%)', z: 6 }),
    text('p6-quote-mark', 'Aspas', '“', 6.5, 87, 6, 5, 4.8, { color: '#ffffff', fontFamily: 'Georgia', fontWeight: 900, z: 13 }),
    text('p6-highlight-text', 'Frase de destaque', highlight, 11, 87.8, 43, 7.2, 1.68, { color: '#ffffff', fontFamily: 'Manrope', fontWeight: 800, italic: true, lineHeight: 1.12, letterSpacing: 0, minFontSize: 1.35, z: 12 }),
    pageNumber(page, '#d9f5ff'),
  ], { type: 'color', value: '#f8fbfc' }, 'lutas-scrapbook', false);
}

function page7(page: MagazinePage) {
  const cards = [
    ['Swords', 'Disciplina', 'Rotina, respeito e foco para crianças e jovens.'],
    ['School', 'Escolas apoiadas', 'Fortalecimento de academias e projetos comunitários.'],
    ['Users', 'Pertencimento', 'Ambientes seguros, vínculos e novas oportunidades.'],
    ['Medal', 'Superação', 'Metas, autoestima e reconhecimento do esforço.'],
  ];
  const elements: CanvasElement[] = [label(page), rule('p7-rule'),
    text('p7-title', 'Título', page.title || 'Disciplina, pertencimento e oportunidade.', 6, 11, 87, 15, 4.7, { color: COLORS.navy, minFontSize: 3.2 }),
    image('p7-main', 'Artes marciais demonstrativas', ASSETS.demoMartialArts, 55, 29, 38, 38, { frameStyle: 'rounded', borderRadius: 1.5, positionX: 46 }),
    image('p7-small1', 'Treino demonstrativo', ASSETS.demoBoxing, 55, 70, 18, 17, { frameStyle: 'polaroid', rotation: -1 }),
    image('p7-small2', 'Educação demonstrativa', ASSETS.demoEducation, 75, 70, 18, 17, { frameStyle: 'polaroid', rotation: 1, positionY: 40 }),
  ];
  cards.forEach(([iconName, titleValue, description], i) => {
    const y = 30 + i * 14.5;
    elements.push(icon(`p7-icon-${i}`, titleValue, iconName, 6, y, 8, 7, '#fff', COLORS.blue));
    elements.push(text(`p7-card-title-${i}`, titleValue, titleValue.toUpperCase(), 16, y, 30, 3.8, 1.45, { color: COLORS.blue, fontFamily: 'Arial Black', lineHeight: 1.03 }));
    elements.push(body(`p7-card-body-${i}`, description, 16, y + 4.2, 32, 6, { color: '#425b70', fontSize: 1.17, lineHeight: 1.22 }));
  });
  return document(page, elements, { type: 'image', value: ASSETS.mosaic, fit: 'cover', overlay: 'linear-gradient(rgba(249,252,253,.96),rgba(249,252,253,.96))' }, 'cards-esporte');
}

function page8(page: MagazinePage) {
  return document(page, [
    image('p8-bg', 'Família demonstrativa', ASSETS.demoFamily, 0, 0, 100, 100, { frameStyle: 'none', borderRadius: 0, allowBleed: true, positionX: 67, positionY: 45, locked: true }),
    shape('p8-overlay', 'Proteção', 0, 0, 100, 100, 'linear-gradient(90deg,rgba(238,250,255,.98) 0%,rgba(229,248,254,.94) 56%,rgba(229,248,254,.48) 100%)', { allowBleed: true, locked: true, z: 2 }),
    label(page), rule('p8-rule'),
    text('p8-title', 'Título', page.title || 'Inclusão começa com compreensão.', 6, 13, 62, 26, 5.7, { color: COLORS.navy, minFontSize: 3.5, z: 12 }),
    body('p8-body', page.body || 'Apoio às pessoas autistas e suas famílias.', 6, 43, 45, 15, { color: '#27485e', fontSize: 1.82, fontWeight: 600, z: 12 }),
    shape('p8-quote-bg', 'Destaque azul', 6, 62, 46, 19, COLORS.blue, { clipPath: 'polygon(0 0,100% 0,93% 100%,0 100%)', z: 6 }),
    text('p8-quote', 'Frase', page.quote || 'Acolher é ouvir, orientar e garantir que cada família tenha acesso a direitos e oportunidades.', 10, 66, 35, 11, 1.85, { color: '#fff', fontFamily: 'Georgia', fontWeight: 700, italic: true, lineHeight: 1.18, letterSpacing: 0, z: 12 }),
    shape('p8-qr', 'Área QR Code', 7, 85, 18, 10, '#fff', { borderColor: COLORS.blue, borderWidth: 1, z: 8 }),
    icon('p8-qr-icon', 'QR Code', 'QrCode', 11, 85.7, 9, 8.5, COLORS.navy, '#fff'),
    text('p8-qr-text', 'Legenda QR', 'GUIA DE APOIO', 27, 88, 20, 4, 1.25, { color: COLORS.blue, fontFamily: 'Arial Black' }),
  ], { type: 'color', value: COLORS.light }, 'hero-inclusao');
}

function page9(page: MagazinePage) {
  const cards = [
    ['Accessibility', 'Atendimento acessível', 'Serviços preparados e acolhimento sem barreiras.'],
    ['GraduationCap', 'Escola inclusiva', 'Apoio multidisciplinar e formação permanente.'],
    ['HeartHandshake', 'Apoio às famílias', 'Informação, orientação e escuta de quem cuida.'],
    ['ShieldCheck', 'Direitos permanentes', 'Menos burocracia e mais dignidade no cotidiano.'],
    ['HeartPulse', 'Terapias e pesquisa', 'Acesso ao cuidado e incentivo ao conhecimento.'],
    ['Users', 'Convivência', 'Respeito às diferentes formas de existir.'],
  ];
  const elements: CanvasElement[] = [label(page), rule('p9-rule'),
    text('p9-title', 'Título', page.title || 'Uma cidade preparada para todas as formas de existir.', 6, 11, 87, 16, 4.4, { color: COLORS.navy, minFontSize: 2.9 }),
    shape('p9-orbit', 'Mapa de conexoes', 27, 29, 46, 46, 'radial-gradient(circle,rgba(6,182,212,.14) 0 32%,transparent 33%),radial-gradient(circle,transparent 0 49%,rgba(7,89,133,.12) 50% 51%,transparent 52%),radial-gradient(circle,transparent 0 69%,rgba(6,182,212,.10) 70% 71%,transparent 72%)', { borderRadius: 50, z: 2 }),
    image('p9-center', 'Família demonstrativa', ASSETS.demoFamily, 34, 34, 32, 37, { frameStyle: 'arch', fit: 'cover', positionY: 38, borderColor: '#bce8f5', borderWidth: 2 }),
    text('p9-manifesto', 'Manifesto', 'INCLUSÃO É\nACESSO + ESCUTA\n+ RESPEITO', 35, 77, 30, 11, 1.5, { color: COLORS.blue, fontFamily: 'Manrope', fontWeight: 800, align: 'center', lineHeight: 1.05, letterSpacing: .04, z: 12 }),
  ];
  cards.forEach(([iconName, titleValue, description], i) => {
    const left = i % 2 === 0;
    const row = Math.floor(i / 2);
    const x = left ? 5.5 : 68.5;
    const y = 31 + row * 20;
    elements.push(shape(`p9-card-${i}`, 'Cartão', x, y, 26, 16, left ? '#e8f8fd' : '#dff5fb', { borderColor: '#8dd6ea', borderWidth: 1, borderRadius: 3, z: 5 }));
    elements.push(icon(`p9-icon-${i}`, titleValue, iconName, x + 2, y + 2, 5, 4.5, COLORS.blue, '#fff'));
    elements.push(text(`p9-card-title-${i}`, titleValue, titleValue.toUpperCase(), x + 8, y + 2, 16, 4, 1.08, { color: COLORS.blue, fontFamily: 'Arial Black', lineHeight: 1.02, z: 12 }));
    elements.push(body(`p9-card-body-${i}`, description, x + 2, y + 7.2, 22, 6.5, { color: '#38556a', fontSize: 1.02, lineHeight: 1.2, z: 12 }));
  });
  return document(page, elements, { type: 'color', value: '#f8fcfd' }, 'mapa-inclusao');
}

function page10(page: MagazinePage) {
  const projects = [
    ['Saúde', 'HeartPulse', ASSETS.demoHealthcare],
    ['Educação', 'GraduationCap', ASSETS.demoEducation],
    ['Proteção animal', 'PawPrint', ASSETS.demoAnimalCare],
    ['Apoio às famílias', 'HeartHandshake', ASSETS.demoFamily],
    ['Cidadania', 'Scale', ASSETS.demoMeeting],
  ];
  const elements: CanvasElement[] = [label(page), rule('p10-rule'),
    text('p10-title', 'Título', page.title || 'Projetos que mudam realidades.', 6, 11, 87, 13, 4.8, { color: COLORS.navy }),
    body('p10-body', page.body || 'Saúde, educação, proteção animal e apoio às famílias.', 6, 25, 84, 7, { color: '#29475d', fontSize: 1.55, fontWeight: 600 }),
  ];
  elements.push(shape('p10-count-bg', 'Indicador de frentes', 78, 11, 15, 16, 'linear-gradient(145deg,#075985,#06b6d4)', { borderRadius: 3, shadow: '0 10px 24px rgba(7,89,133,.16)', z: 5 }));
  elements.push(text('p10-count', 'Quantidade de frentes', '05', 80, 13, 11, 7, 4.3, { color: '#fff', fontFamily: 'Manrope', align: 'center', lineHeight: .9, z: 12 }));
  elements.push(text('p10-count-label', 'Legenda', 'FRENTES DE AÇÃO', 79, 21, 13, 3, .8, { color: '#dff9ff', fontFamily: 'Inter', fontWeight: 900, align: 'center', letterSpacing: .08, z: 12 }));
  projects.forEach(([titleValue, iconName, src], i) => {
    const col = i % 3;
    const row = Math.floor(i / 3);
    const w = row === 0 ? 27 : 42;
    const x = row === 0 ? 6 + col * 30 : 6 + col * 46;
    const y = row === 0 ? 35 : 67;
    const h = row === 0 ? 27 : 22;
    elements.push(shape(`p10-card-${i}`, 'Projeto', x, y, w, h, '#ffffff', { borderColor: '#a9dce9', borderWidth: 1, borderRadius: 3, shadow: '0 8px 20px rgba(7,89,133,.08)', z: 5 }));
    elements.push(image(`p10-photo-${i}`, `Foto ${titleValue}`, src, x + 1.5, y + 1.5, w - 3, h * .48, { frameStyle: 'rounded', borderRadius: 2, positionY: 40, z: 7 }));
    elements.push(icon(`p10-icon-${i}`, titleValue, iconName, x + 2, y + h * .49, 5, 4.3, COLORS.blue, '#e5f7fc'));
    elements.push(text(`p10-title-${i}`, titleValue, titleValue.toUpperCase(), x + 8, y + h * .51, w - 10, 4, 1.22, { color: COLORS.blue, fontFamily: 'Arial Black', z: 12 }));
    elements.push(body(`p10-desc-${i}`, 'Ação, acompanhamento e compromisso com resultados.', x + 2, y + h * .68, w - 4, h * .25, { color: '#526b80', fontSize: 1.0, lineHeight: 1.18, z: 12 }));
  });
  return document(page, elements, { type: 'image', value: ASSETS.mosaic, fit: 'cover', overlay: 'linear-gradient(rgba(248,252,253,.96),rgba(248,252,253,.96))' }, 'grade-projetos');
}

function page11(page: MagazinePage) {
  const items = [
    ['HeartHandshake', 'Escuta permanente'],
    ['ShieldCheck', 'Fiscalização responsável'],
    ['Share2', 'Transparência'],
    ['Sparkles', 'Projetos com impacto'],
    ['Users', 'Participação popular'],
  ];
  const elements: CanvasElement[] = [label(page), rule('p11-rule'),
    image('p11-hero', 'Reunião comunitária demonstrativa', ASSETS.demoMeeting, 43, 8, 57, 46, { frameStyle: 'none', borderRadius: 0, allowBleed: true, positionX: 52, positionY: 38 }),
    shape('p11-title-bg', 'Painel título', 0, 8, 49, 46, 'linear-gradient(135deg,#072b48,#075985)', { allowBleed: true, z: 4 }),
    shape('p11-title-glow', 'Luz do painel', 30, 5, 32, 31, 'radial-gradient(circle,rgba(103,232,249,.26),transparent 68%)', { borderRadius: 50, z: 5 }),
    text('p11-title', 'Título', page.title || 'Compromissos em movimento.', 6, 15, 38, 22, 5.4, { color: '#fff', minFontSize: 3.3, z: 12 }),
    body('p11-intro', page.body || 'Ações permanentes, fiscalização e participação popular.', 6, 40, 34, 10, { color: '#d9f5fc', fontSize: 1.55, z: 12 }),
  ];
  items.forEach(([iconName, item], i) => {
    const y = 58.5 + i * 7.1;
    elements.push(shape(`p11-card-${i}`, 'Compromisso glass', 6, y - .8, 87, 6.1, 'linear-gradient(90deg,rgba(224,247,252,.86),rgba(255,255,255,.45))', { borderColor: 'rgba(103,232,249,.55)', borderWidth: 1, borderRadius: 2.4, z: 4 }));
    elements.push(icon(`p11-icon-${i}`, item, iconName, 7.2, y, 4.5, 4, '#fff', i % 2 ? COLORS.blue : COLORS.cyan));
    elements.push(text(`p11-item-${i}`, item, item.toUpperCase(), 13.5, y + .3, 72, 3.4, 1.25, { color: COLORS.navy, fontFamily: 'Arial Black', lineHeight: 1, z: 12 }));
  });
  shape('dummy','dummy',0,0,1,1,'#fff');
  return document(page, elements, { type: 'color', value: '#f8fcfd' }, 'lista-editorial');
}

function page12(page: MagazinePage) {
  return document(page, [label(page), rule('p12-rule'),
    text('p12-title', 'Título', page.title || 'O gabinete está sempre de portas abertas.', 6, 11, 85, 17, 4.7, { color: COLORS.navy }),
    image('p12-main', 'Atendimento demonstrativo', ASSETS.demoMeeting, 6, 32, 53, 43, { frameStyle: 'polaroid', rotation: -1, positionY: 38 }),
    shape('p12-contact', 'Painel de contato', 63, 31, 30, 44, 'linear-gradient(160deg,#075985,#063452)', { borderRadius: 3, z: 5 }),
    icon('p12-qr', 'QR Code', 'QrCode', 69, 37, 18, 16, '#fff', 'rgba(255,255,255,.1)'),
    text('p12-contact-title', 'Chamada', 'FALE COM\nO GABINETE', 67, 57, 22, 10, 2.8, { color: '#fff', lineHeight: .95, align: 'center', z: 12 }),
    text('p12-contact-info', 'Informações', 'WHATSAPP • REDES SOCIAIS • SUGESTÕES', 65, 69, 26, 4, .95, { color: '#bfeffc', fontFamily: 'Inter', fontWeight: 900, align: 'center', letterSpacing: .06, z: 12 }),
    body('p12-body', page.body || 'Envie sugestões e acompanhe o trabalho.', 6, 81, 86, 8, { color: '#29475d', fontSize: 1.75, fontWeight: 600, align: 'center' }),
  ], { type: 'image', value: ASSETS.mosaic, fit: 'cover', overlay: 'linear-gradient(rgba(248,252,253,.95),rgba(248,252,253,.95))' }, 'contato-gabinete');
}

function page13(page: MagazinePage) {
  return document(page, [label(page), rule('p13-rule'),
    text('p13-title', 'Título', page.title || 'Uma rede que transforma pelo esporte.', 6, 11, 87, 14, 4.8, { color: COLORS.navy }),
    image('p13-main', 'Artes marciais demonstrativas', ASSETS.demoMartialArts, 6, 31, 43, 51, { frameStyle: 'rounded', borderRadius: 2, positionX: 45 }),
    shape('p13-panel', 'Painel de dados', 53, 31, 40, 51, COLORS.navy, { borderRadius: 3, z: 5 }),
    icon('p13-school', 'Escolas', 'School', 58, 36, 8, 7, '#67e8f9', 'rgba(255,255,255,.08)'),
    text('p13-school-title', 'Escolas título', 'ESCOLAS E ACADEMIAS', 68, 38, 20, 4, 1.25, { color: '#fff', fontFamily: 'Arial Black', z: 12 }),
    body('p13-school-body', 'Apoio a iniciativas que oferecem estrutura, orientação e oportunidade.', 58, 46, 30, 8, { color: '#cfeaf4', fontSize: 1.15, z: 12 }),
    icon('p13-modal', 'Modalidades', 'Swords', 58, 58, 8, 7, '#67e8f9', 'rgba(255,255,255,.08)'),
    text('p13-modal-title', 'Modalidades título', 'MODALIDADES E PROFESSORES', 68, 60, 20, 5, 1.2, { color: '#fff', fontFamily: 'Arial Black', z: 12 }),
    body('p13-modal-body', 'Valorização dos educadores e diversidade de práticas esportivas.', 58, 68, 30, 8, { color: '#cfeaf4', fontSize: 1.15, z: 12 }),
    body('p13-body', page.body || 'Modalidades, professores e iniciativas apoiadas.', 6, 87, 87, 6, { color: '#29475d', fontSize: 1.55, fontWeight: 600, align: 'center' }),
  ], { type: 'color', value: '#f7fcfd' }, 'rede-esporte');
}

function page14(page: MagazinePage) {
  return document(page, [label(page), rule('p14-rule'),
    text('p14-title', 'Título', page.title || 'Histórias que começam no tatame.', 6, 11, 87, 13, 4.8, { color: COLORS.navy }),
    image('p14-a', 'Artes marciais demonstrativas', ASSETS.demoMartialArts, 6, 29, 40, 29, { frameStyle: 'polaroid', rotation: -1.5 }),
    image('p14-b', 'Treino demonstrativo', ASSETS.demoBoxing, 54, 23, 38, 31, { frameStyle: 'polaroid', rotation: 1.7 }),
    shape('p14-tape1', 'Fita 1', 21, 26, 11, 3, 'rgba(125,211,252,.62)', { rotation: -3, z: 15 }),
    shape('p14-tape2', 'Fita 2', 67, 20, 11, 3, 'rgba(103,232,249,.58)', { rotation: 3, z: 15 }),
    ...quote('p14-quote', page.quote || 'Disciplina não é apenas seguir regras. É descobrir força, foco e confiança.', 6, 63, 48, 20, COLORS.blue),
    image('p14-c', 'Educação demonstrativa', ASSETS.demoEducation, 58, 61, 34, 26, { frameStyle: 'polaroid', rotation: -1, positionY: 42 }),
    body('p14-body', page.body || 'Disciplina e pertencimento abrindo novos caminhos.', 6, 88, 86, 5, { color: '#29475d', fontSize: 1.45, fontWeight: 600, align: 'center' }),
  ], { type: 'image', value: ASSETS.mosaic, fit: 'cover', overlay: 'linear-gradient(rgba(248,252,253,.95),rgba(248,252,253,.95))' }, 'historias-tatame');
}

function page15(page: MagazinePage) {
  return document(page, [
    shape('p15-bg', 'Fundo azul claro', 0, 0, 100, 100, 'linear-gradient(145deg,#eefbff,#cceef8)', { allowBleed: true, locked: true }),
    label(page), rule('p15-rule'),
    text('p15-title', 'Título', page.title || 'Acolher também é cuidar de quem cuida.', 6, 12, 67, 19, 5.0, { color: COLORS.navy, minFontSize: 3.2 }),
    body('p15-body', page.body || 'Informação e orientação para fortalecer as famílias.', 6, 33, 44, 12, { color: '#29475d', fontSize: 1.72, fontWeight: 600 }),
    shape('p15-quote-bg', 'Destaque', 6, 51, 45, 18, COLORS.blue, { clipPath: 'polygon(0 0,100% 0,93% 100%,0 100%)', z: 5 }),
    text('p15-quote', 'Frase', page.quote || 'Famílias acolhidas constroem caminhos com mais segurança, informação e esperança.', 10, 55, 34, 11, 1.8, { color: '#fff', fontFamily: 'Georgia', fontWeight: 700, italic: true, lineHeight: 1.2, letterSpacing: 0, z: 12 }),
    image('p15-portrait', 'Família demonstrativa', ASSETS.demoFamily, 51, 18, 49, 82, { frameStyle: 'none', borderRadius: 0, positionX: 52, positionY: 40, allowBleed: true, z: 4 }),
    shape('p15-bubbles', 'Elementos inclusivos', 5, 76, 41, 14, 'radial-gradient(circle at 12% 50%,rgba(6,182,212,.45) 0 7%,transparent 8%),radial-gradient(circle at 32% 25%,rgba(3,105,161,.25) 0 10%,transparent 11%),radial-gradient(circle at 58% 62%,rgba(34,211,238,.35) 0 8%,transparent 9%)', { z: 3 }),
  ], { type: 'color', value: '#e9f9fd' }, 'familias-inclusao');
}

function page16(page: MagazinePage) {
  const cards = [
    ['BookOpen', 'Direitos', 'Informações essenciais e caminhos para acessar serviços.'],
    ['CalendarDays', 'Agenda', 'Atividades, encontros e datas importantes.'],
    ['Download', 'Materiais', 'Conteúdos para famílias, escolas e profissionais.'],
    ['PhoneCall', 'Atendimento', 'Canais de orientação e acolhimento.'],
  ];
  const elements: CanvasElement[] = [
    shape('p16-rail', 'Trilho editorial', 0, 0, 2.2, 100, 'linear-gradient(180deg,#075985,#06b6d4)', { allowBleed: true, locked: true, z: 3 }),
    label(page), rule('p16-rule'),
    text('p16-title', 'Título', page.title || 'Direitos, serviços e informação acessível.', 6, 11, 87, 15, 4.7, { color: COLORS.navy }),
    body('p16-body', page.body || 'Conteúdos úteis para famílias e profissionais.', 6, 27, 55, 8, { color: '#29475d', fontSize: 1.55, fontWeight: 600 }),
    shape('p16-qr', 'Área QR Code', 70, 12, 22, 22, '#fff', { borderColor: COLORS.blue, borderWidth: 1, shadow: '0 8px 20px rgba(7,89,133,.1)', z: 6 }),
    icon('p16-qr-icon', 'QR Code', 'QrCode', 75, 16, 12, 12, COLORS.navy, '#fff'),
    text('p16-qr-label', 'Legenda QR', 'ABRA O GUIA COMPLETO', 69, 35, 24, 4, 1.05, { color: COLORS.blue, fontFamily: 'Arial Black', align: 'center' }),
  ];
  cards.forEach(([iconName, titleValue, description], i) => {
    const x = i % 2 === 0 ? 6 : 51;
    const y = i < 2 ? 43 : 68;
    elements.push(shape(`p16-card-${i}`, 'Cartão', x, y, 42, 20, '#ffffff', { borderColor: '#9fd9e8', borderWidth: 1, borderRadius: 3, shadow: '0 8px 20px rgba(7,89,133,.07)', z: 5 }));
    elements.push(icon(`p16-icon-${i}`, titleValue, iconName, x + 3, y + 4, 8, 7, '#fff', COLORS.blue));
    elements.push(text(`p16-title-${i}`, titleValue, titleValue.toUpperCase(), x + 13, y + 4, 24, 4, 1.45, { color: COLORS.blue, fontFamily: 'Arial Black', z: 12 }));
    elements.push(body(`p16-desc-${i}`, description, x + 13, y + 9, 25, 8, { color: '#3d596d', fontSize: 1.12, lineHeight: 1.22, z: 12 }));
  });
  return document(page, elements, { type: 'image', value: ASSETS.mosaic, fit: 'cover', overlay: 'linear-gradient(rgba(247,252,253,.97),rgba(247,252,253,.97))' }, 'guia-servicos');
}

function page17(page: MagazinePage) {
  const steps = [
    ['Escuta', 'As demandas chegam por visitas, redes e gabinete.'],
    ['Fiscalização', 'Cada situação é registrada e acompanhada.'],
    ['Proposição', 'As necessidades se transformam em ações e projetos.'],
    ['Resultado', 'O andamento é comunicado com transparência.'],
  ];
  const elements: CanvasElement[] = [label(page), rule('p17-rule'),
    text('p17-title', 'Título', page.title || 'Presença que pode ser acompanhada.', 6, 11, 87, 14, 4.8, { color: COLORS.navy }),
    image('p17-strip1', 'Reunião demonstrativa', ASSETS.demoMeeting, 6, 29, 27, 18, { frameStyle: 'polaroid', rotation: -1 }),
    image('p17-strip2', 'Saúde demonstrativa', ASSETS.demoHealthcare, 36, 29, 27, 18, { frameStyle: 'polaroid', rotation: 1 }),
    image('p17-strip3', 'Atendimento demonstrativo', ASSETS.demoHealthcare, 66, 29, 27, 18, { frameStyle: 'polaroid', rotation: -1, positionY: 40 }),
    text('p17-kicker', 'Metodo', 'DA ESCUTA AO RESULTADO', 66, 23, 27, 3, .95, { color: COLORS.cyan, fontFamily: 'Inter', fontWeight: 900, align: 'right', letterSpacing: .1 }),
    shape('p17-line', 'Linha do tempo', 10, 59, 80, 1, 'linear-gradient(90deg,#06b6d4,#075985)', { borderRadius: 99 }),
  ];
  steps.forEach(([titleValue, description], i) => {
    const x = 7 + i * 22.5;
    elements.push(shape(`p17-step-bg-${i}`, 'Cartao da etapa', x - 4.5, 65, 19, 22, i % 2 ? '#eef9fc' : '#f5fbfd', { borderColor: '#c6e6ee', borderWidth: 1, borderRadius: 3, z: 3 }));
    elements.push(shape(`p17-dot-${i}`, 'Marcador', x, 55.8, 8, 8, '#fff', { borderColor: i % 2 ? COLORS.blue : COLORS.cyan, borderWidth: 2, borderRadius: 50, z: 8 }));
    elements.push(text(`p17-no-${i}`, 'Etapa', String(i + 1), x, 58.1, 8, 3, 1.25, { color: COLORS.blue, fontFamily: 'Arial Black', align: 'center', z: 12 }));
    elements.push(text(`p17-title-${i}`, titleValue, titleValue.toUpperCase(), x - 3, 67, 14, 4, 1.15, { color: COLORS.navy, fontFamily: 'Arial Black', align: 'center', z: 12 }));
    elements.push(body(`p17-desc-${i}`, description, x - 4, 72, 16, 12, { color: '#425b70', fontSize: 1.02, align: 'center', lineHeight: 1.2, z: 12 }));
  });
  return document(page, elements, { type: 'color', value: '#f8fcfd' }, 'linha-tempo');
}

function page18(page: MagazinePage) {
  return document(page, [label(page), rule('p18-rule'),
    text('p18-title', 'Título', page.title || 'Fotos que contam o trabalho.', 6, 11, 87, 12, 4.8, { color: COLORS.navy }),
    image('p18-1', 'Reunião demonstrativa', ASSETS.demoMeeting, 6, 28, 45, 38, { frameStyle: 'rounded', borderRadius: 1.5, positionY: 43 }),
    image('p18-2', 'Família demonstrativa', ASSETS.demoFamily, 54, 28, 19, 25, { frameStyle: 'polaroid', rotation: -1, positionY: 40 }),
    image('p18-3', 'Saúde demonstrativa', ASSETS.demoHealthcare, 76, 28, 18, 25, { frameStyle: 'polaroid', rotation: 1 }),
    image('p18-4', 'Educação demonstrativa', ASSETS.demoEducation, 54, 57, 40, 29, { frameStyle: 'polaroid', rotation: -.8 }),
    image('p18-5', 'Foto 5', ASSETS.portrait, 6, 70, 20, 19, { fit: 'contain', frameStyle: 'polaroid', rotation: 1 }),
    body('p18-body', page.body || 'Um mosaico de encontros, projetos e ações.', 29, 72, 21, 14, { color: '#29475d', fontSize: 1.55, fontWeight: 700 }),
    shape('p18-tag', 'Etiqueta', 6, 91, 88, 4, 'linear-gradient(90deg,#075985,#06b6d4)', { z: 5 }),
  ], { type: 'image', value: ASSETS.mosaic, fit: 'cover', overlay: 'linear-gradient(rgba(248,252,253,.96),rgba(248,252,253,.96))' }, 'diario-visual');
}

function page19(page: MagazinePage) {
  return document(page, [label(page), rule('p19-rule'),
    text('p19-title', 'Título', page.title || 'Sua voz também constrói o mandato.', 6, 11, 86, 15, 4.7, { color: COLORS.navy }),
    body('p19-body', page.body || 'Contato, enquetes, sugestões e redes sociais.', 6, 27, 45, 10, { color: '#29475d', fontSize: 1.65, fontWeight: 600 }),
    shape('p19-phone', 'Celular', 8, 43, 37, 47, COLORS.navy, { borderRadius: 7, shadow: '0 16px 35px rgba(7,31,56,.18)', z: 5 }),
    shape('p19-screen', 'Tela do celular', 11, 47, 31, 37, 'linear-gradient(160deg,#eaf9fd,#c7edf7)', { borderRadius: 4, z: 7 }),
    text('p19-screen-title', 'Texto no celular', 'COM VAL\nVOCÊ DECIDE.', 14, 52, 25, 12, 2.75, { color: COLORS.blue, align: 'center', lineHeight: .95, z: 12 }),
    icon('p19-screen-icon', 'Participação', 'MessageCircle', 20, 68, 12, 10, '#fff', COLORS.blue),
    shape('p19-qr', 'QR Code', 56, 35, 34, 34, '#fff', { borderColor: COLORS.blue, borderWidth: 2, shadow: '0 14px 30px rgba(7,89,133,.12)', z: 7 }),
    icon('p19-qr-icon', 'QR Code', 'QrCode', 63, 41, 20, 20, COLORS.navy, '#fff'),
    text('p19-qr-title', 'Chamada QR', 'PARTICIPE', 58, 72, 30, 7, 2.8, { color: COLORS.blue, fontFamily: 'Arial Black', align: 'center' }),
    text('p19-qr-sub', 'Legenda QR', 'ENVIE SUA SUGESTÃO • RESPONDA ENQUETES', 55, 80, 36, 6, 1.05, { color: '#38556a', fontFamily: 'Inter', fontWeight: 900, align: 'center', lineHeight: 1.2, letterSpacing: .05 }),
  ], { type: 'image', value: ASSETS.mosaic, fit: 'cover', overlay: 'linear-gradient(rgba(248,252,253,.96),rgba(248,252,253,.96))' }, 'participacao-qr');
}

function page20(page: MagazinePage) {
  return document(page, [
    image('p20-bg', 'Fundo escuro', ASSETS.mosaic, 0, 0, 100, 100, { frameStyle: 'none', borderRadius: 0, filter: 'grayscale(1)', allowBleed: true, locked: true, z: 1 }),
    shape('p20-overlay', 'Sobreposição escura', 0, 0, 100, 100, 'linear-gradient(135deg,rgba(3,18,35,.98),rgba(4,54,78,.88))', { allowBleed: true, locked: true, z: 2 }),
    shape('p20-right-panel', 'Painel de encerramento', 43, 0, 57, 100, 'linear-gradient(160deg,#eefaff 0%,#c9f0f7 58%,#58c8dc 100%)', { allowBleed: true, locked: true, z: 3 }),
    shape('p20-right-stripe', 'Faixa de compromisso', 43, 0, 57, 20, 'linear-gradient(135deg,#075985,#06b6d4)', { allowBleed: true, locked: true, z: 4 }),
    text('p20-pledge', 'Mensagem final', 'TRANSPARÊNCIA\nPRESENÇA\nAÇÃO', 48, 5, 45, 12, 3.3, { color: '#fff', fontFamily: 'Manrope', fontWeight: 800, lineHeight: .9, letterSpacing: .02, z: 12 }),
    image('p20-portrait', 'Retrato', ASSETS.portrait, 43, 28, 57, 72, { fit: 'cover', frameStyle: 'none', borderRadius: 0, positionX: 50, positionY: 50, allowBleed: true, z: 5 }),
    text('p20-title', 'Título', 'MANDE\nUM ZAP', 7, 12, 42, 23, 7.2, { color: '#fff', lineHeight: .85, minFontSize: 4.8, z: 12 }),
    shape('p20-qr', 'QR Code', 9, 41, 31, 28, '#fff', { borderColor: COLORS.cyan, borderWidth: 2, shadow: '0 14px 35px rgba(0,0,0,.25)', z: 8 }),
    icon('p20-qr-icon', 'QR Code', 'QrCode', 15, 46, 19, 18, COLORS.navy, '#fff'),
    body('p20-body', page.body || 'Acompanhe, participe e cobre resultados.', 7, 75, 35, 12, { color: '#d8f4fc', fontSize: 1.85, fontWeight: 700, z: 12 }),
    text('p20-social', 'Redes sociais', '@VALADVOGADO  •  GABINETE ABERTO', 48, 22, 44, 3, 1.0, { color: COLORS.blue, fontFamily: 'Inter', fontWeight: 900, letterSpacing: .07, z: 12 }),
    image('p20-logo', 'Logotipo', ASSETS.logo, 7, 89, 29, 8, { fit: 'contain', frameStyle: 'none', z: 12 }),
  ], { type: 'color', value: COLORS.navy }, 'contracapa-cta', false);
}

const BUILDERS: Record<number, (page: MagazinePage) => CanvasDocument> = {
  1: page1, 2: page2, 3: page3, 4: page4, 5: page5,
  6: page7, 7: page6, 8: page8, 9: page9, 10: page10,
  11: page11, 12: page12, 13: page13, 14: page14, 15: page15,
  16: page16, 17: page17, 18: page18, 19: page19, 20: page10,
  21: page18, 22: page11, 23: page16, 24: page17, 25: page19, 26: page20,
};

export function defaultCanvasForPage(page: MagazinePage): CanvasDocument {
  return (BUILDERS[page.page_number] || page3)(page);
}

export function getCanvasDocument(page: MagazinePage): CanvasDocument {
  const canvas = (page.elements as { canvas?: CanvasDocument } | null)?.canvas;
  const modernLayouts: Record<number, string> = {
    1: 'capa-infojornal-moderna',
    2: 'sumario-infojornal-moderno',
  };
  if (modernLayouts[page.page_number] && canvas?.designFamily !== modernLayouts[page.page_number]) {
    return defaultCanvasForPage(page);
  }
  if (canvas?.version === 3 && Array.isArray(canvas.elements)) return canvas;
  return defaultCanvasForPage(page);
}





