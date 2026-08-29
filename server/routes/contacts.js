const express = require("express");
const router = express.Router();

const { db } = require("../config/firebase-admin");
const { FieldValue } = require("firebase-admin/firestore");

// GET all contacts for a user
router.get("/:userId", async (req, res) => {
    try {
        const { userId } = req.params;

        const snapshot = await db
            .collection("contacts")
            .doc(userId)
            .collection("list")
            .get();

        const contacts = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        res.json(contacts);

    } catch (error) {
        console.error("Get contacts error:", error);

        res.status(500).json({
            error: error.message
        });
    }
});


// ADD contact
router.post("/add", async (req, res) => {
    try {
        const {
            userId,
            contactUserId,
            name
        } = req.body;

        if (!userId || !contactUserId) {
            return res.status(400).json({
                message: "User IDs are required"
            });
        }

        await db
            .collection("contacts")
            .doc(userId)
            .collection("list")
            .doc(contactUserId)
            .set({
                name: name || "",
                addedAt: FieldValue.serverTimestamp()
            });

        res.json({
            message: "Contact added successfully"
        });

    } catch (error) {
        console.error("Add contact error:", error);

        res.status(500).json({
            error: error.message
        });
    }
});


// REMOVE contact
router.delete("/:userId/:contactUserId", async (req, res) => {
    try {
        const {
            userId,
            contactUserId
        } = req.params;

        await db
            .collection("contacts")
            .doc(userId)
            .collection("list")
            .doc(contactUserId)
            .delete();

        res.json({
            message: "Contact removed"
        });

    } catch (error) {
        console.error("Remove contact error:", error);

        res.status(500).json({
            error: error.message
        });
    }
});


module.exports = router;