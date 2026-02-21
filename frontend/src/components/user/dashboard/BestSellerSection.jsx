import React from "react";
import { Star, Users, ArrowRight, Play, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

const BestSellerSection = ({ courses }) => {
    const navigate = useNavigate();

    // Logic: Null check (Preserved)
    if (!courses || courses.length === 0) return null;

    return (
        <section className="mt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            {/* --- SECTION HEADER --- */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-l-8 border-[#E6D929] pl-6 md:pl-8">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <Sparkles size={18} className="text-[#14C4E7]" />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#14C4E7]">Community Favorites</span>
                    </div>
                    <h2 className="text-3xl md:text-5xl font-black text-[#1E2EDE] uppercase tracking-tighter">
                        Best <span className="text-[#14C4E7]">Sellers</span>
                    </h2>
                    <p className="text-slate-400 text-sm font-medium mt-2">
                        Discover the top-rated modules chosen by thousands of learners.
                    </p>
                </div>
                
                <button 
                    onClick={() => navigate("/user/courses")}
                    className="group bg-[#1E2EDE] text-[#E6D929] px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-3 hover:bg-[#14C4E7] hover:text-white transition-all shadow-xl shadow-blue-900/10 active:scale-95 w-fit"
                >
                    Explore All Courses <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </button>
            </div>

            {/* --- CARDS GRID --- */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
                {courses.map((course) => (
                    <div 
                        key={course._id}
                        onClick={() => navigate(`/user/courses/${course._id}`)}
                        className="group bg-white rounded-[2.5rem] border border-slate-100 flex flex-col hover:shadow-[0_40px_80px_rgba(30,46,222,0.12)] transition-all duration-500 cursor-pointer overflow-hidden relative transform hover:-translate-y-3"
                    >
                        {/* 1. Image Container (Inset Style) */}
                        <div className="relative h-52 m-4 overflow-hidden rounded-[2rem] shadow-inner bg-slate-50">
                            <img 
                                src={course.thumbnailUrl} 
                                alt={course.title} 
                                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                            />
                            
                            {/* Branded Badge */}
                            <div className="absolute top-4 left-4 bg-[#E6D929] text-[#1E2EDE] px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-wider shadow-lg flex items-center gap-1.5">
                                <div className="w-1.5 h-1.5 bg-[#1E2EDE] rounded-full animate-pulse"></div>
                                Best Seller
                            </div>

                            {/* Hover Overlay */}
                            <div className="absolute inset-0 bg-[#1E2EDE]/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center">
                                <div className="bg-[#E6D929] p-5 rounded-full text-[#1E2EDE] shadow-2xl transform scale-50 group-hover:scale-100 transition-transform duration-500">
                                    <Play size={24} fill="currentColor" />
                                </div>
                            </div>
                        </div>

                        {/* 2. Card Content */}
                        <div className="px-8 pb-8 flex-1 flex flex-col">
                            {/* Metadata Row */}
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-1.5 bg-[#E6D929]/10 px-2.5 py-1 rounded-lg">
                                    <Star size={12} className="fill-[#E6D929] text-[#E6D929]" />
                                    <span className="text-[11px] font-black text-slate-700">{course.averageRating || '4.9'}</span>
                                </div>
                                <div className="flex items-center gap-2 text-slate-300 font-black text-[9px] uppercase tracking-tighter">
                                    <Users size={12} className="text-[#14C4E7]" />
                                    {/* <span>20{course.studentCount}+ Learners</span> */}
                                </div>
                            </div>

                            {/* Course Title */}
                            <h3 className="text-lg font-bold text-slate-800 mb-6 line-clamp-2 leading-tight transition-colors duration-300 group-hover:text-[#1E2EDE]">
                                {course.title}
                            </h3>

                            {/* 3. Footer Action Area */}
                            <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between">
                                <div className="flex flex-col">
                                    {course.offerPercentage > 0 && (
                                        <span className="text-[10px] text-slate-300 line-through font-bold tracking-tight">₹{course.price}</span>
                                    )}
                                    <span className="text-2xl font-black text-[#1E2EDE] group-hover:text-[#14C4E7] transition-colors tracking-tighter">
                                        ₹{Math.round(course.price - (course.price * (course.offerPercentage || 0) / 100))}
                                    </span>
                                </div>
                                
                                <div className="relative">
                                    <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-[#14C4E7] transition-all duration-500 group-hover:bg-[#1E2EDE] group-hover:text-[#E6D929] group-hover:rotate-[360deg] shadow-sm">
                                        <ArrowRight size={20} />
                                    </div>
                                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#E6D929] rounded-full border-2 border-white opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default BestSellerSection;