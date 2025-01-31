const { getStorySummary } = require('../../src/sessions');

module.exports = {
    name: 'get_summary',
    description: "Get the summary of the story so far",
    async execute({client, inter}) {
        const userId = inter.user.id;
        const summary = getStorySummary(userId);
        inter.reply(`Story Summary:\n${summary}`);
    },
};