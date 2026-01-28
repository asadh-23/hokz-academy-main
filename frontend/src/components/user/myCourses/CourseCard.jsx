import React from 'react';
import { Play, Award, Clock, BookOpen, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CourseCard = ({ course, viewMode = "grid" }) => {
  const navigate = useNavigate();
  const isCompleted = course.progress === 100;

  // Button Click Handler
  const handleNavigation = () => {
    navigate(`/user/learn/${course._id}`);
  };

  if (viewMode === "list") {
    return (
      <div className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-indigo-200 p-6">
        <div className="flex items-center gap-6">
          {/* Thumbnail */}
          <div className="relative w-32 h-20 rounded-xl overflow-hidden shrink-0">
            <img 
              src={course.thumbnailUrl || "https://via.placeholder.com/400x225"} 
              alt={course.title} 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="bg-blue-50 text-blue-600 text-xs px-3 py-1 rounded-full font-semibold">
                    {course.category?.name || "General"}
                  </span>
                  <span className="text-xs text-gray-500 flex items-center gap-1">
                    <BookOpen size={12} />
                    {course.lessonsCount || 0} Lessons
                  </span>
                  <span className="text-xs text-gray-500 flex items-center gap-1">
                    <Clock size={12} />
                    {course.totalDurationSeconds || 0}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-1">
                  {course.title}
                </h3>
                
                {/* Course Description */}
                {course.description && (
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2 leading-relaxed">
                    {course.description}
                  </p>
                )}
                
                <div className="flex items-center gap-2 mb-3">
                  <img 
                    src={course.tutor?.profileImage || "https://via.placeholder.com/32"} 
                    className="w-6 h-6 rounded-full border border-gray-200 object-cover" 
                    alt="tutor" 
                  />
                  <span className="text-sm text-gray-600">
                    {course.tutor?.fullName || "Instructor"}
                  </span>
                </div>
              </div>
              
              <div className="text-right">
                <div className={`text-sm font-semibold mb-1 ${isCompleted ? "text-emerald-500" : "text-indigo-600"}`}>
                  {course.progress || 0}% Complete
                </div>
                <button 
                  onClick={handleNavigation}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                    isCompleted 
                      ? "bg-emerald-500 hover:bg-emerald-600 text-white" 
                      : "bg-indigo-600 hover:bg-indigo-700 text-white"
                  }`}
                >
                  {isCompleted ? "Certificate" : "Continue"}
                </button>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-100 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-1000 ${isCompleted ? 'bg-emerald-500' : 'bg-indigo-600'}`}
                style={{ width: `${course.progress || 0}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="group relative bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 hover:border-indigo-200 flex flex-col h-full">
      
      {/* Thumbnail Section */}
      <div className="relative h-48 w-full overflow-hidden shrink-0">
        <img 
          src={course.thumbnailUrl || "https://via.placeholder.com/400x225"} 
          alt={course.title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        
        {/* Progress Badge */}
        <div className="absolute top-4 right-4">
          <div className={`px-3 py-1 rounded-full text-xs font-bold backdrop-blur-sm border ${
            isCompleted 
              ? "bg-emerald-500/90 text-white border-emerald-400" 
              : "bg-indigo-600/90 text-white border-indigo-400"
          }`}>
            {course.progress || 0}%
          </div>
        </div>
        
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          {!isCompleted ? (
            <button 
              onClick={handleNavigation}
              className="bg-white text-indigo-600 px-6 py-3 rounded-2xl flex items-center gap-2 font-semibold transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <Play size={18} fill="currentColor" />
              Continue Learning
            </button>
          ) : (
            <button 
              onClick={handleNavigation}
              className="bg-white text-emerald-600 px-6 py-3 rounded-2xl flex items-center gap-2 font-semibold transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <Award size={18} />
              View Certificate
            </button>
          )}
        </div>
      </div>

      {/* Course Info */}
      <div className="p-6 flex flex-col flex-1">
        <div className="mb-4">
          <span className="bg-gradient-to-r from-blue-50 to-indigo-50 text-indigo-600 text-xs px-3 py-1.5 rounded-full font-semibold uppercase tracking-wide inline-block border border-indigo-100">
            {course.category?.name || "General"}
          </span>
        </div>
        
        <div className="flex justify-between items-center mb-3">
          <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider flex items-center gap-1">
            <BookOpen size={12} />
            {course.lessonsCount || 0} Lessons
          </span>
          <div className="flex items-center text-gray-500 text-xs">
            <Clock size={12} className="mr-1" />
            {course.totalDurationSeconds || 0}
          </div>
        </div>

        <h3 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2 leading-tight">
          {course.title}
        </h3>

        {/* Course Description */}
        {course.description && (
          <p className="text-sm text-gray-600 mb-4 line-clamp-3 leading-relaxed">
            {course.description}
          </p>
        )}
        
        {/* Progress Bar */}
        <div className="mt-auto">
          <div className="mb-6">
            <div className="flex justify-between text-sm font-semibold text-gray-600 mb-2">
              <span>Progress</span>
              <span className={isCompleted ? "text-emerald-500" : "text-indigo-600"}>
                {course.progress || 0}%
              </span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
              <div 
                className={`h-3 rounded-full transition-all duration-1000 ${
                  isCompleted 
                    ? 'bg-gradient-to-r from-emerald-400 to-emerald-500' 
                    : 'bg-gradient-to-r from-indigo-500 to-purple-600'
                }`}
                style={{ width: `${course.progress || 0}%` }}
              />
            </div>
          </div>

          {/* Tutor Details */}
          <div className="flex items-center justify-between border-t border-gray-100 pt-4">
            <div className="flex items-center gap-3">
              <img 
                src={course.tutor?.profileImage || "https://via.placeholder.com/32"} 
                className="w-10 h-10 rounded-full border-2 border-gray-100 shadow-sm object-cover" 
                alt="tutor" 
              />
              <div>
                <p className="text-xs text-gray-400 font-medium leading-none mb-1">INSTRUCTOR</p>
                <p className="text-sm font-semibold text-gray-700">
                  {course.tutor?.fullName || "Instructor"}
                </p>
              </div>
            </div>
            
            {isCompleted && (
              <div className="bg-emerald-50 p-2 rounded-full">
                <Award className="text-emerald-500" size={16} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;