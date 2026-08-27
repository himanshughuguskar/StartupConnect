const { usersCollection } = require("./firestore");

async function createUser(uid, data) {
    await usersCollection.doc(uid).set({
        uid,
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
        isOnline: false
    });

    return getUser(uid);
}

async function getUser(uid) {
    const doc = await usersCollection.doc(uid).get();

    if (!doc.exists) {
        return null;
    }

    return {
        id: doc.id,
        ...doc.data()
    };
}

async function updateUser(uid, data) {
    await usersCollection.doc(uid).update({
        ...data,
        updatedAt: new Date()
    });

    return getUser(uid);
}

module.exports = {
    createUser,
    getUser,
    updateUser
};