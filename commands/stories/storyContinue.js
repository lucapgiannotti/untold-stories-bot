const { getUserSession, updateUserSession, deleteUserSession} = require('../../src/sessions');
const { MessageCollector } = require('discord.js');

module.exports = async function storyContinue({client, inter}, user_message, channel_id) {
    const { OpenAI } = require('openai');
    const openai = new OpenAI({
        apiKey: process.env.API_KEY,
    });

    // Retrieve the user's previous session data
    const userId = inter.user.id;
    const userSession = getUserSession(userId);
    const channel = client.channels.cache.get(channel_id);


        // Add the user's message to the session
    updateUserSession(userId, "user", [{ type: "text", text: user_message }]);

    // Generate the assistant's response
    const response = await openai.chat.completions.create({
        model: "o4-mini",
        messages: userSession.messages,
        response_format: {
            "type": "text"
        },
        temperature: 1,
        max_completion_tokens: 2048,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0
    });

    let bot_message = response.choices[0].message.content;
    channel.send(bot_message);
    
    // Update the user's session data with the assistant's response
    updateUserSession(userId, "assistant", response.choices[0].message.content);
    // Set up a message collector to wait for the next message from the user
    const filter = m => m.author.id === inter.user.id && m.channel.id === inter.channel.id;
    const collector = new MessageCollector(inter.channel, { filter, max: 1, time: 60000 });

    collector.on('collect', async (message) => {
        let user_message = message.content;
        const messageChannelId = message.channel.id;
        if (user_message.toLowerCase() === "exit") {
            message.reply(`**${message.author.displayName}**, you have exited the text adventure. Your session has been cleared.`);
            deleteUserSession(userId);
            return;
        }
        await storyContinue({client, inter}, user_message, messageChannelId);

    });
};