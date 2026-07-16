'use client';
import { useState } from 'react';
import { Download } from 'lucide-react';

export function PdfButton() {
  const [loading, setLoading] = useState(false);
  async function download() {
    setLoading(true);
    try {
      const response = await fetch('/api/pdf');
      if (!response.ok) throw new Error('Falha ao gerar PDF');
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = 'val-advogado-revista-20-paginas-a5.pdf';
      anchor.click();
      URL.revokeObjectURL(url);
    } catch {
      window.location.href = '/downloads/val-advogado-revista-20-paginas-a5.pdf';
    } finally { setLoading(false); }
  }
  return <button className="button" onClick={download} disabled={loading}><Download size={18}/>{loading ? 'Gerando PDF…' : 'Gerar e baixar PDF'}</button>;
}
