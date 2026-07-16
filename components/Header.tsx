'use client';

import Link from 'next/link';
import { BookOpen, Download, Menu, X } from 'lucide-react';
import { useState } from 'react';

export function Header() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <header className="topbar">
      <Link href="/" className="brand" onClick={close} aria-label="Página inicial do Val Advogado">
        VAL <span>ADVOGADO</span>
      </Link>

      <button
        type="button"
        className="menu-toggle"
        aria-label={open ? 'Fechar menu' : 'Abrir menu'}
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        {open ? <X /> : <Menu />}
      </button>

      <nav className={open ? 'nav-open' : ''}>
        <a href="#sobre" onClick={close}>Quem é Val</a>
        <a href="#causas" onClick={close}>Causas</a>
        <a href="#trabalho" onClick={close}>Mandato</a>
        <Link href="/revista" onClick={close}>Revista digital</Link>
        <Link href="/livreto" onClick={close}><BookOpen size={17}/> Livreto</Link>
        <a className="button small" href="/api/pdf" onClick={close}>
          <Download size={17}/> Baixar PDF
        </a>
      </nav>
    </header>
  );
}
