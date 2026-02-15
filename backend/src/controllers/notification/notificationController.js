import Notification from "../../models/common/Notification.js";

// 1. Get Notifications
export const getNotifications = async (req, res) => {
    try {
        const userId = req.user._id;
        const notifications = await Notification.find({ recipientId: userId })
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, data: notifications });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to fetch notifications" });
    }
};

// 2. Clear All Notifications
export const clearNotifications = async (req, res) => {
    try {
        const userId = req.user._id;
        
        // Delete all notifications for this user
        await Notification.deleteMany({ recipientId: userId });

        res.status(200).json({ success: true, message: "Notifications cleared" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to clear notifications" });
    }
};