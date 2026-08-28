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

const {
    createMessage,
    getMessagesByMatch
} = require("./services/messages");

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

        // Join an existing chat room
    socket.on("joinChat", ({ roomId }) => {
        if (!roomId) {
            socket.emit("chatError", {
                error: "roomId is required"
            });
            return;
        }

        socket.join(roomId);

        console.log(
            `Socket ${socket.id} joined chat room ${roomId}`
        );
    });


    // Send a real-time chat message
    socket.on("sendMessage", async (data) => {
        try {
            const {
                matchId,
                roomId,
                senderId,
                receiverId,
                message
            } = data;

            if (
                !matchId ||
                !roomId ||
                !senderId ||
                !receiverId ||
                !message ||
                !message.trim()
            ) {
                socket.emit("chatError", {
                    error: "matchId, roomId, senderId, receiverId and message are required"
                });

                return;
            }

            // Make sure the sender is actually inside this room
            const room = io.sockets.adapter.rooms.get(roomId);

            if (!room || !room.has(socket.id)) {
                socket.emit("chatError", {
                    error: "You are not connected to this chat room"
                });

                return;
            }

            const messageId = `${matchId}_${Date.now()}_${socket.id}`;

            // Save message in Firestore
            const savedMessage = await createMessage(
                messageId,
                {
                    matchId,
                    senderId,
                    receiverId,
                    message: message.trim()
                }
            );

            // Send message to everyone in the room
            io.to(roomId).emit("newMessage", savedMessage);

            console.log(
                `Message sent in ${roomId}: ${senderId} -> ${receiverId}`
            );

        } catch (error) {
            console.error("Send message error:", error);

            socket.emit("chatError", {
                error: error.message
            });
        }
    });


    // Typing indicator
    socket.on("typing", ({ roomId, userId }) => {
        if (!roomId || !userId) return;

        socket.to(roomId).emit("userTyping", {
            userId
        });
    });


    // Stop typing indicator
    socket.on("stopTyping", ({ roomId, userId }) => {
        if (!roomId || !userId) return;

        socket.to(roomId).emit("userStoppedTyping", {
            userId
        });
    });


    // Leave chat room
    socket.on("leaveChat", ({ roomId }) => {
        if (!roomId) return;

        socket.leave(roomId);

        console.log(
            `Socket ${socket.id} left chat room ${roomId}`
        );
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