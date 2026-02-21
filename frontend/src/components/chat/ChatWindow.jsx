import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
    PhoneIcon,
    VideoCameraIcon,
    EllipsisVerticalIcon,
    ArrowLeftIcon,
    AcademicCapIcon,
    ChevronDownIcon,
} from "@heroicons/react/24/solid";

import MessageInput from "./MessageInput";
import MessageBubble from "./MessageBubble";

import { getMessages, setSelectedChat, getSharedCourses } from "../../store/features/chat/chatSlice";
import { selectOnlineUsers } from "../../store/features/socket/socketSlice";
import { useSocket } from "../../contexts/SocketContext";
import { selectUser } from "../../store/features/auth/userAuthSlice";
import { selectTutor } from "../../store/features/auth/tutorAuthSlice";
import { useCallback } from "react";

const ChatWindow = () => {
    const dispatch = useDispatch();
    const scrollRef = useRef();

    const navigate = useNavigate();

    const { socket } = useSocket();

    const user = useSelector(selectUser);
    const tutor = useSelector(selectTutor);

    const currentUser = user || tutor;

    const [showCourses, setShowCourses] = useState(false);
    const [isTyping, setIsTyping] = useState(false);

    // Redux State
    const { selectedChat, messages, loading, sharedCourses } = useSelector((state) => state.chat);
    const onlineUsers = useSelector(selectOnlineUsers);

    // Determine Receiver ID
    const receiverId = selectedChat?._id;

    const handleCall = () => {
        if (!receiverId || !socket) return;
        const generatedRoomId = Date.now().toString();
        socket.emit("call-user", { to: receiverId, roomId: generatedRoomId, callerName: currentUser.fullName });
        navigate(`/${currentUser.role}/room/${generatedRoomId}`);
    };

    // Socket Context

    // ------------------------------------------------
    // 🔥 SOCKET: TYPING LISTENERS
    // ------------------------------------------------
    useEffect(() => {
        if (!socket) return;

        const handleDisplayTyping = ({ senderId }) => {
            if (receiverId === senderId) {
                setIsTyping(true);
                scrollRef.current?.scrollIntoView({ behavior: "smooth" });
            }
        };

        const handleHideTyping = ({ senderId }) => {
            if (receiverId === senderId) {
                setIsTyping(false);
            }
        };

        socket.on("display_typing", handleDisplayTyping);
        socket.on("hide_typing", handleHideTyping);

        return () => {
            socket.off("display_typing", handleDisplayTyping);
            socket.off("hide_typing", handleHideTyping);
        };
    }, [socket, receiverId, navigate, currentUser]);

    // ------------------------------------------------
    // 🔥 FETCH DATA & SCROLL
    // ------------------------------------------------

    // Check if user is online
    const isOnline = onlineUsers.includes(receiverId);

    // Fetch Messages & Courses
    useEffect(() => {
        if (receiverId) {
            dispatch(getMessages(receiverId));
            dispatch(getSharedCourses(receiverId));
            setShowCourses(false);
            setIsTyping(false); // Reset typing on chat switch
        }
    }, [receiverId, dispatch]);

    // Auto Scroll on new message or typing
    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isTyping]);

    const handleBack = () => {
        dispatch(setSelectedChat(null));
    };

    if (!selectedChat) return null;

    return (
        <div className="flex flex-col h-full w-full bg-[#FDFDFD] relative">
            <div className="px-6 py-4 bg-white/95 backdrop-blur-md border-b border-slate-100 flex items-center justify-between sticky top-0 z-30 shadow-sm">
                <div className="flex items-center gap-4 min-w-0">
                    <button
                        onClick={handleBack}
                        className="md:hidden text-slate-400 hover:text-[#1E2EDE] p-2 bg-slate-50 rounded-xl transition"
                    >
                        <ArrowLeftIcon className="w-5 h-5" />
                    </button>
                    <div className="relative shrink-0">
                        <img
                            src={selectedChat.profileImage || "/default-avatar.png"}
                            className="w-12 h-12 rounded-2xl object-cover border-2 border-[#14C4E7]/20"
                            alt=""
                        />
                        {isOnline && (
                            <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full scale-75"></span>
                        )}
                    </div>
                    <div className="flex flex-col min-w-0">
                        <h3 className="font-black text-[#1E2EDE] text-base leading-tight truncate uppercase tracking-tight">
                            {selectedChat.fullName}
                        </h3>
                        <span
                            className={`text-[10px] font-black uppercase tracking-widest mt-0.5 ${isTyping ? "text-[#14C4E7] animate-pulse" : isOnline ? "text-green-500" : "text-slate-300"}`}
                        >
                            {isTyping ? "Typing..." : isOnline ? "Online" : "Offline"}
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative">
                        <button
                            onClick={() => setShowCourses(!showCourses)}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-black text-[10px] uppercase tracking-widest transition border
                            ${showCourses ? "bg-[#1E2EDE] text-[#E6D929] border-[#1E2EDE]" : "bg-slate-50 text-slate-500 border-slate-100 hover:border-[#1E2EDE]"}`}
                        >
                            <AcademicCapIcon className="w-4 h-4" />
                            <span className="hidden sm:inline">Modules</span>
                            <ChevronDownIcon
                                className={`w-3 h-3 transition-transform ${showCourses ? "rotate-180" : ""}`}
                            />
                        </button>

                        {showCourses && (
                            <div className="absolute top-full right-0 mt-3 w-80 bg-white rounded-[2rem] shadow-2xl border border-slate-100 overflow-hidden z-40 animate-in fade-in zoom-in-95">
                                <div className="p-5 bg-slate-50 border-b border-slate-100">
                                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                        Enrollment Links
                                    </h4>
                                </div>
                                <div className="max-h-80 overflow-y-auto custom-scrollbar p-2">
                                    {sharedCourses?.length > 0 ? (
                                        sharedCourses.map((enrollment) => (
                                            <div
                                                key={enrollment._id}
                                                className="flex items-center gap-4 p-3 hover:bg-slate-50 rounded-2xl transition-all group"
                                            >
                                                <img
                                                    src={enrollment.course?.thumbnailUrl}
                                                    className="w-14 h-14 rounded-xl object-cover bg-slate-100 group-hover:rotate-3 transition-transform"
                                                    alt=""
                                                />
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-bold text-[#1E2EDE] truncate">
                                                        {enrollment.course?.title}
                                                    </p>
                                                    <span className="text-[9px] font-black text-[#14C4E7] uppercase tracking-tighter">
                                                        View Lesson Details
                                                    </span>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="p-10 text-center text-slate-300 font-bold uppercase text-[10px]">
                                            No Shared Progress
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                    <button
                        onClick={handleCall}
                        className="p-3 bg-slate-50 text-slate-400 hover:text-[#1E2EDE] hover:bg-[#1E2EDE]/5 rounded-2xl transition"
                    >
                        <VideoCameraIcon className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <div
                className="flex-1 overflow-y-auto p-6 custom-scrollbar bg-slate-50"
                style={{ backgroundImage: "radial-gradient(#14C4E722 1px, transparent 0)", backgroundSize: "30px 30px" }}
            >
                {messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center">
                        <div className="w-24 h-24 bg-white rounded-[2.5rem] shadow-sm flex items-center justify-center mb-6 text-4xl">
                            📚
                        </div>
                        <h3 className="text-[#1E2EDE] font-black text-xl uppercase tracking-tight">Academic Chat</h3>
                        <p className="text-slate-400 text-xs font-medium max-w-[200px] mt-2">
                            Introduce yourself to start this mentor-student session.
                        </p>
                    </div>
                ) : (
                    messages.map((msg) => <MessageBubble key={msg._id || msg.tempId} message={msg} />)
                )}
                {isTyping && (
                    <div className="flex justify-start mb-4">
                        <div className="bg-white px-4 py-3 rounded-2xl rounded-tl-none shadow-sm flex gap-1 items-center">
                            <span className="w-1.5 h-1.5 bg-[#14C4E7] rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                            <span className="w-1.5 h-1.5 bg-[#14C4E7] rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                            <span className="w-1.5 h-1.5 bg-[#14C4E7] rounded-full animate-bounce"></span>
                        </div>
                    </div>
                )}
                <div ref={scrollRef} />
            </div>
            <MessageInput chatId={selectedChat.chatId} receiverId={receiverId} />
        </div>
    );
};

export default ChatWindow;
