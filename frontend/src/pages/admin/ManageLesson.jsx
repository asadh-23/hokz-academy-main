import { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import {
    ArrowLeft,
    Video,
    Clock,
    Calendar,
    CheckCircle,
    XCircle,
    Play,
    Pause,
    FileText,
    BookOpen,
    Settings,
    Layers,
} from "lucide-react";
import { fetchAdminLessonData, toggleAdminLessonBlock } from "../../store/features/admin/adminCourseSlice";
import { useDispatch } from "react-redux";

const ManageLesson = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { courseId, lessonId } = useParams();
    const { courseTitle } = location.state || {};

    // 1. Initialize with NULL (Not empty object)
    const [lessonData, setLessonData] = useState(null);
    // 2. Add Loading State
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLessonData = async () => {
            try {
                // setLoading(true) here is good practice if refreshing logic exists later
                const data = await dispatch(fetchAdminLessonData(lessonId)).unwrap();
                if (data.success) {
                    setLessonData(data.data);
                }
            } catch (error) {
                console.error("Fetch Error:", error);
                toast.error("Failed to load lesson data");
                // Navigate back safely
                navigate(courseId ? `/admin/courses/${courseId}/manage` : "/admin/courses");
            } finally {
                setLoading(false); // Now this works ✅
            }
        };

        if (lessonId) {
            fetchLessonData();
        }
    }, [lessonId, courseId, navigate, dispatch]);

    // Helper functions
    const formatDuration = (totalSeconds) => {
        if (!totalSeconds) return "0 sec";
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = Math.floor(totalSeconds % 60);

        if (hours > 0) return `${hours}h ${minutes}m ${seconds}s`;
        if (minutes > 0) return `${minutes}m ${seconds}s`;
        return `${seconds}s`;
    };

    const formatDate = (date) => {
        if (!date) return "N/A";
        return new Date(date).toLocaleDateString("en-IN", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const handleToggleLesson = async (lessonId, currentStatus) => {
        const newStatus = !currentStatus;
        try {
            const result = await dispatch(toggleAdminLessonBlock(lessonId)).unwrap();

            // Handle both response structures (if result returns the object directly or wrapped in data)
            const updatedData = result.data;

            setLessonData((prev) => ({ ...prev, ...updatedData, isPublished: newStatus }));
            toast.success(newStatus ? "Lesson Published!" : "Lesson Unpublished!");
        } catch (error) {
            console.error("Toggle Error:", error);
            toast.error("Failed to update status");
        }
    };

    // 3. Loading UI
    if (loading) {
        return (
            <div className="min-h-screen bg-[#FDFDFD] flex flex-col items-center justify-center p-6">
                <div className="w-16 h-16 border-4 border-[#14C4E7]/20 border-t-[#1E2EDE] rounded-full animate-spin"></div>
                <p className="mt-4 text-[#1E2EDE] font-black uppercase tracking-widest text-xs">Loading Lesson...</p>
            </div>
        );
    }

    if (!lessonData) {
        return (
            <div className="min-h-screen bg-[#FDFDFD] flex flex-col items-center justify-center gap-6 p-6">
                <div className="p-6 bg-gray-50 rounded-full">
                    <XCircle className="w-16 h-16 text-gray-300" />
                </div>
                <p className="text-gray-500 font-bold">Lesson data not found.</p>
                <button
                    onClick={() => navigate(-1)}
                    className="px-8 py-3 bg-[#1E2EDE] text-white rounded-2xl font-bold shadow-lg hover:shadow-blue-200 transition-all active:scale-95"
                >
                    Return to Course
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FDFDFD] bg-gradient-to-br from-[#FDFDFD] via-[#14C4E7]/5 to-[#1E2EDE]/5">
            {/* Header Section */}
            <div className="bg-white/80 backdrop-blur-md sticky top-0 z-30 border-b border-gray-100 px-4 md:px-8 py-4">
                <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                        <button
                            onClick={() => navigate(courseId ? `/admin/courses/${courseId}/manage` : -1)}
                            className="p-2.5 bg-[#FDFDFD] text-[#1E2EDE] border border-gray-100 rounded-xl hover:bg-[#1E2EDE] hover:text-white transition-all shadow-sm group"
                        >
                            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        </button>
                        <div className="h-10 w-px bg-gray-200 hidden sm:block"></div>
                        <div>
                            <h1 className="text-xl font-black text-[#1E2EDE] leading-none">Lesson Details</h1>
                            {courseTitle && (
                                <p className="text-[10px] font-bold text-[#14C4E7] uppercase tracking-widest mt-1">
                                    {courseTitle}
                                </p>
                            )}
                        </div>
                    </div>

                    <button
                        onClick={() => handleToggleLesson(lessonData._id, lessonData.isPublished)}
                        className={`
                        w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg
                        ${
                            lessonData.isPublished
                                ? "bg-red-500 text-white hover:shadow-red-200"
                                : "bg-[#14C4E7] text-white hover:shadow-cyan-200"
                        }
                    `}
                    >
                        {lessonData.isPublished ? (
                            <>
                                <Pause className="w-4 h-4" />
                                Unpublish
                            </>
                        ) : (
                            <>
                                <Play className="w-4 h-4" />
                                Publish Now
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Main Content Container */}
            <div className="max-w-7xl mx-auto p-4 md:p-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Side: Video and Materials */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Primary Lesson Card */}
                        <div className="bg-white rounded-[2rem] shadow-xl shadow-blue-900/5 border border-white overflow-hidden p-6 md:p-10">
                            <div className="flex flex-col md:flex-row items-start justify-between gap-6 mb-8">
                                <div className="flex-1">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="p-4 bg-[#14C4E7]/10 rounded-2xl text-[#14C4E7]">
                                            <Video size={32} />
                                        </div>
                                        <div>
                                            <h2 className="text-3xl font-black text-gray-900 leading-tight">
                                                {lessonData.title}
                                            </h2>
                                            <span className="inline-block mt-1 px-3 py-1 bg-[#E6D929] text-[#1E2EDE] text-[10px] font-black uppercase rounded-lg">
                                                Sequence #{lessonData.order + 1}
                                            </span>
                                        </div>
                                    </div>
                                    {lessonData.description && (
                                        <p className="text-gray-500 font-medium leading-relaxed max-w-2xl">
                                            {lessonData.description}
                                        </p>
                                    )}
                                </div>
                                <div className="self-start">
                                    <span
                                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border-2 ${
                                            lessonData.isPublished
                                                ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                                                : "bg-gray-50 text-gray-400 border-gray-100"
                                        }`}
                                    >
                                        {lessonData.isPublished ? <CheckCircle size={14} /> : <XCircle size={14} />}
                                        {lessonData.isPublished ? "Live" : "Draft"}
                                    </span>
                                </div>
                            </div>

                            {/* Video Player */}
                            <div className="relative group rounded-[2rem] overflow-hidden bg-black shadow-2xl">
                                {lessonData.videoUrl ? (
                                    <div className="aspect-video">
                                        <video
                                            key={lessonData.videoUrl}
                                            controls
                                            className="w-full h-full object-contain"
                                            poster={lessonData.thumbnailUrl}
                                        >
                                            <source src={lessonData.videoUrl} type="video/mp4" />
                                        </video>
                                    </div>
                                ) : (
                                    <div className="aspect-video flex flex-col items-center justify-center bg-gray-900 text-gray-500">
                                        <Video size={64} className="mb-4 opacity-20" />
                                        <p className="font-bold uppercase tracking-widest text-sm">Media not available</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Resources Section */}
                        {lessonData.pdfUrl && (
                            <div className="bg-white rounded-[2rem] shadow-xl shadow-blue-900/5 border border-white overflow-hidden">
                                <div className="px-8 py-5 border-b border-gray-50 flex items-center gap-3">
                                    <FileText className="text-[#14C4E7]" />
                                    <h3 className="font-black text-[#1E2EDE] uppercase text-xs tracking-widest">
                                        Learning Materials
                                    </h3>
                                </div>
                                <div className="p-8">
                                    <div className="bg-gray-50 rounded-3xl p-6 flex flex-col sm:flex-row items-center gap-6 border border-gray-100">
                                        <div className="p-4 bg-red-50 text-red-500 rounded-2xl">
                                            <FileText size={32} />
                                        </div>
                                        <div className="flex-1 text-center sm:text-left">
                                            <h4 className="font-black text-gray-900">Supplementary PDF</h4>
                                            <p className="text-xs font-medium text-gray-500 mt-1 uppercase">
                                                Readings & Exercises
                                            </p>
                                        </div>
                                        <a
                                            href={lessonData.pdfUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="px-6 py-3 bg-[#1E2EDE] text-white text-xs font-black uppercase rounded-xl hover:bg-[#14C4E7] transition-all"
                                        >
                                            Open Material
                                        </a>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Side: Sidebar Info */}
                    <div className="space-y-8">
                        <div className="bg-white rounded-[2rem] shadow-xl shadow-blue-900/5 border border-white overflow-hidden p-8">
                            <h3 className="font-black text-[#1E2EDE] text-lg uppercase tracking-tighter mb-8 flex items-center gap-3">
                                <Settings size={20} className="text-[#14C4E7]" /> Metadata
                            </h3>

                            <div className="space-y-6">
                                {[
                                    { label: "Creation Date", val: formatDate(lessonData.createdAt), icon: Calendar },
                                    { label: "Estimated Duration", val: formatDuration(lessonData.duration), icon: Clock },
                                    { label: "Lesson Index", val: `Position ${lessonData.order + 1}`, icon: Layers },
                                ].map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-4">
                                        <div className="p-3 bg-gray-50 rounded-xl text-[#14C4E7]">
                                            <item.icon size={18} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                                {item.label}
                                            </p>
                                            <p className="text-sm font-bold text-gray-800">{item.val || "N/A"}</p>
                                        </div>
                                    </div>
                                ))}

                                <div className="pt-6 border-t border-gray-50">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 block">
                                        Video Path
                                    </label>
                                    <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 overflow-hidden">
                                        <p className="text-[10px] font-mono text-[#14C4E7] break-all line-clamp-2">
                                            {lessonData.videoUrl || "No source link"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Quick Stats Summary */}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManageLesson;
