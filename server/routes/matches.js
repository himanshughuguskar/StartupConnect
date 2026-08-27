const express = require("express");
const router = express.Router();

const {
    createMatch,
    getMatch,
    endMatch
} = require("../services/matches");

router.post("/", async (req, res) => {
    try {
        const { user1Id, user2Id } = req.body;

        if (!user1Id || !user2Id) {
            return res.status(400).json({
                error: "user1Id and user2Id are required"
            });
        }

        const matchId = `${user1Id}_${user2Id}_${Date.now()}`;

        const match = await createMatch(
            matchId,
            user1Id,
            user2Id
        );

        res.status(201).json(match);

    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: error.message
        });
    }
});

router.get("/:matchId", async (req, res) => {
    try {
        const match = await getMatch(req.params.matchId);

        if (!match) {
            return res.status(404).json({ error: "Match not found" });
        }

        res.json(match);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put("/:matchId/end", async (req, res) => {
    try {
        const match = await endMatch(req.params.matchId);
        res.json(match);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;