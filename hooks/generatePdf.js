const puppeteer = require('puppeteer');
const path = require('path');

module.exports = {
    'generate:after': generatePdf
};

async function generatePdf(generator) {
    const targetDir = generator.targetDir;
    const parameters = generator.templateParams;
    //all actions of this hook depend on parameters passed by the user, if non are provided we should just stop the hook
    if (!parameters) return;

    const browser = await puppeteer.launch();
    //mermaid has this strange behaviour that it generates the id of the diagram using current date which makes it totally not possible to test
    //we override date.now() here to make sure always the same number is returned, which is also fine for produciton as only one diagram will be on index.html
    browser.on('targetchanged', async target => {
        const targetPage = await target.page();
        const client = await targetPage.target().createCDPSession();
        await client.send('Runtime.evaluate', {
            expression: 'Date.now = function() { return 0; }'
        });
    });
    const page = await browser.newPage();
    await page.goto(`file://${path.join(targetDir, 'index.html')}`);

    if (parameters.pdf === 'true') await page.pdf({ format: 'A4', path: `${targetDir}/index.pdf` });

    browser.close();
}