import { useState, useRef, useEffect } from "react";
import { BellIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useDispatch, useSelector } from "react-redux";
import { clearAllNotifications, fetchNotifications } from "../../store/features/notification/notificationSlice";


const NotificationDropdown = () => {
    const { items, unreadCount } = useSelector((state) => state.notifications);
    const dispatch = useDispatch();
    
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        dispatch(fetchNotifications());
    }, [dispatch]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <button 
                onClick={() => setIsOpen(!isOpen)} 
                className={`relative p-2 rounded-full transition-all duration-200 
                    ${isOpen ? "bg-cyan-50 text-cyan-600" : "hover:bg-gray-100 text-gray-600"}
                `}
            >
                <BellIcon className="w-6 h-6" />
                
                {/* Badge Count */}
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center border-2 border-white shadow-sm transform scale-100 animate-in fade-in zoom-in duration-200">
                        {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                )}
            </button>

            {/* 📜 DROPDOWN LIST */}
            {isOpen && (
                <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white shadow-xl rounded-2xl border border-gray-100 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 origin-top-right">
                    
                    {/* Header */}
                    <div className="p-4 border-b border-gray-50 flex justify-between items-center bg-gray-50/50 backdrop-blur-sm">
                        <h3 className="font-semibold text-gray-800">Notifications</h3>
                        {items.length > 0 && (
                            <button 
                                onClick={() => dispatch(clearAllNotifications())}
                                className="flex items-center gap-1 text-xs font-medium text-red-500 hover:text-red-700 hover:bg-red-50 px-2 py-1 rounded-lg transition-colors"
                            >
                                <TrashIcon className="w-3 h-3" />
                                Clear All
                            </button>
                        )}
                    </div>

                    {/* Notification Items */}
                    <div className="max-h-[350px] overflow-y-auto custom-scrollbar">
                        {items.length === 0 ? (
                            <div className="flex flex-col items-center justify-center p-8 text-center">
                                <BellIcon className="w-12 h-12 text-gray-200 mb-2" />
                                <p className="text-gray-500 text-sm font-medium">No new notifications</p>
                                <p className="text-gray-400 text-xs">We'll let you know when something arrives!</p>
                            </div>
                        ) : (
                            items.map((notif) => (
                                <div 
                                    key={notif._id} 
                                    className="p-4 border-b border-gray-50 hover:bg-blue-50/30 transition-colors last:border-0 group cursor-default"
                                >
                                    <div className="flex gap-3">
                                        {/* Icon/Avatar Placeholder */}
                                        <div className="mt-1 w-2 h-2 rounded-full bg-cyan-500 flex-shrink-0"></div>
                                        
                                        <div className="flex-1">
                                            <p className="text-sm text-gray-700 leading-relaxed mb-1.5 font-medium">
                                                {notif.message}
                                            </p>
                                            <div className="flex items-center justify-between">
                                                <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">
                                                    {notif.type?.replace("_", " ") || "System"}
                                                </span>
                                                <span className="text-[10px] text-gray-400">
                                                    {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    {" • "}
                                                    {new Date(notif.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationDropdown;