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
        <div className="min-h-screen bg-[#FDFDFD] flex flex-col items-center justify-center p-6">
            <div className="relative">
                <div className="w-16 h-16 border-4 border-[#14C4E7]/20 border-t-[#1E2EDE] rounded-full animate-spin"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-[#E6D929] rounded-full animate-pulse"></div>
            </div>
            <p className="mt-6 text-[#1E2EDE] font-black uppercase tracking-widest text-xs">Synchronizing Course Data...</p>
        </div>
    );
}

if (error) {
    return (
        <div className="min-h-screen bg-[#FDFDFD] flex items-center justify-center p-6">
            <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl p-10 text-center border border-gray-100">
                <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <XCircle className="w-10 h-10 text-red-500" />
                </div>
                <h2 className="text-2xl font-black text-[#1E2EDE] mb-2">Operation Failed</h2>
                <p className="text-gray-500 mb-8 font-medium">{error}</p>
                <button
                    onClick={() => navigate("/admin/courses")}
                    className="w-full py-4 bg-[#1E2EDE] text-white rounded-2xl font-bold hover:shadow-lg transition-all active:scale-95"
                >
                    Return to Directory
                </button>
            </div>
        </div>
    );
}

if (!courseDetails) {
    return (
        <div className="min-h-screen bg-[#FDFDFD] flex items-center justify-center p-6 text-center">
            <div>
                <BookOpen className="w-20 h-20 text-[#14C4E7]/30 mx-auto mb-4" />
                <h2 className="text-2xl font-black text-[#1E2EDE] mb-2">Record Not Found</h2>
                <button onClick={() => navigate("/admin/courses")} className="text-[#14C4E7] font-bold underline">Back to List</button>
            </div>
        </div>
    );
}

const { course, tutor, lessons, students, stats } = courseDetails;
const salePrice = calculateSalePrice(course.price, course.offerPercentage);

return (
    <div className="min-h-screen bg-[#FDFDFD] pb-12">
        {/* Sticky Header */}
        <div className="bg-white/80 backdrop-blur-md sticky top-0 z-30 border-b border-gray-100 px-4 md:px-8 py-4">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4 w-full sm:w-auto">
                    <button
                        onClick={() => navigate("/admin/courses")}
                        className="p-2.5 bg-gray-50 text-[#1E2EDE] rounded-xl hover:bg-[#1E2EDE] hover:text-white transition-all shadow-sm"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-xl md:text-2xl font-black text-[#1E2EDE] leading-none">Course Control</h1>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Management Portal</p>
                    </div>
                </div>
                
                <button
                    onClick={() => handleToggleCourse(course._id, course.title, course.isBanned ? "Unban" : "Ban")}
                    className={`
                        w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg
                        ${course.isBanned
                            ? "bg-[#E6D929] text-[#1E2EDE] hover:shadow-[#E6D929]/20"
                            : "bg-red-500 text-white hover:shadow-red-500/20"
                        }
                    `}
                >
                    {course.isBanned ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    {course.isBanned ? "Revoke Suspension" : "Suspend Course"}
                </button>
            </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 md:px-8 mt-8">
            {/* Primary Info Card */}
            <div className="bg-white rounded-[2.5rem] shadow-xl shadow-blue-900/5 border border-white overflow-hidden mb-8">
                <div className="p-6 md:p-10 flex flex-col lg:flex-row gap-10">
                    {/* Thumbnail Section */}
                    <div className="flex-shrink-0 mx-auto lg:mx-0">
                        <div className="w-full md:w-[320px] aspect-video bg-gray-100 rounded-3xl overflow-hidden shadow-inner relative group">
                            {course.thumbnailUrl ? (
                                <img src={course.thumbnailUrl} alt={course.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                            ) : (
                                <div className="flex items-center justify-center h-full bg-[#14C4E7]/10">
                                    <BookOpen className="w-12 h-12 text-[#14C4E7]" />
                                </div>
                            )}
                            <div className="absolute top-4 left-4">
                                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg ${
                                    course.isBanned ? "bg-red-500 text-white" : course.isListed ? "bg-[#14C4E7] text-white" : "bg-[#E6D929] text-[#1E2EDE]"
                                }`}>
                                    {course.isBanned ? "Banned" : course.isListed ? "Published" : "Draft"}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="flex-1">
                        <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="px-3 py-1 bg-[#1E2EDE]/5 text-[#1E2EDE] rounded-lg text-[10px] font-black uppercase tracking-tighter">
                                        {course.category?.name || "General"}
                                    </span>
                                </div>
                                <h2 className="text-3xl font-black text-gray-900 mb-4 leading-tight">{course.title}</h2>
                                <p className="text-gray-500 font-medium leading-relaxed mb-6 line-clamp-3">{course.description}</p>
                                
                                <div className="flex flex-wrap gap-6 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                                    <span className="flex items-center gap-2"><Calendar className="w-4 h-4 text-[#14C4E7]" /> Created: {formatDate(course.createdAt)}</span>
                                    <span className="flex items-center gap-2"><Target className="w-4 h-4 text-[#1E2EDE]" /> ID: {course._id.slice(-8)}</span>
                                </div>
                            </div>

                            <div className="w-full md:w-auto bg-gray-50 p-6 rounded-[2rem] border border-gray-100 text-center md:text-right">
                                {course.offerPercentage > 0 ? (
                                    <div className="space-y-1">
                                        <div className="text-3xl font-black text-[#1E2EDE]">{formatCurrency(salePrice)}</div>
                                        <div className="text-sm text-gray-400 line-through font-bold">{formatCurrency(course.price)}</div>
                                        <div className="inline-block px-3 py-1 bg-[#E6D929]/20 text-[#1E2EDE] text-[10px] font-black rounded-full">-{course.offerPercentage}% EXCLUSIVE</div>
                                    </div>
                                ) : (
                                    <div className="text-3xl font-black text-[#1E2EDE]">{formatCurrency(course.price)}</div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Dashboard */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 mb-8">
                {[
                    { label: "Lessons", val: stats.totalLessons, icon: BookOpen, color: "#14C4E7" },
                    { label: "Students", val: stats.totalStudents, icon: Users, color: "#1E2EDE" },
                    { label: "Duration", val: formatDuration(stats.totalDuration), icon: Clock, color: "#1E2EDE" },
                    { label: "Total Revenue", val: formatCurrency(stats.totalRevenue), icon: DollarSign, color: "#E6D929" }
                ].map((item, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-2xl bg-gray-50 group transition-colors">
                                <item.icon className="w-6 h-6" style={{ color: item.color }} />
                            </div>
                            <div>
                                <p className="text-2xl font-black text-gray-900 leading-none">{item.val}</p>
                                <p className="text-[10px] font-bold text-gray-400 uppercase mt-2 tracking-widest">{item.label}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Interactive Tabs */}
            <div className="bg-white rounded-[2.5rem] shadow-xl shadow-blue-900/5 border border-gray-100 overflow-hidden min-h-[500px]">
                <div className="bg-gray-50/50 p-2 border-b border-gray-100">
                    <nav className="flex flex-wrap gap-2">
                        {["overview", "lessons", "students"].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`
                                    flex-1 py-4 px-6 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all
                                    ${activeTab === tab
                                        ? "bg-[#1E2EDE] text-white shadow-lg shadow-blue-900/20"
                                        : "text-gray-400 hover:text-[#1E2EDE] hover:bg-white"
                                    }
                                `}
                            >
                                {tab} {tab === "lessons" ? `(${lessons.length})` : tab === "students" ? `(${students.length})` : ""}
                            </button>
                        ))}
                    </nav>
                </div>

                <div className="p-6 md:p-10">
                    {/* Overview Content */}
                    {activeTab === "overview" && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 animate-in fade-in duration-500">
                            <div>
                                <h3 className="text-lg font-black text-[#1E2EDE] mb-6 uppercase tracking-tighter">Instructor Profile</h3>
                                <div className="bg-[#14C4E7]/5 p-8 rounded-[2rem] border border-[#14C4E7]/10 flex flex-col sm:flex-row items-center gap-6">
                                    <div className="relative">
                                        {tutor.profileImage ? (
                                            <img src={tutor.profileImage} alt="" className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-xl" />
                                        ) : (
                                            <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-xl">
                                                <User className="w-10 h-10 text-[#14C4E7]" />
                                            </div>
                                        )}
                                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#E6D929] rounded-full border-4 border-white"></div>
                                    </div>
                                    <div className="text-center sm:text-left">
                                        <h4 className="text-xl font-black text-gray-900">{tutor.fullName}</h4>
                                        <p className="text-xs font-bold text-[#14C4E7] uppercase tracking-widest mb-4">Certified Tutor</p>
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-center sm:justify-start gap-3 text-sm text-gray-500 font-medium">
                                                <Mail className="w-4 h-4 text-[#1E2EDE]" /> {tutor.email}
                                            </div>
                                            {tutor.phone && (
                                                <div className="flex items-center justify-center sm:justify-start gap-3 text-sm text-gray-500 font-medium">
                                                    <Phone className="w-4 h-4 text-[#1E2EDE]" /> {tutor.phone}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-black text-[#1E2EDE] mb-6 uppercase tracking-tighter">Financial Ledger</h3>
                                <div className="space-y-4">
                                    {[
                                        { label: "Gross Revenue", val: stats.totalRevenue, bg: "bg-gray-50", text: "text-gray-900" },
                                        { label: "Platform Profit", val: stats.adminProfit, bg: "bg-[#14C4E7]/10", text: "text-[#14C4E7]" },
                                        { label: "Instructor Share", val: stats.tutorEarnings, bg: "bg-[#E6D929]/10", text: "text-[#1E2EDE]" }
                                    ].map((fin, i) => (
                                        <div key={i} className={`flex justify-between items-center p-5 ${fin.bg} rounded-2xl`}>
                                            <span className="text-xs font-black uppercase tracking-widest text-gray-500">{fin.label}</span>
                                            <span className={`text-lg font-black ${fin.text}`}>{formatCurrency(fin.val)}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Lessons Content */}
                    {activeTab === "lessons" && (
                        <div className="animate-in slide-in-from-bottom-4 duration-500">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-lg font-black text-[#1E2EDE] uppercase tracking-tighter">Curriculum Modules</h3>
                                <span className="text-[10px] font-black text-gray-400 bg-gray-100 px-4 py-1 rounded-full uppercase tracking-widest">
                                    {stats.publishedLessons} / {stats.totalLessons} Ready
                                </span>
                            </div>
                            
                            {lessons.length > 0 ? (
                                <div className="grid gap-4">
                                    {lessons.map((lesson, index) => (
                                        <div
                                            key={lesson._id}
                                            onClick={() => handleManageLesson(lesson)}
                                            className="group flex flex-col md:flex-row md:items-center justify-between p-6 bg-[#FDFDFD] border border-gray-100 rounded-3xl hover:border-[#14C4E7] hover:shadow-xl transition-all cursor-pointer"
                                        >
                                            <div className="flex items-center gap-6 mb-4 md:mb-0">
                                                <div className="w-12 h-12 bg-[#1E2EDE] text-white rounded-2xl flex items-center justify-center font-black text-lg shadow-lg group-hover:scale-110 transition-transform">
                                                    {String(index + 1).padStart(2, '0')}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="font-black text-gray-900 group-hover:text-[#14C4E7] transition-colors truncate">{lesson.title}</h4>
                                                    <div className="flex items-center gap-4 mt-2">
                                                        <span className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase"><Clock size={12} className="text-[#14C4E7]"/> {formatDuration(lesson.duration)}</span>
                                                        <span className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase"><Calendar size={12} className="text-[#14C4E7]"/> {formatDate(lesson.createdAt)}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3 self-end md:self-center">
                                                <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${lesson.isPublished ? "bg-[#14C4E7]/10 text-[#14C4E7]" : "bg-gray-100 text-gray-400"}`}>
                                                    {lesson.isPublished ? "Published" : "Draft"}
                                                </span>
                                                <button className="p-2.5 bg-white text-[#1E2EDE] border border-gray-100 rounded-xl hover:bg-[#1E2EDE] hover:text-white transition-colors">
                                                    <Settings size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-20 bg-gray-50 rounded-[2rem] border-2 border-dashed border-gray-100">
                                    <Video className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                                    <p className="text-gray-400 font-bold uppercase tracking-widest">No Content Uploaded</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Students Content */}
                    {activeTab === "students" && (
                        <div className="animate-in fade-in duration-500 overflow-x-auto">
                            <h3 className="text-lg font-black text-[#1E2EDE] mb-8 uppercase tracking-tighter">Enrollment Roster</h3>
                            {students.length > 0 ? (
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="bg-gray-50/50">
                                            <th className="px-6 py-4 text-[10px] font-black text-[#1E2EDE] uppercase tracking-widest rounded-l-2xl">Learner</th>
                                            <th className="px-6 py-4 text-[10px] font-black text-[#1E2EDE] uppercase tracking-widest">Communications</th>
                                            <th className="px-6 py-4 text-[10px] font-black text-[#1E2EDE] uppercase tracking-widest">Revenue</th>
                                            <th className="px-6 py-4 text-[10px] font-black text-[#1E2EDE] uppercase tracking-widest rounded-r-2xl">Access Date</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {students.map((student) => (
                                            <tr key={student.studentId} className="hover:bg-[#14C4E7]/5 transition-colors group">
                                                <td className="px-6 py-6">
                                                    <div className="flex items-center gap-4">
                                                        {student.profileImage ? (
                                                            <img src={student.profileImage} className="w-10 h-10 rounded-xl object-cover shadow-sm" />
                                                        ) : (
                                                            <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center font-black text-[#1E2EDE]">{student.fullName[0]}</div>
                                                        )}
                                                        <span className="font-bold text-gray-900">{student.fullName}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-6">
                                                    <div className="text-xs font-medium text-gray-600">{student.email}</div>
                                                    <div className="text-[10px] text-gray-400 font-bold">{student.phone || "No Phone"}</div>
                                                </td>
                                                <td className="px-6 py-6">
                                                    <span className="px-3 py-1 bg-white border border-gray-100 shadow-sm rounded-lg text-xs font-black text-[#1E2EDE]">
                                                        {formatCurrency(student.pricePaid || salePrice)}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-6 text-xs font-bold text-gray-400">
                                                    {formatDate(student.enrolledAt)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <div className="text-center py-20 bg-gray-50 rounded-[2rem] border-2 border-dashed border-gray-100">
                                    <Users className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                                    <p className="text-gray-400 font-bold uppercase tracking-widest">Waiting for Learners</p>
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
