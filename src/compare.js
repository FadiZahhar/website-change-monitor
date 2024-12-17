const Jimp = require('jimp');

// Use an async wrapper for dynamic import
const loadPixelmatch = async () => {
  return (await import('pixelmatch')).default;
};

const compareImages = async (image1, image2, diffPath) => {
  const pixelmatch = await loadPixelmatch(); // Dynamically load pixelmatch

  const img1 = await Jimp.read(image1);
  const img2 = await Jimp.read(image2);

  const { width, height } = img1.bitmap;

  const diff = new Jimp(width, height);
  const numDiffPixels = pixelmatch(
    img1.bitmap.data,
    img2.bitmap.data,
    diff.bitmap.data,
    width,
    height,
    { threshold: 0.1 } // Change threshold as needed
  );

  await diff.writeAsync(diffPath);
  return numDiffPixels;
};

module.exports = compareImages;
