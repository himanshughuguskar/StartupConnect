const express = require("express");
const router = express.Router();

const {
    createContact,
    getContact,
    updateContactStatus
} = require("../services/contacts");

router.post("/", async (req, res) => {
    try {
        const {
            matchId,
            requesterId,
            receiverId,
            requesterEmail,
            receiverEmail
        } = req.body;

        if (!matchId || !requesterId || !receiverId) {
            return res.status(400).json({
                error: "matchId, requesterId and receiverId are required"
            });
        }

        const contactId = `${matchId}_${requesterId}`;

        const contact = await createContact(contactId, {
            matchId,
            requesterId,
            receiverId,
            requesterEmail,
            receiverEmail
        });

        res.status(201).json(contact);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

router.get("/:contactId", async (req, res) => {
    try {
        const contact = await getContact(req.params.contactId);

        if (!contact) {
            return res.status(404).json({
                error: "Contact not found"
            });
        }

        res.json(contact);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put("/:contactId/status", async (req, res) => {
    try {
        const { status } = req.body;

        const contact = await updateContactStatus(
            req.params.contactId,
            status
        );

        res.json(contact);

    } catch (error) {
        res.status(400).json({
            error: error.message
        });
    }
});

module.exports = router;