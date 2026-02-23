import React from "react";
import { useSelector } from "react-redux";
import defaultProfileImage from "../../assets/images/default-profile-image.webp";

import NotificationDropdown from "../common/NotificationDropdown";
import { Link } from "react-router-dom";
import { GraduationCap } from "lucide-react";
import { selectTutor } from "../../store/features/auth/tutorAuthSlice";

const TutorHeader = () => {
    // Get Admin State
    const tutor = useSelector(selectTutor);

    const tutorName = tutor?.fullName || "tutor";
    const tutorProfileImage = tutor?.profileImage || null;

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
                        Instructor
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
                        <p className="text-sm font-bold text-gray-800 leading-tight">{tutorName}</p>
                    </div>

                    {/* Avatar */}
                    <div className="shrink-0 w-8 h-8 lg:w-10 lg:h-10 rounded-full border-2 border-[#14C4E7] overflow-hidden">
                        {tutorProfileImage ? (
                            <img src={tutorProfileImage} alt={tutorName || "User"} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full bg-[#1E2EDE] flex items-center justify-center text-white font-bold text-xs lg:text-sm">
                                {tutorName?.charAt(0)?.toUpperCase() || "T"}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default TutorHeader;
