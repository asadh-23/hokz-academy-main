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
        <div className="flex items-center -space-x-1.5">
            <CheckIcon className="w-3.5 h-3.5 text-[#E6D929]" strokeWidth={4} />
            <CheckIcon className="w-3.5 h-3.5 text-[#E6D929]" strokeWidth={4} />
        </div>
    );

    return (
        <div className={`flex w-full mb-4 ${isMe ? "justify-end" : "justify-start"}`}>
            <div
                className={`relative max-w-[85%] sm:max-w-[70%] px-4 py-3 rounded-3xl shadow-sm text-sm transition-all
                ${isMe ? "bg-[#1E2EDE] text-white rounded-tr-none shadow-blue-900/10" : "bg-white text-slate-700 rounded-tl-none border border-slate-100"}`}
            >
                {message.fileType === "image" && (
                    <div className="mb-2 rounded-2xl overflow-hidden border-2 border-white/10 shadow-sm">
                        <img
                            src={message.fileUrl}
                            className="w-full max-h-80 object-cover cursor-zoom-in"
                            onClick={() => window.open(message.fileUrl, "_blank")}
                            alt=""
                        />
                    </div>
                )}

                {message.text && <p className="leading-relaxed font-medium tracking-wide">{message.text}</p>}

                <div className={`flex items-center justify-end gap-1.5 mt-2 ${isMe ? "text-white/60" : "text-slate-300"}`}>
                    <span className="text-[9px] font-black uppercase tracking-tighter">
                        {formatTime(message.createdAt)}
                    </span>
                    {isMe && (
                        <span className="flex items-center ml-0.5">
                            {tickStatus === "read" ? <DoubleTickRead /> : <CheckIcon className="w-3 h-3" strokeWidth={3} />}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MessageBubble;
