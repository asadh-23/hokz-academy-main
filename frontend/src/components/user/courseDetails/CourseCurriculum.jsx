import { PlayCircle, Lock, FileText, Play } from "lucide-react";
import { toast } from "sonner"; // Toast message കാണിക്കാൻ

// Helper to format seconds
const formatDuration = (seconds) => {
    if (!seconds) return "00:00";
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
};

const CourseCurriculum = ({ courseData, totalLessons, hours, minutes, seconds }) => {
    const lessons = courseData?.course?.lessons || [];

    // 👇 Click Handler Logic
    const handleLessonClick = (lesson) => {
        if (lesson.isFreePreview) {
            toast.success("Playing Free Preview...");
        } else {
            // Locked Logic (Tell them to buy)
            toast.info("🔒 This content is locked! Please Enroll to watch.");
        
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

       return (
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8">
            <h2 className="text-2xl font-black text-[#1E2EDE] mb-2 uppercase tracking-tight">Syllabus <span className="text-[#14C4E7]">Modules</span></h2>
            
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-8">
                <span className="text-[#1E2EDE]">{totalLessons} Sessions</span> 
                <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                <span>
                    {hours > 0 && `${hours}h `}{minutes > 0 && `${minutes}m `}{seconds}s Runtime
                </span>
            </div>

            <div className="space-y-4">
                {lessons.length > 0 ? (
                    lessons.map((lesson, index) => (
                        <div 
                            key={lesson._id || index} 
                            onClick={() => handleLessonClick(lesson)}
                            className={`group flex items-center gap-6 p-4 rounded-3xl border transition-all cursor-pointer ${
                                lesson.isFreePreview 
                                ? "bg-slate-50 border-[#14C4E7]/30 hover:border-[#14C4E7]" 
                                : "bg-white border-slate-50 hover:border-[#1E2EDE]/20"
                            }`}
                        >
                            <div className="relative w-24 h-16 md:w-32 md:h-20 flex-shrink-0 rounded-2xl overflow-hidden shadow-inner">
                                <img 
                                    src={lesson.thumbnailUrl} 
                                    className="w-full h-full object-cover transition-transform group-hover:scale-110"
                                />
                                <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-[1px]">
                                    {lesson.isFreePreview 
                                        ? <Play size={20} className="text-[#E6D929] fill-[#E6D929]" />
                                        : <Lock size={16} className="text-white" />
                                    }
                                </div>
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-center gap-4">
                                    <h4 className={`text-sm font-bold truncate ${lesson.isFreePreview ? "text-[#14C4E7]" : "text-slate-700"}`}>
                                        {index + 1}. {lesson.title}
                                    </h4>
                                    <span className="text-[10px] font-black text-slate-400 whitespace-nowrap">
                                        {formatDuration(lesson.duration)}
                                    </span>
                                </div>
                                {lesson.isFreePreview ? (
                                    <span className="text-[8px] font-black uppercase tracking-widest text-[#E6D929] bg-[#1E2EDE] px-2 py-1 rounded-lg inline-block mt-2">
                                        Open Session
                                    </span>
                                ) : (
                                    <p className="text-[10px] text-slate-300 font-bold mt-1 uppercase tracking-tight">Locked Content</p>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="py-20 text-center text-slate-300">
                        <FileText className="mx-auto mb-4 opacity-20" size={48} />
                        <p className="font-bold uppercase text-[10px] tracking-widest">No curriculum uploaded yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CourseCurriculum;