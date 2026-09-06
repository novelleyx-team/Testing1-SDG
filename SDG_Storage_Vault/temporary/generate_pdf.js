const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  console.log('Launching browser...');
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--allow-file-access-from-files']
  });

  const page = await browser.newPage();

  const htmlPath = path.resolve(__dirname, 'SDG_Analysis_Report.html');
  const pdfPath = path.resolve(__dirname, 'SDG_Analysis_Report.pdf');

  console.log('Loading HTML:', htmlPath);
  await page.goto('file:///' + htmlPath.replace(/\\/g, '/'), {
    waitUntil: 'networkidle0',
    timeout: 60000
  });

  // Wait extra time for Chart.js rendering
  await new Promise(r => setTimeout(r, 3000));

  console.log('Generating PDF...');
  await page.pdf({
    path: pdfPath,
    format: 'A4',
    printBackground: true,
    displayHeaderFooter: false,
    margin: {
      top: '0mm',
      bottom: '0mm',
      left: '0mm',
      right: '0mm'
    },
    preferCSSPageSize: true
  });

  console.log('PDF saved to:', pdfPath);
  await browser.close();
  console.log('Done!');
})();
