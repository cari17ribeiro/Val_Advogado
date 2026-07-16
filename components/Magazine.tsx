'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
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
type Page = { id: number; className: string; label: string; content: React.ReactNode };

const pages: Page[] = [
  {
    id: 1,
    label: 'Capa',
    className: 'mag-page cover-page',
    content: <>
      <div className="page-safe cover-safe">
        <img className="cover-logo" src={photos.logo} alt="Logo Val Advogado"/>
        <div className="cover-copy">
          <small>INFOJORNAL • EDIÇÃO 01 • 2026</small>
          <h1>VAL<br/><em>ADVOGADO</em></h1>
          <p>{site.headline}</p>
        </div>
      </div>
      <img className="cover-person" src={photos.hero} alt="Val Advogado"/>
      <span className="page-number">01</span>
    </>,
  },
  {
    id: 2,
    label: 'Quem é Val',
    className: 'mag-page page-blue biography-page',
    content: <div className="page-safe page-stack">
      <small>02 — QUEM É VAL?</small>
      <h2>Uma vida dedicada a servir.</h2>
      <p className="dropcap">Advogado por formação e servidor por vocação. Uma trajetória construída na defesa das famílias, dos consumidores e de quem mais precisa.</p>
      <blockquote>“A política é uma ferramenta de transformação social.”</blockquote>
      <div className="mini-facts"><span>Família</span><span>Direito</span><span>Comunidade</span></div>
      <span className="page-number">02</span>
    </div>,
  },
  {
    id: 3,
    label: 'Trajetória',
    className: 'mag-page photo-collage',
    content: <>
      <div className="collage-grid">
        <img src={photos.familia} alt="Val com a família"/>
        <img src={photos.gabinete} alt="Val no gabinete"/>
        <img src={photos.acao} alt="Val em ação"/>
      </div>
      <div className="floating-caption"><b>+15 anos</b><span>de trabalho e presença</span></div>
      <span className="page-number">03</span>
    </>,
  },
  {
    id: 4,
    label: 'Mandato nas ruas',
    className: 'mag-page page-dark street-page',
    content: <div className="page-safe street-layout">
      <div className="vertical-word">RUA</div>
      <div className="street-copy"><small>04 — PRESENÇA</small><h2>O mandato acontece perto das pessoas.</h2><p>Visitas, escuta ativa e fiscalização para transformar demandas dos bairros em ações concretas.</p></div>
      <span className="page-number">04</span>
    </div>,
  },
  {
    id: 5,
    label: 'Ações nos bairros',
    className: 'mag-page page-dark action-page',
    content: <>
      <img className="full-bleed-photo" src={photos.acao} alt="Ação do mandato nos bairros"/>
      <div className="photo-shade"/>
      <div className="page-safe action-content">
        <small>05 — TRABALHO DE CAMPO</small>
        <div className="action-list"><span>Fiscalização contínua</span><span>Ouvidoria móvel</span><span>Apoio comunitário</span></div>
      </div>
      <span className="page-number">05</span>
    </>,
  },
  {
    id: 6,
    label: 'Escolas de luta',
    className: 'mag-page fight-page',
    content: <div className="page-safe page-stack">
      <small>06 — PROJETO DE DESTAQUE</small>
      <h2>Esporte que abre caminhos.</h2>
      <p>O apadrinhamento de escolas de luta fortalece iniciativas que oferecem disciplina, saúde, proteção e novas oportunidades para crianças e jovens.</p>
      <div className="impact-quote">“Cada tatame pode ser uma porta para um futuro melhor.”</div>
      <div className="keyword-row"><span>Disciplina</span><span>Pertencimento</span><span>Futuro</span></div>
      <span className="page-number">06</span>
    </div>,
  },
  {
    id: 7,
    label: 'Impacto do esporte',
    className: 'mag-page fight-photo',
    content: <>
      <img className="fight-main-photo" src={photos.luvas} alt="Projeto de escolas de luta"/>
      <div className="fight-gradient"/>
      <div className="page-safe fight-lines"><b>PERTENCIMENTO</b><b>DISCIPLINA</b><b>OPORTUNIDADE</b></div>
      <span className="page-number">07</span>
    </>,
  },
  {
    id: 8,
    label: 'Apoio ao autismo',
    className: 'mag-page autism-page',
    content: <div className="page-safe page-stack">
      <small>08 — PROJETO DE DESTAQUE</small>
      <h2>Inclusão começa com compreensão.</h2>
      <p>O apoio ao autismo envolve acolher famílias, ampliar informação, defender atendimento digno e garantir participação plena na sociedade.</p>
      <div className="soft-tags"><span>Acolhimento</span><span>Acessibilidade</span><span>Informação</span></div>
      <span className="page-number">08</span>
    </div>,
  },
  {
    id: 9,
    label: 'Cidade inclusiva',
    className: 'mag-page autism-companion',
    content: <div className="page-safe page-stack compact-stack">
      <div className="autism-symbol" aria-hidden="true"><i/><i/><i/><i/></div>
      <h3>Uma cidade preparada para todas as formas de existir.</h3>
      <ul><li>Escuta e orientação às famílias</li><li>Defesa de atendimento multidisciplinar</li><li>Ambientes públicos mais acessíveis</li><li>Combate ao preconceito</li></ul>
      <span className="page-number">09</span>
    </div>,
  },
  {
    id: 10,
    label: 'Outras bandeiras',
    className: 'mag-page projects-page',
    content: <div className="page-safe projects-layout">
      <div><small>10 — OUTRAS BANDEIRAS</small><h2>Projetos que mudam realidades.</h2></div>
      <div className="project-grid">{causes.map((cause, index)=><article key={cause.title}><span>0{index+1}</span><div><h3>{cause.title}</h3><p>{cause.text}</p></div></article>)}</div>
      <span className="page-number">10</span>
    </div>,
  },
  {
    id: 11,
    label: 'Compromissos',
    className: 'mag-page commitments-page',
    content: <div className="page-safe commitments-layout">
      <div><small>11 — PRÓXIMOS PASSOS</small><h2>Compromissos em movimento.</h2></div>
      <ol><li>Ampliar a rede de projetos esportivos apoiados.</li><li>Construir novas ações permanentes de inclusão.</li><li>Manter a fiscalização próxima dos bairros.</li><li>Transformar participação popular em resultados.</li></ol>
      <div className="number-block"><div className="big-number">+200</div><p className="number-caption">projetos e iniciativas apresentados</p></div>
      <span className="page-number">11</span>
    </div>,
  },
  {
    id: 12,
    label: 'Contato',
    className: 'mag-page back-page',
    content: <div className="page-safe back-layout">
      <img src={photos.logo} alt="Val Advogado"/>
      <div><small>FAÇA PARTE</small><h2>O gabinete está sempre de portas abertas.</h2><p>{site.address}<br/>{site.email}</p><a href={site.whatsapp}>Fale pelo WhatsApp</a></div>
      <footer>Transparência • Presença • Ação</footer>
      <span className="page-number">12</span>
    </div>,
  },
];

function PageCard({ page, side, direction }: { page: Page; side: 'left' | 'right'; direction: number }) {
  return (
    <motion.section
      key={`${page.id}-${side}`}
      className={`${page.className} ${side}`}
      initial={{ rotateY: direction >= 0 ? (side === 'right' ? 28 : 10) : (side === 'left' ? -28 : -10), opacity: 0, scale: .985 }}
      animate={{ rotateY: 0, opacity: 1, scale: 1 }}
      exit={{ rotateY: direction >= 0 ? (side === 'left' ? -82 : -18) : (side === 'right' ? 82 : 18), opacity: 0 }}
      transition={{ duration: .5, ease: [0.22, 1, 0.36, 1] }}
    >
      {page.content}
    </motion.section>
  );
}

export function Magazine({ interactive = false }: MagazineProps) {
  const [spread, setSpread] = useState(0);
  const [direction, setDirection] = useState(1);
  const [singlePage, setSinglePage] = useState(false);
  const totalSpreads = Math.ceil(pages.length / 2);

  useEffect(() => {
    const update = () => setSinglePage(window.innerWidth < 820);
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const maxIndex = singlePage ? pages.length - 1 : totalSpreads - 1;
  const go = (step: number) => {
    setDirection(step);
    setSpread((value) => Math.max(0, Math.min(maxIndex, value + step)));
  };

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') go(1);
      if (event.key === 'ArrowLeft') go(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  useEffect(() => setSpread((value) => Math.min(value, maxIndex)), [maxIndex]);

  if (!interactive) {
    return <div className="magazine print-magazine">{pages.map(page => <section className={page.className} key={page.id}>{page.content}</section>)}</div>;
  }

  const visiblePages = useMemo(() => {
    if (singlePage) return [pages[spread]];
    return [pages[spread * 2], pages[spread * 2 + 1]].filter(Boolean);
  }, [singlePage, spread]);

  const firstVisible = visiblePages[0];
  const lastVisible = visiblePages[visiblePages.length - 1];

  return (
    <div className="magazine-reader">
      <div className="reader-stage">
        <button className="page-control prev" onClick={() => go(-1)} disabled={spread === 0} aria-label="Páginas anteriores"><ChevronLeft/></button>
        <div className={`book-shell ${singlePage ? 'single-page-shell' : ''}`}>
          {!singlePage && <div className="book-spine"/>}
          <AnimatePresence mode="sync" initial={false} custom={direction}>
            {visiblePages.map((page, index) => (
              <PageCard
                key={`${page.id}-${singlePage ? 'single' : index}`}
                page={page}
                side={singlePage ? 'right' : index === 0 ? 'left' : 'right'}
                direction={direction}
              />
            ))}
          </AnimatePresence>
        </div>
        <button className="page-control next" onClick={() => go(1)} disabled={spread === maxIndex} aria-label="Próximas páginas"><ChevronRight/></button>
      </div>

      <div className="reader-controls">
        <span>{singlePage ? `Página ${firstVisible.id} de 12` : `Páginas ${firstVisible.id}–${lastVisible.id} de 12`}</span>
        <div className="progress"><i style={{ width: `${((spread + 1) / (maxIndex + 1)) * 100}%` }}/></div>
        <button onClick={() => document.documentElement.requestFullscreen?.()}><Maximize2 size={16}/> Tela cheia</button>
      </div>

      <div className="thumbnail-strip" aria-label="Índice da revista">
        {pages.map((page, index) => {
          const target = singlePage ? index : Math.floor(index / 2);
          const active = target === spread;
          return <button key={page.id} className={active ? 'active' : ''} onClick={() => { setDirection(target >= spread ? 1 : -1); setSpread(target); }}><span>{String(page.id).padStart(2, '0')}</span>{page.label}</button>;
        })}
      </div>
    </div>
  );
}
