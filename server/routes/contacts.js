const express = require("express");
const router = express.Router();

const { db } = require("../config/firebase-admin");
const { FieldValue } = require("firebase-admin/firestore");
const authenticate = require("../middleware/auth");


// GET all contacts for authenticated user
router.get("/", authenticate, async (req, res) => {
    try {
        const userId = req.user.uid;

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
router.post("/add", authenticate, async (req, res) => {
    try {
        const userId = req.user.uid;

        const {
            contactUserId,
            name
        } = req.body;

        if (!contactUserId) {
            return res.status(400).json({
                message: "Contact user ID is required"
            });
        }

        if (userId === contactUserId) {
            return res.status(400).json({
                message: "You cannot add yourself as a contact"
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
router.delete("/:contactUserId", authenticate, async (req, res) => {
    try {
        const userId = req.user.uid;
        const { contactUserId } = req.params;

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