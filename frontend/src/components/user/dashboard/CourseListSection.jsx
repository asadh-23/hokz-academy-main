import React from "react";
import { PlayCircle, CheckCircle2, ArrowRight, Clock, BookOpen, Layers, Award } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CourseListSection = ({ courses }) => {
    const navigate = useNavigate();

    const ongoing = courses?.filter((c) => (c.progress || 0) < 100) || [];
    const completed = courses?.filter((c) => (c.progress || 0) === 100) || [];

    const CourseItem = ({ course, type }) => (
        <div className="group bg-white p-4 md:p-6 rounded-[2.5rem] border border-slate-100 hover:shadow-[0_30px_60px_rgba(30,46,222,0.08)] transition-all duration-500 flex flex-col md:flex-row items-center gap-6 relative overflow-hidden">
            {/* 1. Thumbnail Section */}
            <div className="relative w-full md:w-48 h-32 rounded-[1.8rem] overflow-hidden shrink-0 shadow-inner bg-slate-50">
                <img
                    src={course.thumbnailUrl}
                    alt={course.title}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                />
                {type === "completed" && (
                    <div className="absolute inset-0 bg-[#1E2EDE]/20 backdrop-blur-[2px] flex items-center justify-center">
                        <div className="bg-[#E6D929] p-2 rounded-full shadow-lg">
                            <CheckCircle2 className="text-[#1E2EDE]" size={24} />
                        </div>
                    </div>
                )}
            </div>

            {/* 2. Info Section */}
            <div className="flex-1 text-center md:text-left min-w-0">
                <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                    <span
                        className={`w-2 h-2 rounded-full ${type === "completed" ? "bg-[#E6D929]" : "bg-[#14C4E7]"}`}
                    ></span>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                        {type === "completed" ? "Curriculum Finished" : "Module in Progress"}
                    </span>
                </div>
                <h4 className="text-xl font-black text-[#1E2EDE] mb-3 line-clamp-1 group-hover:text-[#14C4E7] transition-colors uppercase tracking-tight">
                    {course.title}
                </h4>
                <div className="flex items-center justify-center md:justify-start gap-5 text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                    <span className="flex items-center gap-1.5">
                        <BookOpen size={14} className="text-[#14C4E7]" /> {course.lessonsCount} Sessions
                    </span>
                    <span className="flex items-center gap-1.5">
                        <Clock size={14} className="text-[#14C4E7]" /> {course.totalDurationSeconds || "0m"}
                    </span>
                </div>
            </div>

            {/* 3. Progress & Action Section */}
            <div className="flex flex-col items-center md:items-end gap-4 w-full md:w-48 shrink-0 border-t md:border-t-0 md:border-l border-slate-50 pt-4 md:pt-0 md:pl-8">
                <div className="w-full flex items-center justify-between md:justify-end gap-3 mb-1">
                    <span
                        className={`text-[11px] font-black ${type === "completed" ? "text-[#E6D929]" : "text-[#1E2EDE]"}`}
                    >
                        {course.progress}%
                    </span>
                    <div className="w-24 md:w-32 bg-slate-50 h-2 rounded-full overflow-hidden border border-slate-100">
                        <div
                            className={`h-full rounded-full transition-all duration-1000 ${type === "completed" ? "bg-[#E6D929]" : "bg-[#14C4E7]"}`}
                            style={{ width: `${course.progress}%` }}
                        ></div>
                    </div>
                </div>

                <button
                    onClick={() => navigate(`/user/learn/${course._id}`)}
                    className={`w-full flex items-center justify-center gap-3 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all active:scale-95 shadow-lg ${
                        type === "completed"
                            ? "bg-[#E6D929] text-[#1E2EDE] shadow-yellow-100 hover:bg-[#14C4E7] hover:text-white"
                            : "bg-[#1E2EDE] text-[#FDFDFD] shadow-blue-100 hover:bg-[#14C4E7]"
                    }`}
                >
                    {type === "completed" ? "Review Lesson" : "Resume Module"}
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </button>
            </div>
        </div>
    );

    const EmptyState = ({ message }) => (
        <div className="py-20 text-center bg-white rounded-[3rem] border-4 border-dashed border-slate-50 shadow-inner">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                <Layers className="text-slate-200" size={32} />
            </div>
            <p className="text-[#1E2EDE] font-black text-xs uppercase tracking-[0.3em] opacity-40">{message}</p>
        </div>
    );

    return (
        <div className="space-y-24 mt-20 max-w-7xl mx-auto px-4 md:px-6">
            {/* --- ONGOING SECTION --- */}
            <section>
                <div className="flex items-center justify-between mb-10 border-l-8 border-[#14C4E7] pl-6 md:pl-8">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-black text-[#1E2EDE] uppercase tracking-tighter">
                            Ongoing <span className="text-[#14C4E7]">Learning</span>
                        </h2>
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">
                            Pick up right where you left off
                        </p>
                    </div>
                    <div className="hidden sm:flex bg-[#14C4E7]/10 p-3 rounded-2xl">
                        <PlayCircle className="text-[#14C4E7]" size={32} />
                    </div>
                </div>

                <div className="grid gap-8">
                    {ongoing.length > 0 ? (
                        ongoing.map((course) => <CourseItem key={course._id} course={course} type="ongoing" />)
                    ) : (
                        <EmptyState message="No modules currently active" />
                    )}
                </div>
            </section>

            {/* --- COMPLETED SECTION --- */}
            <section className="pb-20">
                <div className="flex items-center justify-between mb-10 border-l-8 border-[#E6D929] pl-6 md:pl-8">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-black text-[#1E2EDE] uppercase tracking-tighter">
                            Completed <span className="text-[#E6D929]">Milestones</span>
                        </h2>
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">
                            Your academic achievements and results
                        </p>
                    </div>
                    <div className="hidden sm:flex bg-[#E6D929]/10 p-3 rounded-2xl">
                        <Award className="text-[#E6D929]" size={32} />
                    </div>
                </div>

                <div className="grid gap-8">
                    {completed.length > 0 ? (
                        completed.map((course) => <CourseItem key={course._id} course={course} type="completed" />)
                    ) : (
                        <EmptyState message="The trophy cabinet is waiting for you" />
                    )}
                </div>
            </section>
        </div>
    );
};

export default CourseListSection;
