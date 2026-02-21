import { Star, AlertCircle, Globe, BadgeCheck } from "lucide-react";
import { formatText } from "../../../utils/formatText";

const CourseHero = ({ courseData }) => {
    // 1. Safety Check: If course is not loaded yet, show nothing or a skeleton
    if (!courseData?.course) return null;
    const course = courseData.course

        return (
        <header className="bg-[#1E2EDE] relative overflow-hidden pt-12 pb-24 md:pb-32">
            {/* Background Accents */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#14C4E7] opacity-10 rounded-full -translate-y-20 translate-x-20"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#E6D929] opacity-10 rounded-full translate-y-10 -translate-x-10"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="lg:w-2/3">
                    {/* Breadcrumbs */}
                    <div className="flex items-center gap-3 mb-6">
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#14C4E7]">Academy</span>
                        <span className="text-[#FDFDFD]/30">/</span>
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#E6D929]">
                            {course.category?.name || "Premium Class"}
                        </span>
                    </div>

                    <h1 className="text-3xl sm:text-5xl font-black text-white mb-6 leading-tight tracking-tight">
                        {course.title}
                    </h1>

                    <p className="text-lg text-[#FDFDFD]/70 mb-8 leading-relaxed font-medium">
                        {course.shortSummary || formatText(course.description, 200)}
                    </p>

                    {/* Ratings & Students */}
                    <div className="flex flex-wrap items-center gap-6 mb-10">
                        <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10">
                            <span className="text-[#E6D929] font-black text-lg">
                                {course.averageRating || "0.0"}
                            </span>
                            <div className="flex text-[#E6D929]">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        size={14}
                                        className={i < Math.round(course.averageRating || 0) ? "fill-current" : "text-white/20"}
                                    />
                                ))}
                            </div>
                            <span className="text-[#FDFDFD]/50 text-xs font-bold ml-1">
                                ({course.totalReviews || 0} reviews)
                            </span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                            <BadgeCheck size={18} className="text-[#14C4E7]" />
                            <span className="text-[#FDFDFD] font-black text-sm uppercase tracking-tighter">
                                {course.enrolledCount || 0} Students Guided
                            </span>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-8">
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#FDFDFD]/60">
                            <AlertCircle size={14} className="text-[#14C4E7]" />
                            Updated: {course.updatedAt ? new Date(course.updatedAt).toLocaleDateString() : "Live"}
                        </div>
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#FDFDFD]/60">
                            <Globe size={14} className="text-[#14C4E7]" />
                            Language: {course.language || "English"}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default CourseHero;