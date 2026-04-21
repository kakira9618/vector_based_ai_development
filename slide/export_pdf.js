const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  const htmlPath = 'file://' + path.resolve(__dirname, 'index.html');
  const outPath = path.resolve(__dirname, 'vector_based_ai_development.pdf');

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--autoplay-policy=no-user-gesture-required'],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 2 });
  await page.goto(htmlPath, { waitUntil: 'networkidle0' });

  // Wait for all images to load
  await page.evaluate(async () => {
    const imgs = Array.from(document.images);
    await Promise.all(imgs.map(img => img.complete ? null : new Promise(res => {
      img.addEventListener('load', res);
      img.addEventListener('error', res);
    })));
  });

  // Strip UI chrome and disable entry animations/transforms during capture
  await page.addStyleTag({
    content: `
      .progress, .slide-number, .lightbox { display: none !important; }
      .slide.animate-in { animation: none !important; }
      body { display: block !important; }
      .stage { transform: none !important; position: static !important; margin: 0 !important; }
    `,
  });

  const slideCount = await page.evaluate(() => document.querySelectorAll('.slide').length);

  // Screenshot each slide at native canvas resolution (1920x1080 logical @ 2x device pixels)
  const screenshots = [];
  for (let i = 0; i < slideCount; i++) {
    await page.evaluate((idx) => {
      const slides = document.querySelectorAll('.slide');
      slides.forEach((s, j) => {
        s.classList.remove('active', 'animate-in');
        if (j === idx) s.classList.add('active');
      });
    }, i);
    // Let fonts/layout settle
    await new Promise(r => setTimeout(r, 150));
    const shot = await page.screenshot({
      type: 'png',
      clip: { x: 0, y: 0, width: 1920, height: 1080 },
      omitBackground: false,
    });
    screenshots.push(shot.toString('base64'));
  }

  // Build a print-ready HTML of full-bleed images (one per page)
  const pagesHtml = screenshots.map(b64 =>
    `<div class="p"><img src="data:image/png;base64,${b64}"/></div>`
  ).join('');

  const pdfHtml = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><style>
  @page { size: 1920px 1080px; margin: 0; }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html, body { background: #0a0a0a; }
  .p { width: 1920px; height: 1080px; page-break-after: always; break-after: page; overflow: hidden; }
  .p:last-child { page-break-after: auto; break-after: auto; }
  .p img { width: 1920px; height: 1080px; display: block; }
</style></head><body>${pagesHtml}</body></html>`;

  await page.setContent(pdfHtml, { waitUntil: 'load', timeout: 120000 });
  // Ensure all inline data-URL images have decoded before PDF
  await page.evaluate(async () => {
    const imgs = Array.from(document.images);
    await Promise.all(imgs.map(img => img.decode ? img.decode().catch(() => {}) : null));
  });

  await page.pdf({
    path: outPath,
    width: '1920px',
    height: '1080px',
    printBackground: true,
    preferCSSPageSize: true,
  });

  await browser.close();
  console.log('Wrote', outPath);
})().catch(e => { console.error(e); process.exit(1); });
