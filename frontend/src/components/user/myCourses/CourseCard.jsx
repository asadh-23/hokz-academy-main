import React from "react";
import { BookOpen, Clock, Play, Award, CheckCircle2, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { formatText } from "../../../utils/formatText";

const CourseCard = ({ course, viewMode = "grid" }) => {
    const navigate = useNavigate();
    const isCompleted = course.progress === 100;
    const progressColor = isCompleted ? "#E6D929" : "#14C4E7";

    const handleNavigation = (isCompleted) => {
        if (!isCompleted) {
            navigate(`/user/learn/${course._id}`);
            return;
        }

        if (course.exam) {
            if (course.examStatus?.isPassed) {
                navigate("/user/certificates");
            } else {
                navigate(`/user/learn/${course._id}`);
            }
        } else {
            navigate("/user/certificates");
        }
    };

    if (viewMode === "list") {
        return (
            <div className="group bg-white rounded-[2rem] border border-slate-100 p-4 md:p-6 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(30,46,222,0.08)]">
                <div className="flex flex-col md:flex-row items-center gap-6">
                    {/* Thumbnail */}
                    <div className="relative w-full md:w-48 h-32 rounded-2xl overflow-hidden shrink-0 shadow-inner bg-slate-100">
                        <img
                            src={course.thumbnailUrl || "https://via.placeholder.com/400x225"}
                            alt={course.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        {isCompleted && (
                            <div className="absolute inset-0 bg-[#1E2EDE]/20 backdrop-blur-[2px] flex items-center justify-center">
                                <CheckCircle2 className="text-[#E6D929]" size={32} />
                            </div>
                        )}
                    </div>

                    {/* Content Section */}
                    <div className="flex-1 w-full min-w-0">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <span className="text-[9px] font-black uppercase tracking-widest text-[#14C4E7] bg-[#14C4E7]/5 px-3 py-1 rounded-lg">
                                        {course.category?.name || "General"}
                                    </span>
                                    <div className="flex items-center gap-4 text-slate-400 font-bold text-[10px] uppercase tracking-tighter">
                                        <span className="flex items-center gap-1">
                                            <BookOpen size={12} /> {course.lessonsCount || 0} Lessons
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Clock size={12} /> {course.totalDurationSeconds || "0m"}
                                        </span>
                                    </div>
                                </div>
                                <h3 className="text-xl font-black text-[#1E2EDE] mb-1 line-clamp-1 group-hover:text-[#14C4E7] transition-colors">
                                    {course.title}
                                </h3>
                                <div className="flex items-center gap-2">
                                    <img
                                        src={course.tutor?.profileImage}
                                        className="w-5 h-5 rounded-full object-cover border border-[#14C4E7]"
                                        alt="Tutor"
                                    />
                                    <span className="text-xs font-bold text-slate-500 uppercase tracking-tight">
                                        {course.tutor?.fullName}
                                    </span>
                                </div>
                            </div>

                            {/* Action & Percentage */}
                            <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between gap-2">
                                <span
                                    className={`text-xs font-black uppercase tracking-widest ${isCompleted ? "text-[#E6D929]" : "text-[#1E2EDE]"}`}
                                >
                                    {course.progress || 0}% Complete
                                </span>
                                <button
                                    onClick={() => handleNavigation(isCompleted)}
                                    className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all active:scale-95 shadow-lg ${
                                        isCompleted
                                            ? "bg-[#E6D929] text-[#1E2EDE] shadow-yellow-100"
                                            : "bg-[#1E2EDE] text-[#FDFDFD] shadow-blue-100 hover:bg-[#14C4E7]"
                                    }`}
                                >
                                    {isCompleted ? <Award size={14} /> : <Play size={14} />}
                                    {isCompleted ? "Certificate" : "Continue"}
                                </button>
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full bg-slate-50 rounded-full h-2 overflow-hidden border border-slate-100">
                            <div
                                className="h-full rounded-full transition-all duration-1000 ease-out"
                                style={{
                                    width: `${course.progress || 0}%`,
                                    backgroundColor: progressColor,
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // --- GRID MODE DESIGN ---
    return (
        <div className="group bg-white rounded-[2.5rem] border border-slate-100 flex flex-col h-full transition-all duration-500 hover:shadow-[0_30px_60px_rgba(30,46,222,0.12)] hover:-translate-y-2 overflow-hidden">
            {/* Thumbnail Header */}
            <div className="relative h-48 m-3 overflow-hidden rounded-[2rem] shrink-0">
                <img
                    src={course.thumbnailUrl || "https://via.placeholder.com/400x225"}
                    alt={course.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />

                {/* Status Overlay */}
                <div className="absolute top-4 right-4 z-10">
                    <div
                        className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest backdrop-blur-md border ${
                            isCompleted
                                ? "bg-[#E6D929]/90 text-[#1E2EDE] border-[#E6D929]"
                                : "bg-[#1E2EDE]/80 text-white border-white/20"
                        }`}
                    >
                        {course.progress || 0}%
                    </div>
                </div>

                {/* Play Button Overlay on Hover */}
                <div className="absolute inset-0 bg-[#1E2EDE]/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center">
                    <button
                        onClick={() => handleNavigation(isCompleted)}
                        className={`p-5 rounded-full transform scale-50 group-hover:scale-100 transition-all duration-500 shadow-2xl ${
                            isCompleted ? "bg-[#E6D929] text-[#1E2EDE]" : "bg-white text-[#1E2EDE]"
                        }`}
                    >
                        {!isCompleted ? (
                            <Play size={28} fill="currentColor" />
                        ) : course.examStatus?.isPassed ? (
                            <Award size={28} /> // പാസ്സായവർക്ക് അവാർഡ് ഐക്കൺ
                        ) : (
                            <BookOpen size={28} /> // പാസ്സാകാത്തവർക്ക് ബുക്ക് ഐക്കൺ
                        )}
                    </button>
                </div>
            </div>

            {/* Course Information */}
            <div className="p-7 pt-2 flex flex-col flex-1">
                <div className="flex items-center justify-between mb-4">
                    <span className="text-[9px] font-black uppercase tracking-widest text-[#14C4E7] px-3 py-1 bg-[#14C4E7]/5 rounded-lg">
                        {course.category?.name || "General"}
                    </span>
                    <div className="flex items-center gap-2 text-slate-300">
                        <Clock size={12} />
                        <span className="text-[10px] font-bold">{course.totalDurationSeconds || "0m"}</span>
                    </div>
                </div>

                <h3 className="text-xl font-black text-[#1E2EDE] mb-3 line-clamp-2 leading-tight group-hover:text-[#14C4E7] transition-colors">
                    {course.title}
                </h3>

                {course.description && (
                    <p className="text-xs text-slate-400 font-medium leading-relaxed mb-6 line-clamp-2">
                        {course.description}
                    </p>
                )}

                {/* Footer Logic: Progress & Tutor */}
                <div className="mt-auto space-y-6">
                    {/* Progress Visual */}
                    <div>
                        <div className="flex justify-between items-end mb-2">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                Progress
                            </span>
                            <span className={`text-xs font-black ${isCompleted ? "text-[#E6D929]" : "text-[#1E2EDE]"}`}>
                                {course.progress || 0}%
                            </span>
                        </div>
                        <div className="w-full bg-slate-50 h-2 rounded-full overflow-hidden border border-slate-100">
                            <div
                                className="h-full rounded-full transition-all duration-1000 ease-out"
                                style={{
                                    width: `${course.progress || 0}%`,
                                    backgroundColor: progressColor,
                                }}
                            />
                        </div>
                    </div>

                    {/* Tutor Details */}
                    <div className="flex items-center justify-between pt-5 border-t border-slate-50">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl overflow-hidden border-2 border-[#14C4E7]/20 shadow-sm">
                                <img
                                    src={course.tutor?.profileImage || "https://via.placeholder.com/32"}
                                    className="w-full h-full object-cover"
                                    alt="Instructor"
                                />
                            </div>
                            <div className="overflow-hidden">
                                <p className="text-[8px] text-slate-300 font-black uppercase tracking-widest leading-none mb-1">
                                    Expert Mentor
                                </p>
                                <p className="text-xs font-black text-slate-700 truncate max-w-[100px]">
                                    {course.tutor?.fullName}
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={() => handleNavigation(isCompleted)}
                            className="w-10 h-10 bg-slate-50 text-[#14C4E7] rounded-xl flex items-center justify-center group-hover:bg-[#1E2EDE] group-hover:text-[#E6D929] transition-all duration-500 shadow-sm"
                        >
                            <ChevronRight size={18} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseCard;
