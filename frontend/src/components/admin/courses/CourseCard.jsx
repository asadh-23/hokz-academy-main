import React from 'react';
import { Users, Star, Clock, Settings } from 'lucide-react';

const CourseCard = ({ course, formatCurrency, navigate }) => {
    const originalPrice = course.price;
    const offer = course.offerPercentage || 0;
    const sellingPrice = offer > 0 ? Math.round(originalPrice - (originalPrice * offer) / 100) : originalPrice;

    const handleManageCourse = (e) => {
        e.stopPropagation();
        navigate(`/admin/courses/${course._id}/manage`);
    };

    return (
        <div 
            onClick={handleManageCourse}
            className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-all duration-200 overflow-hidden cursor-pointer group"
        >
            {/* Image */}
            <div className="relative h-48 bg-gray-100 overflow-hidden">
                <img
                    src={course.thumbnailUrl || "https://via.placeholder.com/400x250"}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>

                {/* Status Badge */}
                <div className="absolute top-3 left-3">
                    <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                            course.isListed
                                ? "bg-green-100 text-green-800 border border-green-200"
                                : "bg-yellow-100 text-yellow-800 border border-yellow-200"
                        }`}
                    >
                        {course.isListed ? "Published" : "Unlisted"}
                    </span>
                </div>

                {/* Category Badge */}
                <div className="absolute top-3 right-3">
                    <span className="px-2 py-1 bg-white/90 backdrop-blur-sm text-gray-700 rounded-full text-xs font-medium">
                        {course.category?.name || "General"}
                    </span>
                </div>

                {/* Tutor Info */}
                <div className="absolute bottom-3 left-3 flex items-center gap-2">
                    <img
                        src={course.tutor?.profileImage || "https://via.placeholder.com/32"}
                        alt="Tutor"
                        className="w-8 h-8 rounded-full border-2 border-white object-cover"
                    />
                    <div className="text-white">
                        <p className="text-xs font-medium">{course.tutor?.fullName || "Unknown"}</p>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="p-5">
                <h3 className="font-semibold text-gray-900 text-lg mb-2 line-clamp-2 leading-tight">
                    {course.title}
                </h3>

                <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">
                    {course.description || "No description available for this course."}
                </p>

                {/* Stats */}
                <div className="flex items-center justify-between mb-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                        <Users size={14} />
                        <span>{course.enrolledCount} students</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Clock size={14} />
                        <span>{new Date(course.createdAt).toLocaleDateString()}</span>
                    </div>
                </div>

                {/* Price and Action */}
                <div className="flex items-center justify-between">
                    <div>
                        {offer > 0 && (
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-sm text-gray-400 line-through">{formatCurrency(originalPrice)}</span>
                                <span className="text-xs font-medium text-red-600 bg-red-100 px-2 py-0.5 rounded">
                                    -{offer}%
                                </span>
                            </div>
                        )}
                        <div className="text-xl font-bold text-gray-900">{formatCurrency(sellingPrice)}</div>
                    </div>

                    <button 
                        onClick={handleManageCourse}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                    >
                        <Settings size={16} />
                        Manage
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CourseCard;