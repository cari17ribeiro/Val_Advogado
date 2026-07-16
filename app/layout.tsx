import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Val Advogado | Infojornal Digital',
  description: 'Site institucional, revista digital e livreto para impressão.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="pt-BR"><body>{children}</body></html>;
}
