const express = require("express");
const router = express.Router();

const { db } = require("../config/firebase-admin");
const { FieldValue } = require("firebase-admin/firestore");


// SAVE an interaction
router.post("/add", async (req, res) => {
    try {
        const {
            userId,
            otherUserId,
            type
        } = req.body;

        if (!userId || !otherUserId) {
            return res.status(400).json({
                message: "User IDs are required"
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
router.get("/:userId", async (req, res) => {
    try {
        const { userId } = req.params;

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