import React from 'react';
import { useSelector } from 'react-redux';
import defaultProfileImage from "../../assets/images/default-profile-image.webp"

const AdminHeader = () => {
  
  const { admin } = useSelector((state) => state.adminAuth)

  const adminName = admin?.fullName || "Admin";
  const adminProfileImage = admin?.profileImage || defaultProfileImage;

  return (
    <header className="flex justify-between items-center px-6 py-3 bg-white border-b border-gray-200 h-[70px]">
      {/* Left Section - Logo and Categories */}
      <div className="flex items-center gap-8">
        <div className="flex-shrink-0">
          <h1 className="text-2xl font-bold text-cyan-500 m-0">Hokz Academy</h1>
        </div>
      </div>
      
      {/* Center Section - Search Bar */}
      <div className="flex-1 max-w-md mx-8">
        <div className="relative w-full">
          <input 
            type="text" 
            placeholder="Search courses" 
            className="w-full py-2.5 px-4 pl-10 border border-gray-300 rounded-full text-sm outline-none transition-colors focus:border-cyan-500 focus:ring-1 focus:ring-cyan-200 bg-gray-50"
          />
          <svg 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
            />
          </svg>
        </div>
      </div>
      
      {/* Right Section - Notifications and Profile */}
      <div className="flex items-center gap-4">
        {/* Notification Bell */}
        <div className="relative p-2 cursor-pointer rounded-full transition-colors hover:bg-gray-100">
          <svg 
            className="w-5 h-5 text-gray-600" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" 
            />
          </svg>
          {/* Notification dot */}
          <div className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></div>
        </div>
        
        {/* Profile Image */}
        <div className="relative">
          <img 
            src={adminProfileImage}
            alt="Admin Profile" 
            className="w-9 h-9 rounded-full cursor-pointer border-2 border-gray-200 transition-colors hover:border-cyan-500 object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = defaultProfileImage;
            }}
          />
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;