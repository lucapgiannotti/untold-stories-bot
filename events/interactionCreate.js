const { EmbedBuilder, InteractionType } = require('discord.js');
const fs = require('fs');

let commandCount = 0;

// Load the command count from a file
if (fs.existsSync('commandCount.json')) {
    const data = fs.readFileSync('commandCount.json');
    commandCount = JSON.parse(data).count;
}

module.exports = (client, inter) => {
    if (inter.type === InteractionType.ApplicationCommand) {
        const command = client.commands.get(inter.commandName);

        if (!command) return inter.reply({ embeds: [ new EmbedBuilder().setColor('#ff0000').setDescription('❌ | Error! Please contact Developers! 🧰')], ephemeral: true, }), client.slash.delete(inter.commandName)
        if (command.permissions && !inter.member.permissions.has(command.permissions)) return inter.reply({ embeds: [ new EmbedBuilder().setColor('#ff0000').setDescription(`❌ | You do not have the proper permissions to execute this command`)], ephemeral: true, })

        commandCount++;
        fs.writeFileSync('commandCount.json', JSON.stringify({ count: commandCount }));
        command.execute({ inter, client });
    }
}

module.exports.commandCount = commandCount;