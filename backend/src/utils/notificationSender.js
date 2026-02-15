import Notification from "../models/common/Notification.js";
import { getReceiverSocketId, io } from "../socket/socket.js";

export const sendNotification = async ({ recipientId, senderId, type, message, relatedId }) => {
    try {
        // 1. Save to Database
        const notification = await Notification.create({
            recipientId,
            senderId,
            type,
            message,
            relatedId,
        });

        // 2. Send Real-time via Socket
        const receiverSocketIds = getReceiverSocketId(recipientId.toString());
        if (receiverSocketIds) {
            io.to(receiverSocketIds).emit("new_notification", notification);
        }
    } catch (error) {
        console.error("Notification Error:", error);
    }
};