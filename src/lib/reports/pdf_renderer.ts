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

  // We inject tailwind CDN, but rely mostly on custom CSS for exact matching
  const completeHtml = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <script src="https://cdn.tailwindcss.com"></script>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Roboto:wght@400;500;700&display=swap" rel="stylesheet">
      <style>
        ${customCss}
      </style>
    </head>
    <body>
      ${htmlContent}
    </body>
    </html>
  `;

  await page.setContent(completeHtml, { waitUntil: ['load'] });

  const pdfBuffer = await page.pdf({
    format: 'A4',
    printBackground: true,
    displayHeaderFooter: true,
    headerTemplate: `
      <div style="width: 100%; font-size: 10px; color: #1B4F72; display: flex; justify-content: space-between; padding: 0 40px; font-family: 'Inter', sans-serif; font-weight: bold;">
        <span class="title"></span>
      </div>
    `,
    footerTemplate: `
      <div style="width: 100%; font-size: 10px; color: #7f8c8d; display: flex; justify-content: space-between; padding: 0 40px; font-family: 'Inter', sans-serif;">
        <span>SDG Analysis Report &mdash; September 2026</span>
        <span>Page <span class="pageNumber"></span></span>
      </div>
    `,
    margin: {
      top: '40px',
      bottom: '60px',
      left: '0px',
      right: '0px',
    }
  });

  await browser.close();

  if (!pdfBuffer || pdfBuffer.length === 0) {
    throw new Error("Failed to generate PDF: Output buffer is empty");
  }

  return Buffer.from(pdfBuffer);
}
