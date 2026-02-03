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
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    // 4. Data Not Found UI
    if (!lessonData) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4">
                <p className="text-gray-500">Lesson data not found.</p>
                <button 
                    onClick={() => navigate(-1)}
                    className="text-blue-600 hover:underline"
                >
                    Go Back
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-6 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate(courseId ? `/admin/courses/${courseId}/manage` : -1)}
                            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            Back to Course
                        </button>
                        <div className="h-6 w-px bg-gray-300"></div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Lesson Management</h1>
                            {courseTitle && <p className="text-sm text-gray-600">Course: {courseTitle}</p>}
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => handleToggleLesson(lessonData._id, lessonData.isPublished)}
                            className={`
                                flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-colors
                                ${
                                    lessonData.isPublished
                                        ? "bg-red-100 text-red-700 hover:bg-red-200"
                                        : "bg-green-100 text-green-700 hover:bg-green-200"
                                }
                            `}
                        >
                            {lessonData.isPublished ? (
                                <>
                                    <Pause className="w-4 h-4" />
                                    Unpublish Lesson
                                </>
                            ) : (
                                <>
                                    <Play className="w-4 h-4" />
                                    Publish Lesson
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="p-6">
                {/* Lesson Header Card */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
                    <div className="p-6">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="p-2 bg-blue-100 rounded-lg">
                                        <Video className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-900">{lessonData.title}</h2>
                                        <p className="text-sm text-gray-600">Lesson #{lessonData.order + 1 || "Not set"}</p>
                                    </div>
                                </div>
                                {lessonData.description && (
                                    <p className="text-gray-600 mb-4 leading-relaxed">{lessonData.description}</p>
                                )}
                                <div className="flex items-center gap-6 text-sm text-gray-500">
                                    {lessonData.duration && (
                                        <span className="flex items-center gap-1">
                                            <Clock className="w-4 h-4" />
                                            {formatDuration(lessonData.duration)}
                                        </span>
                                    )}
                                    <span className="flex items-center gap-1">
                                        <Calendar className="w-4 h-4" />
                                        Created {formatDate(lessonData.createdAt)}
                                    </span>
                                    {lessonData.videoUrl && (
                                        <span className="flex items-center gap-1 text-blue-600">
                                            <Video className="w-4 h-4" />
                                            Video Available
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className="text-right">
                                <span
                                    className={`
                                    inline-flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium
                                    ${lessonData.isPublished ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"}
                                `}
                                >
                                    {lessonData.isPublished ? (
                                        <>
                                            <CheckCircle className="w-4 h-4" />
                                            Published
                                        </>
                                    ) : (
                                        <>
                                            <XCircle className="w-4 h-4" />
                                            Draft
                                        </>
                                    )}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Video Section */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-100">
                                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                    <Video className="w-5 h-5" />
                                    Lesson Video
                                </h3>
                            </div>
                            <div className="p-6">
                                {lessonData.videoUrl ? (
                                    <div className="space-y-4">
                                        <div className="bg-black rounded-lg overflow-hidden">
                                            {/* Key ensures video reloads if URL changes */}
                                            <video
                                                key={lessonData.videoUrl}
                                                controls
                                                className="w-full h-64 md:h-80 lg:h-96"
                                            >
                                                <source src={lessonData.videoUrl} type="video/mp4" />
                                                Your browser does not support the video tag.
                                            </video>
                                        </div>
                                        <div className="bg-gray-50 rounded-lg p-4">
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-gray-600">Video URL:</span>
                                                <a
                                                    href={lessonData.videoUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-600 hover:text-blue-800 truncate max-w-xs"
                                                >
                                                    {lessonData.videoUrl}
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="bg-gray-100 rounded-lg p-12 text-center">
                                        <Video className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                        <h4 className="text-lg font-medium text-gray-900 mb-2">No Video Available</h4>
                                        <p className="text-gray-600">This lesson doesn't have a video uploaded yet.</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* PDF Materials Section */}
                        {lessonData.pdfUrl && (
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mt-6">
                                <div className="bg-gradient-to-r from-red-50 to-pink-50 px-6 py-4 border-b border-gray-100">
                                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                        <FileText className="w-5 h-5" />
                                        Lesson Materials
                                    </h3>
                                </div>
                                <div className="p-6">
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-red-100 rounded-lg">
                                                <FileText className="w-6 h-6 text-red-600" />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="text-sm font-medium text-gray-900">PDF Material</h4>
                                                <p className="text-xs text-gray-600 mt-1">
                                                    Additional learning resource for this lesson
                                                </p>
                                            </div>
                                            <a
                                                href={lessonData.pdfUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="px-4 py-2 bg-blue-100 text-blue-700 text-sm font-medium rounded-lg hover:bg-blue-200 transition-colors"
                                            >
                                                View PDF
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Lesson Details Sidebar */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                            <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-6 py-4 border-b border-gray-100">
                                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                    <Settings className="w-5 h-5" />
                                    Lesson Details
                                </h3>
                            </div>
                            <div className="p-6 space-y-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-700">Title</label>
                                    <p className="text-sm text-gray-900 mt-1 p-3 bg-gray-50 rounded-lg">
                                        {lessonData.title}
                                    </p>
                                </div>

                                {lessonData.description && (
                                    <div>
                                        <label className="text-sm font-medium text-gray-700">Description</label>
                                        <p className="text-sm text-gray-900 mt-1 p-3 bg-gray-50 rounded-lg">
                                            {lessonData.description}
                                        </p>
                                    </div>
                                )}

                                <div>
                                    <label className="text-sm font-medium text-gray-700">Lesson Order</label>
                                    <p className="text-sm text-gray-900 mt-1 p-3 bg-gray-50 rounded-lg">
                                        #{lessonData.order + 1 || "Not set"}
                                    </p>
                                </div>

                                {lessonData.duration && (
                                    <div>
                                        <label className="text-sm font-medium text-gray-700">Duration</label>
                                        <p className="text-sm text-gray-900 mt-1 p-3 bg-gray-50 rounded-lg">
                                            {formatDuration(lessonData.duration)}
                                        </p>
                                    </div>
                                )}

                                <div>
                                    <label className="text-sm font-medium text-gray-700">Publication Status</label>
                                    <div className="mt-1 p-3 bg-gray-50 rounded-lg">
                                        <span
                                            className={`
                                            inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium
                                            ${
                                                lessonData.isPublished
                                                    ? "bg-green-100 text-green-800"
                                                    : "bg-gray-100 text-gray-600"
                                            }
                                        `}
                                        >
                                            {lessonData.isPublished ? (
                                                <>
                                                    <CheckCircle className="w-3 h-3" />
                                                    Published
                                                </>
                                            ) : (
                                                <>
                                                    <XCircle className="w-3 h-3" />
                                                    Draft
                                                </>
                                            )}
                                        </span>
                                    </div>
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-gray-700">Created Date</label>
                                    <p className="text-sm text-gray-900 mt-1 p-3 bg-gray-50 rounded-lg">
                                        {formatDate(lessonData.createdAt)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManageLesson;