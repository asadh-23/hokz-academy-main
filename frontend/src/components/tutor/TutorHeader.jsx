import React from 'react';
import { useSelector } from 'react-redux';
import defaultProfileImage from "../../assets/images/default-profile-image.webp"

const TutorHeader = () => {
  
  const { user } = useSelector((state) => state.auth)

  const tutorName = user?.fullName || "Tutor";
  const tutorProfileImage = user?.profileImage || defaultProfileImage;

  return (
    <header className="flex justify-between items-center px-8 py-4 bg-white border-b border-gray-200 h-[70px]">
      <div className="flex-shrink-0">
        <h1 className="text-2xl font-bold text-emerald-500 m-0">Hokz Academy</h1>
      </div>
      
      <div className="flex-1 max-w-lg mx-8">
        <div className="relative w-full">
          <input 
            type="text" 
            placeholder="Search..." 
            className="w-full py-3 px-4 pl-10 border-2 border-gray-300 rounded-full text-sm outline-none transition-colors focus:border-emerald-500"
          />
          <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">🔍</span>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="p-2 cursor-pointer rounded-full transition-colors hover:bg-gray-100">
          <span className="text-xl">🔔</span>
        </div>
        <div>
          <img 
            src={tutorProfileImage}
            alt="Profile" 
            className="w-10 h-10 rounded-full cursor-pointer border-2 border-gray-200 transition-colors hover:border-emerald-500"
          />
        </div>
      </div>
    </header>
  );
};

export default TutorHeader;