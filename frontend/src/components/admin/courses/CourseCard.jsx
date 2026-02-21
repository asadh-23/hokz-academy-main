import React from 'react';
import { Users, Star, Clock, Settings } from 'lucide-react';
import { formatText } from '../../../utils/formatText';

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
            className="bg-[#FDFDFD] rounded-[2rem] shadow-lg shadow-blue-900/5 border border-gray-100 hover:shadow-2xl hover:border-[#14C4E7]/30 transition-all duration-500 overflow-hidden cursor-pointer group"
        >
            <div className="relative h-56 overflow-hidden">
                <img
                    src={course.thumbnailUrl || "https://via.placeholder.com/400x250"}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1E2EDE]/80 via-transparent to-transparent"></div>

                {course.isBanned && (
                    <div className="absolute inset-0 bg-gray-900/80 backdrop-blur-sm flex items-center justify-center">
                        <div className="text-center">
                            <span className="block text-white text-3xl font-black mb-1 drop-shadow-lg">BANNED</span>
                            <span className="text-[#E6D929] text-[10px] font-bold uppercase tracking-widest">Administrative Action</span>
                        </div>
                    </div>
                )}

                <div className="absolute top-4 left-4">
                    <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider border-2 shadow-lg
                        ${course.isListed ? "bg-white text-[#14C4E7] border-white" : "bg-[#E6D929] text-[#1E2EDE] border-[#E6D929]"}`}>
                        {course.isListed ? "● Published" : "○ Draft"}
                    </span>
                </div>

                <div className="absolute bottom-4 left-4 flex items-center gap-3">
                    <img
                        src={course.tutor?.profileImage || "https://via.placeholder.com/32"}
                        alt=""
                        className="w-10 h-10 rounded-xl border-2 border-[#14C4E7] object-cover shadow-lg"
                    />
                    <p className="text-white text-xs font-black drop-shadow-md">{course.tutor?.fullName || "Instructor"}</p>
                </div>
            </div>

            <div className="p-6">
                <div className="mb-2">
                    <span className="text-[10px] font-black text-[#14C4E7] uppercase tracking-[0.2em]">{course.category?.name || "Uncategorized"}</span>
                </div>
                <h3 className="font-bold text-[#1E2EDE] text-xl mb-3 line-clamp-1 group-hover:text-[#14C4E7] transition-colors">
                    {course.title}
                </h3>

                <div className="flex items-center gap-4 mb-6 text-xs font-bold text-gray-400">
                    <div className="flex items-center gap-1.5"><Users size={14} className="text-[#14C4E7]"/> {course.enrolledCount}</div>
                    <div className="flex items-center gap-1.5"><Clock size={14} className="text-[#14C4E7]"/> {new Date(course.createdAt).toLocaleDateString()}</div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                    <div>
                        {offer > 0 && (
                            <span className="text-[10px] font-black text-red-500 bg-red-50 px-2 py-1 rounded-lg mr-2">
                                -{offer}%
                            </span>
                        )}
                        <span className="text-2xl font-black text-[#1E2EDE]">{formatCurrency(sellingPrice)}</span>
                    </div>

                    <button className="p-3 bg-[#1E2EDE] text-white rounded-2xl hover:bg-[#14C4E7] transition-all shadow-lg shadow-blue-200">
                        <Settings size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CourseCard;