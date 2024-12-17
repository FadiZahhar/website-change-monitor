const puppeteer = require('puppeteer');
const { URL } = require('url');

const crawlWebsite = async (baseURL, onLog = () => {}) => {
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
      // Log the current page being crawled
      onLog(`Crawling: ${currentURL}`);

      // Load the page and wait for network activity
      await page.goto(currentURL, { waitUntil: 'networkidle2', timeout: 60000 });

      // Wait for the body to load (if applicable)
      try {
        await page.waitForSelector('body', { timeout: 10000 });
      } catch {
        onLog(`Warning: Body not fully loaded on ${currentURL}`);
      }

      // Manual delay for JavaScript execution (helps with dynamic content)
      await new Promise((resolve) => setTimeout(resolve, 3000)); // Wait 3 seconds

      // Mark the page as visited and add it to the results
      visited.add(currentURL);
      urls.push(currentURL);

      // Extract all internal links on the page
      const links = await page.$$eval('a', (anchorTags) =>
        anchorTags
          .map((a) => a.href)
          .filter((href) => href && href.trim() !== '' && !href.startsWith('#'))
      );

      // Convert relative links to absolute and filter internal links
      const absoluteLinks = links
        .map((link) => {
          try {
            return new URL(link, baseURL).href; // Convert to absolute URL
          } catch {
            return null; // Ignore invalid links
          }
        })
        .filter(
          (link) =>
            link &&
            new URL(link).origin === new URL(baseURL).origin &&
            !visited.has(link) &&
            !toVisit.includes(link)
        );

      // Add new links to the crawl queue
      toVisit.push(...absoluteLinks);

      // Log the number of new links found
      onLog(`Found ${absoluteLinks.length} new links on ${currentURL}`);
    } catch (error) {
      // Log errors encountered during crawling
      onLog(`Error crawling ${currentURL}: ${error.message}`);
    }
  }

  await browser.close();
  onLog(`Crawling complete. Found ${urls.length} unique URLs.`);
  return urls;
};

module.exports = crawlWebsite;
