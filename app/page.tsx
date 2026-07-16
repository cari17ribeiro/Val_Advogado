import Link from 'next/link';
import { ArrowRight, CheckCircle2, HeartHandshake, MessageCircle, Swords } from 'lucide-react';
import { Header } from '@/components/Header';
import { causes, priorityProjects, site } from '@/content/site';

export default function Home() {
  return <main>
    <Header/>
    <section className="hero">
      <div className="hero-copy">
        <p className="eyebrow">{site.eyebrow}</p>
        <h1>{site.headline}</h1>
        <p className="lead">{site.description}</p>
        <div className="actions">
          <Link href="/revista" className="button">Abrir revista <ArrowRight size={18}/></Link>
          <a href={site.whatsapp} className="button ghost"><MessageCircle size={18}/> Fale comigo</a>
        </div>
        <div className="stats"><span><strong>+200</strong> projetos</span><span><strong>+15</strong> anos de luta</span><span><strong>Semanal</strong> gabinete na rua</span></div>
      </div>
      <div className="portrait"><div className="portrait-ring"/><img src="https://i.ibb.co/zc68Yhm/8db8ac81-aff0-4f47-84f3-6929b69dbd04.png" alt="Val Advogado"/></div>
    </section>

    <section className="section intro"><p className="eyebrow">As causas que movem este mandato</p><h2>Projetos com propósito.<br/>Impacto na vida real.</h2><p>Duas frentes recebem atenção especial por sua capacidade de acolher, incluir e transformar.</p></section>

    <section className="priority-section section">{priorityProjects.map((project, index)=><article className={`priority-card ${project.accent}`} key={project.slug}><div className="priority-icon">{index === 0 ? <Swords/> : <HeartHandshake/>}</div><p className="eyebrow">{project.kicker}</p><h3>{project.title}</h3><p>{project.text}</p><Link href="/revista">Conhecer na revista <ArrowRight size={17}/></Link></article>)}</section>

    <section className="section intro compact"><p className="eyebrow">Trabalho que transforma</p><h2>Presença para ouvir.<br/>Coragem para agir.</h2></section>
    <section className="cards section">{causes.map((cause, index)=><article key={cause.title}><span>0{index+1}</span><CheckCircle2/><h3>{cause.title}</h3><p>{cause.text}</p></article>)}</section>
    <section className="cta section"><div><p className="eyebrow">Infojornal completo</p><h2>Leia como revista ou leve para a gráfica.</h2></div><div className="actions"><Link href="/revista" className="button">Folhear revista</Link><Link href="/livreto" className="button ghost">Visualizar livreto</Link></div></section>
  </main>;
}
