'use client';

import { useState } from 'react';
import { Download, Printer } from 'lucide-react';

export function PdfButton({ mode = 'proof' }: { mode?: 'proof' | 'bleed' }) {
  const [loading, setLoading] = useState(false);
  const isBleed = mode === 'bleed';

  async function download() {
    setLoading(true);
    try {
      const response = await fetch(`/api/pdf?mode=${mode}`);
      if (!response.ok) throw new Error('Falha ao gerar PDF');
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = isBleed ? 'val-advogado-grafica-a5-sangria-3mm.pdf' : 'val-advogado-prova-a5.pdf';
      anchor.click();
      URL.revokeObjectURL(url);
    } catch {
      window.location.href = '/impressao';
    } finally { setLoading(false); }
  }

  return (
    <button className={`button pdf-mode-${mode}`} onClick={download} disabled={loading}>
      {isBleed ? <Printer size={18} /> : <Download size={18} />}
      {loading ? 'Gerandoâ€¦' : isBleed ? 'PDF gráfica + sangria' : 'PDF prova A5'}
    </button>
  );
}

