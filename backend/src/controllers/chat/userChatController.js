import Chat from "../../models/chat/Chat.js";
import Enrollment from "../../models/course/Enrollment.js";
import Tutor from "../../models/user/Tutor.js";
import Message from "../../models/chat/Message.js";
import { getReceiverSocketId, io } from "../../socket/socket.js";
import { uploadToS3 } from "../../services/s3UploadService.js";

// Get Complete User Sidebar (Active Chats + All Tutors Ordered)
export const getUserSidebar = async (req, res) => {
    try {
        const userId = req.user._id;

        const activeChats = await Chat.find({ user: userId })
            .populate("tutor", "fullName email profileImage phone")
            .populate("lastMessage")
            .sort({ updatedAt: -1 })
            .lean();

        const chatTutorIds = new Set(activeChats.filter((chat) => chat.tutor).map((chat) => chat.tutor._id.toString()));

        const enrolledTutorIds = await Enrollment.distinct("tutor", {
            user: userId,
        });

        const newTutorIds = enrolledTutorIds.filter((id) => !chatTutorIds.has(id.toString()));

        let newTutors = [];
        if (newTutorIds.length > 0) {
            newTutors = await Tutor.find({
                _id: { $in: newTutorIds },
                isBlocked: false,
            })
                .select("fullName email profileImage phone isBlocked")
                .lean();
        }

        // 4. Merge Data for Frontend Sidebar
        // ---------------------------------------------------

        // A. Format Active Chats
        const formattedActiveChats = activeChats
            .map((chat) => ({
                _id: chat.tutor?._id,
                userId: null,
                tutorId: chat.tutor?._id,
                chatId: chat._id, // Existing Chat ID
                fullName: chat.tutor?.fullName,
                email: chat.tutor?.email,
                profileImage: chat.tutor?.profileImage,
                phone: chat.tutor?.phone,
                lastMessage: chat.lastMessage ? chat.lastMessage.text || `Sent a ${chat.lastMessage.fileType}` : "",
                lastMessageTime: chat.updatedAt,
                unreadCount: chat.unreadCountUser,
                isOnline: false,
                type: "active",
            }))
            .filter((item) => item._id);

        // B. Format New Tutors (No Chat History)
        const formattedNewTutors = newTutors.map((tutor) => ({
            _id: tutor._id,
            tutorId: tutor._id,
            userId: null,
            chatId: null, // No chat created yet
            fullName: tutor.fullName,
            email: tutor.email,
            profileImage: tutor.profileImage,
            phone: tutor.phone,
            lastMessage: null,
            lastMessageTime: null,
            unreadCount: 0,
            isOnline: false,
            type: "new",
        }));

        // 5. Final List: Active Chats First + New Tutors Below
        const sidebarList = [...formattedActiveChats, ...formattedNewTutors];

        res.status(200).json({
            success: true,
            data: sidebarList,
        });
    } catch (error) {
        console.error("Get User Sidebar Error:", error);
        res.status(500).json({ success: false, message: "Failed to fetch sidebar tutors" });
    }
};

export const sendMessageUser = async (req, res) => {
    try {
        let { chatId, text, receiverId } = req.body;
        const senderId = req.user._id;
        const file = req.file;

        if (chatId === "null" || chatId === "undefined") chatId = null;
        if (receiverId === "null" || receiverId === "undefined") receiverId = null;

        if (!text && !file) {
            return res.status(400).json({ success: false, message: "Message cannot be empty." });
        }

        if (!chatId && !receiverId) {
            return res.status(400).json({ success: false, message: "Chat ID or Receiver ID is required." });
        }

        
        let targetTutorId = receiverId;

        if (!chatId) {
            let existingChat = await Chat.findOne({
                user: senderId,
                tutor: receiverId,
            });

            if (existingChat) {
                chatId = existingChat._id;
            } else {
                const newChat = await Chat.create({
                    user: senderId,
                    tutor: receiverId,
                    lastMessageAt: new Date(),
                    unreadCountTutor: 0,
                    unreadCountUser: 0,
                });
                chatId = newChat._id;
            }
        } else {

            if (!targetTutorId) {
                const chat = await Chat.findById(chatId).select("tutor");
                if (!chat) return res.status(404).json({ success: false, message: "Chat not found" });
                targetTutorId = chat.tutor;
            }
        }

        // ---------------------------------------------------------
        // S3 Upload
        // ---------------------------------------------------------
        let fileUrl = "";
        let fileType = "text";
        if (file) {
            try {
                const uploadResult = await uploadToS3(file, "chat-media");
                fileUrl = uploadResult.url;
                if (file.mimetype.startsWith("image")) fileType = "image";
                else if (file.mimetype.startsWith("video")) fileType = "video";
                else if (file.mimetype === "application/pdf") fileType = "pdf";
            } catch (err) {
                return res.status(500).json({ success: false, message: "File upload failed" });
            }
        }

        // ---------------------------------------------------------
        // Check Online & Save
        // ---------------------------------------------------------
        const receiverSocketIds = getReceiverSocketId(targetTutorId?.toString());
        const isReceiverOnline = !!(receiverSocketIds && receiverSocketIds.length > 0);

        const newMessage = await Message.create({
            chatId,
            senderId,
            senderRole: "user",
            text: text || "",
            fileUrl,
            fileType,
            isRead: false,
            isDelivered: isReceiverOnline, // 🔥 Correct Logic
        });

        // Update Chat
        const updatedChat = await Chat.findByIdAndUpdate(
            chatId,
            {
                lastMessage: newMessage._id,
                lastMessageAt: new Date(),
                $inc: { unreadCountTutor: 1 },
            },
            { new: true },
        ).populate("tutor");

        // ---------------------------------------------------------
        // Socket Emissions
        // ---------------------------------------------------------
        if (isReceiverOnline) {
            // 1. Send to Receiver
            io.to(receiverSocketIds).emit("receive_message", newMessage);

            let previewText = text;
            if (!text && fileType !== "text") previewText = `Sent a ${fileType}`;

            io.to(receiverSocketIds).emit("notification", {
                chatId,
                senderId,
                unreadCount: updatedChat.unreadCountTutor,
                lastMessage: previewText,
                updatedAt: updatedChat.lastMessageAt || new Date(),
            });
            
        }

        res.status(201).json({ success: true, data: newMessage, chatId });
    } catch (error) {
        console.error("Send Message User Error:", error);
        res.status(500).json({ success: false, message: "Failed to send message" });
    }
};
