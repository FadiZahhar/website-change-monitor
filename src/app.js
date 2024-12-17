const express = require('express');
const path = require('path');
const fs = require('fs');
const takeScreenshot = require('./monitor');
const compareImages = require('./compare');
const crawlWebsite = require('./crawler');
const sendEmailReport = require('./mailer'); // Import the mailer function

const app = express();
const PORT = process.env.PORT || 3000;

const STORAGE_PATH = path.join(__dirname, 'storage');
if (!fs.existsSync(STORAGE_PATH)) fs.mkdirSync(STORAGE_PATH);

app.use(express.static(path.join(__dirname, 'public')));

app.get('/monitor-sse', async (req, res) => {
  const rootUrl = req.query.rootUrl;

  if (!rootUrl) {
    return res.status(400).send('Root URL is required.');
  }

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  const sendEvent = (event, data) => res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);

  try {
    sendEvent('message', { message: `Starting crawl for ${rootUrl}...` });
    console.log(`Starting crawl for ${rootUrl}...`);

    const urls = await crawlWebsite(rootUrl, (log) => sendEvent('log', { message: log }));
    sendEvent('message', { message: `Crawled ${urls.length} URLs.` });

    const reportDetails = [];
    const totalUrls = urls.length;

    for (const [index, url] of urls.entries()) {
      const progress = Math.round(((index + 1) / totalUrls) * 100);
      sendEvent('progress', { progress, message: `Processing (${index + 1}/${totalUrls}): ${url}` });

      const urlSlug = url.replace(/[^a-zA-Z0-9]/g, '_');
      const currentImage = path.join(STORAGE_PATH, `${urlSlug}_current.png`);
      const previousImage = path.join(STORAGE_PATH, `${urlSlug}_previous.png`);
      const diffImage = path.join(STORAGE_PATH, `${urlSlug}_diff.png`);

      try {
        sendEvent('log', { message: `Taking screenshot for ${url}` });
        await takeScreenshot(url, currentImage);

        let status = 'Baseline Saved';
        let diffImagePath = null;

        if (fs.existsSync(previousImage)) {
          sendEvent('log', { message: `Comparing images for ${url}` });
          const numDiffPixels = await compareImages(previousImage, currentImage, diffImage);

          if (numDiffPixels > 0) {
            status = `Changes Detected (${numDiffPixels} pixels different)`;
            diffImagePath = `/diff/${urlSlug}_diff.png`;
          } else {
            status = 'No Changes';
          }

          reportDetails.push({
            url,
            status,
            diffImage: diffImagePath,
          });

          sendEvent('compare', { url, status, diffImage: diffImagePath });
        } else {
          reportDetails.push({ url, status, diffImage: null });
          sendEvent('log', { message: `Baseline image saved for ${url}` });
        }

        fs.renameSync(currentImage, previousImage);
      } catch (error) {
        reportDetails.push({ url, status: 'Error', error: error.message });
        sendEvent('error', { message: `Error processing ${url}: ${error.message}` });
      }
    }

    // Construct the final report
    const report = {
      summary: `Processed ${urls.length} URLs for ${rootUrl}.`,
      details: reportDetails,
    };

    // Send the email report
    const subject = 'Website Monitoring Report';
    const text = `Website Monitoring Report\n\nSummary: ${report.summary}\n\nDetails:\n` +
      report.details
        .map((item) => `${item.url}\nStatus: ${item.status}${item.diffImage ? `\nDiff Image: ${item.diffImage}` : ''}`)
        .join('\n\n');

    const html = `
      <h2>Website Monitoring Report</h2>
      <p><strong>Summary:</strong> ${report.summary}</p>
      <ul>
        ${report.details
          .map(
            (item) => `
              <li>
                <strong>URL:</strong> ${item.url}<br>
                <strong>Status:</strong> ${item.status}<br>
                ${
                  item.diffImage
                    ? `<strong>Diff Image:</strong> <a href="${item.diffImage}" target="_blank">View Image</a>`
                    : ''
                }
              </li>
            `
          )
          .join('')}
      </ul>
    `;

    await sendEmailReport(subject, report);
    sendEvent('complete', { message: 'Monitoring Complete.', report });
    res.end();
  } catch (error) {
    console.error('Error during monitoring:', error.message);
    sendEvent('error', { message: `Error during monitoring process: ${error.message}` });
    res.end();
  }
});

app.use('/diff', express.static(STORAGE_PATH));

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
