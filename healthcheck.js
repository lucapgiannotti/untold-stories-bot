#!/usr/bin/env node

// Simple health check script for Docker
const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({
    intents: [GatewayIntentBits.Guilds]
});

// Check if the bot can authenticate
client.login(process.env.TOKEN)
    .then(() => {
        console.log('Health check passed - Bot can authenticate');
        process.exit(0);
    })
    .catch((error) => {
        console.error('Health check failed:', error.message);
        process.exit(1);
    });

// Timeout after 10 seconds
setTimeout(() => {
    console.error('Health check timed out');
    process.exit(1);
}, 10000);
