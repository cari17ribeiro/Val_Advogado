'use client';

import Link from 'next/link';
import { BookOpen, Download, Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const close = () => setOpen(false);

  return (
    <header className={`glass-header ${scrolled ? 'is-scrolled' : ''}`}>
      <Link href="/" className="brand-v3" onClick={close} aria-label="Página inicial do Val Advogado">
        <span className="brand-monogram">VA</span>
        <span className="brand-copy"><b>VAL</b><small>ADVOGADO</small></span>
      </Link>

      <button
        type="button"
        className="menu-toggle-v3"
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
        <Link href="/revista" onClick={close}><BookOpen size={16} /> Revista</Link>
        <a className="header-download" href="/api/pdf" onClick={close}><Download size={16} /> PDF</a>
      </nav>
    </header>
  );
}
