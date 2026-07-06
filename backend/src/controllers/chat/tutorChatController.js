import Chat from "../../models/chat/Chat.js";
import Enrollment from "../../models/course/Enrollment.js";
import User from "../../models/user/User.js";
import Message from "../../models/chat/Message.js";
import { getReceiverSocketId, io } from "../../socket/socket.js";
import { uploadToCloudinary } from "../../services/cloudinaryService.js";

// Get Complete Tutor Sidebar (Active Chats + All Students Ordered)
export const getTutorSidebar = async (req, res) => {
    try {
        const tutorId = req.user._id;

        const activeChats = await Chat.find({ tutor: tutorId })
            .populate("user", "fullName email profileImage phone isBlocked")
            .populate("lastMessage")
            .sort({ updatedAt: -1 })
            .lean();

        const chatUserIds = new Set(activeChats.filter((chat) => chat.user).map((chat) => chat.user._id.toString()));

        const enrolledUserIds = await Enrollment.distinct("user", {
            tutor: tutorId,
        });

        // 3. Find Students who have NOT chatted yet
        // ---------------------------------------------------
        const newStudentIds = enrolledUserIds.filter((id) => !chatUserIds.has(id.toString()));

        let newStudents = [];
        if (newStudentIds.length > 0) {
            newStudents = await User.find({
                _id: { $in: newStudentIds },
                isBlocked: false,
            })
                .select("fullName email profileImage phone isBlocked")
                .lean();
        }

        // A. Format Active Chats
        const formattedActiveChats = activeChats
            .map((chat) => ({
                _id: chat.user?._id, // User ID for clicking
                tutorId: null,
                userId: chat.user?._id,
                chatId: chat._id, // Existing Chat ID
                fullName: chat.user?.fullName,
                email: chat.user?.email,
                profileImage: chat.user?.profileImage,
                phone: chat.user?.phone,
                lastMessage: chat.lastMessage ? chat.lastMessage.text || `Sent a ${chat.lastMessage.fileType}` : "",
                lastMessageTime: chat.updatedAt,
                unreadCount: chat.unreadCountTutor,
                isOnline: false,
                type: "active",
            }))
            .filter((item) => item._id);

        // B. Format New Students (No Chat History)
        const formattedNewStudents = newStudents.map((student) => ({
            _id: student._id,
            tutorId: null,
            userId: student._id,
            chatId: null, // No chat created yet
            fullName: student.fullName,
            email: student.email,
            profileImage: student.profileImage,
            phone: student.phone,
            lastMessage: null, // No message yet
            lastMessageTime: null, // No time
            unreadCount: 0,
            isOnline: false,
            type: "new", // To identify new students
        }));

        // 5. Final List: Active Chats First + New Students Below
        const sidebarList = [...formattedActiveChats, ...formattedNewStudents];

        res.status(200).json({
            success: true,
            data: sidebarList,
        });
    } catch (error) {
        console.error("Get Tutor Sidebar Error:", error);
        res.status(500).json({ success: false, message: "Failed to fetch sidebar users" });
    }
};

export const sendMessageTutor = async (req, res) => {
    try {
        let { chatId, text, receiverId } = req.body;
        const senderId = req.user._id;
        const file = req.file;

        // FormData "null" string fix
        if (chatId === "null" || chatId === "undefined") chatId = null;
        if (receiverId === "null" || receiverId === "undefined") receiverId = null;

        // 1. Validation: Message Content
        if (!text && !file) {
            return res.status(400).json({ success: false, message: "Message cannot be empty." });
        }

        // 2. Validation: Target
        if (!chatId && !receiverId) {
            return res.status(400).json({ success: false, message: "Chat ID or Receiver ID (Student ID) is required." });
        }

        // ---------------------------------------------------------
        // 🔥 FIX 1: Correct Target ID Logic (Student ID)
        // ---------------------------------------------------------
        let targetStudentId = receiverId;

        if (!chatId) {
            // CASE A: New Chat (Tutor initiating message to Student)
            if (!receiverId) {
                return res.status(400).json({ success: false, message: "Student ID is required for new chats." });
            }

            let existingChat = await Chat.findOne({
                tutor: senderId, // Me (Tutor)
                user: receiverId, // Them (Student)
            });

            if (existingChat) {
                chatId = existingChat._id;
            } else {
                const newChat = await Chat.create({
                    tutor: senderId,
                    user: receiverId,
                    lastMessageAt: new Date(),
                    unreadCountTutor: 0,
                    unreadCountUser: 0,
                });
                chatId = newChat._id;
            }
        } else {
            // CASE B: Existing Chat
            // If receiverId (Student ID) is missing, fetch from DB
            if (!targetStudentId) {
                const chat = await Chat.findById(chatId).select("user");
                if (!chat) return res.status(404).json({ success: false, message: "Chat not found" });
                targetStudentId = chat.user;
            }
        }

        // ---------------------------------------------------------
        // Cloudinary Upload Logic
        // ---------------------------------------------------------
        let fileUrl = "";
        let fileType = "text";
        if (file) {
            try {
                let resourceType = "auto";
                if (file.mimetype.startsWith("image")) {
                    fileType = "image";
                    resourceType = "image";
                } else if (file.mimetype.startsWith("video")) {
                    fileType = "video";
                    resourceType = "video";
                } else if (file.mimetype === "application/pdf") {
                    fileType = "pdf";
                    resourceType = "raw";
                }

                const uploadResult = await uploadToCloudinary(
                    file.buffer,
                    "hokz-academy/chat-media",
                    resourceType,
                    file.originalname
                );
                fileUrl = uploadResult.url;
            } catch (err) {
                return res.status(500).json({ success: false, message: "File upload failed" });
            }
        }

        // ---------------------------------------------------------
        // 🔥 FIX 2: Check Online & Set Delivered
        // ---------------------------------------------------------
        const receiverSocketIds = getReceiverSocketId(targetStudentId?.toString());
        const isReceiverOnline = !!(receiverSocketIds && receiverSocketIds.length > 0);

        // 4. Save Message
        const newMessage = await Message.create({
            chatId,
            senderId,
            senderRole: "tutor", // Role is Tutor
            text: text || "",
            fileUrl,
            fileType,
            isRead: false,
            isDelivered: isReceiverOnline,
        });

        // 5. Update Chat (Increment Student's Unread Count)
        const updatedChat = await Chat.findByIdAndUpdate(
            chatId,
            {
                lastMessage: newMessage._id,
                lastMessageAt: new Date(),
                $inc: { unreadCountUser: 1 }, // Incrementing User (Student) count
            },
            { new: true },
        ).populate("user");

        // Safety Check
        if (!updatedChat) {
            return res.status(404).json({ success: false, message: "Chat not found" });
        }

        // ---------------------------------------------------------
        // 🔥 FIX 3: Socket Emissions (Only to Receiver)
        // ---------------------------------------------------------
        if (isReceiverOnline) {
            // Send to Student
            io.to(receiverSocketIds).emit("receive_message", newMessage);

            let previewText = text;
            if (!text && fileType !== "text") previewText = `Sent a ${fileType}`;

            io.to(receiverSocketIds).emit("notification", {
                chatId,
                senderId,
                unreadCount: updatedChat.unreadCountUser, // Send Student's count
                lastMessage: previewText,
                updatedAt: updatedChat.lastMessageAt || new Date(),
            });
        }

        // 7. Response
        res.status(201).json({ success: true, data: newMessage, chatId });
    } catch (error) {
        console.error("Error sending message (Tutor):", error);
        res.status(500).json({ success: false, message: "Failed to send message" });
    }
};
