import Link from 'next/link';
import { DynamicMagazine } from '@/components/DynamicMagazine';

export default function RevistaPage() {
  return (
    <main className="reader">
      <div className="readerbar">
        <Link href="/">â† Voltar ao site</Link>
        <span>Revista Digital • Edição 01 • 26 páginas</span>
        <div className="actions">
          <Link className="button ghost" href="/impressao">Modo impressão</Link>
          <Link className="button" href="/admin">Área administrativa</Link>
        </div>
      </div>
      <DynamicMagazine />
    </main>
  );
}

