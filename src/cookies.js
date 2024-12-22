const fs = require("fs");

module.exports = {
  /**
   * Load cookies into the page.
   * @param {import('puppeteer').Page} page - The Puppeteer page object.
   * @param {string} cookiesPath - The path to the cookies file.
   */
  loadCookies: (page, cookiesPath) => {
    if (fs.existsSync(cookiesPath)) {
      const cookies = JSON.parse(fs.readFileSync(cookiesPath, "utf-8"));
      return page.setCookie(...cookies);
    }
  },
  /**
   * Save cookies from the page.
   * @param {import('puppeteer').Page} page - The Puppeteer page object.
   * @param {string} cookiesPath - The path to the cookies file.
   */
  saveCookies: async (page, cookiesPath) => {
    const cookies = await page.cookies();
    fs.writeFileSync(cookiesPath, JSON.stringify(cookies, null, 2));
  },
};
