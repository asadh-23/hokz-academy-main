import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
    {
        recipientId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" }, // Student ID
        senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Tutor ID
        type: { type: String, required: true }, // e.g., "lesson_added"
        message: { type: String, required: true },
        relatedId: { type: mongoose.Schema.Types.ObjectId }, // Course ID (for redirecting)
        isRead: { type: Boolean, default: false },
    },
    { timestamps: true },
);

const Notification = mongoose.model("Notification", notificationSchema);
export default Notification;
