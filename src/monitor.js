const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const takeScreenshot = async (url, outputPath) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto(url, { waitUntil: 'networkidle2' });
  await page.screenshot({ path: outputPath, fullPage: true });

  await browser.close();
};

module.exports = takeScreenshot;
