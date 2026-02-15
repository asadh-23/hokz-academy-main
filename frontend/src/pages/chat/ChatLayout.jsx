import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    getConversations,
    addMessage,
    updateConversationLastMessage,
    markMessagesAsRead,
    markMessageAsDelivered,
} from "../../store/features/chat/chatSlice";
import Sidebar from "../../components/chat/Sidebar";
import ChatWindow from "../../components/chat/ChatWindow";
import { useSocket } from "../../contexts/SocketContext";
import { selectUser } from "../../store/features/auth/userAuthSlice";
import { selectTutor } from "../../store/features/auth/tutorAuthSlice";

const ChatLayout = () => {
    const dispatch = useDispatch();

    const { selectedChat, conversations } = useSelector((state) => state.chat);
    const user = useSelector(selectUser);
    const tutor = useSelector(selectTutor);
    const currentUser = user || tutor;

    const { socket } = useSocket();

    // 1. Load Sidebar Conversations on Mount
    useEffect(() => {
        dispatch(getConversations());
    }, [dispatch]);

    // 2. Real-time Message & Notification Listener
    // 2. Real-time Message & Notification Listener
    useEffect(() => {
        if (!socket) return;

        // A. Listen for incoming messages (To show inside Chat Box)
        const handleReceiveMessage = (newMessage) => {
            if (selectedChat?._id === newMessage.senderId) {
                dispatch(addMessage(newMessage));
                socket.emit("mark_as_seen", {
                    chatId: newMessage?.chatId,
                    senderId: newMessage.senderId,
                    currentUserId: currentUser._id,
                });
            }
            socket.emit("message_delivered", {
                messageId: newMessage._id,
                chatId: newMessage.chatId,
                senderId: newMessage.senderId,
            });
        };

        // B. Listen for Notifications (To update Sidebar & Unread Count)
        const handleNotification = ({ chatId, senderId, unreadCount, lastMessage, updatedAt }) => {
            const isOpen = selectedChat?._id === senderId;

            const exists = conversations.some((c) => c._id === senderId);

            if (exists) {
                dispatch(
                    updateConversationLastMessage({
                        chatId,
                        senderId,
                        unreadCount: isOpen ? 0 : unreadCount,
                        lastMessage,
                        updatedAt,
                    }),
                );
            } else {
                dispatch(getConversations());
            }
        };

        const handleMessagesRead = ({ chatId, readAt }) => {
            if (selectedChat?.chatId === chatId) {
                dispatch(markMessagesAsRead({ readAt }));
            }
        };

        const handleMessageDelivered = ({ messageId, isDelivered, chatId }) => {
            if (selectedChat?.chatId === chatId) {
                dispatch(markMessageAsDelivered({ messageId, isDelivered, chatId }));
            }
        };

        socket.on("receive_message", handleReceiveMessage);
        socket.on("notification", handleNotification);

        socket.on("message_seen_update", handleMessagesRead); // From mark_as_seen (Socket event)
        socket.on("messages_read", handleMessagesRead); // From getAllMessages
        socket.on("message_delivered_update", handleMessageDelivered);
        // Cleanup Function
        return () => {
            socket.off("receive_message", handleReceiveMessage);
            socket.off("notification", handleNotification);
            socket.off("message_seen_update", handleMessagesRead);
            socket.off("messages_read", handleMessagesRead);
            socket.off("message_delivered_update", handleMessageDelivered);
        };
    }, [socket, selectedChat, dispatch, conversations]);

    return (
        <div className="flex h-[calc(100vh-80px)] bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
            {/* Sidebar */}
            <div
                className={`${selectedChat ? "hidden md:block" : "w-full"} md:w-[380px] border-r border-gray-200 bg-white shadow-sm`}
            >
                <Sidebar />
            </div>

            {/* Chat Window */}
            <div className={`${!selectedChat ? "hidden md:flex" : "w-full"} flex-1 bg-[#f0f2f5]`}>
                {selectedChat ? (
                    <ChatWindow />
                ) : (
                    <div className="flex flex-col items-center justify-center w-full h-full bg-white">
                        <div className="text-center max-w-md px-6">
                            <div className="mb-6 relative">
                                <div className="w-32 h-32 mx-auto bg-gradient-to-br from-cyan-100 to-blue-100 rounded-full flex items-center justify-center shadow-lg">
                                    <svg
                                        className="w-16 h-16 text-cyan-600"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="1.5"
                                            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                                        ></path>
                                    </svg>
                                </div>
                                <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-md">
                                    <svg
                                        className="w-6 h-6 text-white"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M5 13l4 4L19 7"
                                        ></path>
                                    </svg>
                                </div>
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome to Chat</h2>
                            <p className="text-gray-500 text-sm leading-relaxed">
                                Select a conversation from the sidebar to start messaging with your students or tutors
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChatLayout;
