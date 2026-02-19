import { useSelector } from "react-redux";
import { CheckIcon } from "@heroicons/react/24/outline";
import { DocumentIcon, ArrowDownTrayIcon } from "@heroicons/react/24/solid";

// Selectors
import { selectUser } from "../../store/features/auth/userAuthSlice";
import { selectTutor } from "../../store/features/auth/tutorAuthSlice";
import { selectOnlineUsers } from "../../store/features/socket/socketSlice";

const MessageBubble = ({ message }) => {
    const user = useSelector(selectUser);
    const tutor = useSelector(selectTutor);
    const currentUser = user || tutor;

    const isMe = message.senderId === currentUser?._id;

    // ---------------------------------------------
    // 🔥 FINAL TICK LOGIC 🔥
    // ---------------------------------------------
    let tickStatus = "sent";

    // Check if message is pending (optimistic update)
    if (message.pending) {
        tickStatus = "pending";
    }
    // Priority 1: Read
    else if (message.isRead) {
        tickStatus = "read";
    }
    // Priority 2: Delivered
    else if (message.isDelivered) {
        tickStatus = "delivered";
    }

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    };

    // ---------------------------------------------
    // 🔥 REDESIGNED TICK COMPONENTS 🔥
    // ---------------------------------------------

    // 0. Pending (Loading) -> Small spinner
    const PendingTick = () => (
        <div className="w-3 h-3 border-2 border-white/40 border-t-white/90 rounded-full animate-spin"></div>
    );

    // 1. Single Tick (Sent) -> Slightly faded white
    const SingleTick = () => <CheckIcon className="w-3 h-3 text-white/60" strokeWidth={3} />;

    // 2. Double Tick (Delivered) -> Bright white
    const DoubleTickDelivered = () => (
        <div className="flex items-center -space-x-1">
            <CheckIcon className="w-3 h-3 text-white/90" strokeWidth={3} />
            <CheckIcon className="w-3 h-3 text-white/90" strokeWidth={3} />
        </div>
    );

    // 3. Double Tick (Read) -> Golden/Yellow (High Contrast on Cyan)
    // Blue tick on Cyan bg is hard to see. Yellow/Gold pops out perfectly!
    const DoubleTickRead = () => (
        <div className="flex items-center -space-x-1">
            <CheckIcon className="w-3 h-3 text-yellow-300" strokeWidth={4} />
            <CheckIcon className="w-3 h-3 text-yellow-300" strokeWidth={4} />
        </div>
    );

    return (
        <div className={`flex w-full mb-2 ${isMe ? "justify-end" : "justify-start"}`}>
            <div
                className={`relative max-w-[85%] sm:max-w-[70%] px-3 py-2 rounded-lg shadow-sm text-sm 
          ${
              isMe
                  ? "bg-cyan-600 text-white rounded-tr-sm" // Solid Cyan for better contrast
                  : "bg-white text-gray-800 border border-gray-200 rounded-tl-sm"
          }
        `}
            >
                {/* ---------------- MEDIA CONTENT ---------------- */}
                {message.fileType === "image" && (
                    <div className="mb-2 overflow-hidden rounded-md border border-black/10">
                        <img
                            src={message.fileUrl}
                            alt="img"
                            className="w-full h-auto max-h-72 object-cover cursor-pointer hover:opacity-95 transition"
                            onClick={() => window.open(message.fileUrl, "_blank")}
                        />
                    </div>
                )}

                {message.fileType === "video" && (
                    <div className="mb-2 rounded-lg overflow-hidden bg-black">
                        <video controls src={message.fileUrl} className="w-full max-h-64" />
                    </div>
                )}

                {message.fileType === "pdf" && (
                    <a
                        href={message.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center gap-3 p-3 rounded-lg mb-2 transition hover:opacity-90 ${
                            isMe ? "bg-black/20" : "bg-gray-100"
                        }`}
                    >
                        <div className="bg-white p-2 rounded-full shadow-sm">
                            <DocumentIcon className="w-5 h-5 text-red-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="font-medium truncate text-xs opacity-90">Document.pdf</p>
                            <p className="text-[10px] opacity-70">Click to open</p>
                        </div>
                        <ArrowDownTrayIcon className="w-4 h-4 opacity-70" />
                    </a>
                )}

                {/* ---------------- TEXT CONTENT ---------------- */}
                {message.text && (
                    <p
                        className={`whitespace-pre-wrap break-words leading-relaxed tracking-wide ${
                            message.fileType !== "text" ? "mt-1" : ""
                        }`}
                    >
                        {message.text}
                    </p>
                )}

                {/* ---------------- FOOTER (Time & Ticks) ---------------- */}
                <div
                    className={`flex items-center justify-end gap-1 mt-1 select-none ${
                        isMe ? "text-cyan-100" : "text-gray-400"
                    }`}
                >
                    {/* Time */}
                    <span className="text-[9px] font-medium tracking-wide opacity-90">{formatTime(message.createdAt)}</span>

                    {/* 🔥 TICKS DISPLAY (Only for sender) 🔥 */}
                    {isMe && (
                        <span className="flex items-center ml-1 transition-all duration-200">
                            {tickStatus === "pending" && <PendingTick />}
                            {tickStatus === "read" && <DoubleTickRead />}
                            {tickStatus === "delivered" && <DoubleTickDelivered />}
                            {tickStatus === "sent" && <SingleTick />}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MessageBubble;
