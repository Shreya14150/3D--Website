import puppeteer from 'puppeteer-core';
import path from 'path';
import fs from 'fs';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const pdfPath = 'C:/Users/Asus/.gemini/antigravity/brain/9d11d7b4-5004-41d7-8673-0f28ae656b27/.user_uploaded/media_1795430895943_104b368c.pdf';
const outDir = path.resolve('public/images');

if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

async function renderPDF() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--allow-file-access-from-files']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1400, height: 1600, deviceScaleFactor: 2 });

  // Read PDF as base64
  const pdfBase64 = fs.readFileSync(pdfPath).toString('base64');

  // Create an HTML page loading PDF.js from node_modules
  const pdfJsPath = path.resolve('node_modules/pdfjs-dist/build/pdf.mjs').replace(/\\/g, '/');

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { margin: 0; background: #fff; display: flex; justify-content: center; align-items: center; }
          canvas { display: block; }
        </style>
      </head>
      <body>
        <canvas id="pdf-canvas"></canvas>
        <script type="module">
          import * as pdfjsLib from 'file:///${pdfJsPath}';
          
          window.pdfjsLib = pdfjsLib;
          const pdfData = atob("${pdfBase64}");
          const loadingTask = pdfjsLib.getDocument({ data: pdfData });
          
          window.pdfDoc = await loadingTask.promise;
          window.totalPages = window.pdfDoc.numPages;

          window.renderPageToCanvas = async (pageNum, scale = 2.0) => {
            const page = await window.pdfDoc.getPage(pageNum);
            const viewport = page.getViewport({ scale });
            const canvas = document.getElementById('pdf-canvas');
            canvas.width = viewport.width;
            canvas.height = viewport.height;
            const ctx = canvas.getContext('2d');
            await page.render({ canvasContext: ctx, viewport }).promise;
            return { width: viewport.width, height: viewport.height };
          };
          window.ready = true;
        </script>
      </body>
    </html>
  `;

  await page.setContent(htmlContent, { waitUntil: 'load' });
  await page.waitForFunction('window.ready === true', { timeout: 15000 });

  const numPages = await page.evaluate(() => window.totalPages);
  console.log(`PDF has ${numPages} pages.`);

  const pageNames = [
    '01_tube_single_pink.jpg',
    '02_model_lip_rose.jpg',
    '03_wand_applicator_macro.jpg',
    '04_prismatic_ruby_flare.jpg',
    '05_holographic_glitter_pout.jpg',
    '06_lip_bite_tube.jpg',
    '07_five_shades_lineup.jpg'
  ];

  for (let i = 1; i <= numPages; i++) {
    console.log(`Rendering page ${i}...`);
    await page.evaluate(async (p) => {
      await window.renderPageToCanvas(p, 2.0);
    }, i);

    await new Promise((r) => setTimeout(r, 400));

    const canvas = await page.$('#pdf-canvas');
    const filename = pageNames[i - 1] || `lookbook_${i}.jpg`;
    const dest = path.join(outDir, filename);

    // Save as JPEG with high quality
    await canvas.screenshot({ path: dest, type: 'jpeg', quality: 95 });
    console.log(`✓ Saved page ${i} to ${dest}`);
  }

  await browser.close();
  console.log('PDF Rendering complete!');
}

renderPDF().catch((err) => console.error(err));
