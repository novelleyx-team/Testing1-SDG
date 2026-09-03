import puppeteer from 'puppeteer';
import * as fs from 'fs';
import * as path from 'path';

export async function generatePdfFromHtml(htmlContent: string): Promise<Buffer> {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--font-render-hinting=none'],
  });

  const page = await browser.newPage();
  
  // Read print.css
  const cssPath = path.join(process.cwd(), 'src/lib/reports/templates/print.css');
  let customCss = '';
  try {
    customCss = fs.readFileSync(cssPath, 'utf8');
  } catch {
    console.warn("Could not load print.css, proceeding without it.");
  }

  // To support Tailwind classes, we'd ideally compile Tailwind into a string, but for now we'll inject the CDN.
  // We'll also inject our custom print CSS.
  const completeHtml = `
    <!DOCTYPE html>
    ${htmlContent}
    <script src="https://cdn.tailwindcss.com"></script>
    <style>${customCss}</style>
  `;

  await page.setContent(completeHtml, { waitUntil: 'load' });

  const pdfBuffer = await page.pdf({
    format: 'A4',
    printBackground: true,
    margin: {
      top: '0px',
      right: '0px',
      bottom: '0px',
      left: '0px'
    }
  });

  await browser.close();

  // Validate buffer
  if (!pdfBuffer || pdfBuffer.length === 0) {
    throw new Error("Failed to generate PDF: Output buffer is empty");
  }

  return Buffer.from(pdfBuffer);
}
