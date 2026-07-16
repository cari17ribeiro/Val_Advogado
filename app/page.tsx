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
import { causes, priorityProjects, site } from '@/content/site';

const photos = {
  hero: 'https://i.ibb.co/zc68Yhm/8db8ac81-aff0-4f47-84f3-6929b69dbd04.png',
  logo: 'https://i.ibb.co/Mx14ByDD/fc3cc5b0-070e-44b5-9509-306bcc2fd7a7.png',
  gabinete: 'https://i.ibb.co/mrCKvCRC/gabinete.png',
  luvas: 'https://i.ibb.co/YFybNTck/luvas.png',
  acao: 'https://i.ibb.co/gZQkNzDq/Capturar.png',
  familia: 'https://i.ibb.co/n8C5wNqr/familia.png',
};

const causeIcons = [Stethoscope, GraduationCap, PawPrint, HandHeart, Building2, Landmark];

const reveal = {
  hidden: { opacity: 0, y: 36 },
  visible: { opacity: 1, y: 0 },
};

export default function Home() {
  return (
    <main className="site-shell">
      <Header />

      <section className="home-hero" aria-labelledby="hero-title">
        <div className="ambient-orb ambient-orb-one" aria-hidden="true" />
        <div className="ambient-orb ambient-orb-two" aria-hidden="true" />
        <div className="hero-grid-pattern" aria-hidden="true" />

        <motion.div
          className="home-hero-copy"
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="glass-chip"><Sparkles size={15} /> {site.eyebrow}</span>
          <h1 id="hero-title">O que eu faço<br/><em>é da sua conta.</em></h1>
          <p>{site.description}</p>

          <div className="hero-actions">
            <Link href="/revista" className="primary-action">
              <BookOpen size={19}/> Folhear revista <ArrowRight size={18}/>
            </Link>
            <a href={site.whatsapp} className="secondary-action">
              <MessageCircle size={19}/> Falar com o gabinete
            </a>
          </div>

          <div className="hero-trust" aria-label="Valores do mandato">
            <span><ShieldCheck/> Transparência</span>
            <span><MapPin/> Presença</span>
            <span><Users/> Escuta ativa</span>
          </div>
        </motion.div>

        <motion.div
          className="home-hero-visual"
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="portrait-glass">
            <div className="portrait-glow" aria-hidden="true" />
            <img src={photos.hero} alt="Val Advogado" />
          </div>
          <div className="hero-mini-card card-top">
            <Swords size={22}/><div><strong>Esporte social</strong><span>Oportunidade e disciplina</span></div>
          </div>
          <div className="hero-mini-card card-bottom">
            <Accessibility size={22}/><div><strong>Inclusão</strong><span>Acolhimento às famílias</span></div>
          </div>
        </motion.div>
      </section>

      <section className="signal-strip" aria-label="Princípios do projeto">
        <div><span>01</span><strong>Mandato aberto</strong><small>Informação acessível</small></div>
        <div><span>02</span><strong>Duas causas prioritárias</strong><small>Esporte e autismo</small></div>
        <div><span>03</span><strong>Presença nos bairros</strong><small>Escuta e fiscalização</small></div>
      </section>

      <motion.section
        id="sobre"
        className="content-section story-section"
        variants={reveal}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.7 }}
      >
        <div className="story-media">
          <div className="story-photo story-photo-main"><img src={photos.familia} alt="Val com sua família" /></div>
          <div className="story-photo story-photo-small"><img src={photos.gabinete} alt="Val em atividade no gabinete" /></div>
          <div className="story-badge"><Scale/><span>Advogado por formação<br/><b>Servidor por vocação</b></span></div>
        </div>

        <div className="story-copy">
          <span className="section-kicker">Quem é Val?</span>
          <h2>Uma trajetória construída perto das pessoas.</h2>
          <p>Atuação comunitária, defesa de direitos e um mandato que transforma demandas reais em fiscalização, projetos e presença constante.</p>
          <div className="check-list">
            <span><CheckCircle2/>Atendimento próximo das famílias</span>
            <span><CheckCircle2/>Fiscalização dos serviços públicos</span>
            <span><CheckCircle2/>Projetos com impacto social</span>
          </div>
          <Link href="/revista" className="inline-link">Conhecer a história na revista <ArrowRight size={18}/></Link>
        </div>
      </motion.section>

      <motion.section
        id="causas"
        className="content-section causes-heading"
        variants={reveal}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7 }}
      >
        <span className="section-kicker">As causas que movem o mandato</span>
        <h2>Duas frentes. Um mesmo propósito: transformar vidas.</h2>
        <p>O projeto dá protagonismo às ações que criam oportunidades para crianças e jovens e ampliam acolhimento, respeito e inclusão.</p>
      </motion.section>

      <section className="cause-showcase content-section">
        <motion.article
          className="cause-panel fight-panel"
          initial={{ opacity: 0, x: -36 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.75 }}
        >
          <div className="cause-image"><img src={photos.luvas} alt="Projeto de apoio às escolas de luta" /></div>
          <div className="cause-copy glass-panel">
            <span className="cause-icon"><Swords/></span>
            <small>{priorityProjects[0].kicker}</small>
            <h3>{priorityProjects[0].title}</h3>
            <p>{priorityProjects[0].text}</p>
            <div className="cause-tags"><span>Disciplina</span><span>Pertencimento</span><span>Futuro</span></div>
            <Link href="/revista">Ver páginas especiais <ArrowRight size={18}/></Link>
          </div>
        </motion.article>

        <motion.article
          className="cause-panel autism-panel"
          initial={{ opacity: 0, x: 36 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.75 }}
        >
          <div className="autism-visual" aria-hidden="true">
            <div className="autism-orbit orbit-a"/><div className="autism-orbit orbit-b"/>
            <HeartHandshake/>
          </div>
          <div className="cause-copy glass-panel">
            <span className="cause-icon"><HeartHandshake/></span>
            <small>{priorityProjects[1].kicker}</small>
            <h3>{priorityProjects[1].title}</h3>
            <p>{priorityProjects[1].text}</p>
            <div className="cause-tags"><span>Acolhimento</span><span>Acessibilidade</span><span>Informação</span></div>
            <Link href="/revista">Ver páginas especiais <ArrowRight size={18}/></Link>
          </div>
        </motion.article>
      </section>

      <motion.section
        id="trabalho"
        className="content-section street-section"
        variants={reveal}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.7 }}
      >
        <div className="street-copy">
          <span className="section-kicker">Mandato nas ruas</span>
          <h2>Presença para ouvir.<br/>Coragem para agir.</h2>
          <p>Visitas, fiscalização e diálogo direto com moradores para transformar necessidades dos bairros em providências concretas.</p>
          <div className="timeline-list">
            <div><span>01</span><b>Ouvir</b><small>Receber demandas e conhecer a realidade.</small></div>
            <div><span>02</span><b>Fiscalizar</b><small>Acompanhar serviços e cobrar soluções.</small></div>
            <div><span>03</span><b>Agir</b><small>Encaminhar projetos e prestar contas.</small></div>
          </div>
        </div>
        <div className="street-gallery">
          <figure><img src={photos.acao} alt="Ação do mandato nos bairros"/><figcaption>Trabalho de campo</figcaption></figure>
          <figure><img src={photos.gabinete} alt="Atuação do gabinete"/><figcaption>Gabinete presente</figcaption></figure>
        </div>
      </motion.section>

      <section className="content-section other-causes-section">
        <motion.div
          className="other-causes-heading"
          variants={reveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.65 }}
        >
          <span className="section-kicker">Outras bandeiras</span>
          <h2>Um trabalho que alcança toda a cidade.</h2>
        </motion.div>

        <div className="modern-causes-grid">
          {causes.map((cause, index) => {
            const Icon = causeIcons[index];
            return (
              <motion.article
                key={cause.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.5, delay: index * 0.06 }}
              >
                <span className="cause-number">0{index + 1}</span>
                <span className="modern-cause-icon"><Icon/></span>
                <h3>{cause.title}</h3>
                <p>{cause.text}</p>
              </motion.article>
            );
          })}
        </div>
      </section>

      <motion.section
        className="content-section magazine-feature"
        variants={reveal}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.75 }}
      >
        <div className="magazine-preview-v3" aria-hidden="true">
          <div className="preview-page preview-page-left">
            <img src={photos.hero} alt=""/>
            <span>VAL</span>
          </div>
          <div className="preview-spine"/>
          <div className="preview-page preview-page-right">
            <small>EDIÇÃO 01</small>
            <h3>Esporte.<br/>Inclusão.<br/>Presença.</h3>
            <div className="preview-lines"><i/><i/><i/></div>
          </div>
        </div>
        <div className="magazine-feature-copy">
          <span className="section-kicker">Revista digital</span>
          <h2>Doze páginas para folhear, compartilhar e imprimir.</h2>
          <p>Uma experiência editorial com virada de páginas, leitura em tela cheia e uma versão A5 preparada para apresentação e impressão.</p>
          <div className="hero-actions">
            <Link href="/revista" className="primary-action"><BookOpen size={19}/> Abrir revista</Link>
            <Link href="/livreto" className="secondary-action">Visualizar livreto</Link>
          </div>
        </div>
      </motion.section>

      <section className="contact-banner content-section">
        <div className="contact-glow" aria-hidden="true" />
        <div>
          <span className="section-kicker">Participação popular</span>
          <h2>O gabinete está de portas abertas.</h2>
          <p>Envie sugestões, acompanhe projetos e participe das decisões que impactam a cidade.</p>
        </div>
        <a href={site.whatsapp} className="primary-action"><MessageCircle size={19}/> Falar no WhatsApp</a>
      </section>

      <footer className="site-footer-v3">
        <div className="footer-brand"><img src={photos.logo} alt="Logo Val Advogado"/><span>Transparência • Presença • Ação</span></div>
        <div className="footer-links"><a href="#sobre">Quem é Val</a><a href="#causas">Causas</a><Link href="/revista">Revista</Link></div>
        <small>Infojornal Digital © 2026</small>
      </footer>
    </main>
  );
}
