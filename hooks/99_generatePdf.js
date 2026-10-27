const puppeteer = require('puppeteer');
const path = require('path');
const { pathToFileURL } = require('url');

/**
 * Generates PDF if user pass `pdf` paramater.
 */
module.exports = {
  'generate:after': async ({ templateParams = {}, targetDir }) => {
    // all actions of this hook depend on parameters passed by the user, 
    // if non are provided we should just stop the hook
    if (templateParams.pdf !== 'true') {
      return;
    }

    console.info("PDF is generating...")
    let browser;
    let generated = false;
    try {
      browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});
      const page = await browser.newPage();
      const htmlFilename = templateParams.outFilename || 'index.html';
      const parsedFilename = path.parse(htmlFilename);
      const pdfFilename = path.join(parsedFilename.dir, `${parsedFilename.name}.pdf`);
      const htmlPath = path.resolve(targetDir, htmlFilename);
      const pdfPath = path.resolve(targetDir, pdfFilename);
      const fileUrl = pathToFileURL(htmlPath).href;
      // Go to prepared page with documentation
      await page.goto(fileUrl, { waitUntil: 'networkidle0' });
   
      // Hide burger-menu in pdf
      await page.evaluate(() => { document.querySelector('.burger-menu').style.display = 'none'; });

      // React uses its own events system with SyntheticEvents (prevents browser incompatabilities and gives React more control of events),
      // so we must use `{ bubbles: true }`
      await page.$$eval('button > svg', chevrons => chevrons.forEach(chevron => {
        const button = chevron.parentElement;
        const toClick = chevron && chevron.classList && !Array.from(chevron.classList).some(cl => cl.includes('-rotate-180'));
        toClick && typeof button.dispatchEvent === 'function' && button.dispatchEvent(new Event('click', { bubbles: true }));
      }));
    
      await page.pdf({ format: 'A4', path: pdfPath, printBackground: true, timeout: parseInt(templateParams.pdfTimeout, 10) });
      generated = true;
    } catch(e) {
      console.error(e);
    } finally {
      if (browser) {
        try {
          await browser.close();
        } catch (closeError) {
          console.error(closeError);
          generated = false;
        }
      }
    }
    if (generated) {
      console.info("PDF generated!");
    }
  }  
};
