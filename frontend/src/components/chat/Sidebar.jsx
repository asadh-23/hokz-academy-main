import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { format } from "timeago.js"; // For time formatting (e.g., "5 min ago")
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline"; // Search Icon
// Actions & Selectors
import { setSelectedChat } from "../../store/features/chat/chatSlice";
import { selectOnlineUsers } from "../../store/features/socket/socketSlice";
import { formatText } from "../../utils/formatText";
import { AcademicCapIcon } from "@heroicons/react/24/solid";
import { selectUser } from "../../store/features/auth/userAuthSlice";
import { selectTutor } from "../../store/features/auth/tutorAuthSlice";

const Sidebar = () => {
    const dispatch = useDispatch();

    // 1. Redux State
    const { conversations = [], selectedChat, loading } = useSelector((state) => state.chat);

    const onlineUsers = useSelector(selectOnlineUsers);
    // 2. Local State for Search
    const [searchTerm, setSearchTerm] = useState("");

    const user = useSelector(selectUser);
    const tutor = useSelector(selectTutor);
    const role = user?.role || tutor?.role;

    // 3. Filter Conversations based on Search
    const filteredConversations = conversations.filter((chat) =>
        chat.fullName.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    // 4. Helper to check if a user is online
    const isUserOnline = (userId) => onlineUsers.includes(userId);

    return (
        <div className="flex flex-col h-full bg-white">
            <div className="p-6 bg-[#1E2EDE] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#14C4E7] opacity-10 rounded-full -translate-y-16 translate-x-16"></div>
                <h2 className="text-2xl font-black text-white mb-5 tracking-tight uppercase flex items-center gap-3">
                    <div className="bg-[#E6D929] p-1.5 rounded-lg">
                        <AcademicCapIcon className="w-5 h-5 text-[#1E2EDE]" />
                    </div>
                    Chats
                </h2>

                <div className="relative group">
                    <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 group-focus-within:text-[#E6D929] transition-colors" />
                    <input
                        type="text"
                        placeholder="Search peers or tutors..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 bg-white/10 border-none rounded-2xl focus:ring-2 focus:ring-[#E6D929] transition-all text-sm text-white placeholder-white/40 font-bold backdrop-blur-md"
                    />
                </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 opacity-20">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1E2EDE]"></div>
                    </div>
                ) : filteredConversations.length === 0 ? (
                    <div className="flex flex-col items-center justify-center text-center px-6 py-20">
                        <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
                            <AcademicCapIcon className="w-8 h-8 text-slate-300" />
                        </div>

                        <h3 className="text-sm font-black text-slate-700 mb-2">No Conversations Yet</h3>

                        <p className="text-xs text-slate-400 font-medium max-w-xs">
                            {conversations.length === 0
                                ? role === "user"
                                    ? "Enroll in a course to start chatting with tutors."
                                    : "Students will appear here once they enroll in your course."
                                : "No results found for your search."}
                        </p>
                    </div>
                ) : (
                    filteredConversations.map((chat) => {
                        const isSelected = selectedChat?._id === chat._id;
                        return (
                            <div
                                key={chat._id}
                                onClick={() => dispatch(setSelectedChat(chat))}
                                className={`flex items-center gap-4 p-5 cursor-pointer transition-all border-b border-slate-50 relative group
                                ${isSelected ? "bg-slate-50" : "hover:bg-slate-50/50"}`}
                            >
                                {isSelected && (
                                    <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#1E2EDE] rounded-r-full"></div>
                                )}

                                <div className="relative shrink-0">
                                   
                                    <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-white shadow-sm ring-2 ring-[#14C4E7]/20 relative">
                                        {chat.profileImage ? (
                                            <img
                                                src={chat.profileImage}
                                                alt={chat.fullName || "User"}
                                                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                                            />
                                        ) : (
                                            /* Fallback: Name initial with Blue Gradient */
                                            <div className="w-full h-full bg-gradient-to-br from-[#1E2EDE] to-[#14C4E7] flex items-center justify-center text-white text-xl font-black">
                                                {chat.fullName ? chat.fullName.charAt(0).toUpperCase() : "U"}
                                            </div>
                                        )}
                                    </div>

                                    {/* Online Status Indicator */}
                                    {isUserOnline(chat._id) && (
                                        <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full z-10"></span>
                                    )}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-center mb-1">
                                        <h3
                                            className={`text-sm font-black truncate ${chat.unreadCount > 0 ? "text-[#1E2EDE]" : "text-slate-800"}`}
                                        >
                                            {chat.fullName}
                                        </h3>
                                        <span className="text-[10px] font-black text-slate-300 uppercase">
                                            {chat.lastMessageTime && format(chat.lastMessageTime)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <p
                                            className={`text-xs truncate font-medium ${chat.unreadCount > 0 ? "text-slate-600" : "text-slate-400"}`}
                                        >
                                            {chat.lastMessage || "Start learning..."}
                                        </p>
                                        {chat.unreadCount > 0 && (
                                            <span className="bg-[#E6D929] text-[#1E2EDE] text-[10px] font-black px-2 py-0.5 rounded-lg shadow-sm">
                                                {chat.unreadCount}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default Sidebar;
