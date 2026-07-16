import Link from 'next/link';
import { Download, BookOpen } from 'lucide-react';

export function Header() {
  return <header className="topbar">
    <Link href="/" className="brand">VAL <span>ADVOGADO</span></Link>
    <nav>
      <Link href="/revista">Revista digital</Link>
      <Link href="/livreto"><BookOpen size={17}/> Livreto</Link>
      <a className="button small" href="/downloads/val-advogado-livreto-a5.pdf" download><Download size={17}/> Baixar PDF</a>
    </nav>
  </header>;
}
