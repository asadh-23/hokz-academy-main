import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    ArrowLeft,
    BookOpen,
    Users,
    DollarSign,
    Tag,
    Calendar,
    Clock,
    Award,
    PlayCircle,
    FileText,
    Mail,
    AlertCircle,
    Download,
} from "lucide-react";
import { FiEdit2, FiPlus } from "react-icons/fi";
import { MdOutlineSchool } from "react-icons/md";
import { tutorAxios } from "../../api/tutorAxios";
import { toast } from "sonner";
import { PageLoader } from "../../components/common/LoadingSpinner";
import defaultProfileImage from "../../assets/images/default-profile-image.webp";
import { useDispatch, useSelector } from "react-redux";
import { toggleTutorCourseStatus } from "../../store/features/tutor/tutorCoursesSlice";
import { selectUserIsAuthenticated } from "../../store/features/auth/userAuthSlice";

const CourseDetails = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);
    const [courseData, setCourseData] = useState(null);
    const [selectedLesson, setSelectedLesson] = useState(null);

    useEffect(() => {
        fetchCourseDetails();
    }, [courseId]);

    const fetchCourseDetails = async () => {
        try {
            setLoading(true);
            const response = await tutorAxios.get(`/courses/${courseId}/details`);
            setCourseData(response.data.data);
            // Set first lesson as selected by default if available
            if (response.data.data.lessons.length > 0) {
                setSelectedLesson(response.data.data.lessons[0]);
            }
        } catch (error) {
            console.error("Failed to fetch course details:", error);
            toast.error(error.response?.data?.message || "Failed to load course details");
        } finally {
            setLoading(false);
        }
    };

    const handleLessonClick = (lesson) => {
        setSelectedLesson(lesson);
    };

    const handleToggleListCourse = (courseId, courseTitle, isListed) => {
        const actionText = isListed ? "unlist" : "list";

        toast.warning(`Are you sure you want to ${actionText} "${courseTitle}"?`, {
            action: {
                label: isListed ? "Unlist" : "List",
                onClick: async () => {
                    try {
                        await dispatch(
                            toggleTutorCourseStatus({
                                courseId,
                            }),
                        ).unwrap();

                        toast.success(`${courseTitle} ${actionText}ed successfully`);
                        fetchCourseDetails();
                    } catch (err) {
                        console.log("Failed to update course listing:", err);
                        toast.error(err || "Failed to update listing");
                    }
                },
            },
            cancel: { label: "Cancel" },
        });
    };

    const handleExam = (course) => {
        if (course.exam) {
            navigate(`/tutor/course/${course._id}/manage-exam`);
        } else {
            navigate(`/tutor/course/${course._id}/add-exam`);
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const calculateSalePrice = (price, offerPercentage) => {
        if (!offerPercentage || offerPercentage === 0) return price;
        return price - (price * offerPercentage) / 100;
    };

    if (loading) {
        return <PageLoader />;
    }

    if (!courseData) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-6">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Course Not Found</h2>
                    <button
                        onClick={() => navigate("/tutor/courses")}
                        className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-violet-700 transition-all"
                    >
                        Back to Courses
                    </button>
                </div>
            </div>
        );
    }

    const { courseDetails, lessons, enrolledStudents } = courseData;
    const salePrice = calculateSalePrice(courseDetails.price, courseDetails.offerPercentage);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header with Back Button and Edit Button */}
                <div className="flex items-center justify-between mb-6">
                    <button
                        onClick={() => navigate("/tutor/courses")}
                        className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 transition-colors font-medium"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Back to Courses
                    </button>
                    
                    <button
                        onClick={() => navigate(`/tutor/courses/${courseDetails._id}/edit`)}
                        className="px-5 py-2.5 bg-gradient-to-r from-pink-50 to-rose-50 text-pink-600 rounded-xl text-sm font-bold hover:from-pink-100 hover:to-rose-100 transition-all flex items-center gap-2 border-2 border-pink-200 hover:border-pink-300 shadow-sm"
                    >
                        <FiEdit2 className="text-base" />
                        Edit Course
                    </button>
                </div>

                {/* Course Header Card */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-8 mb-6">
                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Thumbnail */}
                        <div className="flex-shrink-0">
                            <div className="w-full lg:w-80 h-48 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl overflow-hidden shadow-md">
                                {courseDetails.thumbnailUrl ? (
                                    <img
                                        src={courseDetails.thumbnailUrl}
                                        alt={courseDetails.title}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <BookOpen className="w-16 h-16 text-indigo-300" />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Course Info */}
                        <div className="flex-1">
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent mb-2">
                                        {courseDetails.title}
                                    </h1>
                                    {courseDetails.category && (
                                        <span className="inline-block px-4 py-1.5 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium">
                                            {courseDetails.category.name}
                                        </span>
                                    )}
                                </div>
                                {/* List/Unlist Button */}
                                <button
                                    onClick={() => {
                                        if (courseDetails.isBanned) {
                                            toast.error("This course is banned and cannot be listed/unlisted");
                                            return;
                                        }
                                        handleToggleListCourse(courseDetails._id, courseDetails.title, courseDetails.isListed);
                                    }}
                                    className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all border-2 shadow-md ${
                                        courseDetails.isBanned
                                            ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                                            : courseDetails.isListed
                                            ? "bg-gradient-to-r from-red-50 to-rose-50 text-red-600 hover:from-red-100 hover:to-rose-100 border-red-200 hover:border-red-300"
                                            : "bg-gradient-to-r from-green-50 to-emerald-50 text-green-600 hover:from-green-100 hover:to-emerald-100 border-green-200 hover:border-green-300"
                                    }`}
                                    disabled={courseDetails.isBanned}
                                    title={courseDetails.isBanned ? "This course is banned" : ""}
                                >
                                    {courseDetails.isBanned ? "BANNED" : courseDetails.isListed ? "Unlist Course" : "List Course"}
                                </button>
                            </div>

                            <p className="text-gray-700 leading-relaxed mb-6">{courseDetails.description}</p>

                            {/* Stats Grid */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-100">
                                    <div className="flex items-center gap-2 text-blue-600 mb-1">
                                        <BookOpen className="w-5 h-5" />
                                        <span className="text-sm font-medium">Lessons</span>
                                    </div>
                                    <p className="text-2xl font-bold text-gray-900">{courseDetails.lessonsCount}</p>
                                </div>

                                <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-xl border border-green-100">
                                    <div className="flex items-center gap-2 text-green-600 mb-1">
                                        <Users className="w-5 h-5" />
                                        <span className="text-sm font-medium">Students</span>
                                    </div>
                                    <p className="text-2xl font-bold text-gray-900">{courseDetails.totalEnrollments}</p>
                                </div>

                                <div className="bg-gradient-to-br from-purple-50 to-violet-50 p-4 rounded-xl border border-purple-100">
                                    <div className="flex items-center gap-2 text-purple-600 mb-1">
                                        <DollarSign className="w-5 h-5" />
                                        <span className="text-sm font-medium">Price</span>
                                    </div>
                                    <p className="text-2xl font-bold text-gray-900">{formatCurrency(salePrice)}</p>
                                    {courseDetails.offerPercentage > 0 && (
                                        <p className="text-xs text-gray-500 line-through">{formatCurrency(courseDetails.price)}</p>
                                    )}
                                </div>

                                {courseDetails.offerPercentage > 0 && (
                                    <div className="bg-gradient-to-br from-red-50 to-pink-50 p-4 rounded-xl border border-red-100">
                                        <div className="flex items-center gap-2 text-red-600 mb-1">
                                            <Tag className="w-5 h-5" />
                                            <span className="text-sm font-medium">Discount</span>
                                        </div>
                                        <p className="text-2xl font-bold text-gray-900">{courseDetails.offerPercentage}%</p>
                                    </div>
                                )}
                            </div>

                            {/* Exam Info */}
                            {courseDetails.exam && (
                                <div className="mt-4 flex items-center gap-2 text-indigo-600">
                                    <Award className="w-5 h-5" />
                                    <span className="font-medium">Exam: {courseDetails.exam.title}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-6 mb-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <button
                            onClick={() =>
                                navigate(`/tutor/courses/${courseDetails._id}/add-lesson`, {
                                    state: { courseTitle: courseDetails.title },
                                })
                            }
                            className="px-4 py-3 bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-xl text-sm font-bold hover:from-teal-700 hover:to-cyan-700 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                        >
                            <FiPlus className="text-base" />
                            Manage Lessons
                        </button>

                        <button
                            onClick={() => handleExam(courseDetails)}
                            className="px-4 py-3 bg-gradient-to-r from-purple-50 to-violet-50 text-purple-600 rounded-xl text-sm font-bold hover:from-purple-100 hover:to-violet-100 transition-all flex items-center justify-center gap-2 border-2 border-purple-200 hover:border-purple-300 shadow-sm"
                        >
                            <MdOutlineSchool className="text-base" />
                            {courseDetails.exam ? "Manage Exam" : "Add Exam"}
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Video Player & PDF Viewer Section - Takes 2 columns */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Video Player */}
                        {selectedLesson && selectedLesson.videoUrl && (
                            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 overflow-hidden">
                                <div className="bg-gradient-to-r from-indigo-600 to-violet-600 p-4">
                                    <h3 className="text-white font-bold text-lg flex items-center gap-2">
                                        <PlayCircle className="w-5 h-5" />
                                        {selectedLesson.title}
                                    </h3>
                                    {selectedLesson.isBanned && (
                                        <div className="mt-2 flex items-center gap-2 bg-red-500/20 text-white px-3 py-1.5 rounded-lg text-sm">
                                            <AlertCircle className="w-4 h-4" />
                                            This lesson is banned
                                        </div>
                                    )}
                                </div>
                                <div className="aspect-video bg-black">
                                    <video
                                        key={selectedLesson.videoUrl}
                                        controls
                                        className="w-full h-full"
                                        controlsList="nodownload"
                                    >
                                        <source src={selectedLesson.videoUrl} type="video/mp4" />
                                        Your browser does not support the video tag.
                                    </video>
                                </div>
                                <div className="p-4">
                                    <p className="text-gray-700 text-sm">{selectedLesson.description}</p>
                                    <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                                        <span className="flex items-center gap-1">
                                            <Clock className="w-4 h-4" />
                                            {selectedLesson.duration}s
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* PDF Viewer */}
                        {selectedLesson && selectedLesson.pdfUrl && (
                            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 overflow-hidden">
                                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 flex items-center justify-between">
                                    <h3 className="text-white font-bold text-lg flex items-center gap-2">
                                        <FileText className="w-5 h-5" />
                                        Lesson PDF
                                    </h3>
                                    <a
                                        href={selectedLesson.pdfUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all"
                                    >
                                        <Download className="w-4 h-4" />
                                        Download
                                    </a>
                                </div>
                                <div className="h-[600px]">
                                    <iframe
                                        src={selectedLesson.pdfUrl}
                                        className="w-full h-full"
                                        title="Lesson PDF"
                                    />
                                </div>
                            </div>
                        )}

                        {/* No Lesson Selected */}
                        {!selectedLesson && (
                            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-12 text-center">
                                <PlayCircle className="w-20 h-20 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-xl font-bold text-gray-900 mb-2">No Lesson Selected</h3>
                                <p className="text-gray-600">Click on a lesson to view its content</p>
                            </div>
                        )}
                    </div>

                    {/* Lessons List - Takes 1 column */}
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                <BookOpen className="w-5 h-5 text-indigo-600" />
                                Lessons ({lessons.length})
                            </h2>
                            <button
                                onClick={() =>
                                    navigate(`/tutor/courses/${courseDetails._id}/add-lesson`, {
                                        state: { courseTitle: courseDetails.title },
                                    })
                                }
                                className="px-3 py-2 bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-lg text-xs font-bold hover:from-teal-700 hover:to-cyan-700 transition-all shadow-sm hover:shadow-md flex items-center gap-1.5"
                            >
                                <FiPlus className="text-sm" />
                                Manage
                            </button>
                        </div>

                        {lessons.length > 0 ? (
                            <div className="space-y-2 max-h-[800px] overflow-y-auto">
                                {lessons.map((lesson, index) => (
                                    <div
                                        key={lesson._id}
                                        onClick={() => handleLessonClick(lesson)}
                                        className={`p-3 rounded-xl border transition-all cursor-pointer ${
                                            selectedLesson?._id === lesson._id
                                                ? "bg-gradient-to-r from-indigo-100 to-purple-100 border-indigo-300 shadow-md"
                                                : "bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-100 hover:shadow-md hover:border-indigo-200"
                                        }`}
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className="flex-shrink-0 w-7 h-7 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-xs">
                                                {index + 1}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-bold text-gray-900 text-sm mb-1 line-clamp-1">
                                                    {lesson.title}
                                                </h3>
                                                {lesson.isBanned && (
                                                    <div className="flex items-center gap-1 text-xs text-red-600 mb-1">
                                                        <AlertCircle className="w-3 h-3" />
                                                        This lesson is banned
                                                    </div>
                                                )}
                                                <div className="flex items-center gap-3 text-xs text-gray-500">
                                                    <span className="flex items-center gap-1">
                                                        <Clock className="w-3 h-3" />
                                                        {lesson.duration}s
                                                    </span>
                                                    {lesson.pdfUrl && (
                                                        <span className="flex items-center gap-1 text-indigo-600">
                                                            <FileText className="w-3 h-3" />
                                                            PDF
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <PlayCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                <p className="text-gray-500 text-sm">No lessons added yet</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Enrolled Students Section - Full Width */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-6 mt-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Users className="w-5 h-5 text-green-600" />
                        Enrolled Students ({enrolledStudents.length})
                    </h2>

                    {enrolledStudents.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {enrolledStudents.map((student) => (
                                <div
                                    key={student.studentId}
                                    className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl border border-green-100 hover:shadow-md transition-all"
                                >
                                    <div className="flex items-center gap-3">
                                        <img
                                            src={student.profileImage || defaultProfileImage}
                                            alt={student.fullName}
                                            onError={(e) => (e.target.src = defaultProfileImage)}
                                            className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-md flex-shrink-0"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-bold text-gray-900 text-sm truncate">
                                                {student.fullName}
                                            </h3>
                                            {student.email && (
                                                <p className="text-xs text-gray-600 flex items-center gap-1 truncate">
                                                    <Mail className="w-3 h-3 flex-shrink-0" />
                                                    <span className="truncate">{student.email}</span>
                                                </p>
                                            )}
                                            <div className="flex items-center gap-2 mt-1 text-xs">
                                                <span className="text-gray-500 flex items-center gap-1">
                                                    <Calendar className="w-3 h-3" />
                                                    {formatDate(student.enrolledAt)}
                                                </span>
                                            </div>
                                            <span className="text-green-600 font-semibold text-xs">
                                                {formatCurrency(student.pricePaid)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500">No students enrolled yet</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CourseDetails;
