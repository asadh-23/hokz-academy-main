import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    PaperClipIcon,
    PaperAirplaneIcon,
    XCircleIcon,
    DocumentIcon,
    VideoCameraIcon,
    PhotoIcon,
} from "@heroicons/react/24/solid";

import { sendMessage } from "../../store/features/chat/chatSlice";
import { useSocket } from "../../contexts/SocketContext";
import { selectUser } from "../../store/features/auth/userAuthSlice";
import { selectTutor } from "../../store/features/auth/tutorAuthSlice";

const MessageInput = ({ chatId, receiverId }) => {
    const dispatch = useDispatch();

    // States
    const [text, setText] = useState("");
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);

    const { socket } = useSocket();
    const typingTimeoutRef = useRef(null);
    const fileInputRef = useRef();

    // Auth Selectors
    const user = useSelector(selectUser);
    const tutor = useSelector(selectTutor);
    const currentUserId = user?._id || tutor?._id;

    // ------------------------------------------------
    // 🔥 EFFECT: CLEANUP MEMORY (Object URLs)
    // ------------------------------------------------
    useEffect(() => {
        return () => {
            if (preview) {
                URL.revokeObjectURL(preview);
            }
        };
    }, [preview]);

    // ------------------------------------------------
    // 📁 FILE HANDLING
    // ------------------------------------------------
    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setPreview(URL.createObjectURL(selectedFile));
        }
    };

    const clearFile = () => {
        setFile(null);
        setPreview(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    // ------------------------------------------------
    // ⌨️ TYPING LOGIC
    // ------------------------------------------------
    const handleTyping = (e) => {
        setText(e.target.value);

        if (!socket) return;

        socket.emit("typing", { receiverId: receiverId, senderId: currentUserId });

        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

        typingTimeoutRef.current = setTimeout(() => {
            socket.emit("stop_typing", { receiverId, senderId: currentUserId });
            
        }, 2000);
    };

    // ------------------------------------------------
    // 🚀 SEND MESSAGE
    // ------------------------------------------------
    const handleSend = async (e) => {
        e?.preventDefault();

        const hasContent = text.trim() || file;
        const hasTarget = chatId || receiverId;

        if (!hasContent || !hasTarget) return;

        // Dispatch Action
        dispatch(
            sendMessage({
                chatId,
                receiverId,
                text,
                file,
            }),
        );

        // Immediate Cleanup
        socket.emit("stop_typing", { receiverId, senderId: currentUserId });
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

        setText("");
        clearFile();
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="p-3 bg-white/90 backdrop-blur-sm border-t border-gray-100 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-20 relative">
            {/* =========================================================
                🟢 FILE PREVIEW AREA (Animated Card)
               ========================================================= */}
            {file && (
                <div className="absolute bottom-full left-4 mb-2 animate-in fade-in slide-in-from-bottom-3 duration-200">
                    <div className="relative flex items-center gap-3 p-2 pr-8 bg-white rounded-2xl border border-gray-200 shadow-xl w-fit max-w-[90vw]">
                        {/* Thumbnail */}
                        <div className="relative flex-shrink-0 w-12 h-12 rounded-xl overflow-hidden bg-gray-100 border border-gray-100">
                            {file.type.startsWith("image") ? (
                                <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                            ) : file.type.startsWith("video") ? (
                                <div className="w-full h-full flex items-center justify-center bg-purple-50 text-purple-500">
                                    <VideoCameraIcon className="w-6 h-6" />
                                </div>
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-red-50 text-red-500">
                                    <DocumentIcon className="w-6 h-6" />
                                </div>
                            )}
                        </div>

                        {/* File Info */}
                        <div className="flex flex-col overflow-hidden">
                            <span className="text-xs font-semibold text-gray-700 truncate max-w-[150px]">{file.name}</span>
                            <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wider mt-0.5">
                                {(file.size / 1024).toFixed(1)} KB • {file.type.split("/")[1] || "FILE"}
                            </span>
                        </div>

                        {/* Close Button */}
                        <button
                            onClick={clearFile}
                            className="absolute -top-2 -right-2 bg-gray-800 text-white rounded-full p-1 shadow-md hover:bg-red-500 hover:scale-110 transition-all duration-200"
                        >
                            <XCircleIcon className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}

            {/* =========================================================
                🟢 INPUT FORM
               ========================================================= */}
            <form onSubmit={handleSend} className="flex items-end gap-2 max-w-6xl mx-auto">
                {/* 1. Attachment Button */}
                <button
                    type="button"
                    onClick={() => fileInputRef.current.click()}
                    className="p-3 mb-0.5 text-gray-400 hover:text-cyan-600 hover:bg-cyan-50 rounded-full transition-all duration-200 active:scale-90"
                    title="Attach File"
                >
                    <PaperClipIcon className="w-6 h-6" />
                </button>

                {/* Hidden File Input */}
                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={handleFileChange}
                    accept="image/*,video/*,application/pdf"
                />

                {/* 2. Text Area */}
                <div className="flex-1 bg-gray-100 rounded-[24px] focus-within:bg-white focus-within:ring-2 focus-within:ring-cyan-500/50 focus-within:border-cyan-200 border border-transparent transition-all duration-200">
                    <input
                        type="text"
                        value={text}
                        onChange={handleTyping}
                        onKeyDown={handleKeyDown}
                        placeholder="Type a message..."
                        className="w-full py-3 px-5 bg-transparent text-gray-800 placeholder-gray-400 text-sm focus:outline-none rounded-[24px]"
                        autoComplete="off"
                    />
                </div>

                {/* 3. Send Button */}
                <button
                    type="submit"
                    disabled={!text.trim() && !file}
                    className={`p-3 rounded-full mb-0.5 shadow-sm flex items-center justify-center transition-all duration-300 ease-out
                        ${
                            !text.trim() && !file
                                ? "bg-gray-200 text-gray-400 cursor-not-allowed scale-95 opacity-80"
                                : "bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-400 hover:to-blue-500 hover:shadow-lg hover:scale-105 active:scale-95"
                        }
                    `}
                >
                    <PaperAirplaneIcon className="w-5 h-5 -ml-0.5 mt-0.5 -rotate-45 transform translate-x-0.5" />
                </button>
            </form>
        </div>
    );
};

export default MessageInput;
