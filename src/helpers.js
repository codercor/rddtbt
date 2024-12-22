const axios = require("axios");
const fs = require("fs");
const term = require("terminal-kit").terminal;
module.exports = {
    /**
     *  Clicks the button with the specified text.
     *
     * @param {Page} page - puppeteer page object
     * @param {string} text -  text of the button
     */
    clickButtonByInnerText: async (page, text) => {
        term.green(`Clicking button with text: ${text}\n`);
        const button = await page.waitForSelector(
            `span[text()="${text}"]`
        );
        if (button) {
            await button.click();
        //    await button.click();
        } else {
            throw new Error("Button not found");
        }
    },
    /**
     *  Downloads the image from the specified url and saves it to the file path.
     *
     * @param {string} url - url address of the image
     * @param {string} filePath - file path to save the image
     */
    downloadMeme: async (url, filePath) => {
        try {
            const response = await axios.get(url, {responseType: "arraybuffer"});
            fs.writeFileSync(filePath, response.data);
            term.green(`Meme downloaded successfully: ${filePath}\n`);
        } catch (error) {

            term.red("An error occurred while downloading the meme\n");
            throw error;
        }
    },
    /**
     *  Waits for the specified time in milliseconds.
     *
     * @returns {number} - random time between 5 and 15 minutes in milliseconds
     */
    randomTime5or15Min: () => {
        return Math.floor(Math.random() * Math.floor(Math.random() * 2) === 0 ? 5 * 60 * 1000 : 15 * 60 * 1000);
    },

    /**
     * Shows the countdown on the terminal.
     * @param {number} time - time in milliseconds
     */

     showCountDownOnTerminal: async (ms) => {
        const endTime = Date.now() + ms;

        term.hideCursor(); // Terminal imlecini gizle
        term("\nCountdown: "); // Başlık yazdır

        while (Date.now() < endTime) {
            const remainingTime = endTime - Date.now();
            const hours = Math.floor(remainingTime / 3600000);
            const minutes = Math.floor((remainingTime % 3600000) / 60000);
            const seconds = Math.floor((remainingTime % 60000) / 1000);

            // Zaman formatını oluştur
            const timeString = `${hours.toString().padStart(2, "0")}:${minutes
                .toString()
                .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

            // Geri sayımı yazdır
            term("\rCountdown: %s", timeString); // Aynı satıra yazdır
            await new Promise((resolve) => setTimeout(resolve, 1000)); // 1 saniye bekle
        }

        // Geri sayım bittiğinde mesaj yaz
        term("\rCountdown: 00:00:00\n");
        term.green("Time's up!\n");
        // term.showCursor(); // İmleci tekrar göster
    }
}
;
