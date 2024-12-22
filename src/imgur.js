const fs = require("fs");
const axios = require("axios");
require("dotenv").config();

const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID;

async function uploadImage(imagePath) {
  try {
    const image = fs.readFileSync(imagePath, { encoding: "base64" });

    const response = await axios.post(
      "https://api.imgur.com/3/image",
      { image, type: "base64" }, // Görseli base64 formatında gönderiyoruz
      {
        headers: {
          Authorization: `Client-ID ${IMGUR_CLIENT_ID}`,
        },
      }
    );

    if (response.data.success) {
      console.log("Görsel yüklendi:", response.data.data.link);
      return response.data.data.link; // Görsel URL'si
    } else {
      throw new Error("Görsel yükleme başarısız oldu.");
    }
  } catch (error) {
    console.error("Hata:", error.message);
  }
}

module.exports = {
  uploadImage,
};
