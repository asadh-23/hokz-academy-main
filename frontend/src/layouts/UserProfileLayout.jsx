import React, { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import {
    User,
    BookOpen,
    ClipboardList,
    ShoppingCart,
    Heart,
    Award,
    MessageSquare,
    ChevronLeft,
    ChevronRight,
    LogOut,
    Menu,
    X,
} from "lucide-react";
import { useSelector } from "react-redux";
import { selectUserAuth } from "../store/features/auth/userAuthSlice";

const ProfileLayout = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    const { user } = useSelector(selectUserAuth);

    const menuItems = [
        { name: "Profile", path: "/user/profile", icon: <User size={22} /> },
        { name: "My Courses", path: "/user/courses/my-courses", icon: <BookOpen size={22} /> },
        { name: "My Orders", path: "/user/orders", icon: <ClipboardList size={22} /> },
        { name: "Shopping Cart", path: "/user/cart", icon: <ShoppingCart size={22} /> },
        { name: "Wishlist", path: "/user/wishlist", icon: <Heart size={22} /> },
        { name: "My Certificates", path: "/user/certificates", icon: <Award size={22} /> },
        { name: "Chat", path: "/user/chat", icon: <MessageSquare size={22} /> },
    ];

    const activeClass = "bg-[#1E2EDE] text-[#E6D929] shadow-lg shadow-blue-100";
    const inactiveClass = "text-slate-600 hover:bg-slate-50 hover:text-[#1E2EDE]";

    return (
        <div className="flex min-h-[calc(100vh-80px)] bg-[#FDFDFD] relative">
            {/* --- MOBILE TOGGLE BUTTON --- */}
            <button
                onClick={() => setIsMobileOpen(!isMobileOpen)}
                className="lg:hidden fixed bottom-6 right-6 z-[60] bg-[#1E2EDE] text-white p-4 rounded-full shadow-2xl"
            >
                {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* --- SIDEBAR --- */}
            <aside
                className={`
          fixed lg:sticky top-20 left-0 z-40 h-[calc(100vh-80px)] bg-white border-r border-slate-100 transition-all duration-300 ease-in-out
          ${isMobileOpen ? "translate-x-0 w-72" : "-translate-x-full lg:translate-x-0"}
          ${isCollapsed ? "lg:w-20" : "lg:w-72"}
        `}
            >
                <div className="flex flex-col h-full">
                    {/* Collapse Toggle (Desktop Only) */}
                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="hidden lg:flex absolute -right-3 top-8 bg-[#14C4E7] text-white w-6 h-6 rounded-full items-center justify-center shadow-md hover:bg-[#1E2EDE] transition-colors z-50"
                    >
                        {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
                    </button>

                    {/* User Profile Summary */}
                    <div
                        className={`p-6 border-b border-slate-50 flex items-center transition-all ${isCollapsed ? "justify-center" : "gap-4"}`}
                    >
                        <div className="shrink-0 w-10 h-10 rounded-xl border-2 border-[#14C4E7] overflow-hidden">
                            {user?.profileImage ? (
                                <img
                                    src={user.profileImage}
                                    alt={user.fullName || "User"}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full bg-[#1E2EDE] flex items-center justify-center text-white font-bold">
                                    {user?.fullName?.charAt(0)?.toUpperCase() || "U"}
                                </div>
                            )}
                        </div>
                        {!isCollapsed && (
                            <div className="overflow-hidden whitespace-nowrap animate-in fade-in slide-in-from-left-2">
                                <h4 className="font-black text-[#1E2EDE] text-sm">{user.fullName}</h4>
                            </div>
                        )}
                    </div>

                    {/* Nav Links */}
                    <nav className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
                        {menuItems.map((item) => (
                            <NavLink
                                key={item.name}
                                to={item.path}
                                onClick={() => setIsMobileOpen(false)}
                                className={({ isActive }) => `
                  flex items-center rounded-xl transition-all duration-200 group
                  ${isActive ? activeClass : inactiveClass}
                  ${isCollapsed ? "justify-center p-3" : "px-4 py-3.5 gap-4"}
                `}
                                title={isCollapsed ? item.name : ""}
                            >
                                <span className="shrink-0">{item.icon}</span>
                                {!isCollapsed && <span className="font-bold text-sm whitespace-nowrap">{item.name}</span>}
                            </NavLink>
                        ))}
                    </nav>

                    {/* Logout Section */}
                    <div className="p-3 border-t border-slate-50">
                        <button
                            className={`
              flex items-center text-red-500 font-bold text-sm hover:bg-red-50 rounded-xl transition-all w-full
              ${isCollapsed ? "justify-center p-3" : "px-4 py-3.5 gap-4"}
            `}
                        >
                            <LogOut size={22} className="shrink-0" />
                            {!isCollapsed && <span>Sign Out</span>}
                        </button>
                    </div>
                </div>
            </aside>

            {/* --- MAIN CONTENT --- */}
            <main className="flex-1 flex flex-col min-w-0 bg-[#FDFDFD]">
                <div className="p-4 md:p-8 lg:p-10 w-full max-w-7xl mx-auto">
                    {/* Content Container */}
                    <div className="bg-white rounded-[2.5rem] shadow-xl shadow-blue-900/5 border border-slate-100 min-h-[70vh] relative overflow-hidden">
                        {/* Decorative element */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#E6D929]/10 to-transparent rounded-bl-full pointer-events-none"></div>

                        {/* The actual page content */}
                        <div className="p-6 md:p-10">
                            <Outlet />
                        </div>
                    </div>
                </div>
            </main>

            {/* Mobile Overlay */}
            {isMobileOpen && (
                <div
                    className="fixed inset-0 bg-blue-900/20 backdrop-blur-sm z-30 lg:hidden"
                    onClick={() => setIsMobileOpen(false)}
                ></div>
            )}
        </div>
    );
};

export default ProfileLayout;
