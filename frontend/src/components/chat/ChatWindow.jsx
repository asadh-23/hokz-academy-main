import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
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

const ChatWindow = () => {
    const dispatch = useDispatch();
    const scrollRef = useRef();

    // 🔥 Local State
    const [showCourses, setShowCourses] = useState(false);
    const [isTyping, setIsTyping] = useState(false);

    // Redux State
    const { selectedChat, messages, loading, sharedCourses } = useSelector((state) => state.chat);
    const onlineUsers = useSelector(selectOnlineUsers);

    // Determine Receiver ID
    const receiverId =  selectedChat?._id;

    // Socket Context
    const { socket } = useSocket();

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
    }, [socket, receiverId]);

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
        <div className="flex flex-col h-full w-full bg-[#efeae2] relative font-sans">
            {/* =========================================================
                1. HEADER SECTION
               ========================================================= */}
            <div className="px-4 py-3 bg-white/95 backdrop-blur-md border-b border-gray-200 flex items-center justify-between shadow-sm sticky top-0 z-20">
                {/* LEFT: Avatar & Info */}
                <div className="flex items-center gap-3 flex-1 min-w-0">
                    <button
                        onClick={handleBack}
                        className="md:hidden text-gray-600 hover:bg-gray-100 p-2 rounded-full transition"
                    >
                        <ArrowLeftIcon className="w-5 h-5" />
                    </button>

                    <div className="relative flex-shrink-0 cursor-pointer">
                        <img
                            src={selectedChat.profileImage || "/default-avatar.png"}
                            alt="User"
                            className="w-10 h-10 rounded-full object-cover border border-gray-300 shadow-sm"
                        />
                        {isOnline && (
                            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                        )}
                    </div>

                    <div className="flex flex-col min-w-0 flex-1">
                        <h3 className="font-semibold text-gray-800 text-sm md:text-base leading-tight truncate">
                            {selectedChat.fullName}
                        </h3>
                        <span className={`text-xs font-medium ${isOnline ? "text-green-600" : "text-gray-500"}`}>
                            {isTyping ? "typing..." : isOnline ? "Active Now" : "Offline"}
                        </span>
                    </div>
                </div>

                {/* RIGHT: Actions */}
                <div className="flex items-center gap-2 text-gray-600 flex-shrink-0">
                    {/* SHARED COURSES DROPDOWN */}
                    <div className="relative">
                        <button
                            onClick={() => setShowCourses(!showCourses)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition text-xs font-semibold border
                                ${
                                    showCourses
                                        ? "bg-cyan-50 text-cyan-700 border-cyan-200"
                                        : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
                                }
                            `}
                        >
                            <AcademicCapIcon className="w-4 h-4" />
                            <span className="hidden sm:inline">Courses</span>
                            <span className="bg-gray-200 text-gray-700 text-[10px] px-1.5 py-0.5 rounded-full">
                                {sharedCourses?.length || 0}
                            </span>
                            <ChevronDownIcon
                                className={`w-3 h-3 transition-transform duration-200 ${showCourses ? "rotate-180" : ""}`}
                            />
                        </button>

                        {/* DROPDOWN CONTENT */}
                        {showCourses && (
                            <div className="absolute top-full right-0 mt-3 w-80 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-30 animate-in fade-in slide-in-from-top-2 duration-200">
                                <div className="p-3 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
                                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                                        Enrolled Courses
                                    </h4>
                                </div>

                                <div className="max-h-72 overflow-y-auto custom-scrollbar">
                                    {sharedCourses?.length > 0 ? (
                                        sharedCourses.map((enrollment) => (
                                            <div
                                                key={enrollment._id}
                                                className="flex items-center gap-3 p-3 hover:bg-blue-50/50 cursor-pointer border-b border-gray-50 last:border-0 transition-colors group"
                                            >
                                                <img
                                                    src={enrollment.course?.thumbnailUrl || "/course-placeholder.jpg"}
                                                    alt="course"
                                                    className="w-12 h-12 rounded-lg object-cover bg-gray-200 shadow-sm group-hover:scale-105 transition-transform"
                                                />
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-semibold text-gray-800 truncate">
                                                        {enrollment.course?.title}
                                                    </p>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <span
                                                            className={`text-[10px] px-1.5 py-0.5 rounded border ${
                                                                enrollment.course?.isActive
                                                                    ? "bg-green-50 text-green-700 border-green-200"
                                                                    : "bg-gray-50 text-gray-500 border-gray-200"
                                                            }`}
                                                        >
                                                            {enrollment.course?.isActive ? "Active" : "Inactive"}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="p-8 text-center text-gray-400 text-sm flex flex-col items-center">
                                            <AcademicCapIcon className="w-10 h-10 mb-2 opacity-20" />
                                            <p>No shared courses found.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="h-6 w-px bg-gray-200 mx-1"></div>

                    <button className="p-2 hover:bg-gray-100 rounded-full transition text-gray-500 hover:text-cyan-600">
                        <VideoCameraIcon className="w-5 h-5" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-full transition text-gray-500 hover:text-cyan-600">
                        <EllipsisVerticalIcon className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* =========================================================
                2. MESSAGES AREA
               ========================================================= */}
            <div
                className="flex-1 overflow-y-auto p-4 custom-scrollbar flex flex-col"
                style={{
                    backgroundImage:
                        "url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')",
                    backgroundRepeat: "repeat",
                    backgroundColor: "#efeae2", // WhatsApp-like subtle beige
                }}
            >
                {loading ? (
                    <div className="flex-1 flex justify-center items-center">
                        <div className="bg-white/80 backdrop-blur-sm p-4 rounded-full shadow-sm">
                            <div className="w-6 h-6 border-2 border-cyan-600 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    </div>
                ) : messages.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
                        <div className="bg-white p-6 rounded-3xl shadow-sm mb-4">
                            <span className="text-4xl">👋</span>
                        </div>
                        <h3 className="text-gray-800 font-bold text-lg mb-1">No messages yet</h3>
                        <p className="text-gray-500 text-sm max-w-xs leading-relaxed">
                            Send a message to start the conversation with{" "}
                            <span className="font-semibold text-cyan-700">{selectedChat.fullName}</span>.
                        </p>
                    </div>
                ) : (
                    <>
                        {messages.map((msg) => (
                            <MessageBubble key={msg._id} message={msg} />
                        ))}

                        {/* 🔥 TYPING INDICATOR UI 🔥 */}
                        {isTyping && (
                            <div className="flex justify-start mb-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                <div className="bg-white px-4 py-3 rounded-xl rounded-tl-none shadow-sm border border-gray-100 flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
                                </div>
                            </div>
                        )}
                    </>
                )}

                {/* Scroll Anchor */}
                <div ref={scrollRef} className="h-px" />
            </div>

            {/* =========================================================
                3. INPUT AREA
               ========================================================= */}
            <div className="sticky bottom-0 z-20">
                <MessageInput chatId={selectedChat.chatId} receiverId={receiverId} />
            </div>
        </div>
    );
};

export default ChatWindow;
