module.exports = (client) => {
    client.on('clientReady', () => {
        console.log(`[SCRIPTY:INIT]    Logged in as ${client.user.tag}!`);
    });
}