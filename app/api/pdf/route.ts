import { NextRequest } from 'next/server';
import chromium from '@sparticuz/chromium';
import puppeteer from 'puppeteer-core';

export const runtime = 'nodejs';
export const maxDuration = 60;

export async function GET(request: NextRequest) {
  let browser;
  const mode = new URL(request.url).searchParams.get('mode') === 'bleed' ? 'bleed' : 'proof';
  try {
    browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: { width: 1200, height: 1600 },
      executablePath: await chromium.executablePath(),
      headless: true,
    });
    const page = await browser.newPage();
    const origin = new URL(request.url).origin;
    await page.goto(`${origin}/impressao?pdf=${mode}&mode=${mode}`, { waitUntil: 'networkidle0' });
    await page.emulateMediaType('print');
    const pdf = await page.pdf({
      width: mode === 'bleed' ? '154mm' : '148mm',
      height: mode === 'bleed' ? '216mm' : '210mm',
      printBackground: true,
      preferCSSPageSize: true,
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
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
