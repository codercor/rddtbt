const {clickButtonByInnerText} = require("./helpers");
const path = require("path");
const fs = require("fs");
const config = require("./config");
const term = require("terminal-kit").terminal;
const puppeteer = require("puppeteer");
require("dotenv").config();

/**
 *  Checks if the user is logged in to Reddit.
 * @param {puppeteer.Page} page - The puppeteer page object.
 * @returns {Promise<boolean>} - True if the user is logged in, false otherwise.
 * @throws {Error} If an error occurs during the login check.
 */

const isLoggedIn = async (page) => {
    try {
       const result = await page.evaluate(() =>
            Array.from(document.querySelectorAll('*')).find(element =>
                element.innerText?.trim() === 'Log In'
            )
        );
        console.log('IsLOGGEDIN res', result);
        return !!!result;
    } catch (e) {
        return false;
    }
};

/**
 *  Loads the cookies from the file and tries to authenticate with Reddit.
 * @param {puppeteer.Page} page - The puppeteer page object.
 * @returns {Promise<void>}
 */

const tryAuthenticateWithCookieReddit = async (page) => {
    term.gray("Trying to authenticate with cookies...\n");
    if (fs.existsSync(config.COOKIES_PATH)) {
        term.yellow("Cookies file found.\n");
        try {
            term.gray("Loading cookies...\n");
            const cookies = JSON.parse(fs.readFileSync(config.COOKIES_PATH, "utf-8"))
            await page.setCookie(...cookies);
            term.green("Cookies loaded.\n").bold();
        } catch (e) {
            //console.error("An error occurred while loading cookies:", e);
            term.red("An error occurred while loading cookies: %s\n", e);
        }
    }
    term.gray("Navigating to Reddit...\n");
    await page.goto(config.REDDIT_URL, {waitUntil: "networkidle2"});

    if (await isLoggedIn(page)) {
        //console.log("Already logged in.");
        term.green("Already logged in.\n");
    } else {
        await page.goto(config.REDDIT_URL+'/login', {waitUntil: "networkidle2"});
        // console.log("Not logged in, logging in now.");
        term.brightRed("Not logged in, logging in now.\n");
        await loginToReddit(page);
        // Login sonrası cookie'leri kaydet
        const cookies = await page.cookies();
        fs.writeFileSync(config.COOKIES_PATH, JSON.stringify(cookies, null, 2));
        //console.log("Cookies saved.");
        term.green("Cookies saved.\n");
    }
};

/**
 * Logs in to Reddit with the specified username and password.
 * @param {puppeteer.Page} page - The puppeteer page object.
 * @returns {Promise<void>}
 * @throws {Error} If an error occurs during the login process.
 */
const loginToReddit = async (page) => {
    const username = process.env.REDDIT_USERNAME;
    const password = process.env.REDDIT_PASSWORD;
    term.green("Logging in to Reddit with username: %s\n", username);
    // select the username input field
    await page.waitForSelector('input[name="username"]',);
    term.green("Username input field found.\n");
    await page.type('input[type="text"]', username);
    term.green("Username typed.\n");
    // Click Next
    // Wait for password input
    await page.waitForSelector('input[type="password"]', {
        timeout: 5000,
    });
    term.green("Password input field found.\n");
    await page.type('input[type="password"]', password);
    term.green("Password typed.\n");
    await new Promise((resolve) => setTimeout(resolve, 2000));
    await page.waitForSelector('& >>> button.login.button-large.button-brand', { timeout: 5000,

    });
    term.green("Login button found.\n");
    await page.click('& >>> button.login.button-large.button-brand');
    term.green("Login button clicked.\n");
    // wait for the login to complete
    await page.waitForNavigation({waitUntil: "networkidle2"});
    term.green("Navigation completed.\n");
};

/**
 *  Tweets with an image.
 *  @param {puppeteer.Page} page - The puppeteer page object.
 * @param {string} text - The tweet text.
 * @param {string} imagePath - The path to the image file.
 */
const publishWithImageOnReddit = async (page, text, imagePath) => {
    try {
        term.bold.cyan("TweetWithImage is initializing...\n");
        const photoPath = imagePath;
        term.green("Image path is found: %s\n", photoPath);
        term.yellow("Image select button is waiting...\n");

        const imageSelectButton = await page.waitForSelector(
            'button[aria-label="Add photos or video"]',
            {
                timeout: 50000,
            }
        );

        term.green("Image select button ready to click...\n");
        await imageSelectButton.click({delay: 1000});
        term.green("Image select button clicked.\n");

        term.yellow("fileChooser is waiting...\n");
        const [fileChooser] = await Promise.all([
            page.waitForFileChooser(),
            page.click('button[aria-label="Add photos or video"]', {delay: 1000}),
        ]);

        term.green("fileChooser is ready to accept photoPath...\n");
        await fileChooser.accept([photoPath]);

        term.green("Photo is selected.\n");

        term.yellow("Editor is waiting...\n");
        const editor = await page.waitForSelector(
            `::-p-xpath(//*[@id="react-root"]/div/div/div[2]/main/div/div/div/div[1]/div/div[3]/div/div[2]/div[1]/div/div/div/div[2]/div[1])`
        );
        term.green("Editor is ready to click...\n");
        await editor.click({delay: 5000});
        term.green("Editor is clicked. Ready to type text...\n");
        await editor.type(text);
        term.green("Tweet text is typed. Waiting for publish button...\n");
        await clickButtonByInnerText(page, "Post");
        await clickButtonByInnerText(page, "Post");

        term.green.bold("Publish button is clicked.\n");
    } catch (error) {
        term.red.bold("An error occurred while tweeting with image: %s\n", error);
    }
};

module.exports = {
    tryAuthenticateWithCookieReddit,
    publishWithImageOnReddit,
    isLoggedIn,
    loginToReddit
};
