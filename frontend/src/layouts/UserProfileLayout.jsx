import React, { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
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
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser, selectUserAuth } from "../store/features/auth/userAuthSlice";
import { toast } from "sonner";

const ProfileLayout = () => {
    const [isCollapsed, setIsCollapsed] = useState(true);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useSelector(selectUserAuth);
    const [showConfirm, setShowConfirm] = useState(false);

    const handleLogout = async () => {
        try {

            await dispatch(logoutUser()).unwrap();
            toast.success("Logged out successfully");
            setShowConfirm(false);
            navigate("/user/login", { replace: true });

        } catch (error) {
            toast.error(error || "Logout failed");
        }
    };

    const menuItems = [
        { name: "Profile", path: "/user/profile", icon: <User /> },
        { name: "My Courses", path: "/user/courses/my-courses", icon: <BookOpen /> },
        { name: "My Orders", path: "/user/orders", icon: <ClipboardList /> },
        { name: "Shopping Cart", path: "/user/cart", icon: <ShoppingCart /> },
        { name: "Wishlist", path: "/user/wishlist", icon: <Heart /> },
        { name: "My Certificates", path: "/user/certificates", icon: <Award /> },
        { name: "Chat", path: "/user/chat", icon: <MessageSquare /> },
    ];

    const activeClass = "bg-[#1E2EDE] text-[#E6D929] shadow-lg shadow-blue-100";
    const inactiveClass = "text-slate-600 hover:bg-slate-50 hover:text-[#1E2EDE]";

    return (
        <div className="flex min-h-[calc(100vh-80px)] bg-[#FDFDFD] relative">
            {/* --- SIDEBAR CONTAINER --- */}
            {/* FIXED: The gutter width is now constant on desktop (lg:w-20) 
                so that when the fixed aside expands to w-72, it overlays rather than pushes content */}
            <div className="shrink-0 w-0 lg:w-20">
                <aside
                    className={`
            fixed top-20 z-50 h-[calc(100vh-80px)] bg-white border-r border-slate-100 transition-all duration-300 ease-in-out shadow-xl
            ${isCollapsed ? "-left-20 lg:left-0 w-[64px] lg:w-20" : "left-0 w-72"}
        `}
                >
                    <div className="flex flex-col h-full relative">
                        {/* Toggle Button (Arrow icon) - FIXED: Moved from top-8 to top-20 */}
                        <button
                            onClick={() => setIsCollapsed(!isCollapsed)}
                            className={`
        absolute top-5 bg-[#14C4E7] text-white w-8 h-8 rounded-r-xl flex items-center justify-center shadow-md hover:bg-[#1E2EDE] transition-all z-[60]
        ${isCollapsed ? "left-[125%] lg:-right-3 lg:rounded-full lg:w-6 lg:h-6" : "-right-3 w-6 h-6 rounded-full"}
    `}
                        >
                            {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
                        </button>

                        {/* User Profile Summary */}
                        <div
                            className={`p-4 lg:p-6 border-b border-slate-50 flex items-center transition-all ${isCollapsed ? "justify-center" : "gap-4"}`}
                        >
                            <div
                                onClick={() => setIsCollapsed(!isCollapsed)}
                                className="shrink-0 w-8 h-8 lg:w-10 lg:h-10 rounded-full border-2 border-[#14C4E7] overflow-hidden cursor-pointer"
                            >
                                {user?.profileImage ? (
                                    <img
                                        src={user?.profileImage}
                                        alt={user?.fullName || "User"}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-[#1E2EDE] flex items-center justify-center text-white font-bold text-xs lg:text-sm">
                                        {user?.fullName?.charAt(0)?.toUpperCase() || "U"}
                                    </div>
                                )}
                            </div>
                            {!isCollapsed && (
                                <div className="overflow-hidden whitespace-nowrap animate-in fade-in duration-300">
                                    <h4 className="font-black text-[#1E2EDE] text-xs lg:text-sm">{user?.fullName}</h4>
                                </div>
                            )}
                        </div>

                        {/* Nav Links */}
                        <nav className="flex-1 overflow-y-auto p-2 lg:p-3 space-y-2 custom-scrollbar">
                            {menuItems.map((item) => (
                                <NavLink
                                    key={item.name}
                                    to={item.path}
                                    onClick={() => setIsCollapsed(true)}
                                    className={({ isActive }) => `
                                        flex items-center rounded-xl transition-all duration-200 group
                                        ${isActive ? activeClass : inactiveClass}
                                        ${isCollapsed ? "justify-center p-3" : "px-4 py-3.5 gap-4"}
                                    `}
                                    title={isCollapsed ? item.name : ""}
                                >
                                    <span className="shrink-0">
                                        {/* Dynamic Icon Size: 18px on Mobile, 22px on Desktop */}
                                        {React.cloneElement(item.icon, {
                                            size: window.innerWidth < 1024 ? 18 : 22,
                                        })}
                                    </span>
                                    {!isCollapsed && (
                                        <span className="font-bold text-xs lg:text-sm whitespace-nowrap">{item.name}</span>
                                    )}
                                </NavLink>
                            ))}
                        </nav>

                        {/* Logout Section */}
                        <div className="p-2 lg:p-4 border-t border-slate-100 bg-white sticky bottom-0">
                            <button
                                onClick={() => {
                                    setIsCollapsed(true);
                                    setShowConfirm(true);
                                }}
                                className={`
                flex items-center text-red-500 font-bold text-xs lg:text-sm hover:bg-red-50 rounded-xl transition-all w-full
                ${isCollapsed ? "justify-center p-3" : "px-4 py-3.5 gap-4"}
            `}
                            >
                                <LogOut size={window.innerWidth < 1024 ? 18 : 22} className="shrink-0" />
                                {!isCollapsed && <span>Sign Out</span>}
                            </button>
                        </div>
                    </div>
                </aside>
            </div>

            <main className="flex-1 flex flex-col min-w-0 bg-[#FDFDFD]">
                <div className="p-0 md:p-8 lg:p-10 w-full lg:max-w-full mx-auto">
                    <div className="bg-white rounded-none md:rounded-[2.5rem] shadow-none md:shadow-xl border-none md:border border-slate-100 min-h-[calc(100vh-80px)] relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#E6D929]/10 to-transparent rounded-bl-full pointer-events-none"></div>

                        <div onClick={() => setIsCollapsed(true)} className="p-0 md:p-10 h-full">
                            <Outlet />
                        </div>
                    </div>
                </div>
            </main>

            {/* Overlay Backdrop - FIXED: Removed lg:hidden to enable overlay behavior on all screens */}
            {!isCollapsed && (
                <div className="fixed inset-0 bg-black/5 z-40" onClick={() => setIsCollapsed(true)} />
            )}

            {/* Logout Modal */}
            {showConfirm && (
                <div className="fixed inset-0 bg-[#1E2EDE]/20 backdrop-blur-sm flex items-center justify-center z-[100]">
                    <div className="bg-white rounded-[2rem] p-8 w-[90%] max-w-sm shadow-2xl text-center border border-white">
                        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <LogOut size={30} className="text-red-500" />
                        </div>
                        <h3 className="text-xl font-black text-[#1E2EDE] mb-2">End Session?</h3>
                        <p className="text-slate-500 text-sm mb-8 font-medium">
                            Are you sure you want to log out from the user portal?
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowConfirm(false)}
                                className="flex-1 px-6 py-3 rounded-xl border-2 border-slate-100 text-slate-600 font-bold hover:bg-slate-50 transition-all"
                            >
                                No, Stay
                            </button>
                            <button
                                onClick={handleLogout}
                                className="flex-1 px-6 py-3 rounded-xl bg-[#1E2EDE] text-[#E6D929] font-bold hover:shadow-lg transition-all"
                            >
                                Yes, Logout
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfileLayout;
