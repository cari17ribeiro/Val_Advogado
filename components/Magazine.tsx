'use client';

import { AnimatePresence, motion } from 'framer-motion';
import {
  Accessibility,
  BookOpen,
  Building2,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  HandHeart,
  HeartHandshake,
  Home,
  Landmark,
  MapPin,
  Maximize2,
  MessageCircle,
  PawPrint,
  ShieldCheck,
  Stethoscope,
  Swords,
  Users,
} from 'lucide-react';
import type { ReactNode } from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { site } from '@/content/site';

const photos = {
  hero: 'https://i.ibb.co/zc68Yhm/8db8ac81-aff0-4f47-84f3-6929b69dbd04.png',
  logo: 'https://i.ibb.co/Mx14ByDD/fc3cc5b0-070e-44b5-9509-306bcc2fd7a7.png',
  gabinete: 'https://i.ibb.co/mrCKvCRC/gabinete.png',
  luvas: 'https://i.ibb.co/YFybNTck/luvas.png',
  acao: 'https://i.ibb.co/gZQkNzDq/Capturar.png',
  familia: 'https://i.ibb.co/n8C5wNqr/familia.png',
};

type MagazineProps = { interactive?: boolean };
type Page = { id: number; label: string; className: string; content: ReactNode };

const otherCauses = [
  { icon: Stethoscope, title: 'Saúde pública', text: 'Fiscalização e acesso digno.' },
  { icon: GraduationCap, title: 'Educação', text: 'Estrutura e oportunidades.' },
  { icon: PawPrint, title: 'Proteção animal', text: 'Cuidado e combate aos maus-tratos.' },
  { icon: HandHeart, title: 'Melhor idade', text: 'Proteção, saúde e convivência.' },
  { icon: Building2, title: 'Infraestrutura', text: 'Manutenção e qualidade urbana.' },
  { icon: Landmark, title: 'Cidadania', text: 'Direitos e serviços acessíveis.' },
];

const pages: Page[] = [
  {
    id: 1,
    label: 'Capa',
    className: 'mag-page mag-cover',
    content: (
      <div className="mag-safe mag-cover-grid">
        <div className="mag-cover-copy">
          <img className="mag-cover-logo" src={photos.logo} alt="Logo Val Advogado"/>
          <div>
            <span className="mag-overline">INFOJORNAL • EDIÇÃO 01 • 2026</span>
            <h1>VAL <em>ADVOGADO</em></h1>
            <p>O que eu faço<br/>é da sua conta.</p>
          </div>
          <div className="mag-cover-tags"><span>Esporte</span><span>Inclusão</span><span>Presença</span></div>
        </div>
        <div className="mag-cover-photo">
          <div className="mag-photo-halo" aria-hidden="true"/>
          <img src={photos.hero} alt="Val Advogado"/>
        </div>
        <span className="mag-page-number">01</span>
      </div>
    ),
  },
  {
    id: 2,
    label: 'Quem é Val',
    className: 'mag-page mag-about-page',
    content: (
      <div className="mag-safe mag-column-layout">
        <header><span className="mag-overline">02 — QUEM É VAL?</span><h2>Uma vida dedicada a servir.</h2></header>
        <p className="mag-lead">Advogado por formação e servidor por vocação. Uma trajetória construída perto das famílias e na defesa de quem precisa ser ouvido.</p>
        <blockquote>“A política é uma ferramenta de transformação social.”</blockquote>
        <div className="mag-three-values">
          <span><Users/>Comunidade</span><span><ShieldCheck/>Direitos</span><span><Home/>Família</span>
        </div>
        <span className="mag-page-number">02</span>
      </div>
    ),
  },
  {
    id: 3,
    label: 'Trajetória',
    className: 'mag-page mag-story-page',
    content: (
      <div className="mag-safe mag-story-grid">
        <header><span className="mag-overline">03 — TRAJETÓRIA</span><h2>História feita de presença.</h2></header>
        <div className="mag-story-photos">
          <figure className="mag-photo-card mag-photo-large"><img src={photos.familia} alt="Val com sua família"/><figcaption>Família e valores</figcaption></figure>
          <figure className="mag-photo-card"><img src={photos.gabinete} alt="Val no gabinete"/><figcaption>Atuação pública</figcaption></figure>
          <figure className="mag-photo-card"><img src={photos.acao} alt="Val em ação"/><figcaption>Trabalho de campo</figcaption></figure>
        </div>
        <span className="mag-page-number">03</span>
      </div>
    ),
  },
  {
    id: 4,
    label: 'Mandato nas ruas',
    className: 'mag-page mag-street-page',
    content: (
      <div className="mag-safe mag-split-page">
        <div className="mag-contained-photo"><img src={photos.acao} alt="Ação nos bairros"/></div>
        <div className="mag-split-copy">
          <span className="mag-overline">04 — PRESENÇA</span>
          <h2>O mandato acontece perto das pessoas.</h2>
          <p>Visitas, escuta ativa e fiscalização transformam demandas dos bairros em ações concretas.</p>
          <div className="mag-inline-pills"><span><MapPin/>Bairros</span><span><Users/>Escuta</span></div>
        </div>
        <span className="mag-page-number">04</span>
      </div>
    ),
  },
  {
    id: 5,
    label: 'Como o mandato atua',
    className: 'mag-page mag-process-page',
    content: (
      <div className="mag-safe mag-process-layout">
        <header><span className="mag-overline">05 — TRABALHO DE CAMPO</span><h2>Ouvir, fiscalizar e agir.</h2></header>
        <div className="mag-process-list">
          <article><b>01</b><div><h3>Ouvir</h3><p>Receber demandas e entender a realidade local.</p></div></article>
          <article><b>02</b><div><h3>Fiscalizar</h3><p>Acompanhar serviços públicos e cobrar respostas.</p></div></article>
          <article><b>03</b><div><h3>Agir</h3><p>Encaminhar soluções e prestar contas à população.</p></div></article>
        </div>
        <div className="mag-process-photo"><img src={photos.gabinete} alt="Atuação do gabinete"/></div>
        <span className="mag-page-number">05</span>
      </div>
    ),
  },
  {
    id: 6,
    label: 'Escolas de luta',
    className: 'mag-page mag-fight-intro',
    content: (
      <div className="mag-safe mag-cause-intro-layout">
        <div className="mag-cause-icon"><Swords/></div>
        <div>
          <span className="mag-overline">06 — PROJETO DE DESTAQUE</span>
          <h2>Esporte que abre caminhos.</h2>
          <p>O apadrinhamento de escolas de luta fortalece projetos que oferecem disciplina, saúde, proteção e novas oportunidades.</p>
        </div>
        <blockquote>“Cada tatame pode ser uma porta para um futuro melhor.”</blockquote>
        <div className="mag-cause-pill-row"><span>Disciplina</span><span>Pertencimento</span><span>Futuro</span></div>
        <span className="mag-page-number">06</span>
      </div>
    ),
  },
  {
    id: 7,
    label: 'Impacto do esporte',
    className: 'mag-page mag-fight-photo-page',
    content: (
      <div className="mag-safe mag-photo-story-layout">
        <div className="mag-photo-story-image"><img src={photos.luvas} alt="Projeto de escolas de luta"/></div>
        <div className="mag-photo-story-copy">
          <span className="mag-overline">07 — ESPORTE SOCIAL</span>
          <h2>Mais que treino: oportunidade.</h2>
          <div className="mag-mini-grid"><span><b>01</b>Convivência</span><span><b>02</b>Autoconfiança</span><span><b>03</b>Proteção social</span></div>
        </div>
        <span className="mag-page-number">07</span>
      </div>
    ),
  },
  {
    id: 8,
    label: 'Apoio ao autismo',
    className: 'mag-page mag-autism-intro',
    content: (
      <div className="mag-safe mag-autism-layout">
        <div className="mag-autism-art" aria-hidden="true"><div/><div/><HeartHandshake/></div>
        <div className="mag-autism-copy">
          <span className="mag-overline">08 — PROJETO DE DESTAQUE</span>
          <h2>Inclusão começa com compreensão.</h2>
          <p>Apoiar pessoas autistas e suas famílias significa ampliar informação, acolhimento, atendimento digno e participação social.</p>
          <div className="mag-cause-pill-row"><span>Acolhimento</span><span>Acessibilidade</span><span>Respeito</span></div>
        </div>
        <span className="mag-page-number">08</span>
      </div>
    ),
  },
  {
    id: 9,
    label: 'Cidade inclusiva',
    className: 'mag-page mag-inclusion-page',
    content: (
      <div className="mag-safe mag-inclusion-layout">
        <header><span className="mag-overline">09 — CIDADE INCLUSIVA</span><h2>Uma cidade preparada para todas as formas de existir.</h2></header>
        <div className="mag-inclusion-grid">
          <article><HeartHandshake/><h3>Acolher</h3><p>Orientação e apoio às famílias.</p></article>
          <article><Accessibility/><h3>Incluir</h3><p>Ambientes e serviços acessíveis.</p></article>
          <article><BookOpen/><h3>Informar</h3><p>Conhecimento para combater preconceitos.</p></article>
          <article><Users/><h3>Participar</h3><p>Autonomia e presença na comunidade.</p></article>
        </div>
        <span className="mag-page-number">09</span>
      </div>
    ),
  },
  {
    id: 10,
    label: 'Outras bandeiras',
    className: 'mag-page mag-other-causes',
    content: (
      <div className="mag-safe mag-other-layout">
        <header><span className="mag-overline">10 — OUTRAS BANDEIRAS</span><h2>Trabalho que alcança toda a cidade.</h2></header>
        <div className="mag-other-grid">
          {otherCauses.map(({ icon: Icon, title, text }, index) => (
            <article key={title}><span>0{index + 1}</span><Icon/><div><h3>{title}</h3><p>{text}</p></div></article>
          ))}
        </div>
        <span className="mag-page-number">10</span>
      </div>
    ),
  },
  {
    id: 11,
    label: 'Compromissos',
    className: 'mag-page mag-commitments',
    content: (
      <div className="mag-safe mag-commitments-layout">
        <header><span className="mag-overline">11 — PRÓXIMOS PASSOS</span><h2>Compromissos em movimento.</h2></header>
        <ol>
          <li><b>01</b><span>Ampliar a rede de projetos esportivos apoiados.</span></li>
          <li><b>02</b><span>Fortalecer ações permanentes de inclusão.</span></li>
          <li><b>03</b><span>Manter a fiscalização próxima dos bairros.</span></li>
          <li><b>04</b><span>Transformar participação popular em resultados.</span></li>
        </ol>
        <div className="mag-commitment-note"><MessageCircle/><span>O gabinete continua aberto para ouvir, construir e prestar contas.</span></div>
        <span className="mag-page-number">11</span>
      </div>
    ),
  },
  {
    id: 12,
    label: 'Contato',
    className: 'mag-page mag-back-cover',
    content: (
      <div className="mag-safe mag-back-layout">
        <img className="mag-back-logo" src={photos.logo} alt="Val Advogado"/>
        <div>
          <span className="mag-overline">FAÇA PARTE</span>
          <h2>O gabinete está de portas abertas.</h2>
          <p>Envie sugestões, acompanhe projetos e participe das decisões que impactam a cidade.</p>
        </div>
        <div className="mag-contact-list">
          <a href={site.whatsapp}><MessageCircle/> WhatsApp do gabinete</a>
          <span><MapPin/> {site.address}</span>
          <span><BookOpen/> {site.email}</span>
        </div>
        <footer>Transparência • Presença • Ação</footer>
        <span className="mag-page-number">12</span>
      </div>
    ),
  },
];

function PageCard({ page, side, direction }: { page: Page; side: 'left' | 'right'; direction: number }) {
  const from = direction > 0 ? (side === 'right' ? 34 : 10) : (side === 'left' ? -34 : -10);
  const to = direction > 0 ? (side === 'left' ? -76 : -12) : (side === 'right' ? 76 : 12);

  return (
    <motion.section
      key={`${page.id}-${side}`}
      className={`${page.className} ${side}`}
      initial={{ rotateY: from, opacity: 0, scale: 0.99 }}
      animate={{ rotateY: 0, opacity: 1, scale: 1 }}
      exit={{ rotateY: to, opacity: 0, scale: 0.985 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
    >
      {page.content}
    </motion.section>
  );
}

export function Magazine({ interactive = false }: MagazineProps) {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [singlePage, setSinglePage] = useState(false);
  const pointerStart = useRef<number | null>(null);

  useEffect(() => {
    const media = window.matchMedia('(max-width: 959px)');
    const update = () => setSinglePage(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  const totalSteps = singlePage ? pages.length : Math.ceil(pages.length / 2);
  const maxIndex = totalSteps - 1;

  const go = (step: number) => {
    setDirection(step);
    setIndex((current) => Math.max(0, Math.min(maxIndex, current + step)));
  };

  useEffect(() => {
    setIndex((current) => Math.min(current, maxIndex));
  }, [maxIndex]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') go(1);
      if (event.key === 'ArrowLeft') go(-1);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  });

  const visiblePages = useMemo(() => {
    if (singlePage) return [pages[index]];
    return [pages[index * 2], pages[index * 2 + 1]].filter(Boolean);
  }, [index, singlePage]);

  if (!interactive) {
    return <div className="print-magazine">{pages.map((page) => <section className={page.className} key={page.id}>{page.content}</section>)}</div>;
  }

  const firstPage = visiblePages[0];
  const lastPage = visiblePages[visiblePages.length - 1];

  return (
    <div className="magazine-reader-v3">
      <div className="reader-ambient reader-ambient-one" aria-hidden="true"/>
      <div className="reader-ambient reader-ambient-two" aria-hidden="true"/>

      <div className="reader-stage-v3">
        <button type="button" className="reader-arrow" onClick={() => go(-1)} disabled={index === 0} aria-label="Página anterior"><ChevronLeft/></button>

        <div
          className={`book-v3 ${singlePage ? 'book-single' : ''}`}
          onPointerDown={(event) => { pointerStart.current = event.clientX; }}
          onPointerUp={(event) => {
            if (pointerStart.current === null) return;
            const distance = event.clientX - pointerStart.current;
            pointerStart.current = null;
            if (Math.abs(distance) > 45) go(distance < 0 ? 1 : -1);
          }}
        >
          {!singlePage && <div className="book-spine-v3" aria-hidden="true"/>}
          <AnimatePresence mode="sync" initial={false} custom={direction}>
            {visiblePages.map((page, pageIndex) => (
              <PageCard
                key={`${page.id}-${singlePage ? 'single' : pageIndex}`}
                page={page}
                side={singlePage ? 'right' : pageIndex === 0 ? 'left' : 'right'}
                direction={direction}
              />
            ))}
          </AnimatePresence>
        </div>

        <button type="button" className="reader-arrow" onClick={() => go(1)} disabled={index === maxIndex} aria-label="Próxima página"><ChevronRight/></button>
      </div>

      <div className="reader-status-v3">
        <span>{singlePage ? `Página ${firstPage.id} de 12` : `Páginas ${firstPage.id}–${lastPage.id} de 12`}</span>
        <div className="reader-progress-v3"><i style={{ width: `${((index + 1) / totalSteps) * 100}%` }}/></div>
        <button type="button" onClick={() => document.documentElement.requestFullscreen?.()}><Maximize2 size={16}/> Tela cheia</button>
      </div>

      <div className="reader-thumbnails-v3" aria-label="Índice da revista">
        {pages.map((page, pageIndex) => {
          const target = singlePage ? pageIndex : Math.floor(pageIndex / 2);
          return (
            <button
              type="button"
              key={page.id}
              className={target === index ? 'active' : ''}
              onClick={() => { setDirection(target >= index ? 1 : -1); setIndex(target); }}
              aria-label={`Ir para a página ${page.id}: ${page.label}`}
            >
              <b>{String(page.id).padStart(2, '0')}</b><span>{page.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
