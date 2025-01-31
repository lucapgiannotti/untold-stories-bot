const { getUserSession, updateUserSession } = require('../../src/sessions');
const {ApplicationCommandOptionType} = require("discord.js");

module.exports = {
    name: 'create_character',
    description: "Create a character for the story",
    options: [
        {
        name: "name",
        type: ApplicationCommandOptionType.String,
        description: "The name of your character",
        required: true
    },
    {   
        name: "role",
        type: ApplicationCommandOptionType.String,
        description: "The role of your character",
        required: true
    },
    {
        name: "abilities",
        type: ApplicationCommandOptionType.String,
        description: "The abilities of your character",
        required: false
    },
    ],
    async execute({client, inter}, characterName) {
        const userId = inter.user.id;
        const guildId = inter.guild.id;
        const userSession = getUserSession(guildId);
        try {
            if (userSession.characters[userId]) {
                return inter.reply("You already have a character. Delete it using `/delete_character (WIP)`.");
            }
        } catch (error) {
            console.error(error);
        }
        userSession.characters[characterName] = { name: characterName, id: userId, role: characterRole, abilities: characterAbilities, contributions: 0 };
        await updateUserSession(userId, 'characters', userSession.characters);
        inter.reply(`Character ${characterName} created successfully!`);
    },
};