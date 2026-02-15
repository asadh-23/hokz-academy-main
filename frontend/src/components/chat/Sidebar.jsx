import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { format } from "timeago.js"; // For time formatting (e.g., "5 min ago")
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline"; // Search Icon

// Actions & Selectors
import { setSelectedChat } from "../../store/features/chat/chatSlice";
import { selectOnlineUsers } from "../../store/features/socket/socketSlice";

const Sidebar = () => {
  const dispatch = useDispatch();
  
  // 1. Redux State
  const { conversations = [], selectedChat, loading } = useSelector((state) => state.chat);

  const onlineUsers = useSelector(selectOnlineUsers);
  // 2. Local State for Search
  const [searchTerm, setSearchTerm] = useState("");

  // 3. Filter Conversations based on Search
  const filteredConversations = conversations.filter((chat) =>
    chat.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 4. Helper to check if a user is online
  const isUserOnline = (userId) => onlineUsers.includes(userId);

  return (
    <div className="flex flex-col h-full bg-white">
      
      {/* 🟢 HEADER & SEARCH */}
      <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-cyan-600 to-blue-600">
        <h2 className="text-xl font-bold text-white mb-3 tracking-tight flex items-center gap-2">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
          </svg>
          Messages
        </h2>
        
        {/* Search Input */}
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search conversations..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white/95 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 transition-all text-sm placeholder-gray-400 shadow-sm"
          />
        </div>
      </div>

      {/* 🟢 CHAT LIST */}
      <div className="flex-1 overflow-y-auto custom-scrollbar bg-white">
        {loading ? (
          // Loading Skeleton
          <div className="flex flex-col items-center justify-center h-40 space-y-3">
             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-600"></div>
             <p className="text-xs text-gray-400">Loading conversations...</p>
          </div>
        ) : filteredConversations.length === 0 ? (
          // Empty State
          <div className="flex flex-col items-center justify-center h-full text-center p-6">
             <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
               <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
               </svg>
             </div>
             <p className="text-gray-600 font-medium text-sm">No conversations yet</p>
             <p className="text-xs text-gray-400 mt-1">Start chatting to see conversations here</p>
          </div>
        ) : (
          // List Items
          filteredConversations.map((chat) => {
           const isSelected = selectedChat?._id === chat._id;
           const isOnline = isUserOnline(chat._id);

            return (
              <div
                key={chat._id}
                onClick={() => dispatch(setSelectedChat(chat))}
                className={`group relative flex items-center gap-3 p-3 cursor-pointer transition-all duration-150 border-b border-gray-100 hover:bg-gray-50
                  ${isSelected ? "bg-cyan-50/50 border-l-4 border-l-cyan-500" : "border-l-4 border-l-transparent"}
                `}
              >
                {/* 1. AVATAR SECTION */}
                <div className="relative flex-shrink-0">
                  <img
                    src={chat.profileImage || "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"}
                    alt={chat.fullName}
                    className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-sm"
                  />
                  {/* Online Status Dot */}
                  {isOnline && (
                    <span className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></span>
                  )}
                </div>

                {/* 2. TEXT CONTENT */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-0.5">
                    <h3 className={`text-sm font-semibold truncate ${chat.unreadCount > 0 ? "text-gray-900" : "text-gray-700"}`}>
                      {chat.fullName}
                    </h3>
                    
                    {/* Time */}
                    {chat.lastMessageTime && (
                      <span className={`text-[11px] flex-shrink-0 ml-2 ${chat.unreadCount > 0 ? "text-cyan-600 font-semibold" : "text-gray-400"}`}>
                        {format(chat.lastMessageTime)}
                      </span>
                    )}
                  </div>

                  <div className="flex justify-between items-center gap-2">
                    <p className={`text-xs truncate flex-1 ${chat.unreadCount > 0 ? "text-gray-700 font-medium" : "text-gray-500"}`}>
                      {chat.lastMessage || "No messages yet"}
                    </p>
                    
                    {/* Unread Badge */}
                    {chat.unreadCount > 0 && (
                      <span className="flex items-center justify-center min-w-[20px] h-5 px-1.5 bg-cyan-500 text-white text-[10px] font-bold rounded-full shadow-sm">
                        {chat.unreadCount > 99 ? '99+' : chat.unreadCount}
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