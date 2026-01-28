import React from 'react';
import { TrendingUp, BookOpen } from 'lucide-react';
import CourseCard from './CourseCard';

const TopSellerCourses = ({ courses, formatCurrency }) => {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 overflow-hidden">
      
      {/* Header Section */}
      <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
        <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-indigo-600" />
          Top Seller Courses
        </h3>
        <p className="text-sm text-gray-600 mt-1">Your best performing courses this month</p>
      </div>
      
      {/* Grid Content */}
      {courses && courses.length > 0 ? (
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.slice(0, 6).map((course, index) => (
              <CourseCard
                key={course._id} 
                course={course} 
                index={index} 
                formatCurrency={formatCurrency} 
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="p-12 text-center flex flex-col items-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
             <BookOpen className="w-8 h-8 text-gray-400" />
          </div>
          <h4 className="text-lg font-medium text-gray-500 mb-2">No courses yet</h4>
          <p className="text-sm text-gray-400">Once you start selling, your top courses will appear here.</p>
        </div>
      )}
    </div>
  );
};

export default TopSellerCourses;