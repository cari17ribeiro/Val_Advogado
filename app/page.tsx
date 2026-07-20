'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Accessibility,
  ArrowRight,
  BookOpen,
  Building2,
  CheckCircle2,
  GraduationCap,
  HandHeart,
  HeartHandshake,
  Landmark,
  MapPin,
  MessageCircle,
  PawPrint,
  Scale,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Swords,
  Users,
} from 'lucide-react';
import { Header } from '@/components/Header';
import { causes, photos, priorityProjects, site } from '@/content/site';

const causeIcons = [Stethoscope, GraduationCap, PawPrint, ShieldCheck, Building2, Landmark];
const reveal = { hidden: { opacity: 0, y: 36 }, visible: { opacity: 1, y: 0 } };

export default function Home() {
  return (
    <main className="site-shell">
      <Header />

      <section className="home-hero home-hero-v4" aria-labelledby="hero-title">
        <div className="hero-mosaic-background" aria-hidden="true" />
        <div className="ambient-orb ambient-orb-one" aria-hidden="true" />
        <div className="ambient-orb ambient-orb-two" aria-hidden="true" />
        <div className="hero-grid-pattern" aria-hidden="true" />

        <motion.div className="home-hero-copy" initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}>
          <span className="glass-chip"><Sparkles size={15} /> {site.eyebrow}</span>
          <h1 id="hero-title">O que eu faço<br /><em>é da sua conta.</em></h1>
          <p>{site.description}</p>
          <div className="hero-actions">
            <Link href="/revista" className="primary-action"><BookOpen size={19} /> Folhear revista <ArrowRight size={18} /></Link>
            <a href={site.whatsapp} className="secondary-action"><MessageCircle size={19} /> Falar com o gabinete</a>
          </div>
          <div className="hero-trust" aria-label="Valores do mandato">
            <span><ShieldCheck /> Transparência</span><span><MapPin /> Presença</span><span><Users /> Escuta ativa</span>
          </div>
        </motion.div>

        <motion.div className="home-hero-visual" initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.9, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}>
          <div className="portrait-glass portrait-glass-v4">
            <div className="portrait-glow" aria-hidden="true" />
            <img src={photos.hero} alt="Val Advogado" />
          </div>
          <div className="hero-mini-card card-top"><Accessibility size={22} /><div><strong>Inclusão</strong><span>Cuidar de quem cuida</span></div></div>
          <div className="hero-mini-card card-bottom"><Swords size={22} /><div><strong>Esporte social</strong><span>Mais de R$ 710 mil</span></div></div>
        </motion.div>
      </section>

      <section className="signal-strip" aria-label="Resultados do mandato">
        <div><span>01</span><strong>Mais de R$ 1 milhão</strong><small>Inclusão e TEA</small></div>
        <div><span>02</span><strong>Mais de R$ 710 mil</strong><small>Esporte social</small></div>
        <div><span>03</span><strong>R$ 2 milhões</strong><small>Segurança com Renata Abreu</small></div>
      </section>

      <motion.section id="sobre" className="content-section story-section story-section-v4" variants={reveal} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.7 }}>
        <div className="home-photo-mosaic" aria-label="Mosaico de fotografias do mandato">
          <figure className="mosaic-tile mosaic-main"><img src={photos.familia} alt="Val com sua família" /><figcaption>Família e valores</figcaption></figure>
          <figure className="mosaic-tile mosaic-gabinete"><img src={photos.gabinete} alt="Atividade no gabinete" /><figcaption>Gabinete presente</figcaption></figure>
          <figure className="mosaic-tile mosaic-acao"><img src={photos.inclusao} alt="Ação de inclusão" /><figcaption>Inclusão</figcaption></figure>
          <figure className="mosaic-tile mosaic-luta"><img src={photos.esporte} alt="Projeto esportivo apoiado pelo mandato" /><figcaption>Esporte social</figcaption></figure>
          <figure className="mosaic-tile mosaic-portrait"><img src={photos.hero} alt="Val Advogado" /></figure>
          <div className="mosaic-glass-label"><Scale /><span>Advogado por formação<br /><b>Servidor por vocação</b></span></div>
        </div>

        <div className="story-copy">
          <span className="section-kicker">Quem é Val?</span>
          <h2>Uma trajetória humilde transformada pela educação.</h2>
          <p>Filho de um pedreiro e de uma bordadeira, Val encontrou nos estudos o caminho para mudar a própria realidade, tornou-se advogado e levou essa experiência para a vida pública.</p>
          <div className="check-list">
            <span><CheckCircle2 />Defesa de quem precisa ser visto, ouvido e incluído</span>
            <span><CheckCircle2 />Fiscalização dos serviços públicos</span>
            <span><CheckCircle2 />Projetos com impacto social</span>
          </div>
          <Link href="/revista" className="inline-link">Conhecer a história na revista <ArrowRight size={18} /></Link>
        </div>
      </motion.section>

      <motion.section id="causas" className="content-section causes-heading" variants={reveal} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.7 }}>
        <span className="section-kicker">As causas que movem o mandato</span>
        <h2>Um mesmo propósito: transformar vidas.</h2>
        <p>Inclusão, esporte, saúde, proteção animal, segurança e desenvolvimento caminham juntos em um mandato que converte demandas locais em projetos, leis, indicações e recursos.</p>
      </motion.section>

      <section className="cause-showcase content-section">
        <motion.article className="cause-panel autism-panel cause-panel-v4" initial={{ opacity: 0, x: -36 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.25 }} transition={{ duration: 0.75 }}>
          <div className="cause-photo-collage">
            <div className="cause-photo-large"><img src={photos.inclusao} alt="Ação de inclusão" /></div>
            <div className="cause-photo-small"><img src={photos.familia} alt="Família e cuidado" /></div>
            <div className="cause-photo-small"><img src={photos.gabinete} alt="Atuação do gabinete" /></div>
          </div>
          <div className="cause-copy glass-panel">
            <span className="cause-icon"><HeartHandshake /></span><small>{priorityProjects[0].kicker}</small><h3>{priorityProjects[0].title}</h3><p>{priorityProjects[0].text}</p>
            <div className="cause-tags"><span>TEA</span><span>Mães atípicas</span><span>Acessibilidade</span></div>
            <Link href="/revista">Ver páginas especiais <ArrowRight size={18} /></Link>
          </div>
        </motion.article>

        <motion.article className="cause-panel fight-panel cause-panel-v4" initial={{ opacity: 0, x: 36 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.25 }} transition={{ duration: 0.75 }}>
          <div className="autism-photo-composition">
            <img src={photos.esporte} alt="Projeto esportivo apoiado por Val" />
            <div className="autism-soft-layer" aria-hidden="true"><div /><div /><Swords /></div>
          </div>
          <div className="cause-copy glass-panel">
            <span className="cause-icon"><Swords /></span><small>{priorityProjects[1].kicker}</small><h3>{priorityProjects[1].title}</h3><p>{priorityProjects[1].text}</p>
            <div className="cause-tags"><span>Disciplina</span><span>Inclusão</span><span>Oportunidade</span></div>
            <Link href="/revista">Ver páginas especiais <ArrowRight size={18} /></Link>
          </div>
        </motion.article>
      </section>

      <motion.section id="trabalho" className="content-section street-section" variants={reveal} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.7 }}>
        <div className="street-copy">
          <span className="section-kicker">Mandato nas ruas</span><h2>Presença para ouvir.<br />Coragem para agir.</h2>
          <p>Visitas, fiscalização e diálogo direto com moradores para transformar necessidades dos bairros em providências concretas.</p>
          <div className="timeline-list"><div><span>01</span><b>Ouvir</b><small>Receber demandas e conhecer a realidade.</small></div><div><span>02</span><b>Fiscalizar</b><small>Acompanhar serviços e cobrar soluções.</small></div><div><span>03</span><b>Agir</b><small>Encaminhar projetos e prestar contas.</small></div></div>
        </div>
        <div className="street-gallery street-gallery-v4">
          <figure><img src={photos.acao} alt="Ação do mandato nos bairros" /><figcaption>Trabalho de campo</figcaption></figure>
          <figure><img src={photos.renata} alt="Parceria com Renata Abreu" /><figcaption>Guarujá e Brasília</figcaption></figure>
          <figure><img src={photos.familia} alt="Val em momento familiar" /><figcaption>Valores e comunidade</figcaption></figure>
        </div>
      </motion.section>

      <section className="content-section photo-journal-section">
        <motion.div className="other-causes-heading" variants={reveal} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.35 }} transition={{ duration: 0.65 }}>
          <span className="section-kicker">Diário visual</span><h2>Fotos que contam o trabalho.</h2><p>Um mosaico dinâmico para valorizar visitas, projetos, encontros e ações do mandato.</p>
        </motion.div>
        <div className="photo-journal-grid">
          {[photos.gabinete, photos.esporte, photos.inclusao, photos.familia, photos.renata].map((src, index) => (
            <motion.figure key={src} className={`journal-item journal-item-${index + 1}`} initial={{ opacity: 0, scale: .96 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true, amount: .2 }} transition={{ duration: .55, delay: index * .06 }}>
              <img src={src} alt={['Gabinete', 'Esporte social', 'Inclusão', 'Família e valores', 'Parceria institucional'][index]} />
            </motion.figure>
          ))}
        </div>
      </section>

      <section className="content-section other-causes-section">
        <motion.div className="other-causes-heading" variants={reveal} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.4 }} transition={{ duration: 0.65 }}>
          <span className="section-kicker">Outras bandeiras</span><h2>Um trabalho que alcança toda a cidade.</h2>
        </motion.div>
        <div className="modern-causes-grid">
          {causes.map((cause, index) => { const Icon = causeIcons[index]; return (
            <motion.article key={cause.title} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.25 }} transition={{ duration: 0.5, delay: index * 0.06 }}>
              <span className="cause-number">0{index + 1}</span><span className="modern-cause-icon"><Icon /></span><h3>{cause.title}</h3><p>{cause.text}</p>
            </motion.article>
          ); })}
        </div>
      </section>

      <motion.section className="content-section magazine-feature" variants={reveal} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.25 }} transition={{ duration: 0.75 }}>
        <div className="magazine-preview-v3" aria-hidden="true"><div className="preview-page preview-page-left"><img src={photos.hero} alt="" /><span>VAL</span></div><div className="preview-spine" /><div className="preview-page preview-page-right"><small>EDIÇÃO 01</small><h3>Inclusão.<br />Esporte.<br />Resultados.</h3><div className="preview-lines"><i /><i /><i /></div></div></div>
        <div className="magazine-feature-copy"><span className="section-kicker">Revista digital</span><h2>Vinte páginas para folhear, compartilhar e imprimir.</h2><p>Uma experiência editorial com o briefing real do mandato, emendas impositivas, parceria com Renata Abreu e versão A5 preparada para apresentação e impressão.</p><div className="hero-actions"><Link href="/revista" className="primary-action"><BookOpen size={19} /> Abrir revista</Link><Link href="/livreto" className="secondary-action">Visualizar livreto</Link></div></div>
      </motion.section>

      <section className="contact-banner content-section"><div className="contact-glow" aria-hidden="true" /><div><span className="section-kicker">Participação popular</span><h2>O gabinete está de portas abertas.</h2><p>Envie sugestões, acompanhe projetos e participe das decisões que impactam a cidade.</p></div><a href={site.whatsapp} className="primary-action"><MessageCircle size={19} /> Falar no WhatsApp</a></section>

      <footer className="site-footer-v3"><div className="footer-brand"><img src={photos.logo} alt="Logo Val Advogado" /><span>Transparência • Presença • Ação</span></div><div className="footer-links"><a href="#sobre">Quem é Val</a><a href="#causas">Causas</a><Link href="/revista">Revista</Link></div><small>Infojornal Digital © 2026</small></footer>
    </main>
  );
}
