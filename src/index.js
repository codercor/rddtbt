const {shareMemePost} = require("./commands");
const term = require("terminal-kit").terminal;

require("dotenv").config();

const main = async () => {
    term.clear();
    term.cyan("Welcome REDDIT Meme Sharing Bot!\n");
    const menuItems = [
        "Start sharing memes for reddit",
        "Exit"];
    term.on("key", function (name, matches, data) {
        if (name === "CTRL_C") {
            term.red("Exiting the bot...\n");
            term.processExit();
        }
    });

    term.singleColumnMenu(menuItems, (error, response) => {
        switch (response.selectedIndex) {
            case 0:
                shareMemePost();
                break;
        }
    });

};


const mainArgs = async () => {
    const args = process.argv.slice(2);
    if (args.includes("--profile")) {
        shareMemePost();
    } else {
        main();
    }
}

mainArgs();


