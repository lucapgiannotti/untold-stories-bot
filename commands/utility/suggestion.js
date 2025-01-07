const Discord = require('discord.js');
const { ApplicationCommandOptionType } = require('discord.js');

module.exports = {
    name: 'suggestion',
    description: "Suggest a feature or report a bug to the developers!",
    options: [
        {
            name: 'suggestion',
            type: ApplicationCommandOptionType.String,
            description: 'The suggestion or bug report you want to send to the developers!',
            required: true
        }
    ],
    async execute({ client, inter }) {
        const suggestion = inter.options.getString('suggestion');
        const developer = await client.users.fetch('331831222064119819')
        const embed = new Discord.EmbedBuilder()
            .setAuthor({ name: inter.user.username + " ~ suggestion", iconURL: inter.user.avatarURL({ dynamic: true })})
            .setColor('#E67F1A')
            .setDescription(`**Suggestion:** ${suggestion}`)
            .setTimestamp()
        developer.send({ embeds: [embed]});
        inter.reply({ content: "Your suggestion has been sent to the developers via DM!"})
    },
};