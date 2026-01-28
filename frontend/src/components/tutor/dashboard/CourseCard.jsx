import React from 'react';
import { Star, Users, ArrowRight, Tag } from 'lucide-react';

const CourseCard = ({ course, index, formatCurrency }) => {
  
  // 1. Price Calculation Logic (Safe & Accurate)
  const originalPrice = course?.price || 0;
  const offerPercentage = course?.offerPercentage || 0;
  
  const sellingPrice = offerPercentage > 0 
    ? Math.round(originalPrice - (originalPrice * offerPercentage) / 100) 
    : originalPrice;

  // 2. Rank Badge Color Logic
  const getRankStyle = (idx) => {
    switch(idx) {
        case 0: return 'bg-yellow-500 text-white'; // Gold
        case 1: return 'bg-gray-400 text-white';   // Silver
        case 2: return 'bg-orange-400 text-white'; // Bronze
        default: return 'bg-indigo-600 text-white'; // Others
    }
  };

  return (
    <div className="group bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col h-full overflow-hidden">
      
      {/* --- Image Section --- */}
      <div className="relative h-44 overflow-hidden bg-gray-100">
        <img 
          src={course.thumbnail || course.thumbnailUrl || "https://via.placeholder.com/400x200?text=Course"} 
          alt={course.title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        
        {/* Dark Overlay on Hover */}
        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors"></div>
        
        {/* Rank Badge */}
        <div className={`absolute top-3 left-3 px-2.5 py-1 rounded-lg text-xs font-bold shadow-lg ${getRankStyle(index)}`}>
            #{index + 1}
        </div>

        {/* Enrolled Count Badge */}
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-2 py-1 rounded-md text-[10px] font-bold shadow-sm text-gray-700 flex items-center gap-1">
          <Users size={12} className="text-indigo-600" /> 
          {course.enrolledCount}
        </div>
      </div>

      {/* --- Content Section --- */}
      <div className="p-4 flex-1 flex flex-col">
        
        {/* Category & Rating Row */}
        <div className="flex justify-between items-center mb-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-full">
            {course.category.name || 'Course'}
          </span>
          <div className="flex items-center gap-1 text-xs font-medium text-gray-600">
            <Star size={12} className="fill-orange-400 text-orange-400" />
            {course.averageRating || 4.8}
          </div>
        </div>

        {/* Title */}
        <h4 className="font-bold text-gray-800 text-sm line-clamp-2 mb-1 leading-tight group-hover:text-indigo-600 transition-colors">
          {course.title}
        </h4>

        {/* Description (Optional) */}
        {course.description && (
            <p className="text-xs text-gray-500 line-clamp-1 mb-3">
                {course.description}
            </p>
        )}

        {/* Spacer to push price to bottom */}
        <div className="mt-auto pt-3 border-t border-gray-100">
          <div className="flex justify-between items-end">
            
            {/* Price Details */}
            <div>
              {offerPercentage > 0 && (
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-xs text-gray-400 line-through">
                    {formatCurrency(originalPrice)}
                  </span>
                  <div className="flex items-center gap-0.5 text-[10px] font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded">
                    <Tag size={10} />
                    {offerPercentage}% OFF
                  </div>
                </div>
              )}
              <div className="font-bold text-lg text-emerald-600 leading-none">
                {formatCurrency(sellingPrice)}
              </div>
            </div>

            {/* Action Icon */}
            <button className="p-2 rounded-full bg-gray-50 text-gray-400 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;