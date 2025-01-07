const sessions = {};

function getUserSession(userId) {
    return sessions[userId];
}

function updateUserSession(userId, role, content) {
    if (!sessions[userId]) {
        sessions[userId] = { messages: [] };
    }
    sessions[userId].messages.push({ role, content });
    console.log(sessions)
}

function deleteUserSession(userId) {
    delete sessions[userId];
}

module.exports = { getUserSession, updateUserSession, deleteUserSession };