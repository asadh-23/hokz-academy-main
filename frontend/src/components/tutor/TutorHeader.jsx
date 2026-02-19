import React from "react";
import { useSelector } from "react-redux";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline"; // Optional: For better search icon

import defaultProfileImage from "../../assets/images/default-profile-image.webp";
import { selectTutor } from "../../store/features/auth/tutorAuthSlice";

// 🔥 Import Notification Dropdown
import NotificationDropdown from "../common/NotificationDropdown";
import { formatText } from "../../utils/formatText";

const TutorHeader = () => {
    const tutor = useSelector(selectTutor);
    const tutorProfileImage = tutor?.profileImage || defaultProfileImage;

    return (
        <header className="flex justify-between items-center px-8 py-4 bg-white border-b border-gray-200 h-[70px] sticky top-0 z-30 shadow-sm">
            {/* 1. Logo Section */}
            <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-emerald-500 m-0 cursor-pointer">Hokz Academy</h1>
            </div>

            {/* 2. Search Bar Section */}
            <div className="flex-1 max-w-lg mx-8 hidden md:block">
                <div className="relative w-full">
                    <input
                        type="text"
                        placeholder="Search..."
                        className="w-full py-2.5 px-4 pl-10 border border-gray-300 rounded-full text-sm outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 bg-gray-50 focus:bg-white"
                    />
                    <MagnifyingGlassIcon className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                </div>
            </div>

            {/* 3. Right Section (Notifications & Profile) */}
            <div className="flex items-center gap-6">
                {/* Notification Dropdown */}
                <NotificationDropdown />

                {/* Profile Image & Name */}
                <div
                    className="flex items-center gap-3 cursor-pointer group relative"
                    title={tutor?.fullName} // 🔥 Hover cheyyumpol full name kanikkan browser default tooltip
                >
                    <img
                        src={tutorProfileImage}
                        alt="Profile"
                        className="w-10 h-10 rounded-full object-cover border-2 border-gray-100 transition-all group-hover:border-emerald-500 shadow-sm"
                    />

                    <div className="hidden lg:block">
                        <p className="text-sm font-semibold text-gray-700 group-hover:text-emerald-600 transition-colors">
                            {formatText(tutor?.fullName, 16)}
                        </p>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default TutorHeader;
