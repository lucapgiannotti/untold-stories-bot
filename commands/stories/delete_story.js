const {getUserSession, updateUserSession} = require('../../src/sessions');
const { PermissionFlagsBits } = require('discord.js');

module.exports = {
    name: 'delete_story',
    description: "Delete the current story",
    setDefaultMemberPermissions: PermissionFlagsBits.BanMembers,
    async execute({client, inter}) {
        if (inter.user.permissions.has('ADMINISTRATOR')) {
            const guildId = inter.guild.id;
            const userSession = await getUserSession(guildId);
            userSession.story = [];
            userSession.characters = {};
            userSession.summary = "";
            await updateUserSession(guildId, 'story', userSession.story);
            await updateUserSession(guildId, 'characters', userSession.characters);
            await updateUserSession(guildId, 'summary', userSession.summary);
            await updateUserSession(guildId, 'story', userSession.story);
            inter.reply("Story deleted successfully!");
        }
        else {
            inter.reply("You don't have permission to delete the story.");
        }
    },
}