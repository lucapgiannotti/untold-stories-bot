const axios = require('axios');
require('dotenv').config();
const storyContinue = require('./storyContinue');
const { MessageCollector } = require('discord.js');
const {updateUserSession, deleteUserSession} = require("../../src/sessions");


module.exports = {
    name: 'start',
    description: "Start your text adventure!",
    async execute({client, inter}) {
        inter.reply("Starting your text adventure... (Type 'exit' to stop the game at any time.)");
        const { OpenAI } = require('openai');
        const openai = new OpenAI({
            apiKey: process.env.API_KEY,
        });

        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    "role": "system",
                    "content": [
                        {
                            "type": "text",
                            "text": "Create a text adventure game that engages the user in a dynamic, interactive narrative, allowing them to make choices that influence the storyline, ultimately providing an exciting and adventurous experience.\n\nProvide a story introduction that sets the scene and offers the user a choice or prompt. Accept user input logically related to previous scenarios, adapting the narrative as necessary. \n\n# Steps\n\n1. **Introduction**: Begin with a captivating introduction that establishes the setting, characters, and initial conflict or scenario.\n   \n2. **User Interaction**: Prompt the user with a choice, question, or action they should take. Ensure these options are clearly defined and relevant to the unfolding narrative.\n\n3. **Response Adaptation**: Based on the user's input, update the narrative, progressing logically from the previous situation. Introduce new elements, challenges, or plot twists as needed to maintain engagement.\n\n4. **Continuous Engagement**: Continue offering choices and adapting responses, maintaining a balance of narrative development and user interaction.\n\n5. **Endings**: Develop multiple potential outcomes depending on the user's choices throughout the game.\n\n# Output Format\n\n- Each response should be a paragraph that combines narrative elements with user prompts.\n- Choices for user input should be clearly delineated (e.g., \"Type 'A' to explore the cave or 'B' to climb the mountain.\")\n\n# Examples\n\n**Example Start of Adventure**:\n- Introduction: \"You find yourself at the edge of an enchanted forest, the trees whispering secrets with the wind. Two paths lie before you: one leading into the dense, shadowy woods, the other toward a distant, glimmering lake. What do you do?\"\n- User Prompt: \"Type 'A' to venture into the woods or 'B' to head toward the lake.\"\n\n**Example User Response and Adaptation**:\n- User chooses 'A': \"As you step into the woods, the canopy overhead filters the sunlight into a dance of shadows. A mysterious figure appears from behind a tree, offering a cryptic map. Do you accept it?\"\n- Next prompt: \"Type 'A' to take the map or 'B' to politely decline and continue deeper into the woods.\"\n\n# Notes\n\n- Be sure to maintain a consistent narrative tone appropriate for the genre of adventure you are creating.\n- Accommodate a variety of user inputs, even if they are outside the predetermined options, and guide them back to relevant choices."
                        }
                    ]
                }
            ],
            response_format: {
                "type": "text"
            },
            temperature: 1,
            max_completion_tokens: 2048,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0
        });
        let bot_message = response.choices[0].message.content
        inter.editReply(bot_message);
        userId = inter.user.id;
        updateUserSession(userId, "assistant", response.choices[0].message.content);


        // Set up a message collector to wait for the next message from the user
        const filter = m => m.author.id === inter.user.id && m.channel.id === inter.channel.id;
        const collector = new MessageCollector(inter.channel, { filter, max: 1, time: 60000 });

        collector.on('collect', async (message) => {
            let user_message = message.content;
            const messageChannelId = message.channel.id;
            if (user_message === "exit") {
                deleteUserSession(userId);
                return;
            }
            await storyContinue({client, inter}, user_message, messageChannelId);

        });
    },
};