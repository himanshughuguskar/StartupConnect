const express = require("express");
const router = express.Router();

const { db } = require("../config/firebase-admin");
const { FieldValue } = require("firebase-admin/firestore");
const authenticate = require("../middleware/auth");


// SAVE an interaction
router.post("/add", authenticate, async (req, res) => {
    try {
        const userId = req.user.uid;

        const {
            otherUserId,
            type
        } = req.body;

        if (!otherUserId) {
            return res.status(400).json({
                message: "Other user ID is required"
            });
        }

        await db
            .collection("history")
            .doc(userId)
            .collection("interactions")
            .add({
                otherUserId,
                type: type || "match",
                timestamp: FieldValue.serverTimestamp()
            });

        res.json({
            message: "Interaction saved"
        });

    } catch (error) {
        console.error("Save history error:", error);

        res.status(500).json({
            error: error.message
        });
    }
});


// GET interaction history
router.get("/", authenticate, async (req, res) => {
    try {
        const userId = req.user.uid;

        const snapshot = await db
            .collection("history")
            .doc(userId)
            .collection("interactions")
            .orderBy("timestamp", "desc")
            .get();

        const history = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        res.json(history);

    } catch (error) {
        console.error("Get history error:", error);

        res.status(500).json({
            error: error.message
        });
    }
});


module.exports = router;