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
  const pageWidth = mode === 'bleed' ? '154mm' : '148mm';
  const pageHeight = mode === 'bleed' ? '216mm' : '210mm';
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
    page.on('pageerror', (pageError) => {
      console.warn('[api/pdf] Erro na pagina de impressao', pageError.message);
    });
    page.on('requestfailed', (failedRequest) => {
      const url = failedRequest.url();
      if (failedRequest.resourceType() === 'image' || url.includes('/_next/image')) {
        console.warn('[api/pdf] Recurso de imagem falhou', {
          url,
          failure: failedRequest.failure()?.errorText,
        });
      }
    });
    const origin = new URL(request.url).origin;
    const previewParams = new URLSearchParams({ pdf: mode, mode });
    if (token) previewParams.set('token', token);
    await page.goto(`${origin}/impressao?${previewParams.toString()}`, { waitUntil: 'domcontentloaded', timeout: 30_000 });
    await page.emulateMediaType('screen');
    await page.addStyleTag({
      content: `
        @page { size: ${pageWidth} ${pageHeight}; margin: 0; }
        html, body {
          width: ${pageWidth} !important;
          min-width: ${pageWidth} !important;
          margin: 0 !important;
          padding: 0 !important;
          background: #fff !important;
        }
        *, *::before, *::after {
          animation: none !important;
          transition: none !important;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        .print-toolbar, .print-sync-warning {
          display: none !important;
        }
        .print-magazine-v7 {
          display: block !important;
          width: ${pageWidth} !important;
          padding: 0 !important;
          margin: 0 !important;
          gap: 0 !important;
          background: #fff !important;
        }
        .print-sheet-v7 {
          width: ${pageWidth} !important;
          height: ${pageHeight} !important;
          margin: 0 !important;
          box-shadow: none !important;
          overflow: hidden !important;
          break-after: page !important;
          page-break-after: always !important;
        }
        .print-sheet-v7:last-child {
          break-after: auto !important;
          page-break-after: auto !important;
        }
        .proof-a5 .print-trim-v7 {
          position: absolute !important;
          inset: 0 !important;
        }
        .with-bleed .print-trim-v7 {
          position: absolute !important;
          left: 3mm !important;
          top: 3mm !important;
          width: 148mm !important;
          height: 210mm !important;
          box-shadow: none !important;
        }
        .canvas-page-print-v7 {
          width: 100% !important;
          height: 100% !important;
          aspect-ratio: auto !important;
          box-shadow: none !important;
        }
        .canvas-text-autofit {
          overflow: hidden !important;
        }
      `,
    });
    await page.waitForSelector(`[data-print-ready="true"][data-page-count="${MAGAZINE_EDITION_PAGE_COUNT}"]`, { timeout: 30_000 });
    await page.waitForFunction(
      (expectedPages) => document.querySelectorAll('.print-sheet-v7').length === expectedPages
        && [...document.images].every((image) => image.complete),
      { timeout: 25_000 },
      MAGAZINE_EDITION_PAGE_COUNT,
    );
    const brokenImages = await page.evaluate(() => [...document.images]
      .filter((image) => image.naturalWidth === 0)
      .map((image) => image.currentSrc || image.src));
    if (brokenImages.length > 0) {
      console.warn('[api/pdf] PDF gerado com imagens ausentes', { count: brokenImages.length, brokenImages });
    }
    await page.evaluate(async () => {
      await document.fonts.ready;
    });
    await page.evaluate(async () => {
      await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    });
    const pdf = await page.pdf({
      width: pageWidth,
      height: pageHeight,
      printBackground: true,
      preferCSSPageSize: true,
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
      tagged: false,
      outline: false,
      waitForFonts: true,
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
