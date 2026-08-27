const express = require("express");
const router = express.Router();

const {
    createUser,
    getUser,
    updateUser
} = require("../services/users");

// Get user
router.get("/:uid", async (req, res) => {
    try {
        const user = await getUser(req.params.uid);

        if (!user) {
            return res.status(404).json({
                error: "User not found"
            });
        }

        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Failed to get user"
        });
    }
});

// Create user
router.post("/", async (req, res) => {
    try {
        const { uid, ...data } = req.body;

        if (!uid) {
            return res.status(400).json({
                error: "UID is required"
            });
        }

        const user = await createUser(uid, data);

        res.status(201).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Failed to create user"
        });
    }
});

// Update user
router.put("/:uid", async (req, res) => {
    try {
        const user = await updateUser(
            req.params.uid,
            req.body
        );

        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Failed to update user"
        });
    }
});

module.exports = router;