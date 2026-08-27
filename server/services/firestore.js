const { db } = require("../config/firebase-admin");

const usersCollection = db.collection("users");
const matchesCollection = db.collection("matches");
const messagesCollection = db.collection("messages");
const contactsCollection = db.collection("contacts");

module.exports = {
    usersCollection,
    matchesCollection,
    messagesCollection,
    contactsCollection
};