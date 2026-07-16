import type {
  CanvasDocument, CanvasElement, ImageElement, MagazinePage, ShapeElement, TextElement,
} from './editor-types';

export const ASSETS = {
  portrait: '/media/val-portrait.jpg',
  mosaic: '/media/val-mosaic.jpg',
  logo: '/media/val-logo.jpg',
  gabinete: '/media/gabinete.jpg',
  luvas: '/media/publica.jpg',
  acao: '/media/grupo.jpg',
  familia: '/media/familia.jpg',
};

const COLORS = {
  navy: '#071f38',
  blue: '#075985',
  royal: '#0369a1',
  cyan: '#06b6d4',
  light: '#edf8fc',
  paper: '#f8fbfc',
  ink: '#0b2745',
  muted: '#536b80',
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
  minFontSize: options.minFontSize ?? Math.max(1.1, fontSize * 0.54),
  fontWeight: options.fontWeight ?? 800,
  lineHeight: options.lineHeight ?? .94,
  letterSpacing: options.letterSpacing ?? -.025,
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
  text(id, 'Texto', value, x, y, w, h, options.fontSize ?? 1.72, {
    fontFamily: 'Inter', fontWeight: 500, lineHeight: 1.34, letterSpacing: 0, color: COLORS.muted, ...options,
  });

const label = (page: MagazinePage, color = COLORS.blue) => text(
  `p${page.page_number}-label`, 'Cabeçalho editorial', `VAL ADVOGADO  •  ${String(page.page_number).padStart(2, '0')}`,
  5.5, 3.4, 50, 2.5, 1.05,
  { color, fontFamily: 'Inter', fontWeight: 800, letterSpacing: .14, lineHeight: 1, uppercase: true },
);

const rule = (id: string, y = 7.2, fill = COLORS.blue) => shape(id, 'Linha editorial', 5.5, y, 89, .35, fill, { locked: true, z: 30 });
const pageNumber = (page: MagazinePage, color = '#64748b') => text(
  `p${page.page_number}-number`, 'Número da página', String(page.page_number).padStart(2, '0'), 88.5, 95.6, 5.5, 1.8, .9,
  { color, fontFamily: 'Inter', fontWeight: 700, align: 'right', letterSpacing: .08 },
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
  text(`${id}-mark`, 'Aspas', '“', x, y - 1, 8, 8, 6.5, { color, fontFamily: 'Georgia', fontWeight: 900, lineHeight: .9 }),
  text(id, 'Frase de destaque', value, x + 5, y, w - 5, h, 2.15, { color, fontFamily: 'Georgia', fontWeight: 700, lineHeight: 1.15, italic: true, letterSpacing: 0 }),
];

function page1(page: MagazinePage) {
  return document(page, [
    image('p1-collage', 'Mosaico de fundo', ASSETS.mosaic, 0, 0, 46, 100, { frameStyle: 'none', borderRadius: 0, filter: 'grayscale(1) contrast(.9)', opacity: .44, allowBleed: true, locked: true, z: 1 }),
    shape('p1-wash', 'Banho azul', 0, 0, 46, 100, 'linear-gradient(180deg,rgba(3,105,161,.86),rgba(7,31,56,.94))', { allowBleed: true, locked: true, z: 2 }),
    shape('p1-white', 'Painel branco', 42, 0, 58, 100, '#f9fcfd', { allowBleed: true, locked: true, z: 2 }),
    image('p1-portrait', 'Retrato principal', ASSETS.portrait, 2, 35, 63, 65, { fit: 'contain', frameStyle: 'none', borderRadius: 0, positionY: 100, allowBleed: true, z: 8 }),
    image('p1-logo', 'Logotipo', ASSETS.logo, 56, 6, 31, 10, { fit: 'contain', frameStyle: 'none', z: 15 }),
    text('p1-kicker', 'Edição', 'INFOJORNAL • EDIÇÃO 01 • 2026', 52, 21, 40, 3, 1.05, { color: COLORS.cyan, fontFamily: 'Inter', fontWeight: 900, letterSpacing: .11 }),
    text('p1-title', 'Título da capa', page.title || 'VAL ADVOGADO', 52, 27, 40, 14, 5.7, { color: COLORS.navy, minFontSize: 4.1 }),
    text('p1-slogan', 'Chamada principal', page.body || 'O que eu faço é da sua conta.', 52, 42, 40, 17, 4.25, { color: COLORS.blue, minFontSize: 3.0, lineHeight: .98 }),
    shape('p1-band', 'Faixa editorial', 50, 61, 45, 14, 'linear-gradient(135deg,#0369a1,#06b6d4)', { clipPath: 'polygon(0 0,100% 0,92% 100%,0 100%)', z: 5 }),
    text('p1-band-text', 'Resumo da capa', 'PRESENÇA, TRANSPARÊNCIA E AÇÃO PARA TRANSFORMAR VIDAS.', 54, 64.2, 34, 8, 1.55, { color: '#fff', fontFamily: 'Arial Black', fontWeight: 900, lineHeight: 1.05, letterSpacing: .02, z: 12 }),
    shape('p1-qr', 'Área QR Code', 68, 80, 20, 14, '#ffffff', { borderColor: COLORS.blue, borderWidth: 2, shadow: '0 8px 18px rgba(7,31,56,.16)', z: 10 }),
    icon('p1-qr-icon', 'QR Code', 'QrCode', 72.5, 81.5, 10.5, 10.5, COLORS.navy, '#fff'),
    text('p1-qr-label', 'Legenda QR', 'FALE COM O GABINETE', 52, 83.3, 16, 5, 1.15, { color: COLORS.navy, fontFamily: 'Arial Black', fontWeight: 900, lineHeight: 1.05 }),
  ], { type: 'color', value: '#f9fcfd' }, 'capa-editorial', false);
}

function page2(page: MagazinePage) {
  const items = ['Quem é Val', 'Mandato presente', 'Escolas de luta', 'Autismo e famílias', 'Projetos e compromissos'];
  const elements: CanvasElement[] = [
    shape('p2-index-bg', 'Fundo do sumário', 0, 0, 33, 100, 'linear-gradient(180deg,#075985,#063452)', { allowBleed: true, locked: true }),
    text('p2-index-title', 'Título sumário', 'SUMÁRIO', 6, 8, 22, 7, 3.4, { color: '#fff', lineHeight: 1 }),
    image('p2-photo', 'Retrato', ASSETS.portrait, 36, 4, 29, 36, { fit: 'contain', frameStyle: 'arch', borderColor: '#dbeafe', borderWidth: 1, positionY: 100 }),
    shape('p2-title-bg', 'Fundo do título', 67, 10, 28, 24, COLORS.navy, { z: 5 }),
    text('p2-title', 'Título', 'QUEM É\nVAL?', 70, 13, 22, 18, 5.2, { color: '#fff', lineHeight: .9, z: 12 }),
    body('p2-body', page.body || 'Advogado por formação e servidor por vocação. Sua história é construída com presença, escuta e trabalho próximo das pessoas.', 37, 45, 56, 17, { color: '#263f55', fontSize: 1.8 }),
    image('p2-family', 'Família', ASSETS.familia, 37, 65, 30, 26, { frameStyle: 'polaroid', positionY: 42, rotation: -1.2 }),
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
    image('p3-photo1', 'Foto família', ASSETS.familia, 6, 39, 38, 25, { frameStyle: 'polaroid', rotation: -2, positionY: 42 }),
    image('p3-photo2', 'Foto gabinete', ASSETS.gabinete, 52, 10, 40, 28, { frameStyle: 'polaroid', rotation: 1.7, positionY: 36 }),
    image('p3-photo3', 'Foto ação', ASSETS.acao, 55, 43, 35, 26, { frameStyle: 'polaroid', rotation: -1.3, positionY: 42 }),
    image('p3-photo4', 'Foto projeto', ASSETS.luvas, 7, 70, 32, 20, { frameStyle: 'polaroid', rotation: 1.6, positionX: 45 }),
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
    image('p4-bg', 'Foto de fundo', ASSETS.acao, 0, 0, 100, 100, { frameStyle: 'none', borderRadius: 0, positionX: 58, positionY: 44, allowBleed: true, locked: true }),
    shape('p4-overlay', 'Sobreposição', 0, 0, 100, 100, 'linear-gradient(90deg,rgba(3,24,42,.98) 0%,rgba(4,53,80,.92) 54%,rgba(4,31,50,.46) 100%)', { allowBleed: true, locked: true, z: 2 }),
    label(page, '#67e8f9'), rule('p4-rule', 7.2, '#67e8f9'),
    text('p4-title', 'Título', page.title || 'O mandato acontece perto das pessoas.', 6, 13, 57, 25, 5.7, { color: '#fff', minFontSize: 3.5, z: 12 }),
    body('p4-body', page.body || 'Visitas, escuta ativa e fiscalização.', 6, 40, 42, 11, { color: '#d9eef7', fontSize: 1.75, z: 12 }),
  ];
  cards.forEach(([iconName, titleValue, description], i) => {
    const x = i % 2 === 0 ? 6 : 29;
    const y = i < 2 ? 57 : 75;
    elements.push(shape(`p4-card-${i}`, 'Cartão', x, y, 21, 14, 'rgba(255,255,255,.11)', { borderColor: 'rgba(255,255,255,.22)', borderWidth: 1, borderRadius: 3, z: 6 }));
    elements.push(icon(`p4-icon-${i}`, titleValue, iconName, x + 2, y + 2, 5, 4.2, '#67e8f9', 'rgba(255,255,255,.09)'));
    elements.push(text(`p4-card-title-${i}`, titleValue, titleValue.toUpperCase(), x + 8, y + 2, 11, 3.2, 1.06, { color: '#fff', fontFamily: 'Arial Black', lineHeight: 1.05, z: 12 }));
    elements.push(body(`p4-card-body-${i}`, description, x + 2, y + 7, 17, 5.5, { color: '#d3e8f2', fontSize: .96, lineHeight: 1.2, z: 12 }));
  });
  return document(page, elements, { type: 'color', value: COLORS.navy }, 'hero-mandato');
}

function page5(page: MagazinePage) {
  const elements: CanvasElement[] = [label(page), rule('p5-rule'),
    text('p5-title', 'Título', page.title || 'Trabalho de campo', 6, 11, 65, 12, 4.7, { color: COLORS.navy }),
    ...quote('p5-quote', page.quote || 'Resultado começa com escuta, presença e acompanhamento.', 6, 25, 54, 14, COLORS.blue),
    image('p5-main', 'Foto principal', ASSETS.gabinete, 51, 9, 42, 34, { frameStyle: 'polaroid', rotation: 1, positionY: 32 }),
    image('p5-a', 'Foto 1', ASSETS.acao, 6, 47, 28, 23, { frameStyle: 'polaroid', rotation: -1.2 }),
    image('p5-b', 'Foto 2', ASSETS.familia, 37, 47, 26, 23, { frameStyle: 'polaroid', rotation: 1.4, positionY: 40 }),
    image('p5-c', 'Foto 3', ASSETS.luvas, 67, 47, 26, 23, { frameStyle: 'polaroid', rotation: -1.3 }),
    body('p5-a-text', 'Fiscalização contínua e diálogo com os bairros.', 6, 73, 27, 8, { fontSize: 1.25, color: '#273f55' }),
    body('p5-b-text', 'Apoio social e fortalecimento das iniciativas locais.', 37, 73, 27, 8, { fontSize: 1.25, color: '#273f55' }),
    body('p5-c-text', 'Projetos que ampliam oportunidades.', 67, 73, 26, 8, { fontSize: 1.25, color: '#273f55' }),
    shape('p5-footer', 'Faixa inferior', 0, 87, 100, 13, 'linear-gradient(90deg,#075985,#06b6d4)', { allowBleed: true }),
    text('p5-footer-text', 'Chamada', (page.body || 'Fiscalização contínua, ouvidoria móvel e apoio comunitário.').toUpperCase(), 7, 90.5, 86, 5, 1.35, { color: '#fff', fontFamily: 'Arial Black', align: 'center', lineHeight: 1.05, z: 12 }),
  ];
  return document(page, elements, { type: 'image', value: ASSETS.mosaic, fit: 'cover', overlay: 'linear-gradient(rgba(247,250,251,.95),rgba(247,250,251,.95))' }, 'mural-fotografico');
}

function page6(page: MagazinePage) {
  return document(page, [
    image('p6-bg', 'Foto de luta', ASSETS.luvas, 0, 0, 100, 100, { frameStyle: 'none', borderRadius: 0, allowBleed: true, locked: true, positionX: 48, positionY: 48, z: 1 }),
    shape('p6-overlay', 'Degradê de proteção', 0, 0, 100, 100, 'linear-gradient(90deg,rgba(3,31,56,.95),rgba(3,74,105,.74) 54%,rgba(3,31,56,.15))', { allowBleed: true, locked: true, z: 2 }),
    label(page, '#67e8f9'), rule('p6-rule', 7.2, '#67e8f9'),
    text('p6-title', 'Título', page.title || 'Esporte que abre caminhos.', 6, 14, 62, 25, 6.0, { color: '#fff', minFontSize: 3.8, z: 12 }),
    shape('p6-glass', 'Caixa de texto', 6, 45, 49, 25, 'rgba(255,255,255,.88)', { borderRadius: 5, shadow: '0 14px 35px rgba(0,0,0,.22)', z: 6 }),
    body('p6-body', page.body || 'O apadrinhamento de escolas de luta fortalece oportunidades, disciplina e pertencimento.', 10, 49, 41, 15, { color: COLORS.navy, fontSize: 1.75, fontWeight: 650, z: 12 }),
    shape('p6-band', 'Faixa', 0, 78, 100, 17, 'linear-gradient(90deg,#075985,#06b6d4)', { allowBleed: true, z: 5 }),
    text('p6-band-title', 'Chamada', 'APADRINHAMENTO DE ESCOLAS DE LUTA', 6, 82, 88, 6, 2.65, { color: '#fff', fontFamily: 'Arial Black', align: 'center', z: 12 }),
    text('p6-band-sub', 'Subchamada', 'OPORTUNIDADE • DISCIPLINA • RESPEITO', 6, 89.2, 88, 3, 1.05, { color: '#d9f7ff', fontFamily: 'Inter', fontWeight: 900, align: 'center', letterSpacing: .12, z: 12 }),
  ], { type: 'color', value: COLORS.navy }, 'hero-esporte');
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
    image('p7-main', 'Foto principal', ASSETS.luvas, 55, 29, 38, 38, { frameStyle: 'rounded', borderRadius: 1.5, positionX: 46 }),
    image('p7-small1', 'Foto projeto 1', ASSETS.acao, 55, 70, 18, 17, { frameStyle: 'polaroid', rotation: -1 }),
    image('p7-small2', 'Foto projeto 2', ASSETS.familia, 75, 70, 18, 17, { frameStyle: 'polaroid', rotation: 1, positionY: 40 }),
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
    image('p8-bg', 'Foto autismo', ASSETS.familia, 0, 0, 100, 100, { frameStyle: 'none', borderRadius: 0, allowBleed: true, positionX: 64, positionY: 45, locked: true }),
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
    image('p9-center', 'Foto central', ASSETS.familia, 34, 34, 32, 37, { frameStyle: 'arch', fit: 'cover', positionY: 38, borderColor: '#bce8f5', borderWidth: 2 }),
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
    ['Saúde', 'HeartPulse', ASSETS.acao],
    ['Educação', 'GraduationCap', ASSETS.familia],
    ['Proteção animal', 'PawPrint', ASSETS.gabinete],
    ['Apoio às famílias', 'HeartHandshake', ASSETS.acao],
    ['Cidadania', 'Scale', ASSETS.familia],
  ];
  const elements: CanvasElement[] = [label(page), rule('p10-rule'),
    text('p10-title', 'Título', page.title || 'Projetos que mudam realidades.', 6, 11, 87, 13, 4.8, { color: COLORS.navy }),
    body('p10-body', page.body || 'Saúde, educação, proteção animal e apoio às famílias.', 6, 25, 84, 7, { color: '#29475d', fontSize: 1.55, fontWeight: 600 }),
  ];
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
  const items = ['Escuta permanente', 'Fiscalização responsável', 'Transparência', 'Projetos com impacto', 'Participação popular'];
  const elements: CanvasElement[] = [label(page), rule('p11-rule'),
    image('p11-hero', 'Foto principal', ASSETS.acao, 43, 8, 57, 46, { frameStyle: 'none', borderRadius: 0, allowBleed: true, positionX: 52, positionY: 38 }),
    shape('p11-title-bg', 'Painel título', 0, 8, 49, 46, 'linear-gradient(135deg,#072b48,#075985)', { allowBleed: true, z: 4 }),
    text('p11-title', 'Título', page.title || 'Compromissos em movimento.', 6, 15, 38, 22, 5.4, { color: '#fff', minFontSize: 3.3, z: 12 }),
    body('p11-intro', page.body || 'Ações permanentes, fiscalização e participação popular.', 6, 40, 34, 10, { color: '#d9f5fc', fontSize: 1.55, z: 12 }),
  ];
  items.forEach((item, i) => {
    const y = 60 + i * 6.7;
    elements.push(shape(`p11-dot-${i}`, 'Marcador', 7, y + .8, 2.2, 2.2, COLORS.cyan, { borderRadius: 50, z: 8 }));
    elements.push(text(`p11-item-${i}`, item, item.toUpperCase(), 11, y, 40, 4, 1.34, { color: COLORS.navy, fontFamily: 'Arial Black', lineHeight: 1, z: 12 }));
    elements.push(shape(`p11-line-${i}`, 'Linha', 52, y + 1.6, 41, .18, i % 2 ? '#bce7f2' : '#d4eef5', { z: 3 }));
  });
  shape('dummy','dummy',0,0,1,1,'#fff');
  return document(page, elements, { type: 'color', value: '#f8fcfd' }, 'lista-editorial');
}

function page12(page: MagazinePage) {
  return document(page, [label(page), rule('p12-rule'),
    text('p12-title', 'Título', page.title || 'O gabinete está sempre de portas abertas.', 6, 11, 85, 17, 4.7, { color: COLORS.navy }),
    image('p12-main', 'Foto do gabinete', ASSETS.gabinete, 6, 32, 53, 43, { frameStyle: 'polaroid', rotation: -1, positionY: 38 }),
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
    image('p13-main', 'Foto escolas de luta', ASSETS.luvas, 6, 31, 43, 51, { frameStyle: 'rounded', borderRadius: 2, positionX: 45 }),
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
    image('p14-a', 'Foto história 1', ASSETS.luvas, 6, 29, 40, 29, { frameStyle: 'polaroid', rotation: -1.5 }),
    image('p14-b', 'Foto história 2', ASSETS.acao, 54, 23, 38, 31, { frameStyle: 'polaroid', rotation: 1.7 }),
    shape('p14-tape1', 'Fita 1', 21, 26, 11, 3, 'rgba(125,211,252,.62)', { rotation: -3, z: 15 }),
    shape('p14-tape2', 'Fita 2', 67, 20, 11, 3, 'rgba(103,232,249,.58)', { rotation: 3, z: 15 }),
    ...quote('p14-quote', page.quote || 'Disciplina não é apenas seguir regras. É descobrir força, foco e confiança.', 6, 63, 48, 20, COLORS.blue),
    image('p14-c', 'Foto história 3', ASSETS.familia, 58, 61, 34, 26, { frameStyle: 'polaroid', rotation: -1, positionY: 42 }),
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
    image('p15-portrait', 'Foto da família', ASSETS.familia, 51, 18, 49, 82, { frameStyle: 'none', borderRadius: 0, positionX: 52, positionY: 40, allowBleed: true, z: 4 }),
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
  const elements: CanvasElement[] = [label(page), rule('p16-rule'),
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
    image('p17-strip1', 'Foto 1', ASSETS.acao, 6, 29, 27, 18, { frameStyle: 'polaroid', rotation: -1 }),
    image('p17-strip2', 'Foto 2', ASSETS.gabinete, 36, 29, 27, 18, { frameStyle: 'polaroid', rotation: 1 }),
    image('p17-strip3', 'Foto 3', ASSETS.familia, 66, 29, 27, 18, { frameStyle: 'polaroid', rotation: -1, positionY: 40 }),
    shape('p17-line', 'Linha do tempo', 10, 59, 80, 1, 'linear-gradient(90deg,#06b6d4,#075985)', { borderRadius: 99 }),
  ];
  steps.forEach(([titleValue, description], i) => {
    const x = 7 + i * 22.5;
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
    image('p18-1', 'Foto grande', ASSETS.acao, 6, 28, 45, 38, { frameStyle: 'rounded', borderRadius: 1.5, positionY: 43 }),
    image('p18-2', 'Foto 2', ASSETS.familia, 54, 28, 19, 25, { frameStyle: 'polaroid', rotation: -1, positionY: 40 }),
    image('p18-3', 'Foto 3', ASSETS.gabinete, 76, 28, 18, 25, { frameStyle: 'polaroid', rotation: 1 }),
    image('p18-4', 'Foto 4', ASSETS.luvas, 54, 57, 40, 29, { frameStyle: 'polaroid', rotation: -.8 }),
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
    image('p20-portrait', 'Retrato', ASSETS.portrait, 43, 10, 57, 90, { fit: 'contain', frameStyle: 'none', borderRadius: 0, positionY: 100, allowBleed: true, z: 5 }),
    text('p20-title', 'Título', 'MANDE\nUM ZAP', 7, 12, 42, 23, 7.2, { color: '#fff', lineHeight: .85, minFontSize: 4.8, z: 12 }),
    shape('p20-qr', 'QR Code', 9, 41, 31, 28, '#fff', { borderColor: COLORS.cyan, borderWidth: 2, shadow: '0 14px 35px rgba(0,0,0,.25)', z: 8 }),
    icon('p20-qr-icon', 'QR Code', 'QrCode', 15, 46, 19, 18, COLORS.navy, '#fff'),
    body('p20-body', page.body || 'Acompanhe, participe e cobre resultados.', 7, 75, 35, 12, { color: '#d8f4fc', fontSize: 1.85, fontWeight: 700, z: 12 }),
    image('p20-logo', 'Logotipo', ASSETS.logo, 7, 89, 29, 8, { fit: 'contain', frameStyle: 'none', z: 12 }),
  ], { type: 'color', value: COLORS.navy }, 'contracapa-cta', false);
}

const BUILDERS: Record<number, (page: MagazinePage) => CanvasDocument> = {
  1: page1, 2: page2, 3: page3, 4: page4, 5: page5,
  6: page6, 7: page7, 8: page8, 9: page9, 10: page10,
  11: page11, 12: page12, 13: page13, 14: page14, 15: page15,
  16: page16, 17: page17, 18: page18, 19: page19, 20: page20,
};

export function defaultCanvasForPage(page: MagazinePage): CanvasDocument {
  return (BUILDERS[page.page_number] || page3)(page);
}

export function getCanvasDocument(page: MagazinePage): CanvasDocument {
  const canvas = (page.elements as { canvas?: CanvasDocument } | null)?.canvas;
  if (canvas?.version === 3 && Array.isArray(canvas.elements)) return canvas;
  return defaultCanvasForPage(page);
}
