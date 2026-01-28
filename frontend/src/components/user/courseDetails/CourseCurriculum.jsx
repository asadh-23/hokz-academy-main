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
            // Free Preview Logic (For now just a success message)
            toast.success("Playing Free Preview...");
            // Here you can open a Video Modal if you have one
        } else {
            // Locked Logic (Tell them to buy)
            toast.error("🔒 This content is locked! Please Enroll to watch.");
            
            // Optional: Scroll to the Enroll button (UX Improvement)
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Course Content</h2>
            
            {/* Header Stats */}
            <div className="text-sm text-gray-500 mb-4 flex items-center gap-2">
                <span className="font-medium text-gray-900">{totalLessons} lessons</span> 
                <span>•</span>
                <span>
                    {hours > 0 && `${hours}h `} 
                    {minutes > 0 && `${minutes}m `} 
                    {seconds}s total length
                </span>
            </div>

            {/* Syllabus List */}
            <div className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
                {lessons.length > 0 ? (
                    <div className="divide-y divide-gray-100">
                        {lessons.map((lesson, index) => (
                            <div 
                                key={lesson._id || index} 
                                onClick={() => handleLessonClick(lesson)} // 👈 Click Action Added
                                className={`group p-3 sm:p-4 flex gap-4 transition-all cursor-pointer ${
                                    lesson.isFreePreview ? "hover:bg-blue-50" : "hover:bg-gray-50"
                                }`}
                            >
                                {/* Left Side: Thumbnail with Overlay */}
                                <div className="relative w-32 h-20 flex-shrink-0 bg-gray-200 rounded-lg overflow-hidden border border-gray-200">
                                    {lesson.thumbnailUrl ? (
                                        <img 
                                            src={lesson.thumbnailUrl} 
                                            alt={lesson.title} 
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-gray-100">
                                            <PlayCircle className="w-8 h-8 text-gray-300" />
                                        </div>
                                    )}
                                    
                                    {/* Icon Overlay on Thumbnail */}
                                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 flex items-center justify-center transition-colors">
                                        {lesson.isFreePreview ? (
                                            <div className="bg-white/90 rounded-full p-1.5 shadow-sm">
                                                <Play className="w-4 h-4 text-blue-600 fill-blue-600" />
                                            </div>
                                        ) : (
                                            <div className="bg-gray-900/60 rounded-full p-1.5 shadow-sm backdrop-blur-sm">
                                                <Lock className="w-3.5 h-3.5 text-white" />
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Right Side: Title & Info */}
                                <div className="flex-1 flex flex-col justify-center">
                                    <div className="flex justify-between items-start gap-2">
                                        <div>
                                            <h4 className={`text-sm font-semibold line-clamp-2 ${
                                                lesson.isFreePreview ? "text-blue-700" : "text-gray-700"
                                            }`}>
                                                {index + 1}. {lesson.title}
                                            </h4>
                                            
                                            {/* Free Preview Badge */}
                                            {lesson.isFreePreview && (
                                                <span className="inline-block mt-1 text-[10px] font-bold text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">
                                                    Free Preview
                                                </span>
                                            )}
                                        </div>

                                        {/* Duration */}
                                        <span className="text-xs text-gray-500 font-medium whitespace-nowrap">
                                            {formatDuration(lesson.duration)}
                                        </span>
                                    </div>
                                    
                                    {/* Helper text for locked items */}
                                    {!lesson.isFreePreview && (
                                        <p className="text-xs text-gray-400 mt-1 group-hover:text-gray-500 transition-colors">
                                            <Lock className="w-3 h-3 inline mr-1" />
                                            Enroll to watch
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    // Fallback State
                    <div className="p-8 text-center text-gray-500 flex flex-col items-center gap-2">
                        <FileText className="w-8 h-8 text-gray-300" />
                        <p>No lessons uploaded yet.</p>
                    </div>
                )}
            </div>

            {lessons.length > 0 && (
                <p className="text-xs text-gray-500 mt-3 text-center">
                    <Lock className="w-3 h-3 inline mr-1" /> 
                    Only lessons marked as "Free Preview" are accessible before enrollment.
                </p>
            )}
        </div>
    );
};

export default CourseCurriculum;