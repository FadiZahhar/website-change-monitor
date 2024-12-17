const puppeteer = require('puppeteer');

const takeScreenshot = async (url, outputPath) => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'networkidle2' });
  await page.screenshot({ path: outputPath, fullPage: true });
  await browser.close();
};

module.exports = takeScreenshot;
