const puppeteer = require('puppeteer');
const { URL } = require('url');

const crawlWebsite = async (baseURL) => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();

  // Set a realistic User-Agent to avoid bot detection
  await page.setUserAgent(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36'
  );

  const visited = new Set();
  const toVisit = [baseURL];
  const urls = [];

  while (toVisit.length > 0) {
    const currentURL = toVisit.pop();

    if (visited.has(currentURL)) continue;

    try {
      console.log(`Crawling: ${currentURL}`);
      
      // Load the page and wait for network activity
      await page.goto(currentURL, { waitUntil: 'networkidle0', timeout: 60000 });

      // Wait for key elements to appear (customize based on the website)
      try {
        await page.waitForSelector('body', { timeout: 10000 });
      } catch {
        console.warn(`Body not fully loaded on ${currentURL}`);
      }

      // Manual delay for JavaScript execution
      await new Promise((resolve) => setTimeout(resolve, 5000)); // Replaces page.waitForTimeout

      visited.add(currentURL);
      urls.push(currentURL);

      // Extract internal links
      const links = await page.$$eval('a', (anchorTags) =>
        anchorTags
          .map((a) => a.href)
          .filter((href) => href && href.trim() !== '' && !href.startsWith('#'))
      );

      const absoluteLinks = links
        .map((link) => {
          try {
            return new URL(link, baseURL).href; // Convert to absolute URL
          } catch (err) {
            return null;
          }
        })
        .filter(
          (link) =>
            link &&
            new URL(link).origin === new URL(baseURL).origin &&
            !visited.has(link) &&
            !toVisit.includes(link)
        );

      toVisit.push(...absoluteLinks);

      console.log(`Found ${absoluteLinks.length} new links on ${currentURL}`);
    } catch (error) {
      console.warn(`Failed to crawl ${currentURL}: ${error.message}`);
    }
  }

  await browser.close();
  return urls;
};

module.exports = crawlWebsite;
