const {getChatGPTResponse} = require("../chatgpt");
const {terminal: term} = require("terminal-kit");
const {createMeme} = require("../imgflip");
const path = require("path");
const {downloadMeme} = require("../helpers");
const puppeteer = require("puppeteer");
const {tryAuthenticateWithCookieReddit, publishWithImageOnReddit} = require("../reddit");
const {addWatermark} = require("../watermark");

/**
 * - Share a meme by generating a meme and tweeting it.
 *  @returns {Promise<void>}
 */

const generateMemeAndPublish = async () => {
    try {
        /*
        // Step 1: Get a meme idea from ChatGPT
        const memePrompt =
            "Give me a funny idea for a meme. It can be a joke, a pun, or a funny situation." +
            'This idea should be available for all people. You can use a little bit dark humor. Give me only the idea. And dont use "';
        const memeIdea = await getChatGPTResponse(memePrompt);
        //console.log("ChatGPT Meme Idea:", memeIdea);
        term.blue("ChatGPT Meme Idea: %s\n", memeIdea);

        // Step 2: Generate a meme using Imgflip API
        const memeData = await createMeme(
            process.env.IMGFLIP_USERNAME,
            process.env.IMGFLIP_PASSWORD,
            "openai", // Model
            undefined, // Template ID
            memeIdea, // Prefix Text
            true // Remove watermark
        );
        term.gray("Meme Data: %s\n", memeData);

        const memeUrl = memeData.url;
        term.green("Generated Meme URL: %s\n", memeUrl);

        // Step 3: Download the meme image
        const memePath = path.join(
            __dirname,
            "..",
            "generated_meme" + Date.now() + ".png"
        );
        await downloadMeme(memeUrl, memePath);

        // Step 4: Get a tweet suggestion from ChatGPT
        const postTextPrompt = `
    You suggested a meme idea: "${memeIdea}".
    Here is a meme image that other ai created:
     ${memeUrl}. Suggest a creative tweet to post with this meme.
     And give me the title content for Reddit. you can use only hastag '#meme'. But as I said before only tweet content is enough. 
     And exactly don't use another hashtags except '#zupdogillion #meme' only use these hashtags.
     `;
        const tweetText = await getChatGPTResponse(postTextPrompt);
        term.blue("ChatGPT Reddit Title Content: %s\n", tweetText);
       */

        const browser = await puppeteer.launch({
            headless: false,
            'args': [
                '--no-sandbox',
                '--disable-setuid-sandbox'
            ]
        });
        const page = await browser.newPage();
        await tryAuthenticateWithCookieReddit(page);
        /*
              const watermarkPath = path.join(
                  __dirname,
                  "..",
                  "..",
                  "zupdogillion_watermark.png"
              );
              const finalMemePath = watermarkPath.replace(".png", "_final.png");
              await addWatermark(memePath, watermarkPath, finalMemePath, {
                  left: 10,
                  top: 10,
              });
              await publishWithImageOnReddit(page, tweetText, finalMemePath);
              await page.waitForResponse((response) =>
                  response.url().includes("CreateTweet")
              );
              term.green("Tweet successfully posted!\n");

         */
    } catch (error) {
        term.red("An error occurred: %s\n", error);
    }
};

module.exports = {generateMemeAndPublish};