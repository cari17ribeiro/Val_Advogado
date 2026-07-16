import type { Metadata } from 'next';
import { DM_Sans, Inter, Manrope, Playfair_Display } from 'next/font/google';
import './globals.css';

const dmSans = DM_Sans({ subsets: ['latin'], variable: '--font-dm-sans', display: 'swap' });
const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const manrope = Manrope({ subsets: ['latin'], variable: '--font-manrope', display: 'swap' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair', display: 'swap' });

export const metadata: Metadata = {
  title: 'Val Advogado | Infojornal Digital',
  description: 'Site institucional, revista digital e livreto para impressão.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={`${dmSans.variable} ${inter.variable} ${manrope.variable} ${playfair.variable}`}>
      <body>{children}</body>
    </html>
  );
}
