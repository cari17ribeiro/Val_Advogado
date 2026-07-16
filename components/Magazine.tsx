'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import { useState } from 'react';
import { causes, site } from '@/content/site';

const photos = {
  hero: 'https://i.ibb.co/zc68Yhm/8db8ac81-aff0-4f47-84f3-6929b69dbd04.png',
  logo: 'https://i.ibb.co/Mx14ByDD/fc3cc5b0-070e-44b5-9509-306bcc2fd7a7.png',
  gabinete: 'https://i.ibb.co/mrCKvCRC/gabinete.png',
  luvas: 'https://i.ibb.co/YFybNTck/luvas.png',
  acao: 'https://i.ibb.co/gZQkNzDq/Capturar.png',
  familia: 'https://i.ibb.co/n8C5wNqr/familia.png',
};

type MagazineProps = { interactive?: boolean };

type Page = { id: number; className: string; content: React.ReactNode };

const pages: Page[] = [
  { id: 1, className: 'mag-page cover-page', content: <><img className="cover-logo" src={photos.logo} alt="Logo Val Advogado"/><div className="cover-copy"><small>INFOJORNAL • EDIÇÃO 01 • 2026</small><h1>VAL<br/><em>ADVOGADO</em></h1><p>{site.headline}</p></div><img className="cover-person" src={photos.hero} alt="Val Advogado"/><span className="page-number">01</span></> },
  { id: 2, className: 'mag-page page-blue', content: <><small>02 — QUEM É VAL?</small><h2>Uma vida dedicada a servir.</h2><p className="dropcap">Advogado por formação e servidor por vocação. Uma trajetória construída na defesa das famílias, dos consumidores e de quem mais precisa.</p><blockquote>“A política é uma ferramenta de transformação social.”</blockquote><span className="page-number">02</span></> },
  { id: 3, className: 'mag-page photo-collage', content: <><img src={photos.familia} alt="Família"/><img src={photos.gabinete} alt="Gabinete"/><div className="floating-caption"><b>+15 anos</b><span>de trabalho e presença</span></div><span className="page-number">03</span></> },
  { id: 4, className: 'mag-page page-dark street-page', content: <><div className="vertical-word">RUA</div><small>04 — PRESENÇA</small><h2>O mandato acontece perto das pessoas.</h2><p>Visitas, escuta ativa e fiscalização para transformar demandas dos bairros em ações concretas.</p><span className="page-number">04</span></> },
  { id: 5, className: 'mag-page page-dark action-page', content: <><img src={photos.acao} alt="Ação nos bairros"/><div className="action-list"><span>Fiscalização contínua</span><span>Ouvidoria móvel</span><span>Apoio comunitário</span></div><span className="page-number">05</span></> },
  { id: 6, className: 'mag-page fight-page', content: <><small>06 — PROJETO DE DESTAQUE</small><h2>Esporte que abre caminhos.</h2><p>O apadrinhamento de escolas de luta fortalece iniciativas que oferecem disciplina, saúde, proteção e novas oportunidades para crianças e jovens.</p><div className="impact-quote">“Cada tatame pode ser uma porta para um futuro melhor.”</div><span className="page-number">06</span></> },
  { id: 7, className: 'mag-page fight-photo', content: <><img src={photos.luvas} alt="Projeto de escolas de luta"/><div className="fight-lines"><b>PERTENCIMENTO</b><b>DISCIPLINA</b><b>OPORTUNIDADE</b></div><span className="page-number">07</span></> },
  { id: 8, className: 'mag-page autism-page', content: <><small>08 — PROJETO DE DESTAQUE</small><h2>Inclusão começa com compreensão.</h2><p>O apoio ao autismo envolve acolher famílias, ampliar informação, defender atendimento digno e garantir participação plena na sociedade.</p><div className="soft-tags"><span>Acolhimento</span><span>Acessibilidade</span><span>Informação</span></div><span className="page-number">08</span></> },
  { id: 9, className: 'mag-page autism-companion', content: <><div className="autism-symbol" aria-hidden="true"><i/><i/><i/><i/></div><h3>Uma cidade preparada para todas as formas de existir.</h3><ul><li>Escuta e orientação às famílias</li><li>Defesa de atendimento multidisciplinar</li><li>Ambientes públicos mais acessíveis</li><li>Combate ao preconceito</li></ul><span className="page-number">09</span></> },
  { id: 10, className: 'mag-page projects-page', content: <><small>10 — OUTRAS BANDEIRAS</small><h2>Projetos que mudam realidades.</h2><div className="project-grid">{causes.map((cause, index)=><article key={cause.title}><span>0{index+1}</span><h3>{cause.title}</h3><p>{cause.text}</p></article>)}</div><span className="page-number">10</span></> },
  { id: 11, className: 'mag-page commitments-page', content: <><small>11 — PRÓXIMOS PASSOS</small><h2>Compromissos que seguem em movimento.</h2><ol><li>Ampliar a rede de projetos esportivos apoiados.</li><li>Construir novas ações permanentes de inclusão.</li><li>Manter a fiscalização próxima dos bairros.</li><li>Transformar participação popular em resultados.</li></ol><div className="big-number">+200</div><p className="number-caption">projetos e iniciativas apresentados</p><span className="page-number">11</span></> },
  { id: 12, className: 'mag-page back-page', content: <><img src={photos.logo} alt="Val Advogado"/><div><small>FAÇA PARTE</small><h2>O gabinete está sempre de portas abertas.</h2><p>{site.address}<br/>{site.email}</p><a href={site.whatsapp}>Fale pelo WhatsApp</a></div><footer>Transparência • Presença • Ação</footer><span className="page-number">12</span></> },
];

function PageCard({ page, side }: { page: Page; side: 'left' | 'right' }) {
  return <motion.section
    key={page.id}
    className={`${page.className} ${side}`}
    initial={{ rotateY: side === 'right' ? 14 : -14, opacity: 0, scale: .98 }}
    animate={{ rotateY: 0, opacity: 1, scale: 1 }}
    exit={{ rotateY: side === 'right' ? -88 : 88, opacity: 0 }}
    transition={{ duration: .55, ease: [0.22, 1, 0.36, 1] }}
  >{page.content}</motion.section>;
}

export function Magazine({ interactive = false }: MagazineProps) {
  const [spread, setSpread] = useState(0);
  const maxSpread = 6;
  const go = (direction: number) => setSpread(value => Math.max(0, Math.min(maxSpread - 1, value + direction)));

  if (!interactive) {
    return <div className="magazine print-magazine">{pages.map(page => <section className={page.className} key={page.id}>{page.content}</section>)}</div>;
  }

  const left = pages[spread * 2];
  const right = pages[spread * 2 + 1];

  return <div className="magazine-reader">
    <div className="reader-stage">
      <button className="page-control prev" onClick={() => go(-1)} disabled={spread === 0} aria-label="Páginas anteriores"><ChevronLeft/></button>
      <div className="book-shell">
        <div className="book-spine"/>
        <AnimatePresence mode="popLayout" initial={false}>
          <PageCard page={left} side="left"/>
          <PageCard page={right} side="right"/>
        </AnimatePresence>
      </div>
      <button className="page-control next" onClick={() => go(1)} disabled={spread === maxSpread - 1} aria-label="Próximas páginas"><ChevronRight/></button>
    </div>
    <div className="reader-controls">
      <span>Páginas {left.id}–{right.id} de 12</span>
      <div className="progress"><i style={{ width: `${((spread + 1) / maxSpread) * 100}%` }}/></div>
      <button onClick={() => document.documentElement.requestFullscreen?.()}><Maximize2 size={16}/> Tela cheia</button>
    </div>
  </div>;
}
