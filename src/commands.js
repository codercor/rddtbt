const {randomTime5or15Min, showCountDownOnTerminal} = require("./helpers");
const {generateMemeAndPublish} = require("./logics");
/**
 * - Share a meme by generating a meme and posting it.
 * @returns {Promise<void>}
 */

const shareMemePost = async () => {
    await generateMemeAndPublish();
    let time = randomTime5or15Min(); // 5-15 minutes in milliseconds
    await showCountDownOnTerminal(time);
    await shareMemePost();
};


module.exports = {shareMemePost};