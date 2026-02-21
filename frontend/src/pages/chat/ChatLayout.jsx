import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    getConversations,
    addMessage,
    updateConversationLastMessage,
    markMessagesAsRead,
    markMessageAsDelivered,
    setSelectedChat,
} from "../../store/features/chat/chatSlice";
import Sidebar from "../../components/chat/Sidebar";
import ChatWindow from "../../components/chat/ChatWindow";
import { useSocket } from "../../contexts/SocketContext";
import { selectUser } from "../../store/features/auth/userAuthSlice";
import { selectTutor } from "../../store/features/auth/tutorAuthSlice";
import { VideoCameraIcon } from "@heroicons/react/24/solid";
import { useLocation, useNavigate } from "react-router-dom";

const ChatLayout = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const { selectedChat, conversations } = useSelector((state) => state.chat);
    const user = useSelector(selectUser);
    const tutor = useSelector(selectTutor);
    const currentUser = user || tutor;

    const { socket } = useSocket();

    const [callerId, setCallerId] = useState(null);
    const [callerName, setCallerName] = useState(null);
    const [showCallModal, setShowCallModal] = useState(false);
    const [incomingRoomId, setIncomingRoomId] = useState(null);

    // 1. Load Sidebar Conversations on Mount
    useEffect(() => {
        dispatch(getConversations());
    }, [dispatch]);

    useEffect(() => {
        const tutorIdFromState = location.state?.tutorId;

        if (tutorIdFromState && conversations.length > 0) {
            const tutorChat = conversations.find((c) => c._id === tutorIdFromState);

            if (tutorChat) {
                dispatch(setSelectedChat(tutorChat));

                navigate(location.pathname, { replace: true, state: {} });
            }
        }
    }, [location.state, conversations, dispatch, navigate, location.pathname]);

    const acceptCall = () => {
        setShowCallModal(false);
        navigate(`/${currentUser.role}/room/${incomingRoomId}`);
    };

    const rejectCall = () => {
        setShowCallModal(false);

        if (socket && callerId) {
            socket.emit("call-rejected", { to: callerId, name: currentUser.fullName });
        }

        setIncomingRoomId(null);
        setCallerId(null);
    };

    const handleIncomingCall = useCallback(({ from, roomId, callerName }) => {
        setIncomingRoomId(roomId);
        setCallerId(from);
        setCallerName(callerName);
        setShowCallModal(true);
    }, []);

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
        socket.on("incoming-call", handleIncomingCall);
        // Cleanup Function
        return () => {
            socket.off("receive_message", handleReceiveMessage);
            socket.off("notification", handleNotification);
            socket.off("message_seen_update", handleMessagesRead);
            socket.off("messages_read", handleMessagesRead);
            socket.off("message_delivered_update", handleMessageDelivered);
            socket.off("incoming-call", handleIncomingCall);
        };
    }, [socket, selectedChat, dispatch, conversations]);

    return (
        <div className="flex h-[calc(100vh-80px)] bg-[#FDFDFD] overflow-hidden">
            {/* Sidebar */}
            <div
                className={`${selectedChat ? "hidden md:block" : "w-full"} md:w-[400px] border-r border-slate-100 bg-white z-20`}
            >
                <Sidebar />
            </div>

            {/* Chat Window Area */}
            <div className={`${!selectedChat ? "hidden md:flex" : "w-full"} flex-1 bg-slate-50 relative`}>
                {showCallModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#1E2EDE]/20 backdrop-blur-md p-4">
                        <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in duration-300 border border-white">
                            <div className="bg-[#1E2EDE] p-10 flex flex-col items-center relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-[#14C4E7] opacity-10 rounded-full -translate-y-16 translate-x-16"></div>
                                <div className="w-24 h-24 bg-white/10 rounded-3xl flex items-center justify-center animate-pulse border border-white/20">
                                    <VideoCameraIcon className="w-12 h-12 text-[#E6D929]" />
                                </div>
                                <h2 className="text-white font-black text-2xl mt-6 uppercase tracking-tight">
                                    Incoming Call
                                </h2>
                                <p className="text-[#14C4E7] text-xs font-bold uppercase tracking-widest mt-1">
                                    Live Mentorship Session
                                </p>
                            </div>

                            <div className="p-8 flex flex-col items-center gap-8">
                                <p className="text-slate-600 text-center font-bold text-lg leading-tight">
                                    <span className="text-[#1E2EDE]">{callerName}</span> is requesting a video consultation.
                                </p>

                                <div className="flex gap-4 w-full">
                                    <button
                                        onClick={rejectCall}
                                        className="flex-1 py-4 px-4 bg-slate-100 text-slate-400 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-red-50 hover:text-red-500 transition-all"
                                    >
                                        Decline
                                    </button>
                                    <button
                                        onClick={acceptCall}
                                        className="flex-1 py-4 px-4 bg-[#1E2EDE] text-[#E6D929] rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[#14C4E7] transition-all shadow-xl shadow-blue-100"
                                    >
                                        Accept
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {selectedChat ? (
                    <ChatWindow />
                ) : (
                    <div className="flex flex-col items-center justify-center w-full h-full bg-[#FDFDFD]">
                        <div className="text-center max-w-sm px-6">
                            <div className="mb-8 relative">
                                <div className="w-40 h-40 mx-auto bg-slate-50 rounded-[3rem] flex items-center justify-center shadow-inner border border-slate-100">
                                    <svg
                                        className="w-20 h-20 text-[#14C4E7]/30"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="1"
                                            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                                        ></path>
                                    </svg>
                                </div>
                                <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-[#E6D929] rounded-2xl flex items-center justify-center shadow-xl border-4 border-white transform rotate-12">
                                    <span className="text-2xl">🎓</span>
                                </div>
                            </div>
                            <h2 className="text-3xl font-black text-[#1E2EDE] mb-3 uppercase tracking-tight">
                                Student Portal
                            </h2>
                            <p className="text-slate-400 text-sm font-medium leading-relaxed">
                                Pick a conversation to start your educational exchange. Mentors are ready to guide you.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChatLayout;
