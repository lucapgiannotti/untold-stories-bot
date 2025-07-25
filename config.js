require('dotenv').config();
module.exports = {
    app: {
        token: process.env.TOKEN,
        open_ai_key: process.env.API_KEY,
        playing: '/start',
        global: true,
    },
};