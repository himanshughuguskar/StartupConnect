const { matchesCollection } = require("./firestore");

async function createMatch(matchId, user1Id, user2Id) {
    await matchesCollection.doc(matchId).set({
        matchId,
        user1Id,
        user2Id,
        status: "active",
        startedAt: new Date(),
        endedAt: null
    });

    return getMatch(matchId);
}

async function getMatch(matchId) {
    const doc = await matchesCollection.doc(matchId).get();

    if (!doc.exists) {
        return null;
    }

    return {
        id: doc.id,
        ...doc.data()
    };
}

async function endMatch(matchId) {
    await matchesCollection.doc(matchId).update({
        status: "ended",
        endedAt: new Date()
    });

    return getMatch(matchId);
}

module.exports = {
    createMatch,
    getMatch,
    endMatch
};