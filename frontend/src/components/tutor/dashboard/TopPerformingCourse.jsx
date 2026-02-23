import React from "react";
import { TrendingUp, BookOpen, Star, Users, Award } from "lucide-react";
import { formatText } from "../../../utils/formatText";
import { useNavigate } from "react-router-dom";

const TopPerformingCourse = ({ courses, formatCurrency }) => {
    // Safe check if course exists
    const course = courses && courses.length > 0 ? courses[0] : null;
    const navigate = useNavigate();
    // Calculate Prices Dynamically
    const originalPrice = course?.price || 0;
    const offerPercentage = course?.offerPercentage || 0;

    const sellingPrice =
        offerPercentage > 0 ? Math.round(originalPrice - (originalPrice * offerPercentage) / 100) : originalPrice;

    return (
        <div className="bg-gradient-to-br from-white via-white to-blue-50/30 backdrop-blur-sm p-6 rounded-3xl shadow-xl border border-white/60 flex flex-col justify-between h-[350px] hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
            <div className="flex-1 flex flex-col">
                {/* Header with Icon and Title */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg">
                            <Award className="w-4 h-4 text-white" />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-800 text-base">Top Performer</h3>
                            <p className="text-xs text-gray-500">Best selling course</p>
                        </div>
                    </div>
                    <div className="bg-gradient-to-r from-emerald-100 to-green-100 px-2.5 py-1 rounded-full">
                        <span className="text-xs font-bold text-emerald-700">#1</span>
                    </div>
                </div>

                {course ? (
                    <>
                        {/* Compact Image Section */}
                        <div
                            onClick={() => navigate(`/tutor/courses/${course._id}`)}
                            className="relative h-32 rounded-xl overflow-hidden mb-3 bg-gradient-to-br from-gray-100 to-gray-200 shadow-inner group"
                        >
                            <img
                                src={course.thumbnailUrl || "https://via.placeholder.com/400x200?text=Course"}
                                alt={course.title}
                                className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>

                            {/* Floating Stats */}
                            <div className="absolute top-2 left-2 bg-white/95 backdrop-blur-md px-2 py-1 rounded-lg shadow-lg">
                                <div className="flex items-center gap-1">
                                    <Users className="w-3 h-3 text-indigo-600" />
                                    <span className="text-xs font-bold text-gray-700">{course.enrolledCount}</span>
                                </div>
                            </div>

                            {/* Category Badge */}
                            {course.category && (
                                <div className="absolute top-2 right-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-2 py-1 rounded-lg shadow-lg">
                                    <span className="text-xs font-bold">{course.category.name}</span>
                                </div>
                            )}

                            {/* Rating Badge */}
                            <div className="absolute bottom-2 left-2 bg-white/95 backdrop-blur-md px-2 py-1 rounded-lg shadow-lg">
                                <div className="flex items-center gap-1">
                                    <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                                    <span className="text-xs font-bold text-gray-700">{course.averageRating || 4.8}</span>
                                </div>
                            </div>
                        </div>

                        {/* Compact Course Info Section */}
                        <div className="space-y-3 flex-1">
                            {/* Title */}
                            <div>
                                <h4
                                    className="font-bold text-base text-gray-900 line-clamp-1 leading-tight mb-1"
                                    title={course.title}
                                >
                                    {formatText(course.title, 30)}
                                </h4>

                                {/* Description */}
                                {course.description && (
                                    <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                                        {formatText(course.description, 40)}
                                    </p>
                                )}
                            </div>

                            {/* Compact Price Section */}
                            <div className="bg-gradient-to-r from-emerald-50 to-green-50 p-3 rounded-xl border border-emerald-100">
                                <div className="space-y-2">
                                    {/* Current Price */}
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-medium text-gray-600">Selling Price:</span>
                                        <span className="font-bold text-lg text-emerald-600">
                                            {formatCurrency(sellingPrice)}
                                        </span>
                                    </div>

                                    {/* Discount Details */}
                                    {offerPercentage > 0 && (
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs text-gray-500">Original:</span>
                                            <div className="flex items-center gap-1.5">
                                                <span className="text-xs text-gray-400 line-through">
                                                    {formatCurrency(originalPrice)}
                                                </span>
                                                <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-1.5 py-0.5 rounded-md shadow-sm">
                                                    <span className="text-xs font-bold">{offerPercentage}% OFF</span>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="text-center py-8 flex flex-col items-center justify-center flex-1">
                        <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-3 shadow-inner">
                            <BookOpen className="w-8 h-8 text-gray-400" />
                        </div>
                        <h4 className="text-base font-semibold text-gray-500 mb-1">No Top Course Yet</h4>
                        <p className="text-xs text-gray-400 text-center leading-relaxed">
                            Create and sell your first course
                            <br />
                            to see your top performer here
                        </p>
                    </div>
                )}
            </div>

            {/* Compact Action Button */}
            {course && (
                <div className="mt-4 pt-3 border-t border-gray-100">
                    <button className="w-full py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl text-xs font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2">
                        <TrendingUp className="w-3.5 h-3.5" />
                    </button>
                </div>
            )}
        </div>
    );
};

export default TopPerformingCourse;
