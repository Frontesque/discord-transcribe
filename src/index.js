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

require('./events/clientReady')(client);
require('./events/messageCreate')(client);

client.login('');