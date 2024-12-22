const axios = require("axios");
const FormData = require("form-data");
require("dotenv").config();
/**
 * Creates a meme using the Imgflip AI Meme API.
 *
 * @param {string} username - Imgflip Premium API username.
 * @param {string} password - Imgflip Premium API password.
 * @param {string} model - Model to use ("openai" or "classic").
 * @param {string} template_id - Meme template ID.
 * @param {string} prefix_text - Initial text for the meme.
 * @param {boolean} no_watermark - Whether to remove the watermark.
 * @returns {Promise<object>} Meme response data.
 */
const createMeme = async (
  username,
  password,
  model,
  template_id,
  prefix_text,
  no_watermark = false
) => {
  const API_URL = "https://api.imgflip.com/ai_meme";
  console.log("createMeme is initializing...");
  // Create FormData instance
  const formData = new FormData();
  formData.append("username", username);
  formData.append("password", password);
  formData.append("model", model);
  formData.append("prefix_text", prefix_text);
  formData.append("no_watermark", no_watermark ? "true" : "false");
  const jsonData = JSON.stringify({
    username: username,
    password: password,
    model: model,
    template_id: template_id,
    prefix_text: prefix_text,
    no_watermark: no_watermark,
  });
  try {
    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://api.imgflip.com/ai_meme",
      headers: {
        Cookie: `claim_key=${process.env.IMGFLIP_CLAIM_KEY}`,
        ...formData.getHeaders(),
      },
      data: formData.getBuffer(),
    };

    const response = await axios.request(config);
    if (response.data.success) {
      console.log("Meme created successfully:", response.data.data.url);
      return response.data.data;
    } else {
      console.error("Error creating meme:", response.data.error_message);
      throw new Error(response.data.error_message);
    }
  } catch (error) {
    console.error("Error during API request:", error);
    throw error;
  }
};

module.exports = {
  createMeme,
};
