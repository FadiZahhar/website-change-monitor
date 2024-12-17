const express = require('express');
const path = require('path');
const fs = require('fs');
const takeScreenshot = require('./monitor');
const compareImages = require('./compare');
const sendNotification = require('./mailer');

const app = express();
const PORT = process.env.PORT || 3000;

const URL_TO_MONITOR = process.env.URL_TO_MONITOR;
const STORAGE_PATH = path.join(__dirname, 'storage');

// Ensure the storage directory exists
if (!fs.existsSync(STORAGE_PATH)) fs.mkdirSync(STORAGE_PATH);

app.get('/monitor', async (req, res) => {
  const currentImage = path.join(STORAGE_PATH, 'current.png');
  const previousImage = path.join(STORAGE_PATH, 'previous.png');
  const diffImage = path.join(STORAGE_PATH, 'diff.png');

  try {
    // Take a new screenshot
    await takeScreenshot(URL_TO_MONITOR, currentImage);

    // Compare images if a previous screenshot exists
    if (fs.existsSync(previousImage)) {
      const numDiffPixels = await compareImages(previousImage, currentImage, diffImage);

      if (numDiffPixels > 0) {
        await sendNotification(`Change detected at ${URL_TO_MONITOR}`);
      }
    }

    // Replace previous with current
    fs.renameSync(currentImage, previousImage);
    res.send('Monitoring complete.');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error monitoring the website.');
  }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
