const express = require("express");
const router = express.Router();

const {
    createMessage,
    getMessage,
    getMessagesByMatch
} = require("../services/messages");

router.post("/", async (req, res) => {
    try {
        const { matchId, senderId, receiverId, message } = req.body;

        if (!matchId || !senderId || !receiverId || !message) {
            return res.status(400).json({
                error: "matchId, senderId, receiverId and message are required"
            });
        }

        const messageId = `${matchId}_${Date.now()}`;

        const newMessage = await createMessage(messageId, {
            matchId,
            senderId,
            receiverId,
            message
        });

        res.status(201).json(newMessage);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

router.get("/:messageId", async (req, res) => {
    try {
        const message = await getMessage(req.params.messageId);

        if (!message) {
            return res.status(404).json({ error: "Message not found" });
        }

        res.json(message);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get("/match/:matchId", async (req, res) => {
    try {
        const messages = await getMessagesByMatch(req.params.matchId);
        res.json(messages);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;