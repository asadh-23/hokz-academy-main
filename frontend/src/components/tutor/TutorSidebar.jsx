import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import {
    LayoutDashboard,
    User,
    BookOpen,
    Ticket,
    BarChart3,
    Wallet,
    Video,
    LogOut,
    ChevronLeft,
    ChevronRight,
    MessageSquare,
    X,
} from "lucide-react";

import { logoutTutor, selectTutor } from "../../store/features/auth/tutorAuthSlice";
import defaultProfileImage from "../../assets/images/default-profile-image.webp";
import { formatText } from "../../utils/formatText";

const TutorSidebar = ({ isCollapsed, setIsCollapsed, isMobileOpen, setIsMobileOpen }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const [showConfirm, setShowConfirm] = useState(false);

    const tutor = useSelector(selectTutor);
    const tutorName = tutor?.fullName || "Tutor";
    const tutorProfileImage = tutor?.profileImage || null;

    const handleLogout = async () => {
        const res = await dispatch(logoutTutor());
        if (logoutTutor.fulfilled.match(res)) {
            toast.success("Logged out successfully");
            navigate("/tutor/login", { replace: true });
        } else {
            toast.error(res.payload || "Logout failed");
        }
    };

    const menuItems = [
        { name: "Overview", icon: <LayoutDashboard />, path: "/tutor/dashboard" },
        { name: "Profile", icon: <User />, path: "/tutor/profile" },
        { name: "Courses", icon: <BookOpen />, path: "/tutor/courses" },
        { name: "Coupons", icon: <Ticket />, path: "/tutor/coupons" },
        { name: "Orders", icon: <BarChart3 />, path: "/tutor/orders" },
        { name: "Wallet", icon: <Wallet />, path: "/tutor/wallet" },
        { name: "Chat & Video", icon: <MessageSquare />, path: "/tutor/chat" },
    ];

    const activeClass = "bg-[#1E2EDE] text-[#E6D929] shadow-lg shadow-blue-900/20";
    const inactiveClass = "text-slate-600 hover:bg-[#14C4E7]/5 hover:text-[#1E2EDE]";

    return (
        <>
            <aside
                className={`
                    fixed top-[70px] z-50 h-[calc(100vh-70px)] bg-white border-r border-slate-100 transition-all duration-300 ease-in-out shadow-xl
                    ${isCollapsed ? "-left-20 lg:left-0 w-[64px] lg:w-20" : "left-0 w-72"}
                `}
            >
                <div className="flex flex-col h-full relative">
                    {/* Toggle Button (Arrow icon for both Mobile and Desktop) */}
                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className={`
                            absolute top-10 bg-[#14C4E7] text-white w-8 h-8 rounded-r-xl flex items-center justify-center shadow-md hover:bg-[#1E2EDE] transition-all z-[60]
                            ${
                                isCollapsed
                                    ? "left-[110%] lg:-right-3 lg:rounded-full lg:w-6 lg:h-6"
                                    : "-right-3 w-6 h-6 rounded-full"
                            }
                        `}
                    >
                        {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
                    </button>

                    {/* Tutor Profile Header */}
                    <div
                        className={`p-4 lg:p-6 border-b border-slate-50 flex items-center transition-all ${isCollapsed ? "justify-center" : "gap-4"}`}
                    >
                        <div
                            onClick={() => setIsCollapsed(!isCollapsed)}
                            className="shrink-0 w-8 h-8 lg:w-10 lg:h-10 rounded-xl border-2 border-[#14C4E7] overflow-hidden"
                        >
                            {tutorProfileImage ? (
                                <img
                                    src={tutorProfileImage}
                                    alt={tutorName || "User"}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full bg-[#1E2EDE] flex items-center justify-center text-white font-bold text-xs lg:text-sm">
                                    {tutorName?.charAt(0)?.toUpperCase() || "T"}
                                </div>
                            )}
                        </div>
                        {!isCollapsed && (
                            <div className="overflow-hidden whitespace-nowrap animate-in fade-in duration-300">
                                <h4 className="font-black text-[#1E2EDE] text-xs lg:text-sm">{formatText(tutorName)}</h4>
                                <p className="text-[9px] lg:text-[10px] text-[#14C4E7] font-black uppercase tracking-widest">
                                    Verified
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Navigation Links */}
                    <nav className="flex-1 overflow-y-auto p-2 lg:p-3 space-y-2 custom-scrollbar">
                        {menuItems.map((item) => {
                            const isActive = location.pathname === item.path;
                            return (
                                <div
                                    key={item.name}
                                    onClick={() => {
                                        setIsCollapsed(true);
                                        navigate(item.path);
                                    }}
                                    className={`
                                        flex items-center rounded-xl transition-all duration-200 cursor-pointer group
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
                                </div>
                            );
                        })}
                    </nav>

                    {/* Sign Out Button */}
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

            {/* Logout Confirmation Modal */}
            {showConfirm && (
                <div className="fixed inset-0 bg-[#1E2EDE]/20 backdrop-blur-sm flex items-center justify-center z-[100]">
                    <div className="bg-white rounded-[2rem] p-8 w-[90%] max-w-sm shadow-2xl text-center border border-white">
                        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <LogOut size={30} className="text-red-500" />
                        </div>
                        <h3 className="text-xl font-black text-[#1E2EDE] mb-2">End Session?</h3>
                        <p className="text-slate-500 text-sm mb-8 font-medium">
                            Are you sure you want to log out from the tutor portal?
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
        </>
    );
};

export default TutorSidebar;
