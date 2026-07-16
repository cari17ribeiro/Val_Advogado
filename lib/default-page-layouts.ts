import type { CanvasDocument, CanvasElement, MagazinePage, TextElement } from './editor-types';

export const ASSETS = {
  portrait: 'https://i.ibb.co/zc68Yhm/8db8ac81-aff0-4f47-84f3-6929b69dbd04.png',
  mosaic: 'https://i.ibb.co/Kz9HyrPX/67f29597-c56c-4f03-8064-1a8f978908d5.jpg',
  logo: 'https://i.ibb.co/Mx14ByDD/fc3cc5b0-070e-44b5-9509-306bcc2fd7a7.png',
  gabinete: 'https://i.ibb.co/mrCKvCRC/gabinete.png',
  luvas: 'https://i.ibb.co/YFybNTck/luvas.png',
  acao: 'https://i.ibb.co/gZQkNzDq/Capturar.png',
  familia: 'https://i.ibb.co/n8C5wNqr/familia.png',
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
  color: options.color ?? '#0f2744',
  fontFamily: options.fontFamily ?? 'Playfair Display',
  fontSize,
  minFontSize: options.minFontSize ?? Math.max(1.5, fontSize * 0.55),
  fontWeight: options.fontWeight ?? 800,
  lineHeight: options.lineHeight ?? 0.95,
  letterSpacing: options.letterSpacing ?? -0.03,
  align: options.align ?? 'left',
  italic: options.italic ?? false,
  uppercase: options.uppercase ?? false,
  background: options.background ?? 'transparent',
  padding: options.padding ?? 0,
  borderRadius: options.borderRadius ?? 0,
  opacity: options.opacity ?? 1,
  rotation: options.rotation ?? 0,
  locked: options.locked,
  hidden: options.hidden,
});

const image = (
  id: string,
  name: string,
  src: string,
  x: number,
  y: number,
  w: number,
  h: number,
  options: Partial<Extract<CanvasElement, { type: 'image' }>> = {},
): Extract<CanvasElement, { type: 'image' }> => ({
  ...base(id, name, x, y, w, h, options.z ?? 3),
  type: 'image', src,
  alt: options.alt ?? name,
  fit: options.fit ?? 'cover',
  positionX: options.positionX ?? 50,
  positionY: options.positionY ?? 50,
  zoom: options.zoom ?? 100,
  borderRadius: options.borderRadius ?? 3,
  borderColor: options.borderColor ?? 'transparent',
  borderWidth: options.borderWidth ?? 0,
  opacity: options.opacity ?? 1,
  rotation: options.rotation ?? 0,
  locked: options.locked,
  hidden: options.hidden,
});

const shape = (
  id: string,
  name: string,
  x: number,
  y: number,
  w: number,
  h: number,
  fill: string,
  options: Partial<Extract<CanvasElement, { type: 'shape' }>> = {},
): Extract<CanvasElement, { type: 'shape' }> => ({
  ...base(id, name, x, y, w, h, options.z ?? 1),
  type: 'shape', fill,
  borderColor: options.borderColor ?? 'transparent',
  borderWidth: options.borderWidth ?? 0,
  borderRadius: options.borderRadius ?? 0,
  shadow: options.shadow,
  opacity: options.opacity ?? 1,
  rotation: options.rotation ?? 0,
  locked: options.locked,
  hidden: options.hidden,
});

const icon = (
  id: string,
  name: string,
  iconName: string,
  x: number,
  y: number,
  w: number,
  h: number,
  options: Partial<Extract<CanvasElement, { type: 'icon' }>> = {},
): Extract<CanvasElement, { type: 'icon' }> => ({
  ...base(id, name, x, y, w, h, options.z ?? 8),
  type: 'icon', icon: iconName,
  color: options.color ?? '#06b6d4',
  background: options.background ?? 'rgba(255,255,255,.9)',
  padding: options.padding ?? 18,
  borderRadius: options.borderRadius ?? 24,
  opacity: options.opacity ?? 1,
  rotation: options.rotation ?? 0,
  locked: options.locked,
  hidden: options.hidden,
});

const pageLabel = (page: MagazinePage, color = '#0891b2') => text(
  `p${page.page_number}-label`,
  'Identificação da página',
  `${String(page.page_number).padStart(2, '0')} · ${(page.subtitle || 'INFOJORNAL').toUpperCase()}`,
  7, 6, 72, 3.5, 1.45,
  { color, fontFamily: 'Inter', fontWeight: 800, lineHeight: 1.1, letterSpacing: 0.12, uppercase: true },
);

const pageNumber = (page: MagazinePage, color = '#64748b') => text(
  `p${page.page_number}-number`, 'Número', String(page.page_number).padStart(2, '0'), 88, 94.5, 6, 2.2, 1.2,
  { color, fontFamily: 'Inter', fontWeight: 700, align: 'right', letterSpacing: 0.08 },
);

const common = (page: MagazinePage, elements: CanvasElement[], background: CanvasDocument['background']): CanvasDocument => ({
  version: 2, background, safeArea: 5, elements: [...elements, pageNumber(page)],
});

function cover(page: MagazinePage): CanvasDocument {
  return common(page, [
    shape('cover-glow', 'Brilho', 50, 0, 50, 100, 'linear-gradient(145deg,rgba(34,211,238,.12),rgba(14,165,233,.34))', { locked: true }),
    shape('cover-arch', 'Arco da foto', 52, 5, 42, 90, 'rgba(255,255,255,.42)', { borderRadius: 48, borderColor: 'rgba(14,165,233,.28)', borderWidth: 1, locked: true, z: 2 }),
    image('cover-photo', 'Foto principal', ASSETS.portrait, 53, 8, 40, 86, { fit: 'contain', borderRadius: 34, z: 4 }),
    image('cover-logo', 'Logotipo', ASSETS.logo, 7, 5, 18, 8, { fit: 'contain', z: 12 }),
    text('cover-edition', 'Edição', 'INFOJORNAL · EDIÇÃO 01 · 2026', 7, 21, 38, 4, 1.45, { color: '#0786a5', fontFamily: 'Inter', fontWeight: 900, letterSpacing: 0.12 }),
    text('cover-title', 'Nome', page.title || 'Val Advogado', 7, 29, 43, 18, 7.8, { color: '#0b2745', minFontSize: 4.7 }),
    text('cover-phrase', 'Frase principal', page.body || 'O que eu faço é da sua conta.', 7, 50, 42, 13, 4.3, { color: '#0ea5c6', italic: true, fontWeight: 700, minFontSize: 2.7 }),
    text('cover-support', 'Descrição', 'Transparência, presença nos bairros e ação para transformar vidas.', 7, 66, 39, 10, 2.05, { color: '#36556f', fontFamily: 'Inter', fontWeight: 500, lineHeight: 1.45, letterSpacing: 0 }),
    icon('cover-icon-1', 'Esporte', 'Dumbbell', 8, 81, 7, 7, { color: '#0891b2' }),
    icon('cover-icon-2', 'Inclusão', 'Accessibility', 18, 81, 7, 7, { color: '#0e7490' }),
  ], { type: 'image', value: ASSETS.mosaic, fit: 'cover', overlay: 'linear-gradient(90deg,rgba(245,251,255,.95),rgba(237,248,253,.83))' });
}

function biography(page: MagazinePage): CanvasDocument {
  return common(page, [
    pageLabel(page),
    text(`p${page.page_number}-title`, 'Título', page.title || '', 7, 13, 49, 22, 6.5, { minFontSize: 3.6 }),
    text(`p${page.page_number}-body`, 'Texto', page.body || '', 7, 39, 43, 16, 2.05, { fontFamily: 'Inter', fontWeight: 450, lineHeight: 1.52, letterSpacing: 0, color: '#496179' }),
    shape(`p${page.page_number}-quote-bg`, 'Caixa de destaque', 7, 59, 42, 15, 'rgba(14,165,233,.09)', { borderRadius: 4, borderColor: 'rgba(14,165,233,.22)', borderWidth: 1 }),
    text(`p${page.page_number}-quote`, 'Destaque', page.quote || 'Servir é estar perto, ouvir e transformar presença em resultado.', 10, 62, 36, 9, 2.35, { italic: true, color: '#075985', minFontSize: 1.7 }),
    image(`p${page.page_number}-photo`, 'Fotografia', page.page_number % 2 ? ASSETS.familia : ASSETS.gabinete, 57, 9, 36, 84, { fit: 'cover', positionY: 35, borderRadius: 4 }),
    shape(`p${page.page_number}-stripe`, 'Faixa decorativa', 52.5, 9, 1.4, 84, 'linear-gradient(#22d3ee,#0284c7)', { borderRadius: 2 }),
  ], { type: 'color', value: '#f4faff' });
}

function mosaic(page: MagazinePage): CanvasDocument {
  const imgs = [ASSETS.familia, ASSETS.gabinete, ASSETS.acao, ASSETS.luvas, ASSETS.portrait];
  return common(page, [
    pageLabel(page),
    text(`p${page.page_number}-title`, 'Título', page.title || '', 7, 12, 75, 14, 5.4, { minFontSize: 3.2 }),
    image(`p${page.page_number}-m1`, 'Foto 1', imgs[0], 7, 30, 42, 36, { positionY: 40, borderRadius: 3 }),
    image(`p${page.page_number}-m2`, 'Foto 2', imgs[1], 52, 30, 20, 25, { borderRadius: 3 }),
    image(`p${page.page_number}-m3`, 'Foto 3', imgs[2], 75, 30, 18, 25, { borderRadius: 3 }),
    image(`p${page.page_number}-m4`, 'Foto 4', imgs[3], 52, 58, 41, 27, { borderRadius: 3 }),
    image(`p${page.page_number}-m5`, 'Foto 5', imgs[4], 7, 69, 42, 18, { fit: 'contain', borderRadius: 3, borderColor: '#dbeafe', borderWidth: 1 }),
    text(`p${page.page_number}-caption`, 'Legenda', page.body || '', 7, 90, 76, 4, 1.65, { fontFamily: 'Inter', fontWeight: 500, color: '#48647d', lineHeight: 1.25, letterSpacing: 0 }),
  ], { type: 'color', value: '#f5faff' });
}

function darkStory(page: MagazinePage): CanvasDocument {
  return common(page, [
    image(`p${page.page_number}-bg`, 'Foto de fundo', page.page_number % 2 ? ASSETS.acao : ASSETS.gabinete, 0, 0, 100, 100, { borderRadius: 0, positionY: 40, z: 1 }),
    shape(`p${page.page_number}-overlay`, 'Sobreposição', 0, 0, 100, 100, 'linear-gradient(90deg,rgba(2,19,36,.97) 0%,rgba(2,31,55,.88) 52%,rgba(2,24,43,.34) 100%)', { z: 2, locked: true }),
    pageLabel(page, '#67e8f9'),
    text(`p${page.page_number}-title`, 'Título', page.title || '', 8, 18, 52, 28, 6.6, { color: '#ffffff', minFontSize: 3.5 }),
    text(`p${page.page_number}-body`, 'Texto', page.body || '', 8, 51, 45, 16, 2.05, { color: '#d8edf7', fontFamily: 'Inter', fontWeight: 450, lineHeight: 1.5, letterSpacing: 0 }),
    shape(`p${page.page_number}-glass`, 'Cartão glass', 8, 73, 44, 12, 'rgba(255,255,255,.10)', { borderColor: 'rgba(255,255,255,.24)', borderWidth: 1, borderRadius: 4, z: 5 }),
    text(`p${page.page_number}-quote`, 'Destaque', page.quote || 'Escuta ativa, presença e fiscalização.', 11, 76, 38, 7, 2.05, { color: '#ffffff', fontFamily: 'Inter', fontWeight: 700, lineHeight: 1.25, letterSpacing: 0, z: 8 }),
  ], { type: 'color', value: '#061a2b' });
}

function photoStory(page: MagazinePage): CanvasDocument {
  return common(page, [
    pageLabel(page),
    text(`p${page.page_number}-title`, 'Título', page.title || '', 7, 13, 68, 14, 5.4, { minFontSize: 3.1 }),
    text(`p${page.page_number}-body`, 'Texto', page.body || '', 7, 29, 78, 10, 1.9, { fontFamily: 'Inter', fontWeight: 450, color: '#526a80', lineHeight: 1.45, letterSpacing: 0 }),
    image(`p${page.page_number}-main`, 'Foto principal', ASSETS.gabinete, 7, 43, 86, 45, { borderRadius: 4, positionY: 42 }),
    shape(`p${page.page_number}-badge`, 'Selo', 64, 80, 24, 12, 'rgba(5,55,84,.88)', { borderRadius: 4, z: 7 }),
    text(`p${page.page_number}-badge-text`, 'Texto do selo', 'MANDATO NAS RUAS', 67, 83.5, 18, 5, 1.45, { color: '#ffffff', fontFamily: 'Inter', fontWeight: 900, align: 'center', letterSpacing: 0.08, z: 8 }),
  ], { type: 'color', value: '#f6fbff' });
}

function fightIntro(page: MagazinePage): CanvasDocument {
  return common(page, [
    image(`p${page.page_number}-photo`, 'Foto esporte', ASSETS.luvas, 0, 0, 100, 100, { positionX: 55, positionY: 45, borderRadius: 0 }),
    shape(`p${page.page_number}-overlay`, 'Sobreposição azul', 0, 0, 100, 100, 'linear-gradient(180deg,rgba(3,23,43,.16),rgba(3,25,47,.95) 76%)', { locked: true, z: 2 }),
    icon(`p${page.page_number}-icon`, 'Ícone de luta', 'Swords', 8, 8, 9, 9, { color: '#67e8f9', background: 'rgba(2,24,43,.76)', z: 8 }),
    pageLabel(page, '#67e8f9'),
    text(`p${page.page_number}-title`, 'Título', page.title || '', 8, 56, 74, 22, 6.5, { color: '#ffffff', minFontSize: 3.8 }),
    text(`p${page.page_number}-body`, 'Texto', page.body || '', 8, 80, 72, 9, 1.9, { color: '#d9f3fb', fontFamily: 'Inter', fontWeight: 500, lineHeight: 1.4, letterSpacing: 0 }),
  ], { type: 'color', value: '#031b2d' });
}

function fightGallery(page: MagazinePage): CanvasDocument {
  return common(page, [
    pageLabel(page),
    text(`p${page.page_number}-title`, 'Título', page.title || '', 7, 12, 79, 16, 5.6, { minFontSize: 3.2 }),
    image(`p${page.page_number}-g1`, 'Foto de luta 1', ASSETS.luvas, 7, 32, 40, 50, { positionX: 46, borderRadius: 4 }),
    image(`p${page.page_number}-g2`, 'Foto de luta 2', ASSETS.acao, 50, 32, 43, 23, { borderRadius: 4 }),
    image(`p${page.page_number}-g3`, 'Foto de luta 3', ASSETS.familia, 50, 58, 43, 24, { borderRadius: 4 }),
    icon(`p${page.page_number}-i1`, 'Disciplina', 'Medal', 10, 85, 6, 6, { background: '#e0f2fe', padding: 15 }),
    text(`p${page.page_number}-t1`, 'Disciplina', 'DISCIPLINA', 18, 86.5, 18, 3, 1.25, { color: '#075985', fontFamily: 'Inter', fontWeight: 900, letterSpacing: 0.08 }),
    icon(`p${page.page_number}-i2`, 'Oportunidade', 'Users', 50, 85, 6, 6, { background: '#e0f2fe', padding: 15 }),
    text(`p${page.page_number}-t2`, 'Oportunidade', 'OPORTUNIDADE', 58, 86.5, 24, 3, 1.25, { color: '#075985', fontFamily: 'Inter', fontWeight: 900, letterSpacing: 0.08 }),
  ], { type: 'color', value: '#f4faff' });
}

function autismIntro(page: MagazinePage): CanvasDocument {
  return common(page, [
    shape(`p${page.page_number}-blob1`, 'Forma azul', 55, -8, 55, 55, 'rgba(34,211,238,.18)', { borderRadius: 50, locked: true }),
    shape(`p${page.page_number}-blob2`, 'Forma lilás', 67, 37, 43, 43, 'rgba(129,140,248,.15)', { borderRadius: 50, locked: true }),
    pageLabel(page, '#0e7490'),
    icon(`p${page.page_number}-icon`, 'Inclusão', 'HeartHandshake', 7, 14, 10, 10, { color: '#0e7490', background: '#cffafe' }),
    text(`p${page.page_number}-title`, 'Título', page.title || '', 7, 29, 55, 30, 6.2, { color: '#17324c', minFontSize: 3.4 }),
    text(`p${page.page_number}-body`, 'Texto', page.body || '', 7, 63, 49, 14, 2.0, { color: '#46627a', fontFamily: 'Inter', fontWeight: 450, lineHeight: 1.5, letterSpacing: 0 }),
    image(`p${page.page_number}-photo`, 'Foto família', ASSETS.familia, 62, 13, 31, 75, { borderRadius: 18, positionY: 40 }),
    shape(`p${page.page_number}-tag`, 'Etiqueta', 58, 78, 34, 12, 'rgba(255,255,255,.88)', { borderRadius: 4, borderColor: 'rgba(14,116,144,.16)', borderWidth: 1, z: 7 }),
    text(`p${page.page_number}-tag-text`, 'Etiqueta', 'ACOLHIMENTO · ACESSIBILIDADE', 61, 82, 28, 4, 1.25, { color: '#0e7490', fontFamily: 'Inter', fontWeight: 900, align: 'center', letterSpacing: 0.05, z: 8 }),
  ], { type: 'gradient', value: 'linear-gradient(145deg,#f7fcff,#edf9fb 58%,#f3f1ff)' });
}

function cards(page: MagazinePage, theme: 'autism' | 'projects' | 'guide' = 'projects'): CanvasDocument {
  const palette = theme === 'autism'
    ? { accent: '#0e7490', pale: '#e6fbff', icons: ['HeartHandshake', 'Accessibility', 'BookOpen', 'CalendarDays'] }
    : theme === 'guide'
      ? { accent: '#0369a1', pale: '#eaf5ff', icons: ['Scale', 'MapPinned', 'Download', 'PhoneCall'] }
      : { accent: '#075985', pale: '#e8f5ff', icons: ['GraduationCap', 'HeartPulse', 'PawPrint', 'Users'] };
  const labels = theme === 'guide' ? ['Direitos', 'Serviços', 'Materiais', 'Contatos'] : theme === 'autism' ? ['Acolher', 'Informar', 'Incluir', 'Acompanhar'] : ['Educação', 'Saúde', 'Proteção', 'Famílias'];
  const elements: CanvasElement[] = [
    pageLabel(page, palette.accent),
    text(`p${page.page_number}-title`, 'Título', page.title || '', 7, 12, 80, 20, 5.6, { color: '#122c46', minFontSize: 3.2 }),
    text(`p${page.page_number}-body`, 'Texto', page.body || '', 7, 34, 82, 9, 1.9, { color: '#526b80', fontFamily: 'Inter', fontWeight: 450, lineHeight: 1.45, letterSpacing: 0 }),
  ];
  labels.forEach((label, index) => {
    const col = index % 2;
    const row = Math.floor(index / 2);
    const x = 7 + col * 44;
    const y = 48 + row * 21;
    elements.push(shape(`p${page.page_number}-card-${index}`, `Cartão ${label}`, x, y, 41, 17, '#ffffff', { borderRadius: 4, borderColor: '#d9e9f2', borderWidth: 1, shadow: '0 10px 30px rgba(15,74,105,.08)' }));
    elements.push(icon(`p${page.page_number}-icon-${index}`, label, palette.icons[index], x + 3, y + 3.5, 8, 8, { color: palette.accent, background: palette.pale, padding: 20, z: 8 }));
    elements.push(text(`p${page.page_number}-card-title-${index}`, label, label, x + 14, y + 4, 23, 4, 1.65, { color: '#17324c', fontFamily: 'Inter', fontWeight: 850, lineHeight: 1.1, letterSpacing: 0, z: 8 }));
    elements.push(text(`p${page.page_number}-card-body-${index}`, `${label} descrição`, 'Informação clara e ação próxima das pessoas.', x + 14, y + 8.5, 23, 6, 1.15, { color: '#60778a', fontFamily: 'Inter', fontWeight: 450, lineHeight: 1.35, letterSpacing: 0, z: 8 }));
  });
  return common(page, elements, { type: 'color', value: '#f5faff' });
}

function network(page: MagazinePage): CanvasDocument {
  return common(page, [
    pageLabel(page),
    text(`p${page.page_number}-title`, 'Título', page.title || '', 7, 12, 78, 17, 5.5, { minFontSize: 3.2 }),
    image(`p${page.page_number}-photo`, 'Foto principal', ASSETS.luvas, 7, 34, 45, 52, { borderRadius: 4, positionX: 45 }),
    shape(`p${page.page_number}-panel`, 'Painel de dados', 56, 34, 37, 52, '#082a43', { borderRadius: 4 }),
    icon(`p${page.page_number}-icon1`, 'Escolas', 'School', 60, 39, 8, 8, { background: 'rgba(34,211,238,.12)', color: '#67e8f9', z: 8 }),
    text(`p${page.page_number}-stat1`, 'Escolas', 'ESCOLAS E ACADEMIAS', 70, 41, 18, 5, 1.35, { color: '#e6f9ff', fontFamily: 'Inter', fontWeight: 900, lineHeight: 1.2, letterSpacing: 0.06, z: 8 }),
    icon(`p${page.page_number}-icon2`, 'Modalidades', 'Swords', 60, 55, 8, 8, { background: 'rgba(34,211,238,.12)', color: '#67e8f9', z: 8 }),
    text(`p${page.page_number}-stat2`, 'Modalidades', 'MODALIDADES E PROFESSORES', 70, 57, 18, 6, 1.35, { color: '#e6f9ff', fontFamily: 'Inter', fontWeight: 900, lineHeight: 1.2, letterSpacing: 0.06, z: 8 }),
    icon(`p${page.page_number}-icon3`, 'Jovens', 'Users', 60, 71, 8, 8, { background: 'rgba(34,211,238,.12)', color: '#67e8f9', z: 8 }),
    text(`p${page.page_number}-stat3`, 'Jovens', 'CRIANÇAS E JOVENS', 70, 73, 18, 5, 1.35, { color: '#e6f9ff', fontFamily: 'Inter', fontWeight: 900, lineHeight: 1.2, letterSpacing: 0.06, z: 8 }),
    text(`p${page.page_number}-body`, 'Texto', page.body || '', 7, 89, 78, 5, 1.55, { color: '#526b80', fontFamily: 'Inter', fontWeight: 500, lineHeight: 1.35, letterSpacing: 0 }),
  ], { type: 'color', value: '#f5faff' });
}

function timeline(page: MagazinePage): CanvasDocument {
  const years = ['Escuta', 'Fiscalização', 'Proposição', 'Resultado'];
  const elements: CanvasElement[] = [pageLabel(page), text(`p${page.page_number}-title`, 'Título', page.title || '', 7, 12, 79, 16, 5.5, { minFontSize: 3.2 }), shape(`p${page.page_number}-line`, 'Linha', 14, 40, 2, 43, 'linear-gradient(#22d3ee,#0369a1)', { borderRadius: 2 })];
  years.forEach((label, index) => {
    const y = 39 + index * 13;
    elements.push(shape(`p${page.page_number}-dot-${index}`, `Marcador ${index + 1}`, 10.5, y, 9, 6.5, '#ffffff', { borderRadius: 50, borderColor: '#0ea5e9', borderWidth: 2, z: 7 }));
    elements.push(text(`p${page.page_number}-step-${index}`, label, label, 23, y - 0.5, 24, 4, 1.65, { color: '#0b4f70', fontFamily: 'Inter', fontWeight: 900, letterSpacing: 0, z: 8 }));
    elements.push(text(`p${page.page_number}-desc-${index}`, `${label} descrição`, 'Ação registrada, acompanhada e comunicada com transparência.', 23, y + 4, 60, 6, 1.2, { color: '#61778a', fontFamily: 'Inter', fontWeight: 450, lineHeight: 1.35, letterSpacing: 0, z: 8 }));
  });
  return common(page, elements, { type: 'color', value: '#f5faff' });
}

function participation(page: MagazinePage): CanvasDocument {
  return common(page, [
    pageLabel(page),
    text(`p${page.page_number}-title`, 'Título', page.title || '', 7, 13, 72, 24, 6.4, { minFontSize: 3.5 }),
    text(`p${page.page_number}-body`, 'Texto', page.body || '', 7, 40, 45, 12, 2.0, { color: '#526b80', fontFamily: 'Inter', fontWeight: 450, lineHeight: 1.45, letterSpacing: 0 }),
    shape(`p${page.page_number}-qr`, 'Área do QR Code', 61, 17, 30, 30, '#ffffff', { borderColor: '#b9ddeb', borderWidth: 1, borderRadius: 4, shadow: '0 12px 35px rgba(7,89,133,.12)' }),
    icon(`p${page.page_number}-qr-icon`, 'QR Code', 'QrCode', 66, 22, 20, 20, { color: '#075985', background: '#f0faff', padding: 10, borderRadius: 8, z: 8 }),
    shape(`p${page.page_number}-channels`, 'Painel de canais', 7, 59, 84, 27, 'linear-gradient(135deg,#06243b,#0a4f6d)', { borderRadius: 5 }),
    icon(`p${page.page_number}-wpp`, 'WhatsApp', 'MessageCircle', 12, 65, 9, 9, { color: '#67e8f9', background: 'rgba(255,255,255,.1)', z: 8 }),
    text(`p${page.page_number}-wpp-t`, 'WhatsApp texto', 'WHATSAPP E GABINETE', 24, 67.5, 25, 4, 1.45, { color: '#ffffff', fontFamily: 'Inter', fontWeight: 900, letterSpacing: 0.05, z: 8 }),
    icon(`p${page.page_number}-social`, 'Redes sociais', 'Share2', 55, 65, 9, 9, { color: '#67e8f9', background: 'rgba(255,255,255,.1)', z: 8 }),
    text(`p${page.page_number}-social-t`, 'Redes texto', 'REDES E ENQUETES', 67, 67.5, 20, 4, 1.45, { color: '#ffffff', fontFamily: 'Inter', fontWeight: 900, letterSpacing: 0.05, z: 8 }),
  ], { type: 'color', value: '#f5faff' });
}

function finalCover(page: MagazinePage): CanvasDocument {
  return common(page, [
    image(`p${page.page_number}-bg`, 'Mosaico de fundo', ASSETS.mosaic, 0, 0, 100, 100, { borderRadius: 0, positionY: 45, z: 1 }),
    shape(`p${page.page_number}-overlay`, 'Sobreposição', 0, 0, 100, 100, 'linear-gradient(145deg,rgba(3,25,45,.96),rgba(6,65,87,.87))', { locked: true, z: 2 }),
    image(`p${page.page_number}-logo`, 'Logotipo', ASSETS.logo, 8, 7, 20, 9, { fit: 'contain', z: 9 }),
    text(`p${page.page_number}-title`, 'Título', page.title || '', 8, 25, 72, 30, 7.2, { color: '#ffffff', minFontSize: 4.0 }),
    text(`p${page.page_number}-body`, 'Texto', page.body || page.quote || 'Acompanhe, participe e cobre resultados.', 8, 60, 60, 12, 2.3, { color: '#d8f6ff', fontFamily: 'Inter', fontWeight: 500, lineHeight: 1.45, letterSpacing: 0 }),
    shape(`p${page.page_number}-contact`, 'Contato', 8, 79, 78, 10, 'rgba(255,255,255,.12)', { borderRadius: 4, borderColor: 'rgba(255,255,255,.2)', borderWidth: 1, z: 7 }),
    text(`p${page.page_number}-contact-text`, 'Contato', 'FALE COM O GABINETE · ACOMPANHE NAS REDES', 12, 82.5, 70, 4, 1.65, { color: '#ffffff', fontFamily: 'Inter', fontWeight: 900, align: 'center', letterSpacing: 0.06, z: 8 }),
  ], { type: 'color', value: '#06233a' });
}

export function defaultCanvasForPage(page: MagazinePage): CanvasDocument {
  switch (page.template) {
    case 'cover': return cover(page);
    case 'biography': return biography(page);
    case 'mosaic':
    case 'visual-diary': return mosaic(page);
    case 'editorial-dark': return darkStory(page);
    case 'photo-story': return photoStory(page);
    case 'fight-intro': return fightIntro(page);
    case 'fight-gallery':
    case 'fight-stories': return fightGallery(page);
    case 'fight-network': return network(page);
    case 'autism-intro':
    case 'autism-family': return autismIntro(page);
    case 'autism-actions': return cards(page, 'autism');
    case 'autism-guide': return cards(page, 'guide');
    case 'projects':
    case 'commitments': return cards(page, 'projects');
    case 'timeline': return timeline(page);
    case 'participation': return participation(page);
    case 'back-cover':
    case 'final-back-cover': return finalCover(page);
    default: return biography(page);
  }
}

export function getCanvasDocument(page: MagazinePage): CanvasDocument {
  const canvas = (page.elements as { canvas?: CanvasDocument } | null)?.canvas;
  if (canvas?.version === 2 && Array.isArray(canvas.elements)) return canvas;
  return defaultCanvasForPage(page);
}
