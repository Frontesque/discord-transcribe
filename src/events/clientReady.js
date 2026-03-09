module.exports = (client) => {
    client.on('clientReady', () => {
        console.log(`Logged in as ${client.user.tag}!`);
    });
}