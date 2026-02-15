import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
    {
        chatId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Chat",
            required: true,
        },

        senderId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },

        senderRole: {
            type: String,
            enum: ["user", "tutor"],
            required: true,
        },

        text: {
            type: String,
            trim: true,
            default: "",
        },

        fileUrl: {
            type: String,
            default: "",
        },

        fileType: {
            type: String,
            enum: ["image", "video", "pdf", "text"],
            default: "text",
        },
        isDelivered: { type: Boolean, default: false },
        isRead: {
            type: Boolean,
            default: false,
        },

        readAt: {
            type: Date,
        },
    },
    { timestamps: true },
);

const Message = mongoose.model("Message", messageSchema);
export default Message;
