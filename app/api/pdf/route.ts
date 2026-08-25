import { NextRequest } from 'next/server';
import chromium from '@sparticuz/chromium';
import puppeteer from 'puppeteer-core';
import { MAGAZINE_EDITION_PAGE_COUNT } from '@/lib/magazine-edition';

export const runtime = 'nodejs';
export const maxDuration = 60;

function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error);
}

export async function GET(request: NextRequest) {
  let browser;
  const startedAt = Date.now();
  const params = new URL(request.url).searchParams;
  const mode = params.get('mode') === 'bleed' ? 'bleed' : 'proof';
  const authorization = request.headers.get('authorization');
  const cookie = request.headers.get('cookie');
  const editionId = params.get('edition');
  const pageWidth = mode === 'bleed' ? '154mm' : '148mm';
  const pageHeight = mode === 'bleed' ? '216mm' : '210mm';
  const rasterize = params.get('raster') === '1' && mode === 'proof';
  // A folha A5 mede cerca de 559 px CSS; escala 2,5 produz ~1.398 px,
  // equivalente a aproximadamente 240 DPI sem exceder a memória da função.
  const viewport = { width: 1200, height: 1700, deviceScaleFactor: 2.5 };
  const origin = new URL(request.url).origin;
  try {
    const localExecutablePath = process.env.PUPPETEER_EXECUTABLE_PATH;
    browser = await puppeteer.launch({
      args: localExecutablePath ? ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'] : chromium.args,
      defaultViewport: viewport,
      executablePath: localExecutablePath || await chromium.executablePath(),
      headless: true,
    });
    const page = await browser.newPage();
    await page.setViewport(viewport);
    if (authorization || cookie) {
      await page.setRequestInterception(true);
      page.on('request', (pageRequest) => {
        const requestOrigin = new URL(pageRequest.url()).origin;
        if (requestOrigin === origin) {
          void pageRequest.continue({
            headers: {
              ...pageRequest.headers(),
              ...(authorization ? { Authorization: authorization } : {}),
              ...(cookie ? { Cookie: cookie } : {}),
            },
          });
        } else {
          void pageRequest.continue();
        }
      });
    }
    page.on('pageerror', (pageError) => {
      console.warn('[api/pdf] Erro na pagina de impressao', errorMessage(pageError));
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
    const previewParams = new URLSearchParams({ pdf: mode, mode });
    if (editionId) previewParams.set('edition', editionId);
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
          -webkit-text-size-adjust: 100% !important;
          text-size-adjust: 100% !important;
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
          font-synthesis: none !important;
        }
        .canvas-text-autofit[data-fit-overflow="true"] {
          overflow: visible !important;
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
    const fontStatus = await page.evaluate(async () => {
      await Promise.race([
        Promise.all([
          document.fonts.load('400 16px Inter'),
          document.fonts.load('650 16px Inter'),
          document.fonts.load('800 16px Manrope'),
          document.fonts.load('700 16px "Playfair Display"'),
          document.fonts.load('400 16px "DM Sans"'),
          document.fonts.ready,
        ]),
        new Promise((resolve) => { window.setTimeout(resolve, 4000); }),
      ]);
      return {
        inter: document.fonts.check('650 16px Inter'),
        manrope: document.fonts.check('800 16px Manrope'),
        playfair: document.fonts.check('700 16px "Playfair Display"'),
        dmSans: document.fonts.check('400 16px "DM Sans"'),
      };
    });
    console.info('[api/pdf] Fontes carregadas', fontStatus);
    try {
      await page.waitForFunction(
        () => [...document.querySelectorAll('.canvas-text-autofit')]
          .every((element) => element.getAttribute('data-fit-ready') === 'true'),
        { timeout: 5_000 },
      );
    } catch (fitError) {
      console.warn('[api/pdf] Auto-fit de texto não finalizou antes do PDF', errorMessage(fitError));
    }
    await page.evaluate(async () => {
      await new Promise<void>((resolve) => {
        requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
      });
    });
    if (rasterize) {
      const sheets = await page.$$('.print-sheet-v7');
      if (sheets.length !== MAGAZINE_EDITION_PAGE_COUNT) {
        throw new Error(`A prévia renderizou ${sheets.length} páginas, mas eram esperadas ${MAGAZINE_EDITION_PAGE_COUNT}.`);
      }
      const pageImages: string[] = [];
      for (let index = 0; index < sheets.length; index += 1) {
        await page.evaluate((activeIndex) => {
          const pageSheets = [...document.querySelectorAll<HTMLElement>('.print-sheet-v7')];
          pageSheets.forEach((sheet, sheetIndex) => {
            sheet.style.display = sheetIndex === activeIndex ? 'block' : 'none';
            sheet.style.breakAfter = 'auto';
            sheet.style.pageBreakAfter = 'auto';
          });
          window.scrollTo(0, 0);
        }, index);
        await sheets[index].evaluate(async (element) => {
          await Promise.all([...element.querySelectorAll('img')]
            .map((image) => image.decode().catch(() => undefined)));
          await new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
        });
        const box = await sheets[index].boundingBox();
        if (!box) throw new Error(`Não foi possível medir a página ${index + 1}.`);
        let image = '';
        for (let attempt = 1; attempt <= 3; attempt += 1) {
          try {
            image = await page.screenshot({
              type: 'jpeg',
              quality: 94,
              encoding: 'base64',
              omitBackground: false,
              captureBeyondViewport: false,
              clip: {
                x: Math.max(0, box.x),
                y: Math.max(0, box.y),
                width: box.width,
                height: box.height,
              },
            });
            break;
          } catch (captureError) {
            if (attempt === 3) {
              throw new Error(`Falha ao capturar a página ${index + 1}: ${errorMessage(captureError)}`);
            }
            await new Promise((resolve) => setTimeout(resolve, 150));
          }
        }
        pageImages.push(`data:image/jpeg;base64,${image}`);
        if ((index + 1) % 5 === 0 || index + 1 === sheets.length) {
          console.info('[api/pdf] Páginas rasterizadas', { completed: index + 1, total: sheets.length });
        }
      }
      await page.setContent(`<!doctype html>
        <html>
          <head>
            <meta charset="utf-8" />
            <style>
              @page { size: ${pageWidth} ${pageHeight}; margin: 0; }
              html, body {
                width: ${pageWidth};
                margin: 0;
                padding: 0;
                background: #fff;
              }
              .pdf-page {
                width: ${pageWidth};
                height: ${pageHeight};
                margin: 0;
                padding: 0;
                page-break-after: always;
                break-after: page;
                overflow: hidden;
                background: #fff;
              }
              .pdf-page:last-child {
                page-break-after: auto;
                break-after: auto;
              }
              img {
                display: block;
                width: 100%;
                height: 100%;
                object-fit: fill;
              }
            </style>
          </head>
          <body>
            ${pageImages.map((src) => `<section class="pdf-page"><img src="${src}" alt="" /></section>`).join('')}
          </body>
        </html>`, { waitUntil: 'load' });
      await page.emulateMediaType('screen');
    }
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
