const express = require("express");
const path = require("path");
const http = require("http");
const cors = require("cors");
const dotenv = require("dotenv");
const { Server } = require("socket.io");

const {
    addUserToQueue,
    removeUserFromQueue,
    findMatch
} = require("./services/matchmaking");

const { createMatch } = require("./services/matches");

dotenv.config();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

app.use(cors());
app.use(express.json());

const userRoutes = require("./routes/users");
const matchRoutes = require("./routes/matches");
const messageRoutes = require("./routes/messages");
const contactRoutes = require("./routes/contacts");

app.use("/api/users", userRoutes);
app.use("/api/matches", matchRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/contacts", contactRoutes);

app.use(express.static(path.join(__dirname, "../client")));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/index.html"));
});

io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("findMatch", async (data) => {
        try {
            const user = {
                socketId: socket.id,
                userId: data.userId,
                role: data.role
            };

            const added = addUserToQueue(user);

            if (!added) {
                return;
            }

            const match = findMatch(user);

            if (!match) {
                socket.emit("waitingForMatch");
                return;
            }

            const roomId = `room_${Date.now()}_${Math.floor(Math.random() * 10000)}`;

            const user1Socket = io.sockets.sockets.get(match.user1.socketId);
            const user2Socket = io.sockets.sockets.get(match.user2.socketId);

            if (!user1Socket || !user2Socket) {
                return;
            }

            user1Socket.join(roomId);
            user2Socket.join(roomId);

            // Save match in Firestore
            const matchId = roomId;

            await createMatch(
                matchId,
                match.user1.userId,
                match.user2.userId
            );

            user1Socket.emit("matchFound", {
                roomId,
                matchId,
                matchedUserId: match.user2.userId
            });

            user2Socket.emit("matchFound", {
                roomId,
                matchId,
                matchedUserId: match.user1.userId
            });

            console.log(
                `MATCH FOUND: ${match.user1.userId} <-> ${match.user2.userId}`
            );

        } catch (error) {
            console.error("Matchmaking error:", error);
            socket.emit("matchmakingError", {
                error: error.message
            });
        }
    });

    socket.on("cancelMatch", () => {
        removeUserFromQueue(socket.id);
    });

    socket.on("disconnect", () => {
        removeUserFromQueue(socket.id);
        console.log("User disconnected:", socket.id);
    });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log(`StartupConnect server running on port ${PORT}`);
});