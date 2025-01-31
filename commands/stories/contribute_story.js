const { getUserSession, addStoryContribution } = require('../../src/sessions');
const { OpenAI } = require('openai');

module.exports = {
    name: 'contribute_story',
    description: "Contribute to the ongoing story",
    options: [
        {
            name: 'contribution',
            type: 3,
            description: 'Your contribution to the story',
            required: true
        }
    ],
    async execute({client, inter}) {
        await inter.deferReply();
        const userContribution = inter.options.getString('contribution');
        const userId = inter.user.id;
        const guildId = inter.guild.id;
        const userSession = await getUserSession(guildId);
        if (userSession.story.length === 0) {
            return inter.editReply("You don't have an ongoing story session. Start one using `/start`.");
        }
        if (!userSession.characters[userId]) {
            return inter.editReply("You don't have any characters. Create one using `/create_character`.");
        }
        if (userContribution.length > 2048) {
            return inter.editReply("Your contribution is too long. Please keep it under 2048 characters.");
        }
        
        const openai = new OpenAI({
            apiKey: process.env.API_KEY,
        });

        await addStoryContribution(userId, { role: "user", content: `${userContribution}\nCharacter: ${userSession.characters[userId]}` });

        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: userSession.story,
            temperature: 1,
            max_tokens: 2048,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0
        });

        const botContribution = response.choices[0].message.content;
        await addStoryContribution(guildId, { role: "assistant", content: botContribution }, userId);
        inter.editReply(botContribution);
    },
};