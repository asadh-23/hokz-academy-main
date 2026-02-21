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

import { sendMessage, addOptimisticMessage } from "../../store/features/chat/chatSlice";
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

        // Create temporary ID for optimistic update
        const tempId = `temp_${Date.now()}_${Math.random()}`;

        // Create optimistic message object
        const optimisticMessage = {
            tempId,
            _id: tempId,
            senderId: currentUserId,
            text: text.trim(),
            createdAt: new Date().toISOString(),
            isRead: false,
            isDelivered: false,
            pending: true, // Flag to show loading indicator
        };

        // If file exists, add file preview data
        if (file) {
            optimisticMessage.fileType = file.type.startsWith("image")
                ? "image"
                : file.type.startsWith("video")
                  ? "video"
                  : file.type === "application/pdf"
                    ? "pdf"
                    : "file";
            optimisticMessage.fileUrl = preview; // Use the preview URL temporarily
            optimisticMessage.fileName = file.name;
        } else {
            optimisticMessage.fileType = "text";
        }

        // Add optimistic message to Redux state immediately
        dispatch(addOptimisticMessage(optimisticMessage));

        // Store values before clearing
        const messageText = text;
        const messageFile = file;

        // Immediate Cleanup
        socket.emit("stop_typing", { receiverId, senderId: currentUserId });
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

        setText("");
        clearFile();

        // Dispatch actual send action with tempId
        dispatch(
            sendMessage({
                chatId,
                receiverId,
                text: messageText,
                file: messageFile,
                tempId, // Pass tempId to match with optimistic message
            }),
        );
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="p-4 bg-white/95 backdrop-blur-md border-t border-slate-100 relative z-20">
            {file && (
                <div className="absolute bottom-full left-6 mb-4 animate-in slide-in-from-bottom-2 duration-300">
                    <div className="relative flex items-center gap-4 p-3 bg-[#1E2EDE] text-white rounded-[1.5rem] shadow-2xl border border-white/20">
                        <div className="w-12 h-12 bg-white/10 rounded-xl overflow-hidden flex items-center justify-center">
                            {file.type.startsWith("image") ? (
                                <img src={preview} className="w-full h-full object-cover" alt="" />
                            ) : (
                                <DocumentIcon className="w-6 h-6 text-[#E6D929]" />
                            )}
                        </div>
                        <div className="pr-8">
                            <p className="text-[10px] font-black truncate max-w-[120px] uppercase tracking-widest">
                                {file.name}
                            </p>
                        </div>
                        <button
                            onClick={clearFile}
                            className="absolute -top-2 -right-2 bg-[#E6D929] text-[#1E2EDE] rounded-lg p-1 hover:rotate-90 transition-transform shadow-lg"
                        >
                            <XCircleIcon className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}

            <form onSubmit={handleSend} className="flex items-center gap-4 max-w-7xl mx-auto">
                <button
                    type="button"
                    onClick={() => fileInputRef.current.click()}
                    className="p-3 text-slate-400 hover:text-[#14C4E7] bg-slate-50 rounded-2xl transition active:scale-95"
                >
                    <PaperClipIcon className="w-6 h-6" />
                </button>
                <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} />

                <div className="flex-1 relative">
                    <input
                        type="text"
                        value={text}
                        onChange={handleTyping}
                        onKeyDown={handleKeyDown}
                        placeholder="Inquire or discuss with mentor..."
                        className="w-full py-4 px-6 bg-slate-50 border-none rounded-2xl text-slate-700 placeholder-slate-300 font-bold focus:ring-2 focus:ring-[#14C4E7] focus:bg-white transition-all"
                    />
                </div>

                <button
                    type="submit"
                    disabled={!text.trim() && !file}
                    className={`p-4 rounded-2xl shadow-xl transition-all active:scale-90 flex items-center justify-center
                        ${!text.trim() && !file ? "bg-slate-100 text-slate-300" : "bg-[#1E2EDE] text-[#E6D929] hover:bg-[#14C4E7] hover:text-white shadow-blue-200"}`}
                >
                    <PaperAirplaneIcon className="w-6 h-6 -rotate-45" />
                </button>
            </form>
        </div>
    );
};

export default MessageInput;
