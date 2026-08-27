const { contactsCollection } = require("./firestore");

async function createContact(contactId, data) {
    await contactsCollection.doc(contactId).set({
        contactId,
        ...data,
        status: "pending",
        createdAt: new Date()
    });

    return getContact(contactId);
}

async function getContact(contactId) {
    const doc = await contactsCollection.doc(contactId).get();

    if (!doc.exists) {
        return null;
    }

    return {
        id: doc.id,
        ...doc.data()
    };
}

async function updateContactStatus(contactId, status) {
    if (!["pending", "accepted", "rejected"].includes(status)) {
        throw new Error("Invalid contact status");
    }

    await contactsCollection.doc(contactId).update({
        status
    });

    return getContact(contactId);
}

module.exports = {
    createContact,
    getContact,
    updateContactStatus
};