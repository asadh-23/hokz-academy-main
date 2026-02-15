import mongoose from "mongoose";
import Message from "../../models/chat/Message.js";
import Chat from "../../models/chat/Chat.js";
import { getReceiverSocketId, io } from "../../socket/socket.js";
import Enrollment from "../../models/course/Enrollment.js";

// ------------------------------------------------------------------
// Fetch All Messages & Mark as Read (Blue Tick Logic)
// ------------------------------------------------------------------
export const getAllMessages = async (req, res) => {
    try {
        const { receiverId } = req.params; // Frontend-ൽ നിന്ന് receiverId അയക്കുന്നു
        const myId = req.user._id;

        // 1. Validate IDs
        if (!receiverId || receiverId === "null" || receiverId === "undefined") {
            return res.status(400).json({ success: false, message: "Invalid Receiver ID" });
        }

        // 2. Find the Chat Document First (using MyId + ReceiverId)
        // We check both combinations because we don't know who is tutor/user easily without role
        let chat = await Chat.findOne({
            $or: [
                { user: myId, tutor: receiverId },
                { tutor: myId, user: receiverId }
            ]
        });

        // 3. CASE: No Chat Exists yet (New Conversation)
        if (!chat) {
            return res.status(200).json({ success: true, data: [] });
        }

        const chatId = chat._id;
        // 4. Fetch Messages using the Found Chat ID
        const messages = await Message.find({ chatId }).sort({ createdAt: 1 });

        // 5. Identify Unread Messages (Only from the OTHER person)
        const unreadMessages = messages.filter(
            (msg) => msg.senderId.toString() !== myId.toString() && !msg.isRead
        );

        if (unreadMessages.length > 0) {
            // A. Update Messages to Read
            await Message.updateMany(
                { chatId, senderId: { $ne: myId }, isRead: false },
                { $set: { isRead: true, readAt: new Date(), isDelivered: true } }
            );

            // B. Reset Unread Count in Chat Model
            // Determine my role in this specific chat to reset correct counter
            if (chat.tutor.toString() === myId.toString()) {
                chat.unreadCountTutor = 0; // I am Tutor
            } else {
                chat.unreadCountUser = 0;  // I am User
            }
            await chat.save();

            const senderIdToNotify = unreadMessages[0].senderId.toString();
            const senderSocketIds = getReceiverSocketId(senderIdToNotify);

            if (senderSocketIds?.length > 0) {
                io.to(senderSocketIds).emit("messages_read", {
                    chatId,
                    readAt: new Date(),
                });
            }
        }

        // 6. Return Messages (Update read status in response locally)
        const updatedMessages = messages.map((msg) => {
            if (msg.senderId.toString() !== myId.toString() && !msg.isRead) {
                return { ...msg.toObject(), isRead: true, readAt: new Date() };
            }
            return msg;
        });

        res.status(200).json({ success: true, data: updatedMessages, chatId });

    } catch (error) {
        console.error("Get Messages Error:", error);
        res.status(500).json({ success: false, message: "Failed to fetch messages" });
    }
};

// Get courses shared between current user and chat participant
export const getSharedCourses = async (req, res) => {
    try {
        const myId = req.user._id;
        const { participantId } = req.params;

        const courses = await Enrollment.find({
            $or: [
                { user: myId, tutor: participantId },
                { tutor: myId, user: participantId }
            ]
        })
        .populate("course", "title thumbnailUrl price isActive")
        .select("course");

        res.status(200).json({ success: true, data: courses });
    } catch (error) {
        console.error("Shared Courses Error:", error);
        res.status(500).json({ success: false, message: "Failed to fetch shared courses" });
    }
};