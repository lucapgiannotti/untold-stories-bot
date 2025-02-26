const { Client, GatewayIntentBits } = require('discord.js');

global.client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.MessageContent
    ],
    disableMentions: 'everyone',
});


client.config = require('./config');

require('./src/loader');
require('./src/events');
console.log(client.channels.cache.size);

client.login(client.config.app.token).then(r => console.log('Logged in!')).catch(console.error);