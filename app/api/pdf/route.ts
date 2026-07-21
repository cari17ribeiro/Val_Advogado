import { NextRequest } from 'next/server';
import chromium from '@sparticuz/chromium';
import puppeteer from 'puppeteer-core';
import { MAGAZINE_EDITION_PAGE_COUNT } from '@/lib/magazine-edition';

export const runtime = 'nodejs';
export const maxDuration = 60;

export async function GET(request: NextRequest) {
  let browser;
  const startedAt = Date.now();
  const params = new URL(request.url).searchParams;
  const mode = params.get('mode') === 'bleed' ? 'bleed' : 'proof';
  const token = params.get('token');
  try {
    const localExecutablePath = process.env.PUPPETEER_EXECUTABLE_PATH;
    browser = await puppeteer.launch({
      args: localExecutablePath ? ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'] : chromium.args,
      defaultViewport: { width: 900, height: 1280 },
      executablePath: localExecutablePath || await chromium.executablePath(),
      headless: true,
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 900, height: 1280, deviceScaleFactor: 1 });
    const origin = new URL(request.url).origin;
    const previewParams = new URLSearchParams({ pdf: mode, mode });
    if (token) previewParams.set('token', token);
    await page.goto(`${origin}/impressao?${previewParams.toString()}`, { waitUntil: 'domcontentloaded', timeout: 30_000 });
    await page.emulateMediaType('print');
    await page.addStyleTag({ content: '*,*::before,*::after{animation:none!important;transition:none!important}' });
    await page.waitForSelector(`[data-print-ready="true"][data-page-count="${MAGAZINE_EDITION_PAGE_COUNT}"]`, { timeout: 30_000 });
    await page.waitForFunction(
      (expectedPages) => document.querySelectorAll('.print-sheet-v7').length === expectedPages
        && [...document.images].every((image) => image.complete && image.naturalWidth > 0),
      { timeout: 25_000 },
      MAGAZINE_EDITION_PAGE_COUNT,
    );
    await page.evaluate(async () => {
      await document.fonts.ready;
    });
    const pdf = await page.pdf({
      width: mode === 'bleed' ? '154mm' : '148mm',
      height: mode === 'bleed' ? '216mm' : '210mm',
      printBackground: true,
      preferCSSPageSize: true,
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
      tagged: false,
      outline: false,
      waitForFonts: false,
    });
    const pdfBuffer = Buffer.from(pdf);
    if (pdfBuffer.length < 1024 || pdfBuffer.subarray(0, 5).toString('ascii') !== '%PDF-') {
      throw new Error('O Chromium retornou um arquivo sem assinatura PDF válida.');
    }
    const filename = mode === 'bleed' ? 'val-advogado-grafica-a5-sangria-3mm.pdf' : 'val-advogado-prova-a5.pdf';
    console.info('[api/pdf] PDF gerado', { mode, bytes: pdfBuffer.length, pages: MAGAZINE_EDITION_PAGE_COUNT, durationMs: Date.now() - startedAt });
    const stream = new ReadableStream<Uint8Array>({
      start(controller) {
        const chunkSize = 256 * 1024;
        for (let offset = 0; offset < pdfBuffer.length; offset += chunkSize) {
          controller.enqueue(pdfBuffer.subarray(offset, Math.min(offset + chunkSize, pdfBuffer.length)));
        }
        controller.close();
      },
    });
    return new Response(stream, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-store',
        'X-Pdf-Page-Count': String(MAGAZINE_EDITION_PAGE_COUNT),
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro desconhecido';
    console.error('[api/pdf] Falha ao gerar PDF', { mode, message, durationMs: Date.now() - startedAt });
    return Response.json(
      { error: 'Não foi possível gerar o PDF. Tente novamente em alguns instantes.', detail: message },
      { status: 500, headers: { 'Cache-Control': 'no-store' } },
    );
  } finally {
    await browser?.close();
  }
}
