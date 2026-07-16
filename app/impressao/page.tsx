import Link from 'next/link';
import { DynamicMagazine } from '@/components/DynamicMagazine';
import { PdfButton } from '@/components/PdfButton';
export default function Impressao(){return <main className="db-print-view"><div className="print-toolbar"><Link href="/">← Site</Link><span>Prévia A5 • 20 páginas</span><PdfButton/></div><DynamicMagazine print/></main>}
