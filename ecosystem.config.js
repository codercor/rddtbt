module.exports = {
    apps: [
        {
            name: 'tweet-process',
            script: 'src/index.js',
            args: '--tweet',
        },
        {
            name: 'reply-process',
            script: 'src/index.js',
            args: '--reply',
        }
    ]
};