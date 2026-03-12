const { Client, GatewayIntentBits } = require('discord.js');

// 1. Initialize Client with necessary Intents
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates,
    ],
});

if (!process.env.SCRIPTY_MODEL) {
    console.log("[SCRIPTY:INIT]    No model specified. Please set the SCRIPTY_MODEL environment variable.");
    console.log("[SCRIPTY:INIT]    Exiting.");
    return;
} else {
    console.log (`[SCRIPTY:INIT]    Loading model: ggml-${process.env.SCRIPTY_MODEL}.bin`);
}

require('./events/clientReady')(client);
require('./events/messageCreate')(client);

client.login('');