require('dotenv').config();
const storyContinue = require('./storyContinue');
const { ApplicationCommandOptionType } = require('discord.js');
const { updateUserSession, getUserSession } = require('../../src/sessions');
const { OpenAI } = require('openai');

module.exports = {
    name: 'start',
    description: "Start your text adventure!",
    options: [
        {
            name: 'worldname',
            type: ApplicationCommandOptionType.String,
            description: "The name of the world you want to create",
            required: true
        },
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
        {
            name: "customization",
            type: ApplicationCommandOptionType.String,
            description: "Any additional information about the world",
            required: false
        }
    ],
    async execute({ client, inter }) {
        const userId = inter.user.id;
        const guildId = inter.guild.id;
        const userSession = await getUserSession(guildId);
        if (userSession.story.length > 0) {
            inter.reply("You already have an ongoing story session. Contribute to this one, or ask your server administrators to start a new story.");
            return;
        }

        inter.reply("Starting your new server-wide text adventure...");

        const openai = new OpenAI({
            apiKey: process.env.API_KEY,
        });

        const response = await openai.chat.completions.create({
            model: "o4-mini",
            messages: [
                {
                    role: "system",
                    content: [
                        {
                            type: "text",
                            text: "Create a collaborative, real-time story by integrating user contributions in a manner similar to a text adventure or Dungeons and Dragons (DND), without the use of dice rolls. Implement features such as character creation, branching storylines, and plot summaries.\n\nAll user inputs should be woven into an overarching plot, with some actions being unsuccessful to maintain dynamic storytelling. Allow new characters to join at later times by providing a character template that adds them to the story without altering the existing narrative significantly.\n\n# Steps\n\n1. **Character Creation:** \n   - Allow users to create characters by providing a template with attributes such as name, role, and unique abilities.\n   - Incorporate new characters seamlessly into the story without drastically altering ongoing events.\n\n2. **Branching Storylines:**\n   - Develop multiple narrative paths based on user contributions and decisions.\n   - Ensure each story thread retains continuity and plausibility, with key plot points leading to various outcomes.\n   \n3. **Plot Summaries:**\n   - Generate concise summaries after significant plot developments to keep participants informed.\n   - Highlight character actions, successes, failures, and impacts on the storyline.\n\n4. **Integration of User Inputs:**\n   - Merge user actions into the narrative, whether successful or unsuccessful, and adjust the story accordingly.\n   - Balance user control and AI generation to create a coherent plot.\n\n# Output Format\n\n- Story narratives should be concise, engaging, and provide clear next steps.\n- Character creation forms should follow a structured template.\n- Plot summaries should be short paragraphs encapsulating recent developments.\n\n# Examples\n\n**Character Creation Template:**\n- `{ \"name\": \"[Character Name]\", \"role\": \"[Role]\", \"abilities\": \"[Unique Abilities]\" }`\n\n**Story Addition Example:**\n- User input: \"My character steps forward to negotiate with the dragon.\"\n- AI response: \"As [Character Name] approaches the dragon, its eyes glimmer with curiosity. Despite a noble attempt, the dragon remains unconvinced of any truce.\"\n\n**Plot Summary Example:**\n- \"After several attempts, the adventurers have reached the dragon's lair. [Character Name]'s negotiation attempt paused hostilities, but the dragon remains skeptical.\"\n\n# Notes\n\n- Ensure character interactions reflect individual traits and story setting.\n- Maintain a balance between guided plot development and improvisational elements contributed by users.\n- Consider limiting the number of characters and inputs per session to maintain story coherence.\n-Do not copy the examples. Create something unique.\nYour responses should only include the events from a character's action. Do not include anything other than this. Do not include a summary. Do not include a character template. The first message should be a world-building event. This should be large, unique, and immersive. " +
                                "The first character is " + inter.options.getString('name') + ", a " + inter.options.getString('role') + " with the following abilities: " + inter.options.getString('abilities') + "." + "The world is called " + inter.options.getString('worldname') + "." + " Any additional information about the world: " + inter.options.getString('customization') + "."
                        }
                    ]
                }
            ],
            response_format: {
                type: "text"
            },
            temperature: 1,
            max_completion_tokens: 2048,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0
        });

        userSession.characters[userId] = { name: inter.options.getString('name'), role: inter.options.getString('role'), abilities: inter.options.getString('abilities') };
        const initialMessage = response.choices[0].message.content;
        
        const characterName = inter.options.getString('name');
        const characterRole = inter.options.getString('role');
        const characterAbilities = inter.options.getString('abilities');
        userSession.characters[userId] = { name: characterName, role: characterRole, abilities: characterAbilities, contributions: 0 };
        await updateUserSession(guildId, 'characters', userSession.characters);
        await updateUserSession(guildId, 'story', [{ role: 'assistant', content: initialMessage }]);
        inter.followUp(initialMessage);
        
    },
};