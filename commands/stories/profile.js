const { getUserSession } = require('../../src/sessions');
const Discord = require('discord.js');


module.exports = {
    name: 'profile',
    description: "View your profile",
    async execute({ client, inter }) {
        await inter.deferReply();
        const userId = inter.user.id;
        const guildId = inter.guild.id;
        const userSession = await getUserSession(guildId);
        if (!userSession.characters[userId]) {
            return inter.editReply("You don't have any characters. Create one using `/create_character`.");
        }
        const character = userSession.characters[userId];
        const embed = new Discord.EmbedBuilder()
            .setColor(0xE67F1A)
            .setAuthor({ name: inter.user.username + " ~ profile", iconURL: inter.user.avatarURL({ dynamic: true }) })
            .addFields(
                { name: 'Name', value: character.name },
                { name: 'Role', value: character.role },
                // { name: 'Abilities', value: character.abilities || 'None' },
                { name: 'Story Contributions', value: character.contributions.toString() }
            )
            .setTimestamp();
        inter.editReply({ embeds: [embed]});
    },
};
