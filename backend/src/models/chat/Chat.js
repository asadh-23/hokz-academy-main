import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    tutor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tutor",
      required: true,
    },

    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },

    lastMessageAt: {
      type: Date,
      default: Date.now,
    },
    
    unreadCountTutor: {
        type: Number,
        default: 0
    },
    
    unreadCountUser: {
        type: Number,
        default: 0
    }
  },
  { timestamps: true }
);

chatSchema.index({ user: 1, tutor: 1 }, { unique: true });

const Chat = mongoose.model("Chat", chatSchema);
export default Chat;