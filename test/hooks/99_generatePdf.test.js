jest.mock('puppeteer', () => ({
  launch: jest.fn(),
}));

const path = require('path');
const { pathToFileURL } = require('url');
const puppeteer = require('puppeteer');

const generatePdf = require('../../hooks/99_generatePdf')['generate:after'];

describe('PDF generation hook', () => {
  let page;
  let browser;
  let infoSpy;
  let errorSpy;

  beforeEach(() => {
    jest.clearAllMocks();

    page = {
      goto: jest.fn().mockResolvedValue(undefined),
      evaluate: jest.fn().mockResolvedValue(undefined),
      $$eval: jest.fn().mockResolvedValue(undefined),
      pdf: jest.fn().mockResolvedValue(undefined),
    };
    browser = {
      newPage: jest.fn().mockResolvedValue(page),
      close: jest.fn().mockResolvedValue(undefined),
    };
    puppeteer.launch.mockResolvedValue(browser);

    infoSpy = jest.spyOn(console, 'info').mockImplementation(() => {});
    errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it.each([undefined, false, 'false', 'TRUE'])(
    'does not launch Puppeteer when pdf is %p',
    async pdf => {
      await generatePdf({ templateParams: { pdf }, targetDir: path.resolve('test-output') });

      expect(puppeteer.launch).not.toHaveBeenCalled();
    }
  );

  it('uses the default HTML and PDF filenames', async () => {
    const targetDir = path.resolve('test output');

    await generatePdf({ templateParams: { pdf: 'true', pdfTimeout: '30000' }, targetDir });

    expect(puppeteer.launch).toHaveBeenCalledWith({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    expect(page.goto).toHaveBeenCalledWith(
      pathToFileURL(path.resolve(targetDir, 'index.html')).href,
      { waitUntil: 'networkidle0' }
    );
    expect(page.evaluate).toHaveBeenCalledTimes(1);
    expect(page.$$eval).toHaveBeenCalledTimes(1);
    expect(page.pdf).toHaveBeenCalledWith({
      format: 'A4',
      path: path.resolve(targetDir, 'index.pdf'),
      printBackground: true,
      timeout: 30000,
    });
  });

  it.each([
    ['asyncapi.html', 'asyncapi.pdf'],
    ['foo', 'foo.pdf'],
    ['docs.v1.html', 'docs.v1.pdf'],
    ['docs/api.html', path.join('docs', 'api.pdf')],
  ])('derives the PDF filename from %s', async (outFilename, expectedPdfFilename) => {
    const targetDir = path.resolve('test-output');

    await generatePdf({
      templateParams: { pdf: 'true', pdfTimeout: '1234', outFilename },
      targetDir,
    });

    expect(page.goto).toHaveBeenCalledWith(
      pathToFileURL(path.resolve(targetDir, outFilename)).href,
      { waitUntil: 'networkidle0' }
    );
    expect(page.pdf).toHaveBeenCalledWith(expect.objectContaining({
      path: path.resolve(targetDir, expectedPdfFilename),
      timeout: 1234,
    }));
  });

  it('constructs a correctly encoded file URL for URL-sensitive paths', async () => {
    const targetDir = path.resolve('output folder #1');
    const outFilename = path.join('docs #1', 'API file.html');

    await generatePdf({
      templateParams: { pdf: 'true', pdfTimeout: '30000', outFilename },
      targetDir,
    });

    expect(page.goto).toHaveBeenCalledWith(
      pathToFileURL(path.resolve(targetDir, outFilename)).href,
      { waitUntil: 'networkidle0' }
    );
  });

  it('awaits browser cleanup before reporting success', async () => {
    let releaseClose;
    let signalCloseStarted;
    const closeStarted = new Promise(resolve => { signalCloseStarted = resolve; });
    const closePending = new Promise(resolve => { releaseClose = resolve; });
    browser.close.mockImplementation(() => {
      signalCloseStarted();
      return closePending;
    });

    const result = generatePdf({
      templateParams: { pdf: 'true', pdfTimeout: '30000' },
      targetDir: path.resolve('test-output'),
    });

    await closeStarted;
    expect(infoSpy).not.toHaveBeenCalledWith('PDF generated!');

    releaseClose();
    await result;

    expect(browser.close).toHaveBeenCalledTimes(1);
    expect(infoSpy).toHaveBeenCalledWith('PDF generated!');
  });

  it.each([
    ['new page', browser => browser.newPage.mockRejectedValue(new Error('new page failed'))],
    ['navigation', (browser, page) => page.goto.mockRejectedValue(new Error('navigation failed'))],
    ['page evaluation', (browser, page) => page.evaluate.mockRejectedValue(new Error('evaluation failed'))],
    ['chevron expansion', (browser, page) => page.$$eval.mockRejectedValue(new Error('expansion failed'))],
    ['PDF generation', (browser, page) => page.pdf.mockRejectedValue(new Error('PDF failed'))],
  ])('closes the browser and suppresses success when %s fails', async (name, fail) => {
    fail(browser, page);

    await expect(generatePdf({
      templateParams: { pdf: 'true', pdfTimeout: '30000' },
      targetDir: path.resolve('test-output'),
    })).resolves.toBeUndefined();

    expect(errorSpy).toHaveBeenCalledTimes(1);
    expect(browser.close).toHaveBeenCalledTimes(1);
    expect(infoSpy).not.toHaveBeenCalledWith('PDF generated!');
  });

  it('handles a browser launch failure without reporting success', async () => {
    const launchError = new Error('launch failed');
    puppeteer.launch.mockRejectedValue(launchError);

    await expect(generatePdf({
      templateParams: { pdf: 'true', pdfTimeout: '30000' },
      targetDir: path.resolve('test-output'),
    })).resolves.toBeUndefined();

    expect(errorSpy).toHaveBeenCalledWith(launchError);
    expect(browser.close).not.toHaveBeenCalled();
    expect(infoSpy).not.toHaveBeenCalledWith('PDF generated!');
  });


  it('suppresses success when cleanup fails after PDF generation', async () => {
    const cleanupError = new Error('close failed');
    browser.close.mockRejectedValue(cleanupError);

    await expect(generatePdf({
      templateParams: { pdf: 'true', pdfTimeout: '30000' },
      targetDir: path.resolve('test-output'),
    })).resolves.toBeUndefined();

    expect(errorSpy).toHaveBeenCalledWith(cleanupError);
    expect(browser.close).toHaveBeenCalledTimes(1);
    expect(infoSpy).not.toHaveBeenCalledWith('PDF generated!');
  });

  it('logs both generation and cleanup failures without masking either error', async () => {
    const generationError = new Error('PDF failed');
    const cleanupError = new Error('close failed');
    page.pdf.mockRejectedValue(generationError);
    browser.close.mockRejectedValue(cleanupError);

    await expect(generatePdf({
      templateParams: { pdf: 'true', pdfTimeout: '30000' },
      targetDir: path.resolve('test-output'),
    })).resolves.toBeUndefined();

    expect(errorSpy).toHaveBeenNthCalledWith(1, generationError);
    expect(errorSpy).toHaveBeenNthCalledWith(2, cleanupError);
    expect(browser.close).toHaveBeenCalledTimes(1);
    expect(infoSpy).not.toHaveBeenCalledWith('PDF generated!');
  });
});
