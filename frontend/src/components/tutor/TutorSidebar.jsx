import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";

import {
    logoutTutor,
    selectTutor,
} from "../../store/features/auth/tutorAuthSlice";

import defaultProfileImage from "../../assets/images/default-profile-image.webp";

const TutorSidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();

    const [showConfirm, setShowConfirm] = useState(false);

    // ✅ New auth structure
    const tutor = useSelector(selectTutor);
    console.log(tutor)
    const tutorName = tutor?.fullName || "Tutor";
    const tutorProfileImage = tutor?.profileImage || defaultProfileImage;

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
        { name: "Overview", icon: "📊", path: "/tutor/dashboard" },
        { name: "Profile", icon: "👤", path: "/tutor/profile" },
        { name: "Courses", icon: "📚", path: "/tutor/courses" },
        { name: "Revenues", icon: "💰", path: "/tutor/revenues" },
        { name: "Chat & Video", icon: "🎥", path: "/tutor/chat" },
        { name: "LogOut", icon: "🚪" }, // No path -> triggers modal
    ];

    return (
        <>
            <aside className="w-[280px] bg-white border-r border-gray-200 flex flex-col h-[calc(100vh-70px)] sticky top-0">
                <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 scrollbar-hide">

                    {/* Profile Section */}
                    <div className="text-center">
                        <img
                            src={tutorProfileImage}
                            alt="Tutor"
                            className="w-20 h-20 rounded-full border-4 border-emerald-400 mx-auto mb-3"
                        />
                        <h3 className="text-lg font-semibold text-emerald-600">
                            {tutorName}
                        </h3>
                    </div>

                    {/* Menu */}
                    <div className="bg-gradient-to-br from-cyan-400 to-emerald-500 rounded-2xl p-5 text-white shadow-md">
                        <h4 className="text-lg font-semibold mb-4">Dashboard</h4>

                        <div className="flex flex-col gap-2">
                            {menuItems.map((item) => {
                                const isActive = location.pathname === item.path;

                                const handleClick =
                                    item.name === "LogOut"
                                        ? () => setShowConfirm(true)
                                        : () => navigate(item.path);

                                return (
                                    <div
                                        key={item.name}
                                        onClick={handleClick}
                                        className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all
                                        ${
                                            isActive
                                                ? "bg-white text-emerald-600 font-semibold"
                                                : "hover:bg-white/20 hover:text-white"
                                        }`}
                                    >
                                        <span className="text-lg">{item.icon}</span>
                                        <span className="text-sm font-medium">{item.name}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </aside>

            {/* Logout Modal */}
            {showConfirm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-6 w-[90%] max-w-sm shadow-lg text-center">
                        <h3 className="text-lg font-semibold text-gray-800 mb-3">
                            Confirm Logout
                        </h3>
                        <p className="text-gray-500 mb-6">
                            Are you sure you want to log out?
                        </p>

                        <div className="flex justify-center gap-4">
                            <button
                                onClick={() => setShowConfirm(false)}
                                className="px-5 py-2 rounded-full border border-gray-300 text-gray-600 hover:bg-gray-100 transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleLogout}
                                className="px-5 py-2 rounded-full bg-gradient-to-br from-cyan-400 to-emerald-500 text-white font-semibold hover:opacity-90 transition-all"
                            >
                                Yes, Log Out
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default TutorSidebar;
