'use client';
import { useEffect, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, LoaderCircle, Maximize2 } from 'lucide-react';
import { rest } from '@/lib/supabase-rest';

type Page = { id:string; page_number:number; template:string; title:string|null; subtitle:string|null; body:string|null; quote:string|null; background:string|null; elements:any; is_published:boolean };
const fallback = [
  'https://i.ibb.co/zc68Yhm/8db8ac81-aff0-4f47-84f3-6929b69dbd04.png','https://i.ibb.co/n8C5wNqr/familia.png','https://i.ibb.co/mrCKvCRC/gabinete.png','https://i.ibb.co/gZQkNzDq/Capturar.png','https://i.ibb.co/YFybNTck/luvas.png'
];
function visual(page:Page){ const e=page.elements||{}; return { url:e.primaryImage || fallback[(page.page_number-1)%fallback.length], fit:e.fit||'cover', x:e.positionX??50, y:e.positionY??50, zoom:e.zoom??100 }; }
function PageView({page, print=false}:{page:Page;print?:boolean}){
  const v=visual(page); const style={objectFit:v.fit as any, objectPosition:`${v.x}% ${v.y}%`, transform:`scale(${v.zoom/100})`};
  const cls=`db-page template-${page.template} ${print?'db-page-print':''}`;
  if(page.template==='cover'||page.template==='back-cover'||page.template==='final-back-cover') return <section className={cls} style={{background:page.background||undefined}}><div className="db-cover-copy"><small>{String(page.page_number).padStart(2,'0')} • INFOJORNAL</small><h1>{page.title}</h1><p>{page.body||page.subtitle}</p></div><div className="db-cover-media"><img src={v.url} alt="" style={style}/></div><b className="db-number">{String(page.page_number).padStart(2,'0')}</b></section>;
  if(page.template.includes('mosaic')||page.template.includes('gallery')) return <section className={cls} style={{background:page.background||undefined}}><header><small>{String(page.page_number).padStart(2,'0')} • {page.subtitle}</small><h2>{page.title}</h2></header><div className="db-mosaic">{[0,1,2,3,4].map((i)=><figure key={i}><img src={(page.elements?.images?.[i]?.url)||fallback[(page.page_number+i)%fallback.length]} alt="" style={i===0?style:undefined}/></figure>)}</div>{page.body&&<p className="db-caption">{page.body}</p>}<b className="db-number">{String(page.page_number).padStart(2,'0')}</b></section>;
  return <section className={cls} style={{background:page.background||undefined}}><div className="db-text"><small>{String(page.page_number).padStart(2,'0')} • {page.subtitle}</small><h2>{page.title}</h2>{page.body&&<p>{page.body}</p>}{page.quote&&<blockquote>{page.quote}</blockquote>}<div className="db-tags"><span>Presença</span><span>Inclusão</span><span>Resultados</span></div></div><div className="db-media"><img src={v.url} alt="" style={style}/></div><b className="db-number">{String(page.page_number).padStart(2,'0')}</b></section>;
}
export function DynamicMagazine({print=false}:{print?:boolean}){
  const [pages,setPages]=useState<Page[]>([]); const [index,setIndex]=useState(0); const [single,setSingle]=useState(false); const [loading,setLoading]=useState(true); const [dir,setDir]=useState(1);
  useEffect(()=>{rest<Page[]>('magazine_pages?select=*&is_published=eq.true&order=page_number.asc').then(setPages).finally(()=>setLoading(false));},[]);
  useEffect(()=>{const fn=()=>setSingle(innerWidth<900);fn();addEventListener('resize',fn);return()=>removeEventListener('resize',fn)},[]);
  const max=single?pages.length-1:Math.max(0,Math.ceil(pages.length/2)-1); const visible=useMemo(()=>single?[pages[index]]:[pages[index*2],pages[index*2+1]].filter(Boolean),[pages,index,single]);
  const go=(d:number)=>{setDir(d);setIndex(v=>Math.max(0,Math.min(max,v+d)))};
  useEffect(()=>{const k=(e:KeyboardEvent)=>{if(e.key==='ArrowRight')go(1);if(e.key==='ArrowLeft')go(-1)};addEventListener('keydown',k);return()=>removeEventListener('keydown',k)});
  if(loading) return <div className="db-loading"><LoaderCircle className="spin"/> Carregando revista…</div>;
  if(print) return <div className="db-print-magazine">{pages.map(p=><PageView key={p.id} page={p} print/>)}</div>;
  return <div className="db-reader"><div className="db-stage"><button onClick={()=>go(-1)} disabled={index===0}><ChevronLeft/></button><div className={`db-book ${single?'single':''}`} data-dir={dir}>{visible.map(p=><div className="db-page-wrap" key={`${p.id}-${index}`}><PageView page={p}/></div>)}</div><button onClick={()=>go(1)} disabled={index===max}><ChevronRight/></button></div><div className="db-controls"><span>{single?`Página ${visible[0]?.page_number} de ${pages.length}`:`Páginas ${visible[0]?.page_number}–${visible.at(-1)?.page_number} de ${pages.length}`}</span><div className="db-progress"><i style={{width:`${((index+1)/(max+1))*100}%`}}/></div><button onClick={()=>document.documentElement.requestFullscreen?.()}><Maximize2 size={16}/> Tela cheia</button></div><div className="db-thumbs">{pages.map((p,i)=><button key={p.id} className={(single?i:Math.floor(i/2))===index?'active':''} onClick={()=>setIndex(single?i:Math.floor(i/2))}>{p.page_number}</button>)}</div></div>;
}
