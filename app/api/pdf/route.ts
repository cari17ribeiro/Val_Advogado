import { NextRequest } from 'next/server';
import chromium from '@sparticuz/chromium';
import puppeteer from 'puppeteer-core';

export const runtime = 'nodejs';
export const maxDuration = 60;

export async function GET(request: NextRequest) {
  let browser;
  const params = new URL(request.url).searchParams;
  const mode = params.get('mode') === 'bleed' ? 'bleed' : 'proof';
  const token = params.get('token');
  try {
    browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: { width: 1200, height: 1600 },
      executablePath: await chromium.executablePath(),
      headless: true,
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 1748, height: 2480, deviceScaleFactor: 1 });
    const origin = new URL(request.url).origin;
    const previewParams = new URLSearchParams({ pdf: mode, mode });
    if (token) previewParams.set('token', token);
    await page.goto(`${origin}/impressao?${previewParams.toString()}`, { waitUntil: 'networkidle0', timeout: 45_000 });
    await page.waitForSelector('[data-print-ready="true"]', { timeout: 45_000 });
    await page.waitForFunction(
      () => document.querySelectorAll('.print-sheet-v7').length > 0 && [...document.images].every((image) => image.complete),
      { timeout: 45_000 },
    );
    await page.evaluate(async () => {
      await document.fonts.ready;
      await Promise.all([...document.images].map((image) => image.decode?.().catch(() => undefined)));
    });
    await page.emulateMediaType('print');
    const pdf = await page.pdf({
      width: mode === 'bleed' ? '154mm' : '148mm',
      height: mode === 'bleed' ? '216mm' : '210mm',
      printBackground: true,
      preferCSSPageSize: true,
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
      tagged: true,
      outline: true,
    });
    const filename = mode === 'bleed' ? 'val-advogado-grafica-a5-sangria-3mm.pdf' : 'val-advogado-prova-a5.pdf';
    return new Response(Buffer.from(pdf), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-store',
      },
    });
  } catch (error) {
    console.error(error);
    return Response.redirect(new URL('/impressao', request.url), 307);
  } finally {
    await browser?.close();
  }
}
