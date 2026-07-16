import Link from 'next/link';
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  HeartHandshake,
  MapPin,
  MessageCircle,
  Quote,
  ShieldCheck,
  Sparkles,
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

export default function Home() {
  return (
    <main>
      <Header />

      <section className="hero-v2">
        <div className="hero-noise" aria-hidden="true" />
        <div className="hero-copy-v2">
          <div className="hero-badge"><Sparkles size={16}/>{site.eyebrow}</div>
          <h1>{site.headline}</h1>
          <p className="lead">{site.description}</p>
          <div className="actions">
            <Link href="/revista" className="button">Abrir revista <ArrowRight size={18}/></Link>
            <a href={site.whatsapp} className="button ghost"><MessageCircle size={18}/> Fale comigo</a>
          </div>
          <div className="hero-proof">
            <span><ShieldCheck/>Transparência</span>
            <span><MapPin/>Presença nos bairros</span>
            <span><Users/>Escuta ativa</span>
          </div>
        </div>

        <div className="hero-visual">
          <div className="hero-orbit orbit-one" />
          <div className="hero-orbit orbit-two" />
          <div className="portrait-v2">
            <img src={photos.hero} alt="Val Advogado" />
          </div>
          <div className="floating-stat stat-one"><strong>+200</strong><span>projetos e iniciativas</span></div>
          <div className="floating-stat stat-two"><strong>+15</strong><span>anos de luta</span></div>
        </div>
      </section>

      <section className="impact-strip" aria-label="Principais resultados">
        <div><strong>Semanal</strong><span>Gabinete na rua</span></div>
        <div><strong>2 pilares</strong><span>Esporte e inclusão</span></div>
        <div><strong>Mandato aberto</strong><span>Participação popular</span></div>
      </section>

      <section id="sobre" className="section about-v2">
        <div className="about-media">
          <img className="about-main" src={photos.familia} alt="Val com a família" />
          <img className="about-small" src={photos.gabinete} alt="Val em atividade no gabinete" />
          <div className="about-stamp"><Quote/><span>Uma vida dedicada a servir.</span></div>
        </div>
        <div className="about-copy">
          <p className="eyebrow">Quem é Val?</p>
          <h2>Advogado por formação.<br/>Servidor por vocação.</h2>
          <p>Uma trajetória construída perto das pessoas, na defesa das famílias, dos consumidores e de quem precisa ter seus direitos ouvidos e respeitados.</p>
          <div className="about-list">
            <span><CheckCircle2/>Atuação comunitária</span>
            <span><CheckCircle2/>Fiscalização permanente</span>
            <span><CheckCircle2/>Projetos com impacto social</span>
          </div>
          <Link href="/revista" className="text-link">Conhecer a trajetória completa <ArrowRight size={18}/></Link>
        </div>
      </section>

      <section id="causas" className="section section-heading">
        <p className="eyebrow">As causas que movem este mandato</p>
        <h2>Duas frentes com atenção especial.</h2>
        <p>Projetos pensados para transformar oportunidades, acolher famílias e construir uma cidade mais inclusiva.</p>
      </section>

      <section className="feature-projects section">
        <article className="feature-project fight-feature">
          <img src={photos.luvas} alt="Projeto de apadrinhamento de escolas de luta" />
          <div className="feature-overlay" />
          <div className="feature-content">
            <div className="feature-icon"><Swords/></div>
            <p className="eyebrow">{priorityProjects[0].kicker}</p>
            <h3>{priorityProjects[0].title}</h3>
            <p>{priorityProjects[0].text}</p>
            <Link href="/revista">Ver páginas especiais <ArrowRight size={18}/></Link>
          </div>
        </article>

        <article className="feature-project autism-feature">
          <div className="autism-art" aria-hidden="true"><i/><i/><i/><i/></div>
          <div className="feature-content">
            <div className="feature-icon"><HeartHandshake/></div>
            <p className="eyebrow">{priorityProjects[1].kicker}</p>
            <h3>{priorityProjects[1].title}</h3>
            <p>{priorityProjects[1].text}</p>
            <Link href="/revista">Ver páginas especiais <ArrowRight size={18}/></Link>
          </div>
        </article>
      </section>

      <section id="trabalho" className="section mandate-v2">
        <div className="mandate-copy">
          <p className="eyebrow">Mandato nas ruas</p>
          <h2>Presença para ouvir.<br/>Coragem para agir.</h2>
          <p>Fiscalização, visitas, escuta ativa e cobrança de soluções. O mandato acontece onde os problemas estão e onde as pessoas precisam ser ouvidas.</p>
          <div className="mandate-points">
            <span>01 <b>Fiscalização contínua</b></span>
            <span>02 <b>Ouvidoria móvel</b></span>
            <span>03 <b>Apoio comunitário</b></span>
          </div>
        </div>
        <div className="mandate-gallery">
          <img src={photos.acao} alt="Ação do mandato nos bairros" />
          <img src={photos.gabinete} alt="Atuação do gabinete" />
        </div>
      </section>

      <section className="section section-heading compact">
        <p className="eyebrow">Outras bandeiras</p>
        <h2>Trabalho que alcança toda a cidade.</h2>
      </section>

      <section className="cards section causes-grid">
        {causes.map((cause, index) => (
          <article key={cause.title}>
            <span>0{index + 1}</span>
            <CheckCircle2/>
            <h3>{cause.title}</h3>
            <p>{cause.text}</p>
          </article>
        ))}
      </section>

      <section className="section magazine-preview">
        <div className="magazine-mockup" aria-hidden="true">
          <div className="mock-page mock-left"><img src={photos.hero} alt=""/></div>
          <div className="mock-page mock-right"><small>EDIÇÃO 01</small><h3>Esporte, inclusão e presença.</h3><p>Uma leitura visual sobre os projetos e compromissos do mandato.</p></div>
        </div>
        <div className="magazine-copy">
          <p className="eyebrow">Revista digital</p>
          <h2>Uma experiência para folhear, compartilhar e imprimir.</h2>
          <p>Doze páginas com narrativa editorial, páginas duplas e destaque especial para as escolas de luta e para o apoio ao autismo.</p>
          <div className="actions">
            <Link href="/revista" className="button"><BookOpen size={18}/> Folhear revista</Link>
            <Link href="/livreto" className="button ghost">Modo impressão</Link>
          </div>
        </div>
      </section>

      <section className="cta section">
        <div>
          <p className="eyebrow">Participação popular</p>
          <h2>O gabinete está sempre de portas abertas.</h2>
          <p>Envie sugestões, acompanhe projetos e participe das decisões que impactam a cidade.</p>
        </div>
        <div className="actions">
          <a href={site.whatsapp} className="button"><MessageCircle size={18}/> Falar no WhatsApp</a>
          <a href={`mailto:${site.email}`} className="button ghost">Enviar e-mail</a>
        </div>
      </section>

      <footer className="site-footer">
        <img src={photos.logo} alt="Logo Val Advogado" />
        <p>Transparência • Presença • Ação</p>
        <small>Infojornal Digital © 2026</small>
      </footer>
    </main>
  );
}
