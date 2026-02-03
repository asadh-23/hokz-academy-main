import React from 'react';
import { BookOpen, TrendingUp } from 'lucide-react';

const CourseStatsCards = ({ totalCourses, publishedCourses }) => {
    return (
        <div className="flex gap-4">
            <div className="bg-white rounded-lg p-4 shadow-sm border">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                        <BookOpen className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-gray-900">{totalCourses}</p>
                        <p className="text-sm text-gray-500">Total Courses</p>
                    </div>
                </div>
            </div>
            
            <div className="bg-white rounded-lg p-4 shadow-sm border">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                        <TrendingUp className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-gray-900">{publishedCourses}</p>
                        <p className="text-sm text-gray-500">Published</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseStatsCards;