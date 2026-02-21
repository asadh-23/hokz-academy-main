import React from "react";
import { useSelector } from "react-redux";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

import defaultProfileImage from "../../assets/images/default-profile-image.webp";

// 🔥 Import Notification Dropdown
import NotificationDropdown from "../common/NotificationDropdown";
import { selectAdmin } from "../../store/features/auth/adminAuthSlice";
import { Link, useNavigate } from "react-router-dom";
import { GraduationCap } from "lucide-react";

const AdminHeader = () => {
  const navigate = useNavigate();
    // Get Admin State
    const admin = useSelector(selectAdmin);

    const adminName = admin?.fullName || "Administrator";
    const adminProfileImage = admin?.profileImage || defaultProfileImage;

    return (
        <header className="flex justify-between items-center px-6 py-3 bg-white border-b border-gray-200 h-[70px] sticky top-0 z-30 shadow-sm">
            {/* 1. Left Section - Logo */}
            <div className="flex items-center gap-4">
                <div className="flex-shrink-0 flex items-center gap-2">
                    <Link to="/admin/dashboard" className="flex items-center gap-3 group">
                        <div className="w-12 h-12 bg-[#1E2EDE] rounded-2xl flex items-center justify-center transition-transform group-hover:rotate-12 shadow-xl shadow-blue-900/20">
                            <GraduationCap className="text-[#E6D929] w-7 h-7" />
                        </div>
                        <span className="text-2xl font-black tracking-tighter text-[#1E2EDE]">
                            HOKZ<span className="text-[#14C4E7]">ACADEMY</span>
                        </span>
                    </Link>
                    <span className="bg-cyan-50 text-cyan-700 text-[10px] font-bold px-2 py-0.5 rounded border border-cyan-200 uppercase tracking-wider hidden sm:block">
                        Admin
                    </span>
                </div>
            </div>

            {/* 3. Right Section - Notifications and Profile */}
            <div className="flex items-center gap-5">
                {/* 🔥 Notification Dropdown */}
                <NotificationDropdown />

                {/* Separator */}
                <div className="h-8 w-px bg-gray-200 hidden sm:block"></div>

                {/* Profile Section */}
                <div className="flex items-center gap-3 cursor-pointer group">
                    {/* Admin Info (Hidden on mobile) */}
                    <div className="text-right hidden lg:block">
                        <p className="text-sm font-bold text-gray-800 leading-tight">{adminName}</p>
                        <p className="text-xs text-cyan-600 font-medium">Super Admin</p>
                    </div>

                    {/* Avatar */}
                    <div onClick={() => navigate("/admin/profile")} className="relative group cursor-pointer">
                        <img
                            src={adminProfileImage}
                            alt="Admin Profile"
                            className="w-10 h-10 rounded-full border-2 border-gray-100 transition-all group-hover:border-cyan-500 object-cover shadow-sm"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = defaultProfileImage;
                            }}
                        />
                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></span>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default AdminHeader;
