const { QuickDB } = require('quick.db');
const path = require('path');

// Use a data directory for persistent storage in Docker
const dbPath = process.env.NODE_ENV === 'production' 
    ? path.join('/app/data', 'database.sqlite')
    : './database.sqlite';

const db = new QuickDB({ filePath: dbPath });

async function getUserSession(guildId) {
    const session = await db.get(guildId);
    if (!session) {
        const newSession = {
            characters: {},
            story: [],
            summary: "",
            last_user: null,
            contributions: []
        };
        await db.set(guildId, newSession);
        return newSession;
    }
    return session;
}

async function updateUserSession(guildId, key, value) {
    const session = await getUserSession(guildId);
    session[key] = value;
    await db.set(guildId, session);
}

async function addStoryContribution(guildId, contribution, userId) {
    const session = await getUserSession(guildId);
    session.story.push(contribution);
    session.last_user = userId;
    if (session.characters[userId]) {
        session.characters[userId].contributions += 1;
    }
    await db.set(guildId, session);
}

async function getStorySummary(guildId) {
    const session = await getUserSession(guildId);
    return session.summary;
}

module.exports = { getUserSession, updateUserSession, addStoryContribution, getStorySummary };