const puppeteer = require('puppeteer');
const path = require('path');

module.exports = {
    'generate:after': generatePdf
};

async function generatePdf(generator) {
    const targetDir = generator.targetDir;
    const parameters = generator.templateParams;
    if (!parameters || parameters.pdf === undefined) return;

    const page = await browser.newPage();
    await page.goto(`file://${path.join(targetDir, 'index.html')}`);

    if (parameters.pdf === 'true') 
        await page.pdf({ format: 'A4', path: `${targetDir}/index.pdf` });

    browser.close();
}