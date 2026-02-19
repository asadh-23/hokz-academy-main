import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import {
    ArrowLeft,
    BookOpen,
    Users,
    Clock,
    DollarSign,
    Eye,
    EyeOff,
    Play,
    Pause,
    User,
    Mail,
    Phone,
    Calendar,
    Video,
    CheckCircle,
    XCircle,
    Target,
    Settings,
} from "lucide-react";
import {
    fetchAdminCourseDetails,
    selectAdminCourseDetails,
    selectAdminCourseDetailsLoading,
    selectAdminCourseError,
    toggleAdminCourseBlock,
} from "../../store/features/admin/adminCourseSlice";
import { formatText } from "../../utils/formatText";

const ManageCourses = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [activeTab, setActiveTab] = useState("overview");

    // Redux selectors
    const courseDetails = useSelector(selectAdminCourseDetails);
    const loading = useSelector(selectAdminCourseDetailsLoading);
    const error = useSelector(selectAdminCourseError);

    useEffect(() => {
        if (courseId) {
            dispatch(fetchAdminCourseDetails(courseId));
        }
    }, [dispatch, courseId]);

    // Helper functions
    const formatCurrency = (amount) =>
        new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0,
        }).format(amount || 0);

    const calculateSalePrice = (price, offerPercentage) => {
        if (!offerPercentage || offerPercentage === 0) return price;
        return price - (price * offerPercentage) / 100;
    };

    const formatDuration = (totalSeconds) => {
        if (!totalSeconds) return "0 sec";

        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = Math.floor(totalSeconds % 60);

        if (hours > 0) {
            return `${hours}h ${minutes}m ${seconds}s`;
        } else if (minutes > 0) {
            return `${minutes}m ${seconds}s`;
        } else {
            return `${seconds}s`;
        }
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString("en-IN", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    // Coming Soon functions
    const handleToggleCourse = (courseId, courseName, status) => {
        const actionText = status;

        toast.warning(`Are you sure you want to ${actionText} ${courseName}?`, {
            action: {
                label: actionText,
                onClick: async () => {
                    try {
                        await dispatch(toggleAdminCourseBlock({ courseId })).unwrap();
                        dispatch(fetchAdminCourseDetails(courseId));

                        toast.success(`${courseName} has been ${actionText}ed successfully`);
                    } catch (error) {
                        console.error(`Failed to ${actionText} course:`, error);
                        toast.error(error.message || `Failed to ${actionText.toLowerCase()} courses`);
                    }
                },
            },
            cancel: { label: "Cancel" },
        });
    };

    const handleManageLesson = (lesson) => {
        navigate(`/admin/courses/${courseId}/lessons/${lesson._id}`, {
            state: { courseTitle: courseDetails.course.title },
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading course details...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Course</h2>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <button
                        onClick={() => navigate("/admin/courses")}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Back to Courses
                    </button>
                </div>
            </div>
        );
    }

    if (!courseDetails) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Course Not Found</h2>
                    <p className="text-gray-600 mb-4">The requested course could not be found.</p>
                    <button
                        onClick={() => navigate("/admin/courses")}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Back to Courses
                    </button>
                </div>
            </div>
        );
    }

    const { course, tutor, lessons, students, stats } = courseDetails;
    const salePrice = calculateSalePrice(course.price, course.offerPercentage);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-6 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate("/admin/courses")}
                            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            Back to Courses
                        </button>
                        <div className="h-6 w-px bg-gray-300"></div>
                        <h1 className="text-2xl font-bold text-gray-900">Course Management</h1>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() =>
                                handleToggleCourse(course._id, course.title, course.isBanned ? "Unban" : "Ban")
                            }
                            className={`
                                flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-colors
                                ${
                                    course.isBanned
                                        ? "bg-green-100 text-green-700 hover:bg-green-200"
                                        : "bg-red-100 text-red-700 hover:bg-red-200"
                                }
                            `}
                        >
                            {course.isBanned ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                            {course.isBanned ? "Unban Course" : "Ban Course"}
                        </button>
                    </div>
                </div>
            </div>

            {/* Course Info Card */}
            <div className="p-6">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
                    <div className="p-6">
                        <div className="flex flex-col lg:flex-row gap-6">
                            {/* Course Thumbnail */}
                            <div className="flex-shrink-0">
                                <div className="w-48 h-32 bg-gray-100 rounded-lg overflow-hidden">
                                    {course.thumbnailUrl ? (
                                        <img
                                            src={course.thumbnailUrl}
                                            alt={course.title}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="flex items-center justify-center h-full">
                                            <BookOpen className="w-8 h-8 text-gray-400" />
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Course Details */}
                            <div className="flex-1">
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-900 mb-2">{course.title}</h2>
                                        <p className="text-gray-600 mb-3">{course.description}</p>
                                        <div className="flex items-center gap-4 text-sm text-gray-500">
                                            <span className="flex items-center gap-1">
                                                <Target className="w-4 h-4" />
                                                {course.category?.name || "Uncategorized"}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Calendar className="w-4 h-4" />
                                                Created {formatDate(course.createdAt)}
                                            </span>
                                            {course.updatedAt && course.updatedAt !== course.createdAt && (
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="w-4 h-4" />
                                                    Updated {formatDate(course.updatedAt)}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span
                                                className={`
                                                inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium
                                                ${
                                                    course.isBanned
                                                        ? "bg-red-100 text-red-800"
                                                        : course.isListed
                                                        ? "bg-green-100 text-green-800"
                                                        : "bg-yellow-100 text-yellow-800"
                                                }
                                            `}
                                            >
                                                {course.isBanned ? (
                                                    <>
                                                        <XCircle className="w-3 h-3" />
                                                        Banned
                                                    </>
                                                ) : course.isListed ? (
                                                    <>
                                                        <Eye className="w-3 h-3" />
                                                        Published
                                                    </>
                                                ) : (
                                                    <>
                                                        <EyeOff className="w-3 h-3" />
                                                        Unlisted
                                                    </>
                                                )}
                                            </span>
                                        </div>
                                        <div className="text-right">
                                            {course.offerPercentage > 0 ? (
                                                <div>
                                                    <div className="text-lg font-bold text-green-600">
                                                        {formatCurrency(salePrice)}
                                                    </div>
                                                    <div className="text-sm text-gray-500 line-through">
                                                        {formatCurrency(course.price)}
                                                    </div>
                                                    <div className="text-xs text-green-600 font-medium">
                                                        {course.offerPercentage}% OFF
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="text-lg font-bold text-gray-900">
                                                    {formatCurrency(course.price)}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <BookOpen className="w-6 h-6 text-blue-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Total Lessons</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.totalLessons}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center">
                            <div className="p-2 bg-green-100 rounded-lg">
                                <Users className="w-6 h-6 text-green-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Total Students</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.totalStudents}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center">
                            <div className="p-2 bg-purple-100 rounded-lg">
                                <Clock className="w-6 h-6 text-purple-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Duration</p>
                                <p className="text-2xl font-bold text-gray-900">{formatDuration(stats.totalDuration)}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center">
                            <div className="p-2 bg-yellow-100 rounded-lg">
                                <DollarSign className="w-6 h-6 text-yellow-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Revenue</p>
                                <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalRevenue)}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                    <div className="border-b border-gray-200">
                        <nav className="flex space-x-8 px-6">
                            <button
                                onClick={() => setActiveTab("overview")}
                                className={`
                                    py-4 px-1 border-b-2 font-medium text-sm transition-colors
                                    ${
                                        activeTab === "overview"
                                            ? "border-blue-500 text-blue-600"
                                            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                    }
                                `}
                            >
                                Overview
                            </button>
                            <button
                                onClick={() => setActiveTab("lessons")}
                                className={`
                                    py-4 px-1 border-b-2 font-medium text-sm transition-colors
                                    ${
                                        activeTab === "lessons"
                                            ? "border-blue-500 text-blue-600"
                                            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                    }
                                `}
                            >
                                Lessons ({lessons.length})
                            </button>
                            <button
                                onClick={() => setActiveTab("students")}
                                className={`
                                    py-4 px-1 border-b-2 font-medium text-sm transition-colors
                                    ${
                                        activeTab === "students"
                                            ? "border-blue-500 text-blue-600"
                                            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                    }
                                `}
                            >
                                Students ({students.length})
                            </button>
                        </nav>
                    </div>

                    <div className="p-6">
                        {/* Overview Tab */}
                        {activeTab === "overview" && (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Instructor Info */}
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-900 mb-4">Instructor Information</h3>
                                        <div className="bg-gray-50 rounded-lg p-4">
                                            <div className="flex items-center gap-4 mb-4">
                                                {tutor.profileImage ? (
                                                    <img
                                                        src={tutor.profileImage}
                                                        alt={tutor.fullName}
                                                        className="w-12 h-12 rounded-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                                                        <User className="w-6 h-6 text-gray-400" />
                                                    </div>
                                                )}
                                                <div>
                                                    <h4 className="font-medium text-gray-900">{tutor.fullName}</h4>
                                                    <p className="text-sm text-gray-600">Course Instructor</p>
                                                </div>
                                            </div>
                                            <div className="space-y-2 text-sm">
                                                <div className="flex items-center gap-2">
                                                    <Mail className="w-4 h-4 text-gray-400" />
                                                    <span className="text-gray-600">{tutor.email}</span>
                                                </div>
                                                {tutor.phone && (
                                                    <div className="flex items-center gap-2">
                                                        <Phone className="w-4 h-4 text-gray-400" />
                                                        <span className="text-gray-600">{tutor.phone}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Financial Overview */}
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">Financial Overview</h3>
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                            <span className="text-sm font-medium text-gray-700">Total Revenue</span>
                                            <span className="font-bold text-gray-900">
                                                {formatCurrency(stats.totalRevenue)}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                                            <span className="text-sm font-medium text-blue-700">Admin Profit</span>
                                            <span className="font-bold text-blue-900">
                                                {formatCurrency(stats.adminProfit)}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                                            <span className="text-sm font-medium text-green-700">Tutor Earnings</span>
                                            <span className="font-bold text-green-900">
                                                {formatCurrency(stats.tutorEarnings)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Lessons Tab */}
                        {activeTab === "lessons" && (
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-medium text-gray-900">Course Lessons</h3>
                                    <span className="text-sm text-gray-500">
                                        {stats.publishedLessons} of {stats.totalLessons} published
                                    </span>
                                </div>
                                {lessons.length > 0 ? (
                                    <div className="space-y-3">
                                        {lessons.map((lesson, index) => (
                                            <div
                                                key={lesson._id}
                                                className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                                                onClick={() => handleManageLesson(lesson)}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-4 flex-1">
                                                        <div className="flex-shrink-0">
                                                            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-medium text-gray-600">
                                                                {index + 1}
                                                            </div>
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <h4 className="text-sm font-medium text-gray-900 truncate">
                                                                {lesson.title}
                                                            </h4>
                                                            {lesson.description && (
                                                                <p className="text-xs text-gray-500 truncate mt-1">
                                                                    {formatText(lesson.description, 100)}
                                                                </p>
                                                            )}
                                                            <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                                                                {lesson.duration && (
                                                                    <span className="flex items-center gap-1">
                                                                        <Clock className="w-3 h-3" />
                                                                        {formatDuration(lesson.duration)}
                                                                    </span>
                                                                )}
                                                                <span className="flex items-center gap-1">
                                                                    <Calendar className="w-3 h-3" />
                                                                    {formatDate(lesson.createdAt)}
                                                                </span>
                                                                {lesson.videoUrl && (
                                                                    <span className="flex items-center gap-1 text-blue-600">
                                                                        <Video className="w-3 h-3" />
                                                                        Video Available
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div
                                                        className="flex items-center gap-3"
                                                        onClick={(e) => e.stopPropagation()}
                                                    >
                                                        <span
                                                            className={`
                                                            inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium
                                                            ${
                                                                lesson.isPublished
                                                                    ? "bg-green-100 text-green-800"
                                                                    : "bg-gray-100 text-gray-600"
                                                            }
                                                        `}
                                                        >
                                                            {lesson.isPublished ? (
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
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleManageLesson(lesson);
                                                            }}
                                                            className="flex items-center gap-1 px-3 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors"
                                                        >
                                                            <Settings className="w-3 h-3" />
                                                            Manage Lesson
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <Video className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                        <p className="text-gray-500">No lessons found for this course</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Students Tab */}
                        {activeTab === "students" && (
                            <div>
                                <h3 className="text-lg font-medium text-gray-900 mb-4">Enrolled Students</h3>
                                {students.length > 0 ? (
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Student
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Contact
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Price Paid
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Enrolled Date
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {students.map((student) => (
                                                    <tr key={student.studentId} className="hover:bg-gray-50">
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="flex items-center">
                                                                {student.profileImage ? (
                                                                    <img
                                                                        src={student.profileImage}
                                                                        alt={student.fullName}
                                                                        className="w-8 h-8 rounded-full object-cover"
                                                                    />
                                                                ) : (
                                                                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                                                                        <User className="w-4 h-4 text-gray-400" />
                                                                    </div>
                                                                )}
                                                                <div className="ml-3">
                                                                    <div className="text-sm font-medium text-gray-900">
                                                                        {student.fullName}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="text-sm text-gray-900">{student.email}</div>
                                                            {student.phone && (
                                                                <div className="text-sm text-gray-500">{student.phone}</div>
                                                            )}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="text-sm font-medium text-gray-900">
                                                                {formatCurrency(student.pricePaid || salePrice)}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            {formatDate(student.enrolledAt)}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                        <p className="text-gray-500">No students enrolled yet</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManageCourses;
