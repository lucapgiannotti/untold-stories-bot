require('dotenv').config();
module.exports = {
    app: {
        token: process.env.TOKEN,
        open_ai_key: process.env.OPENAI_KEY,
        playing: '/start',
        global: true,
    },
};