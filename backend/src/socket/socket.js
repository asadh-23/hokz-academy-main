import { Server } from "socket.io";
import http from "http";
import express from "express";
import dotenv from "dotenv";
import Message from "../models/chat/Message.js";
import Chat from "../models/chat/Chat.js";

dotenv.config();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: [process.env.FRONTEND_URL, "http://localhost:5173", "http://localhost:3000"],
        methods: ["GET", "POST"],
        credentials: true,
    },
});

// Format: { userId: [socketId1, socketId2] }
const userSocketMap = {};
console.log(Object.keys(userSocketMap));

export const getReceiverSocketId = (receiverId) => {
    return userSocketMap[receiverId]; // This willreturn an Array []
};

io.on("connection", (socket) => {
    // console.log("A user connected", socket.id);

    const userId = socket.handshake.query.userId;

    if (userId && userId !== "undefined") {
        // 1. Check if user already exists in map
        if (!userSocketMap[userId]) {
            userSocketMap[userId] = [];
        }
        // 2. Add new socket ID to the array (Push)
        userSocketMap[userId].push(socket.id);
    } else {
        return;
    }

    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    // --- EVENTS ---

    socket.on("mark_as_seen", async ({ chatId, senderId, currentUserId }) => {
        try {
            const readAt = new Date();
            await Message.updateMany(
                { chatId, senderId: senderId, isRead: false },
                { $set: { isRead: true, readAt: readAt } },
            );

            const chat = await Chat.findById(chatId);

            if (chat) {
                if (chat.user.toString() === currentUserId) {
                    chat.unreadCountUser = 0;
                } else if (chat.tutor.toString() === currentUserId) {
                    chat.unreadCountTutor = 0;
                }

                await chat.save();
            }

            const senderSocketIds = getReceiverSocketId(senderId);
            if (senderSocketIds && senderSocketIds.length > 0) {
                io.to(senderSocketIds).emit("message_seen_update", { chatId, readAt });
            }
        } catch (error) {
            console.log("Error in mark_as_seen socket:", error);
        }
    });

    // Backend: socket.js

    socket.on("message_delivered", async ({ messageId, chatId, senderId }) => {
        try {
            const updatedMessage = await Message.findByIdAndUpdate(messageId, { isDelivered: true }, { new: true });

            const senderSocketIds = getReceiverSocketId(senderId);

            if (senderSocketIds?.length > 0) {
                io.to(senderSocketIds).emit("message_status_update", {
                    messageId,
                    isDelivered: true,
                    chatId,
                });
            }
        } catch (error) {
            console.log("Error in message_delivered:", error);
        }
    });

    socket.on("setup", async (userId) => {
        socket.join(userId);

        try {
            const myChats = await Chat.find({
                $or: [{ user: userId }, { tutor: userId }],
            }).select("_id");

            const myChatIds = myChats.map((chat) => chat._id);

            const pendingMessages = await Message.find({
                chatId: { $in: myChatIds },
                senderId: { $ne: userId },
                isDelivered: false,
            });

            if (pendingMessages.length > 0) {
                await Message.updateMany(
                    { _id: { $in: pendingMessages.map((msg) => msg._id) } },
                    { $set: { isDelivered: true } },
                );

                pendingMessages.forEach((msg) => {
                    const senderSocketIds = getReceiverSocketId(msg.senderId.toString());

                    if (senderSocketIds?.length > 0) {
                        io.to(senderSocketIds).emit("message_delivered_update", {
                            messageId: msg._id,
                            isDelivered: true,
                            chatId: msg.chatId,
                        });
                    }
                });
            }
        } catch (error) {
            console.error("Error updating delivery status:", error);
        }
    });

    socket.on("typing", ({ receiverId, senderId }) => {
        const receiverSocketIds = getReceiverSocketId(receiverId);

        if (receiverSocketIds?.length > 0) {
            io.to(receiverSocketIds).emit("display_typing", { senderId });
        }
    });

    socket.on("stop_typing", ({ receiverId, senderId }) => {
        const receiverSocketIds = getReceiverSocketId(receiverId);

        if (receiverSocketIds?.length > 0) {
            io.to(receiverSocketIds).emit("hide_typing", { senderId });
        }
    });

    socket.on("call-user", ({ to, roomId, callerName }) => {
        const receiverSocketIds = getReceiverSocketId(to);

        if (receiverSocketIds && receiverSocketIds.length > 0) {
            io.to(receiverSocketIds).emit("incoming-call", {
                from: userId,
                roomId: roomId,
                callerName: callerName,
            });
        }
    });

    socket.on("call-rejected", ({ to, name }) => {
    const receiverSocketIds = getReceiverSocketId(to);
    if (receiverSocketIds && receiverSocketIds.length > 0) {
        io.to(receiverSocketIds).emit("call-rejected", { name: name});
    }
});

    // Disconnect Logic (Updated)
    socket.on("disconnect", () => {
        if (userId && userSocketMap[userId]) {
            userSocketMap[userId] = userSocketMap[userId].filter((id) => id !== socket.id);

            if (userSocketMap[userId].length === 0) {
                delete userSocketMap[userId];
                io.emit("getOnlineUsers", Object.keys(userSocketMap));
            }
        }
    });
});

export { app, io, server };
