import Link from 'next/link';
import { Magazine } from '@/components/Magazine';
import { PdfButton } from '@/components/PdfButton';

export default function RevistaPage(){return <main className="reader"><div className="readerbar"><Link href="/">← Voltar ao site</Link><span>Revista Digital • Edição 01</span><div className="actions"><PdfButton/><Link className="button ghost" href="/livreto">Modo impressão</Link></div></div><Magazine interactive/></main>}
