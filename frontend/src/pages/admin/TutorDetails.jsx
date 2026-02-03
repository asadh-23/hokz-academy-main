import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
    ArrowLeft,
    Mail,
    Phone,
    BookOpen,
    Users,
    DollarSign,
    TrendingUp,
    Calendar,
    ShieldCheck,
    Settings,
    Clock,
    Eye,
    EyeOff,
    Award,
    MessageCircle,
    Ban,
    CheckCircle,
    ExternalLink,
} from "lucide-react";
import { toast } from "sonner";
import { fetchAdminTutorDetails, toggleAdminTutorBlock } from "../../store/features/admin/adminTutorSlice";

const TutorDetails = () => {
    const { tutorId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    const loadTutorDetails = async () => {
        try {
            const response = await dispatch(fetchAdminTutorDetails({ tutorId })).unwrap();
            if (response.success) {
                setData(response.data);
            }
        } catch (error) {
            console.error("Fetch Error:", error);
            toast.error(error.message || "Failed to fetch tutor details");
            navigate("/admin/tutors");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadTutorDetails();
    }, [tutorId, navigate, dispatch]);

    const handleToggleBlockTutor = async (tutorId, tutorName, isBlocked) => {
        const actionText = isBlocked ? "Unblock" : "Block";

        toast.warning(`Are you sure you want to ${actionText} ${tutorName}?`, {
            action: {
                label: actionText,
                onClick: async () => {
                    try {
                        await dispatch(toggleAdminTutorBlock({ tutorId })).unwrap();
                        loadTutorDetails();
                        toast.success(`${tutorName} has been ${actionText}ed successfully`);
                    } catch (error) {
                        console.error(`Failed to ${actionText} user:`, error);
                        toast.error(error.message || `Failed to ${actionText.toLowerCase()} user`);
                    }
                },
            },
            cancel: { label: "Cancel" },
        });
    };

    const handleManageCourse = (courseId) => {
        navigate(`/admin/courses/${courseId}/manage`);
    };

    // Formatting Helper
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0,
        }).format(amount || 0);
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString("en-IN", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="relative">
                        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto"></div>
                        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 opacity-20 animate-pulse"></div>
                    </div>
                    <p className="mt-6 text-slate-600 font-medium">Loading tutor profile...</p>
                </div>
            </div>
        );
    }

    if (!data) return null;

    const { tutor, stats, courses } = data;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
            {/* Enhanced Header */}
            <div className="bg-white/80 backdrop-blur-xl border-b border-white/20 shadow-lg shadow-blue-500/5">
                <div className="px-6 py-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-6">
                            <button
                                onClick={() => navigate("/admin/tutors")}
                                className="group flex items-center gap-3 px-4 py-2 bg-white/60 hover:bg-white/80 border border-white/40 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10"
                            >
                                <ArrowLeft className="w-5 h-5 text-slate-600 group-hover:text-blue-600 transition-colors" />
                                <span className="text-slate-700 font-medium">Back to Tutors</span>
                            </button>
                            <div className="h-8 w-px bg-gradient-to-b from-transparent via-slate-300 to-transparent"></div>
                            <div>
                                <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                                    Tutor Profile
                                </h1>
                                <p className="text-slate-600 mt-1">Comprehensive tutor management dashboard</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="px-6 py-8 space-y-8">
                {/* Premium Profile Card */}
                <div className="relative overflow-hidden">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 opacity-90"></div>
                    <div className="absolute inset-0 opacity-30">
                        <div className="absolute inset-0" style={{
                            backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)',
                            backgroundSize: '20px 20px'
                        }}></div>
                    </div>
                    
                    <div className="relative bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl shadow-blue-500/20 border border-white/30">
                        <div className="p-8">
                            <div className="flex flex-col lg:flex-row gap-8">
                                {/* Profile Section */}
                                <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6 flex-1">
                                    {/* Avatar with Enhanced Design */}
                                    <div className="relative group">
                                        <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
                                        <div className="relative">
                                            <img
                                                src={tutor.profileImage || "https://via.placeholder.com/120"}
                                                alt={tutor.fullName}
                                                className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-xl"
                                            />
                                            {tutor.isVerified && (
                                                <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white p-3 rounded-full border-4 border-white shadow-lg">
                                                    <ShieldCheck className="w-6 h-6" />
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Profile Info */}
                                    <div className="text-center lg:text-left flex-1">
                                        <div className="flex flex-col lg:flex-row lg:items-center gap-4 mb-4">
                                            <h2 className="text-3xl font-bold text-slate-800">{tutor.fullName}</h2>
                                            <div className="flex items-center gap-3">
                                                <span className={`
                                                    inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold
                                                    ${tutor.isBlocked 
                                                        ? 'bg-red-100 text-red-700 border-2 border-red-200' 
                                                        : 'bg-emerald-100 text-emerald-700 border-2 border-emerald-200'
                                                    }
                                                `}>
                                                    {tutor.isBlocked ? (
                                                        <>
                                                            <Ban className="w-4 h-4" />
                                                            Blocked
                                                        </>
                                                    ) : (
                                                        <>
                                                            <CheckCircle className="w-4 h-4" />
                                                            Active
                                                        </>
                                                    )}
                                                </span>
                                                {tutor.isVerified && (
                                                    <span className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold border-2 border-blue-200">
                                                        <Award className="w-4 h-4" />
                                                        Verified
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        
                                        <p className="text-slate-600 text-lg mb-6">Professional Course Instructor</p>
                                        
                                        {/* Contact Info Grid */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                                                <div className="p-2 bg-blue-100 rounded-lg">
                                                    <Mail className="w-5 h-5 text-blue-600" />
                                                </div>
                                                <div>
                                                    <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">Email</p>
                                                    <p className="text-slate-800 font-medium">{tutor.email}</p>
                                                </div>
                                            </div>
                                            
                                            {tutor.phone && (
                                                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                                                    <div className="p-2 bg-emerald-100 rounded-lg">
                                                        <Phone className="w-5 h-5 text-emerald-600" />
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">Phone</p>
                                                        <p className="text-slate-800 font-medium">{tutor.phone}</p>
                                                    </div>
                                                </div>
                                            )}
                                            
                                            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                                                <div className="p-2 bg-purple-100 rounded-lg">
                                                    <Calendar className="w-5 h-5 text-purple-600" />
                                                </div>
                                                <div>
                                                    <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">Joined</p>
                                                    <p className="text-slate-800 font-medium">{formatDate(tutor.createdAt)}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex flex-col gap-3 lg:w-64">
                                    
                                    
                                    <button
                                        onClick={() => handleToggleBlockTutor(tutor._id, tutor.fullName, tutor.isBlocked)}
                                        className={`
                                            group flex items-center justify-center gap-3 px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105
                                            ${tutor.isBlocked 
                                                ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white hover:shadow-lg hover:shadow-emerald-500/25' 
                                                : 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white hover:shadow-lg hover:shadow-red-500/25'
                                            }
                                        `}
                                    >
                                        {tutor.isBlocked ? (
                                            <>
                                                <CheckCircle className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                                                Unblock Tutor
                                            </>
                                        ) : (
                                            <>
                                                <Ban className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                                                Block Tutor
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Enhanced Statistics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                    <StatCard
                        title="Total Courses"
                        value={stats.totalCourses}
                        icon={<BookOpen className="w-7 h-7" />}
                        gradient="from-blue-500 to-cyan-500"
                        bgGradient="from-blue-50 to-cyan-50"
                        change="+12%"
                        changeType="positive"
                    />
                    <StatCard
                        title="Total Students"
                        value={stats.totalStudents}
                        icon={<Users className="w-7 h-7" />}
                        gradient="from-emerald-500 to-teal-500"
                        bgGradient="from-emerald-50 to-teal-50"
                        change="+8%"
                        changeType="positive"
                    />
                    <StatCard
                        title="Total Revenue"
                        value={formatCurrency(stats.totalGrossSales)}
                        icon={<DollarSign className="w-7 h-7" />}
                        gradient="from-purple-500 to-pink-500"
                        bgGradient="from-purple-50 to-pink-50"
                        change="+15%"
                        changeType="positive"
                    />
                    <StatCard
                        title="Tutor Earnings"
                        value={formatCurrency(stats.totalTutorEarnings)}
                        icon={<TrendingUp className="w-7 h-7" />}
                        gradient="from-orange-500 to-red-500"
                        bgGradient="from-orange-50 to-red-50"
                        change="+22%"
                        changeType="positive"
                    />
                    <StatCard
                        title="Admin Commission"
                        value={formatCurrency(stats.totalAdminCommission)}
                        icon={<TrendingUp className="w-7 h-7" />}
                        gradient="from-indigo-500 to-purple-500"
                        bgGradient="from-indigo-50 to-purple-50"
                        change="+18%"
                        changeType="positive"
                    />
                </div>

                {/* Premium Courses Section */}
                <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl shadow-blue-500/10 border border-white/30 overflow-hidden">
                    {/* Section Header */}
                    <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800"></div>
                        <div className="relative px-8 py-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                                        <BookOpen className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold text-white">Course Portfolio</h3>
                                        <p className="text-slate-300">Manage and monitor all courses</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-3xl font-bold text-white">{courses.length}</div>
                                    <div className="text-slate-300 text-sm">Total Courses</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Courses Grid */}
                    <div className="p-8">
                        {courses.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {courses.map((course) => {
                                    const originalPrice = course.price;
                                    const offer = course.offerPercentage || 0;
                                    const sellingPrice = offer > 0 
                                        ? Math.round(originalPrice - (originalPrice * offer) / 100) 
                                        : originalPrice;

                                    return (
                                        <div
                                            key={course._id}
                                            onClick={() => handleManageCourse(course._id)}
                                            className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden cursor-pointer hover:scale-105 border border-slate-200/50"
                                        >
                                            {/* Course Image */}
                                            <div className="relative h-56 overflow-hidden">
                                                <img
                                                    src={course.thumbnailUrl || "https://via.placeholder.com/400x250"}
                                                    alt={course.title}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

                                                {/* Status Badge */}
                                                <div className="absolute top-4 left-4">
                                                    <span className={`
                                                        inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold backdrop-blur-sm
                                                        ${course.isListed
                                                            ? "bg-emerald-500/90 text-white border border-emerald-400/50"
                                                            : "bg-amber-500/90 text-white border border-amber-400/50"
                                                        }
                                                    `}>
                                                        {course.isListed ? (
                                                            <>
                                                                <Eye className="w-3 h-3" />
                                                                Published
                                                            </>
                                                        ) : (
                                                            <>
                                                                <EyeOff className="w-3 h-3" />
                                                                Draft
                                                            </>
                                                        )}
                                                    </span>
                                                </div>

                                                {/* Category Badge */}
                                                <div className="absolute top-4 right-4">
                                                    <span className="px-3 py-1.5 bg-white/90 backdrop-blur-sm text-slate-700 rounded-full text-xs font-bold border border-white/50">
                                                        {course.category?.name || "General"}
                                                    </span>
                                                </div>

                                                {/* Discount Badge */}
                                                {offer > 0 && (
                                                    <div className="absolute bottom-4 left-4">
                                                        <span className="px-3 py-1.5 bg-red-500 text-white rounded-full text-xs font-bold">
                                                            {offer}% OFF
                                                        </span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Course Content */}
                                            <div className="p-6">
                                                <h4 className="text-xl font-bold text-slate-800 mb-3 line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors">
                                                    {course.title}
                                                </h4>

                                                <p className="text-slate-600 mb-4 line-clamp-2 leading-relaxed">
                                                    {course.description || "No description available for this course."}
                                                </p>

                                                {/* Course Metrics */}
                                                <div className="flex items-center justify-between mb-6 text-sm">
                                                    <div className="flex items-center gap-2 text-slate-500">
                                                        <Users className="w-4 h-4" />
                                                        <span className="font-medium">{course.enrolledCount} students</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-slate-500">
                                                        <Clock className="w-4 h-4" />
                                                        <span className="font-medium">{formatDate(course.createdAt)}</span>
                                                    </div>
                                                </div>

                                                {/* Price and Action */}
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        {offer > 0 && (
                                                            <div className="text-sm text-slate-400 line-through mb-1">
                                                                {formatCurrency(originalPrice)}
                                                            </div>
                                                        )}
                                                        <div className="text-2xl font-bold text-slate-800">
                                                            {formatCurrency(sellingPrice)}
                                                        </div>
                                                    </div>

                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleManageCourse(course._id);
                                                        }}
                                                        className="group/btn flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25"
                                                    >
                                                        <Settings className="w-4 h-4 group-hover/btn:rotate-90 transition-transform duration-300" />
                                                        Manage
                                                        <ExternalLink className="w-4 h-4 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="text-center py-16">
                                <div className="relative inline-block mb-6">
                                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full blur-xl opacity-20"></div>
                                    <div className="relative p-6 bg-gradient-to-r from-slate-100 to-slate-200 rounded-full">
                                        <BookOpen className="w-16 h-16 text-slate-400" />
                                    </div>
                                </div>
                                <h4 className="text-2xl font-bold text-slate-800 mb-3">No Courses Yet</h4>
                                <p className="text-slate-600 text-lg">This tutor hasn't created any courses yet.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

// Enhanced Stat Card Component
const StatCard = ({ title, value, icon, gradient, bgGradient, change, changeType }) => (
    <div className={`relative group bg-gradient-to-br ${bgGradient} rounded-2xl p-6 border border-white/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 overflow-hidden`}>
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{
                backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(0,0,0,0.1) 1px, transparent 0)',
                backgroundSize: '20px 20px'
            }}></div>
        </div>
        
        <div className="relative">
            <div className="flex items-center justify-between mb-4">
                <div className={`p-3 bg-gradient-to-r ${gradient} rounded-xl text-white shadow-lg`}>
                    {icon}
                </div>
                {change && (
                    <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold ${
                        changeType === 'positive' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                    }`}>
                        <TrendingUp className="w-3 h-3" />
                        {change}
                    </div>
                )}
            </div>
            
            <div>
                <p className="text-slate-600 text-sm font-semibold uppercase tracking-wide mb-2">{title}</p>
                <p className="text-3xl font-bold text-slate-800 group-hover:scale-105 transition-transform duration-300">
                    {value}
                </p>
            </div>
        </div>
    </div>
);

export default TutorDetails;