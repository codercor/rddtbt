const sharp = require("sharp");

/**
 * Adds a watermark with 50% opacity to an image at a specified position.
 *
 * @param {string} imagePath - Path to the original image.
 * @param {string} watermarkPath - Path to the watermark image.
 * @param {string} outputPath - Path to save the watermarked image.
 * @param {object} position - Position of the watermark (e.g., { left: 100, top: 50 }).
 * @returns {Promise<void>}
 */
const addWatermark = async (
  imagePath,
  watermarkPath,
  outputPath,
  position = { left: 0, top: 0 }
) => {
  try {
    console.log({
        watermarkPath,
        imagePath,
        outputPath,
        position
    });
    
    // Load watermark and set opacity
    const watermark = await sharp(watermarkPath)
      .ensureAlpha() // Ensures the image has an alpha channel
      .modulate({ brightness: 1, opacity: 0.8 }) // Reduces opacity to 50%
      // size should be 10% of the original image
      .resize({ width: 60, height: 60 })
      .toBuffer();

    // Composite watermark on the original image
    await sharp(imagePath)
      .composite([
        {
          input: watermark,
          top: position.top,
          left: position.left,
          blend: "multiply",
        },
      ])
      .toFile(outputPath);

    console.log("Watermark added successfully:", outputPath);
  } catch (error) {
    console.error("Error adding watermark:", error.message);
    throw error;
  }
};

module.exports = {
  addWatermark,
};
