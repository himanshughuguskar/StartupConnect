const { messagesCollection } = require("./firestore");

async function createMessage(messageId, data) {
    await messagesCollection.doc(messageId).set({
        messageId,
        ...data,
        sentAt: new Date()
    });

    return getMessage(messageId);
}

async function getMessage(messageId) {
    const doc = await messagesCollection.doc(messageId).get();

    if (!doc.exists) {
        return null;
    }

    return {
        id: doc.id,
        ...doc.data()
    };
}

async function getMessagesByMatch(matchId) {
    const snapshot = await messagesCollection
        .where("matchId", "==", matchId)
        .orderBy("sentAt", "asc")
        .get();

    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));
}

module.exports = {
    createMessage,
    getMessage,
    getMessagesByMatch
};