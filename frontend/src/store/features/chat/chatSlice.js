import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// User & Tutor Axios instances import ചെയ്യുക
import { userAxios } from "../../../api/userAxios";
import { tutorAxios } from "../../../api/tutorAxios";

// ======================================================
// HELPER: Select Axios based on who is logged in
// ======================================================
const getAxiosInstance = (state) => {
    if (state.userAuth?.user) {
        return userAxios;
    }
    if (state.tutorAuth?.tutor) {
        return tutorAxios;
    }

    throw new Error("No active chat session found");
};

// ======================================================
// 1. ASYNC THUNKS (API Calls)
// ======================================================

// A. Get All Conversations (Sidebar List)
export const getConversations = createAsyncThunk("chat/getConversations", async (_, { rejectWithValue, getState }) => {
    try {
        const state = getState();
        const axiosInstance = getAxiosInstance(state);

        // Calls: /api/user/chat/conversations OR /api/tutor/chat/conversations
        const res = await axiosInstance.get("/chat/conversations");
        return res.data.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Failed to load chats");
    }
});

export const getSharedCourses = createAsyncThunk(
    "chat/getSharedCourses",
    async (participantId, { rejectWithValue, getState }) => {
        try {
            const state = getState();
            const axiosInstance = getAxiosInstance(state); // Dynamic Axios

            const res = await axiosInstance.get(`/chat/shared-courses/${participantId}`);
            return res.data.data;
        } catch (error) {
            return rejectWithValue("Failed to fetch courses");
        }
    },
);

// B. Get Messages (Specific Chat)
export const getMessages = createAsyncThunk("chat/getMessages", async (receiverId, { rejectWithValue, getState }) => {
    try {
        const state = getState();
        const axiosInstance = getAxiosInstance(state);
        const res = await axiosInstance.get(`/chat/${receiverId}`);
        return res.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Failed to load messages");
    }
});

// C. Send Message
export const sendMessage = createAsyncThunk(
    "chat/sendMessage",
    async ({ chatId, receiverId, text, file }, { rejectWithValue, getState }) => {
        try {
            const state = getState();
            const axiosInstance = getAxiosInstance(state);

            const formData = new FormData();

            formData.append("type", "chat");
            // 🟢 CORRECTED LOGIC:
            if (chatId) {
                formData.append("chatId", chatId);
            }

            if (receiverId) {
                formData.append("receiverId", receiverId);
            }

            // 3. Message Content
            if (text) formData.append("text", text);
            if (file) formData.append("file", file);

            const res = await axiosInstance.post("/chat/send-message", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            return { message: res.data.data, chatId: res.data.chatId };
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to send message");
        }
    },
);

// ======================================================
// 2. SLICE & REDUCERS
// ======================================================

const initialState = {
    conversations: [],
    SharedCourses: [],
    messages: [],
    selectedChat: null,
    loading: false,
    error: null,
};

const chatSlice = createSlice({
    name: "chat",
    initialState,
    reducers: {
        setSelectedChat: (state, action) => {
            state.selectedChat = action.payload;
        },
        addMessage: (state, action) => {
            state.messages.push(action.payload);
        },
        addOptimisticMessage: (state, action) => {
            state.messages.push(action.payload);
        },
        updateOptimisticMessage: (state, action) => {
            const { tempId, message } = action.payload;
            const index = state.messages.findIndex((msg) => msg.tempId === tempId);
            if (index !== -1) {
                state.messages[index] = message;
            }
        },
        // Sidebar update logic
        updateConversationLastMessage: (state, action) => {
            const { chatId, senderId, unreadCount, lastMessage, updatedAt } = action.payload;

            const index = state.conversations.findIndex((c) => c._id === senderId);

            if (index !== -1) {
                const chat = state.conversations[index];

                if (chatId) {
                    chat.chatId = chatId;
                }

                if (chat.type === "new") {
                    chat.type = "active";
                }

                chat.lastMessage = lastMessage;
                chat.lastMessageAt = updatedAt || new Date();

                if (unreadCount !== undefined) {
                    chat.unreadCount = unreadCount;
                }

                // Reordering logic
                state.conversations.splice(index, 1);
                state.conversations.unshift(chat);
            }
        },
        markMessagesAsRead: (state, action) => {
            const { readAt } = action.payload;

            state.messages.forEach((msg) => {
                if (!msg.isRead) {
                    msg.isRead = true;
                    msg.readAt = readAt;
                }
            });
        },
        markMessageAsDelivered: (state, action) => {
            const { messageId, isDelivered, chatId } = action.payload;

            const existingMessage = state.messages.find((msg) => msg._id === messageId);

            if (existingMessage) {
                existingMessage.isDelivered = isDelivered;
            } else {
                state.messages.forEach((msg) => {
                    if (msg.chatId === chatId && !msg.isRead && !msg.isDelivered) {
                        msg.isDelivered = true;
                    }
                });
            }
        },
    },
    extraReducers: (builder) => {
        // Conversations
        builder.addCase(getConversations.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(getConversations.fulfilled, (state, action) => {
            state.loading = false;
            state.conversations = action.payload;
        });
        builder.addCase(getConversations.rejected, (state) => {
            state.loading = false;
        });

        //getSharedCourses
        builder.addCase(getSharedCourses.fulfilled, (state, action) => {
            state.sharedCourses = action.payload;
        });

        // Messages
        builder.addCase(getMessages.pending, (state) => {
            state.loading = true;
            state.messages = [];
        });

        builder.addCase(getMessages.fulfilled, (state, action) => {
            state.loading = false;
            state.messages = action.payload.data;

            const currentReceiverId = action.meta.arg;

            const conversationIndex = state.conversations.findIndex((c) => c._id === currentReceiverId);

            if (conversationIndex !== -1) {
                state.conversations[conversationIndex].unreadCount = 0;
            }

            // 3. New Chat ID Logic (Existing)
            if (state.selectedChat && !state.selectedChat.chatId && action.payload.chatId) {
                state.selectedChat.chatId = action.payload.chatId;

                if (conversationIndex !== -1) {
                    state.conversations[conversationIndex].chatId = action.payload.chatId;
                    state.conversations[conversationIndex].type = "active";
                }
            }
        });

        // Send Message
        builder.addCase(sendMessage.pending, (state, action) => {
            // Optimistic update is already added in MessageInput, just mark it as pending
            const tempId = action.meta.arg.tempId;
            if (tempId) {
                const message = state.messages.find((msg) => msg.tempId === tempId);
                if (message) {
                    message.pending = true;
                }
            }
        });
        builder.addCase(sendMessage.fulfilled, (state, action) => {
            const { message, chatId } = action.payload;
            const tempId = action.meta.arg.tempId;

            // Update optimistic message in place to prevent flickering
            if (tempId) {
                const index = state.messages.findIndex((msg) => msg.tempId === tempId);
                if (index !== -1) {
                    // Update properties in place instead of replacing the entire object
                    const existingMsg = state.messages[index];
                    existingMsg._id = message._id;
                    existingMsg.chatId = message.chatId;
                    existingMsg.senderId = message.senderId;
                    existingMsg.receiverId = message.receiverId;
                    existingMsg.text = message.text;
                    existingMsg.fileType = message.fileType;
                    existingMsg.fileUrl = message.fileUrl;
                    existingMsg.fileName = message.fileName;
                    existingMsg.isRead = message.isRead;
                    existingMsg.isDelivered = message.isDelivered;
                    existingMsg.createdAt = message.createdAt;
                    existingMsg.updatedAt = message.updatedAt;
                    existingMsg.pending = false; // Remove pending flag
                }
            } else {
                state.messages.push(message);
            }

            if (state.selectedChat && !state.selectedChat.chatId && chatId) {
                state.selectedChat.chatId = chatId;
                state.selectedChat.type = "active";

                // Also update in sidebar list
                const conversation = state.conversations.find((c) => c._id === state.selectedChat._id);
                if (conversation) {
                    conversation.chatId = chatId;
                    conversation.type = "active";
                }
            }
            if (state.selectedChat) {
                const conversation = state.conversations.find((c) => c._id === state.selectedChat._id);

                if (conversation) {
                    conversation.unreadCount = 0;
                }
            }
        });
        builder.addCase(sendMessage.rejected, (state, action) => {
            const tempId = action.meta.arg.tempId;
            if (tempId) {
                // Remove failed optimistic message
                const index = state.messages.findIndex((msg) => msg.tempId === tempId);
                if (index !== -1) {
                    state.messages.splice(index, 1);
                }
            }
        });
    },
});

export const {
    setSelectedChat,
    addMessage,
    addOptimisticMessage,
    updateOptimisticMessage,
    updateConversationLastMessage,
    markMessagesAsRead,
    markMessageAsDelivered,
} = chatSlice.actions;
export const selectSelectedChat = (state) => state.chat.selectedChat;
export const selectConversations = (state) => state.chat.conversations;

export default chatSlice.reducer;
