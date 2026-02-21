import React from 'react';
import { BookOpen, TrendingUp } from 'lucide-react';

const CourseStatsCards = ({ totalCourses, publishedCourses }) => {
   return (
        <div className="flex flex-wrap sm:flex-nowrap gap-4 w-full lg:w-auto">
            <div className="bg-white rounded-[1.5rem] p-6 shadow-xl shadow-blue-900/5 border border-gray-100 flex-1 min-w-[160px]">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-[#1E2EDE]/5 rounded-xl text-[#1E2EDE]">
                        <BookOpen className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-2xl font-black text-[#1E2EDE] leading-none">{totalCourses}</p>
                        <p className="text-[10px] font-black text-gray-400 uppercase mt-1">Total Assets</p>
                    </div>
                </div>
            </div>
            
            <div className="bg-white rounded-[1.5rem] p-6 shadow-xl shadow-blue-900/5 border border-gray-100 flex-1 min-w-[160px]">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-[#14C4E7]/10 rounded-xl text-[#14C4E7]">
                        <TrendingUp className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-2xl font-black text-[#14C4E7] leading-none">{publishedCourses}</p>
                        <p className="text-[10px] font-black text-gray-400 uppercase mt-1">Live Now</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseStatsCards;