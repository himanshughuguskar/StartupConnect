const { getAuth } = require("firebase-admin/auth");

async function authenticate(req, res, next) {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                error: "Authentication required"
            });
        }

        const idToken = authHeader.split("Bearer ")[1];

        const decodedToken = await getAuth().verifyIdToken(idToken);

        // Firebase UID of the authenticated user
        req.user = decodedToken;

        next();

    } catch (error) {
        console.error("Authentication error:", error);

        return res.status(401).json({
            error: "Invalid or expired authentication token"
        });
    }
}

module.exports = authenticate;