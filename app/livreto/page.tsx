import Link from 'next/link';
import { Magazine } from '@/components/Magazine';
import { PdfButton } from '@/components/PdfButton';

export default function LivretoPage(){return <main className="print-view"><div className="print-toolbar"><Link href="/">← Site</Link><span>Prévia A5 • 12 páginas</span><PdfButton/></div><Magazine/></main>}
