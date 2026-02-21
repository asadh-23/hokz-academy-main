import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import {
    LayoutDashboard,
    User,
    Layers,
    Users,
    GraduationCap,
    ClipboardList,
    Wallet,
    BookOpen,
    Settings,
    LogOut,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";

import { clearAdminAuthState, logoutAdmin } from "../../store/features/auth/adminAuthSlice";
import defaultProfileImage from "../../assets/images/default-profile-image.webp";

const AdminSidebar = ({ isCollapsed, setIsCollapsed, isMobileOpen, setIsMobileOpen }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();

    const [showConfirm, setShowConfirm] = useState(false);
    const { admin } = useSelector((state) => state.adminAuth);

    const handleLogout = async () => {
        try {
            await dispatch(logoutAdmin()).unwrap();
            toast.success("Logout successfully");
            dispatch(clearAdminAuthState());
            navigate("/admin/login", { replace: true });
        } catch (error) {
            console.error("Logout failed:", error);
            toast.error("Logout failed");
        }
    };

    const adminName = admin?.fullName || "Admin";
    const adminProfileImage = admin?.profileImage || defaultProfileImage;

    const menuItems = [
        { name: "Dashboard", icon: <LayoutDashboard size={22} />, path: "/admin/dashboard" },
        { name: "Profile", icon: <User size={22} />, path: "/admin/profile" },
        { name: "Category", icon: <Layers size={22} />, path: "/admin/categories" },
        { name: "Students", icon: <GraduationCap size={22} />, path: "/admin/users" },
        { name: "Tutors", icon: <Users size={22} />, path: "/admin/tutors" },
        { name: "Orders", icon: <ClipboardList size={22} />, path: "/admin/orders" },
        { name: "Wallet", icon: <Wallet size={22} />, path: "/admin/Wallet" },
        { name: "Courses", icon: <BookOpen size={22} />, path: "/admin/courses" },
    ];

    const activeClass = "bg-[#1E2EDE] text-[#E6D929] shadow-lg shadow-blue-900/20";
    const inactiveClass = "text-slate-600 hover:bg-[#14C4E7]/5 hover:text-[#1E2EDE]";

    return (
        <>
            <aside
                className={`
                   fixed lg:sticky top-[70px] left-0 z-40 h-[calc(100vh-70px)] bg-white border-r border-slate-100 transition-all duration-300 ease-in-out
                    ${isMobileOpen ? "translate-x-0 w-72" : "-translate-x-full lg:translate-x-0"}
                    ${isCollapsed ? "lg:w-20" : "lg:w-72"}
                `}
            >
                <div className="flex flex-col h-full">
                    {/* Desktop Collapse Toggle */}
                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="hidden lg:flex absolute -right-3 top-10 bg-[#1E2EDE] text-white w-6 h-6 rounded-full items-center justify-center shadow-md hover:bg-[#14C4E7] transition-colors z-50"
                    >
                        {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
                    </button>

                    {/* Admin Profile Summary */}
                    <div className={`p-6 border-b border-slate-50 flex items-center transition-all ${isCollapsed ? "justify-center" : "gap-4"}`}>
                        <div className="shrink-0 w-10 h-10 rounded-xl border-2 border-[#14C4E7] overflow-hidden shadow-sm">
                            <img src={adminProfileImage} alt="Admin" className="w-full h-full object-cover" />
                        </div>
                        {!isCollapsed && (
                            <div className="overflow-hidden whitespace-nowrap animate-in fade-in slide-in-from-left-2">
                                <h4 className="font-black text-[#1E2EDE] text-sm leading-tight">{adminName}</h4>
                                <p className="text-[10px] text-[#14C4E7] font-black uppercase tracking-widest">Super Administrator</p>
                            </div>
                        )}
                    </div>

                    {/* Nav Links */}
                    <nav className="flex-1 overflow-y-auto p-3 space-y-1 custom-scrollbar">
                        <div className={`mb-2 px-4 py-2 ${isCollapsed ? 'hidden' : 'block'}`}>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Main Menu</p>
                        </div>
                        {menuItems.map((item) => {
                            const isActive = location.pathname === item.path;
                            return (
                                <div
                                    key={item.name}
                                    onClick={() => {
                                        navigate(item.path);
                                        setIsMobileOpen(false);
                                    }}
                                    className={`
                                        flex items-center rounded-xl transition-all duration-200 cursor-pointer group
                                        ${isActive ? activeClass : inactiveClass}
                                        ${isCollapsed ? "justify-center p-3" : "px-4 py-3 gap-4"}
                                    `}
                                    title={isCollapsed ? item.name : ""}
                                >
                                    <span className="shrink-0">{item.icon}</span>
                                    {!isCollapsed && <span className="font-bold text-sm whitespace-nowrap">{item.name}</span>}
                                </div>
                            );
                        })}
                    </nav>

                    {/* Footer Section */}
                    <div className="p-3 border-t border-slate-50 space-y-2">
                      
                        <button
                            onClick={() => setShowConfirm(true)}
                            className={`
                                flex items-center text-red-500 font-bold text-sm hover:bg-red-50 rounded-xl transition-all w-full
                                ${isCollapsed ? "justify-center p-3" : "px-4 py-3 gap-4"}
                            `}
                        >
                            <LogOut size={22} className="shrink-0" />
                            {!isCollapsed && <span>Sign Out</span>}
                        </button>
                    </div>
                </div>
            </aside>

            {/* Logout Modal */}
            {showConfirm && (
                <div className="fixed inset-0 bg-[#1E2EDE]/20 backdrop-blur-sm flex items-center justify-center z-[100]">
                    <div className="bg-white rounded-[2.5rem] p-8 w-[90%] max-w-sm shadow-2xl text-center border border-white">
                        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <LogOut size={30} className="text-red-500" />
                        </div>
                        <h3 className="text-xl font-black text-[#1E2EDE] mb-2">Logout System?</h3>
                        <p className="text-slate-500 text-sm mb-8 font-medium">Are you sure you want to exit the admin control panel?</p>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowConfirm(false)}
                                className="flex-1 px-6 py-3 rounded-xl border-2 border-slate-100 text-slate-600 font-bold hover:bg-slate-50 transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleLogout}
                                className="flex-1 px-6 py-3 rounded-xl bg-[#1E2EDE] text-[#E6D929] font-bold hover:shadow-lg transition-all"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default AdminSidebar;