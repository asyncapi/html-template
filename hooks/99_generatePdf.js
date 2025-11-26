const puppeteer = require('puppeteer');
const path = require('path');

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
    try {
      const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});
      const page = await browser.newPage();
      const fullPath = path.resolve(targetDir, 'index.html');
      const fileUrl = `file:///${fullPath.replace(/\\/g, '/')}`;
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
    
      await page.pdf({ format: 'A4', path: `${targetDir}/index.pdf`, printBackground: true, timeout: parseInt(templateParams.pdfTimeout, 10) });
      browser.close();
    } catch(e) {
      console.error(e);
      return;
    }
    console.info("PDF generated!");
  }  
};
