const { OpenAI } = require('openai');
require('dotenv').config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Fetches a response from ChatGPT (GPT-4) for a given prompt.
 *
 * @param {string} prompt - The prompt to send to ChatGPT.
 * @param {number} maxTokens - Maximum number of tokens for the response.
 * @returns {Promise<string>} The response from ChatGPT.
 */
const getChatGPTResponse = async (prompt, maxTokens = 100) => {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: maxTokens,
    });

    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error('Error while requesting ChatGPT API:', error.message);
    throw error;
  }
};

module.exports = {
  getChatGPTResponse,
};
