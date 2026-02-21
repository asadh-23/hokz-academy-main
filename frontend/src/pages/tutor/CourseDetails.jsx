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
            <div className="min-h-screen bg-[#FDFDFD] flex items-center justify-center p-6">
                <div className="text-center animate-fade-in">
                    <div className="w-20 h-20 bg-[#14C4E7]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <BookOpen className="w-10 h-10 text-[#1E2EDE]" />
                    </div>
                    <h2 className="text-3xl font-extrabold text-[#1E2EDE] mb-4">Course Not Found</h2>
                    <button
                        onClick={() => navigate("/tutor/courses")}
                        className="px-8 py-3 bg-[#1E2EDE] text-[#FDFDFD] rounded-2xl font-bold hover:shadow-[0_10px_20px_rgba(30,46,222,0.3)] transition-all active:scale-95"
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
        <div className="min-h-screen bg-[#FDFDFD] bg-gradient-to-br from-[#FDFDFD] via-[#14C4E7]/5 to-[#1E2EDE]/5 p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Top Navigation Bar */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
                    <button
                        onClick={() => navigate("/tutor/courses")}
                        className="flex items-center gap-2 text-[#1E2EDE] hover:text-[#14C4E7] transition-colors font-bold group"
                    >
                        <div className="p-2 bg-white rounded-xl shadow-sm group-hover:shadow-md transition-all">
                            <ArrowLeft className="w-5 h-5" />
                        </div>
                        Back to Portfolio
                    </button>

                    <button
                        onClick={() => navigate(`/tutor/courses/${courseDetails._id}/edit`)}
                        className="w-full sm:w-auto px-6 py-3 bg-white text-[#1E2EDE] rounded-2xl text-sm font-bold hover:bg-[#1E2EDE] hover:text-white transition-all flex items-center justify-center gap-2 border-2 border-[#1E2EDE] shadow-sm"
                    >
                        <FiEdit2 className="text-base" />
                        Edit Course Details
                    </button>
                </div>

                {/* Hero Section Card */}
                <div className="bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(30,46,222,0.08)] border border-white p-6 md:p-10 mb-8">
                    <div className="flex flex-col lg:flex-row gap-10">
                        {/* Visual Preview */}
                        <div className="flex-shrink-0 mx-auto lg:mx-0">
                            <div className="w-full sm:w-[320px] h-[200px] bg-gray-100 rounded-[2rem] overflow-hidden shadow-inner border-4 border-[#FDFDFD] relative">
                                {courseDetails.thumbnailUrl ? (
                                    <img
                                        src={courseDetails.thumbnailUrl}
                                        alt={courseDetails.title}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-[#14C4E7]/10">
                                        <BookOpen className="w-16 h-16 text-[#14C4E7]" />
                                    </div>
                                )}
                                <div className="absolute top-4 left-4">
                                    <span className="px-4 py-1.5 bg-[#E6D929] text-[#1E2EDE] rounded-full text-xs font-black uppercase tracking-wider shadow-lg">
                                        {courseDetails.category?.name || "General"}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Essential Info */}
                        <div className="flex-1 text-center lg:text-left">
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
                                <h1 className="text-3xl md:text-4xl font-black text-[#1E2EDE] leading-tight">
                                    {courseDetails.title}
                                </h1>
                                <button
                                    onClick={() => {
                                        if (courseDetails.isBanned) {
                                            toast.error("This course is banned and cannot be listed/unlisted");
                                            return;
                                        }
                                        handleToggleListCourse(
                                            courseDetails._id,
                                            courseDetails.title,
                                            courseDetails.isListed,
                                        );
                                    }}
                                    className={`min-w-[140px] px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all border-2 ${
                                        courseDetails.isBanned
                                            ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                                            : courseDetails.isListed
                                              ? "bg-white text-red-500 border-red-100 hover:bg-red-50"
                                              : "bg-[#14C4E7] text-white border-[#14C4E7] hover:bg-[#1E2EDE] hover:border-[#1E2EDE] shadow-lg shadow-[#14C4E7]/20"
                                    }`}
                                    disabled={courseDetails.isBanned}
                                >
                                    {courseDetails.isBanned ? "Banned" : courseDetails.isListed ? "Unlist" : "Go Live"}
                                </button>
                            </div>

                            <p className="text-gray-500 font-medium leading-relaxed mb-8 max-w-3xl">
                                {courseDetails.description}
                            </p>

                            {/* Responsive Stats Grid */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {[
                                    { icon: BookOpen, label: "Lessons", val: courseDetails.lessonsCount, color: "#14C4E7" },
                                    {
                                        icon: Users,
                                        label: "Students",
                                        val: courseDetails.totalEnrollments,
                                        color: "#1E2EDE",
                                    },
                                    {
                                        icon: DollarSign,
                                        label: "Revenue",
                                        val: formatCurrency(salePrice),
                                        color: "#1E2EDE",
                                    },
                                    {
                                        icon: Tag,
                                        label: "Discount",
                                        val: `${courseDetails.offerPercentage}%`,
                                        color: "#E6D929",
                                        show: courseDetails.offerPercentage > 0,
                                    },
                                ].map(
                                    (stat, i) =>
                                        stat.show !== false && (
                                            <div
                                                key={i}
                                                className="bg-gray-50/50 p-4 rounded-2xl border border-gray-100 group hover:border-[#14C4E7]/30 transition-colors"
                                            >
                                                <div className="flex items-center gap-2 mb-2 justify-center lg:justify-start">
                                                    <stat.icon size={16} style={{ color: stat.color }} />
                                                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                                                        {stat.label}
                                                    </span>
                                                </div>
                                                <p className="text-xl font-black text-gray-800">{stat.val}</p>
                                            </div>
                                        ),
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Actions Bar */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    <button
                        onClick={() =>
                            navigate(`/tutor/courses/${courseDetails._id}/add-lesson`, {
                                state: { courseTitle: courseDetails.title },
                            })
                        }
                        className="p-5 bg-gradient-to-r from-[#1E2EDE] to-[#14C4E7] text-white rounded-[1.5rem] font-bold hover:shadow-xl hover:-translate-y-1 transition-all flex items-center justify-center gap-3 group"
                    >
                        <div className="bg-white/20 p-2 rounded-lg group-hover:scale-110 transition-transform">
                            <FiPlus size={20} />
                        </div>
                        Manage Course Content
                    </button>
                    <button
                        onClick={() => handleExam(courseDetails)}
                        className="p-5 bg-white text-[#1E2EDE] border-2 border-[#1E2EDE]/10 rounded-[1.5rem] font-bold hover:border-[#E6D929] hover:bg-[#E6D929]/5 transition-all flex items-center justify-center gap-3 group"
                    >
                        <div className="bg-[#1E2EDE]/5 p-2 rounded-lg group-hover:bg-[#E6D929]/20 transition-colors">
                            <MdOutlineSchool size={20} />
                        </div>
                        {courseDetails.exam ? "Curriculum Exam Settings" : "Initialize Course Exam"}
                    </button>
                </div>

                {/* Content Explorer Section */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Content Player - 8 Columns */}
                    <div className="lg:col-span-8 space-y-6">
                        {selectedLesson ? (
                            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                {/* Video Player */}
                                {selectedLesson.videoUrl && (
                                    <div className="bg-white rounded-[2rem] shadow-xl border border-gray-100 overflow-hidden mb-6">
                                        <div className="bg-[#1E2EDE] p-5 flex items-center justify-between">
                                            <h3 className="text-white font-bold flex items-center gap-3">
                                                <div className="w-2 h-2 bg-[#E6D929] rounded-full animate-pulse" />
                                                {selectedLesson.title}
                                            </h3>
                                            {selectedLesson.isBanned && (
                                                <span className="bg-red-500 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter">
                                                    Banned
                                                </span>
                                            )}
                                        </div>
                                        <div className="aspect-video bg-black shadow-inner">
                                            <video
                                                key={selectedLesson.videoUrl}
                                                controls
                                                className="w-full h-full"
                                                controlsList="nodownload"
                                            >
                                                <source src={selectedLesson.videoUrl} type="video/mp4" />
                                            </video>
                                        </div>
                                        <div className="p-6">
                                            <div className="flex items-center gap-4 mb-3 text-xs font-bold text-[#14C4E7] uppercase tracking-widest">
                                                <span className="flex items-center gap-1.5">
                                                    <Clock size={14} /> {selectedLesson.duration} Seconds
                                                </span>
                                                <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                                <span className="text-gray-400">Lesson Description</span>
                                            </div>
                                            <p className="text-gray-600 leading-relaxed font-medium">
                                                {selectedLesson.description}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {/* PDF Section */}
                                {selectedLesson.pdfUrl && (
                                    <div className="bg-white rounded-[2rem] shadow-xl border border-gray-100 overflow-hidden">
                                        <div className="p-5 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-red-50 rounded-xl text-red-500">
                                                    <FileText size={20} />
                                                </div>
                                                <span className="font-black text-[#1E2EDE] uppercase text-xs tracking-widest">
                                                    Resource Documents
                                                </span>
                                            </div>
                                            <a
                                                href={selectedLesson.pdfUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="px-4 py-2 bg-[#14C4E7] text-white rounded-xl text-xs font-bold hover:bg-[#1E2EDE] transition-all flex items-center gap-2"
                                            >
                                                <Download size={14} /> Download
                                            </a>
                                        </div>
                                        <div className="h-[500px] md:h-[650px] bg-gray-100">
                                            <iframe
                                                src={selectedLesson.pdfUrl}
                                                className="w-full h-full"
                                                title="PDF Viewer"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="bg-white rounded-[2.5rem] border-2 border-dashed border-gray-200 p-20 text-center flex flex-col items-center justify-center min-h-[400px]">
                                <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                                    <PlayCircle className="w-12 h-12 text-[#14C4E7]" />
                                </div>
                                <h3 className="text-2xl font-black text-[#1E2EDE] mb-2">Select a Lesson</h3>
                                <p className="text-gray-400 font-medium">
                                    Choose a topic from the curriculum to preview the content
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Lessons Sidebar - 4 Columns */}
                    <div className="lg:col-span-4">
                        <div className="bg-white rounded-[2rem] shadow-xl border border-gray-100 p-6 sticky top-8">
                            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-50">
                                <h2 className="font-black text-[#1E2EDE] flex items-center gap-2 uppercase tracking-tighter text-lg">
                                    <BookOpen size={20} className="text-[#14C4E7]" />
                                    Curriculum ({lessons.length})
                                </h2>
                            </div>

                            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                                {lessons.length > 0 ? (
                                    lessons.map((lesson, index) => (
                                        <div
                                            key={lesson._id}
                                            onClick={() => handleLessonClick(lesson)}
                                            className={`group p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden ${
                                                selectedLesson?._id === lesson._id
                                                    ? "bg-[#1E2EDE] border-[#1E2EDE] text-white shadow-lg translate-x-1"
                                                    : "bg-gray-50 border-transparent hover:border-[#14C4E7] hover:bg-white text-gray-700"
                                            }`}
                                        >
                                            <div className="flex items-start gap-4">
                                                <div
                                                    className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs flex-shrink-0 ${
                                                        selectedLesson?._id === lesson._id
                                                            ? "bg-[#14C4E7] text-white"
                                                            : "bg-white text-[#1E2EDE] shadow-sm"
                                                    }`}
                                                >
                                                    {String(index + 1).padStart(2, "0")}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="font-bold text-sm mb-1 truncate group-hover:whitespace-normal transition-all">
                                                        {lesson.title}
                                                    </h3>
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-[10px] font-bold opacity-60 flex items-center gap-1">
                                                            <Clock size={10} /> {lesson.duration}s
                                                        </span>
                                                        {lesson.pdfUrl && (
                                                            <FileText
                                                                size={10}
                                                                className={
                                                                    selectedLesson?._id === lesson._id
                                                                        ? "text-[#E6D929]"
                                                                        : "text-[#14C4E7]"
                                                                }
                                                            />
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            {selectedLesson?._id === lesson._id && (
                                                <div className="absolute right-0 top-0 bottom-0 w-1 bg-[#E6D929]" />
                                            )}
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-10 text-gray-400 font-medium">
                                        No lessons published yet
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Students Roster Section */}
                <div className="mt-12">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="p-3 bg-white rounded-2xl shadow-sm border border-gray-50">
                            <Users className="text-[#14C4E7]" size={24} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-[#1E2EDE]">Enrolled Students</h2>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                                {enrolledStudents.length} Active Learners
                            </p>
                        </div>
                        <div className="flex-1 h-[2px] bg-gradient-to-r from-gray-100 to-transparent"></div>
                    </div>

                    {enrolledStudents.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {enrolledStudents.map((student) => (
                                <div
                                    key={student.studentId}
                                    className="bg-white p-5 rounded-[2rem] border border-gray-100 hover:border-[#14C4E7] transition-all hover:shadow-xl group"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="relative">
                                            <img
                                                src={student.profileImage || defaultProfileImage}
                                                alt=""
                                                className="w-14 h-14 rounded-2xl object-cover border-2 border-white shadow-md"
                                            />
                                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#14C4E7] rounded-full border-2 border-white"></div>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-black text-[#1E2EDE] text-sm truncate">
                                                {student.fullName}
                                            </h3>
                                            <div className="flex items-center gap-1.5 text-[10px] text-gray-400 font-bold mb-1">
                                                <Calendar size={10} /> {formatDate(student.enrolledAt)}
                                            </div>
                                            <span className="text-xs font-black text-[#14C4E7]">
                                                {formatCurrency(student.pricePaid)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white rounded-[2rem] p-16 text-center border-2 border-dashed border-gray-100">
                            <Users className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                            <p className="text-gray-500 font-bold">Waiting for first enrollment</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CourseDetails;
