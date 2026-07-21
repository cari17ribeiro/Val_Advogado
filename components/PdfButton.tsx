'use client';

import { useState } from 'react';
import { Download, Printer } from 'lucide-react';
import { readSession } from '@/lib/supabase-rest';

export function PdfButton({ mode = 'proof' }: { mode?: 'proof' | 'bleed' }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const isBleed = mode === 'bleed';

  async function download() {
    setLoading(true);
    setError('');
    try {
      const token = readSession()?.access_token;
      const query = new URLSearchParams({ mode });
      if (token) query.set('token', token);
      const response = await fetch(`/api/pdf?${query.toString()}`);
      const contentType = response.headers.get('content-type') || '';
      if (!response.ok || !contentType.includes('application/pdf')) {
        const payload = await response.json().catch(() => null) as { error?: string } | null;
        throw new Error(payload?.error || 'Falha ao gerar PDF');
      }
      const blob = await response.blob();
      const signature = new TextDecoder('ascii').decode(await blob.slice(0, 5).arrayBuffer());
      if (signature !== '%PDF-') throw new Error('O arquivo gerado não é um PDF válido.');
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = isBleed ? 'val-advogado-grafica-a5-sangria-3mm.pdf' : 'val-advogado-prova-a5.pdf';
      anchor.click();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (downloadError) {
      setError(downloadError instanceof Error ? downloadError.message : 'Não foi possível gerar o PDF.');
    } finally { setLoading(false); }
  }

  return (
    <div className="pdf-download-control">
      <button className={`button pdf-mode-${mode}`} onClick={download} disabled={loading}>
        {isBleed ? <Printer size={18} /> : <Download size={18} />}
        {loading ? 'Gerando PDF...' : isBleed ? 'PDF gráfica + sangria' : 'PDF prova A5'}
      </button>
      {error && <small className="pdf-download-error" role="alert">{error}</small>}
    </div>
  );
}


