const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  const htmlPath = 'file://' + path.resolve(__dirname, 'index.html');
  // OUTPUT_PDF_NAME をプロジェクト名に合わせて書き換える
  const outPath = path.resolve(__dirname, 'OUTPUT_PDF_NAME.pdf');

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--autoplay-policy=no-user-gesture-required'],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 1 });
  await page.goto(htmlPath, { waitUntil: 'networkidle0' });

  // Wait for all images to load
  await page.evaluate(async () => {
    const imgs = Array.from(document.images);
    await Promise.all(imgs.map(img => img.complete ? null : new Promise(res => {
      img.addEventListener('load', res);
      img.addEventListener('error', res);
    })));
  });

  // Inject print CSS: show every slide as its own page at 1920x1080
  await page.addStyleTag({
    content: `
      @page { size: 1920px 1080px; margin: 0; }
      html, body { overflow: visible !important; height: auto !important; background: #0a0a0a !important; }
      body { display: block !important; }
      .stage { transform: none !important; width: 1920px !important; height: auto !important; display: block !important; position: static !important; }
      .slide {
        display: flex !important;
        position: relative !important;
        top: auto !important; left: auto !important;
        width: 1920px !important;
        height: 1080px !important;
        overflow: hidden !important;
        page-break-after: always;
        break-after: page;
        animation: none !important;
      }
      .slide:last-child { page-break-after: auto; break-after: auto; }
      .progress, .slide-number, .lightbox { display: none !important; }
      .media-container img, .media-container video {
        box-shadow: none !important;
      }
    `,
  });

  // Give layout a moment to settle
  await new Promise(r => setTimeout(r, 500));

  await page.pdf({
    path: outPath,
    width: '1920px',
    height: '1080px',
    printBackground: true,
    pageRanges: '',
    preferCSSPageSize: true,
  });

  await browser.close();
  console.log('Wrote', outPath);
})().catch(e => { console.error(e); process.exit(1); });
