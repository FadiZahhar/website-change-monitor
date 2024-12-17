const express = require('express');
const path = require('path');
const fs = require('fs');
const takeScreenshot = require('./monitor');
const compareImages = require('./compare');
const crawlWebsite = require('./crawler');

const app = express();
const PORT = process.env.PORT || 3000;

const URL_TO_MONITOR = process.env.URL_TO_MONITOR || 'https://example.com';
const STORAGE_PATH = path.join(__dirname, 'storage');

// Ensure the storage directory exists
if (!fs.existsSync(STORAGE_PATH)) fs.mkdirSync(STORAGE_PATH);

app.get('/monitor', async (req, res) => {
  try {
    console.log(`Starting crawl for ${URL_TO_MONITOR}...`);
    const urls = await crawlWebsite(URL_TO_MONITOR);
    console.log(`Crawled ${urls.length} URLs.`);

    const report = [];
    for (const [index, url] of urls.entries()) {
      console.log(`Processing (${index + 1}/${urls.length}): ${url}`);

      const urlSlug = url.replace(/[^a-zA-Z0-9]/g, '_'); // Sanitize URL for filenames
      const currentImage = path.join(STORAGE_PATH, `${urlSlug}_current.png`);
      const previousImage = path.join(STORAGE_PATH, `${urlSlug}_previous.png`);
      const diffImage = path.join(STORAGE_PATH, `${urlSlug}_diff.png`);

      try {
        // Take a new screenshot
        await takeScreenshot(url, currentImage);

        // Compare images if a previous screenshot exists
        if (fs.existsSync(previousImage)) {
          const numDiffPixels = await compareImages(previousImage, currentImage, diffImage);

          report.push({
            url,
            status: numDiffPixels > 0 ? 'Changes Detected' : 'No Changes',
            diffImage: numDiffPixels > 0 ? `/diff/${urlSlug}_diff.png` : null,
          });
        } else {
          report.push({
            url,
            status: 'Baseline Saved',
            diffImage: null,
          });
        }

        // Replace previous with current
        fs.renameSync(currentImage, previousImage);
      } catch (error) {
        console.error(`Error processing ${url}:`, error.message);
        report.push({ url, status: 'Error', error: error.message });
      }
    }

    // Return the report as JSON
    res.json({ summary: `Processed ${urls.length} URLs.`, report });
  } catch (error) {
    console.error('Error during monitoring:', error);
    res.status(500).send('Error monitoring the website.');
  }
});

// Serve diff images for visualization
app.use('/diff', express.static(STORAGE_PATH));

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
