import React from "react";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    ArrowLeft,
    Mail,
    Phone,
    Instagram,
    Youtube,
    Twitter,
    Linkedin,
    BookOpen,
    Clock,
    BadgeCheck,
    MessageSquare,
    Star,
} from "lucide-react";
import { userAxios } from "../../api/userAxios";
import { toast } from "sonner";
import { PageLoader } from "../../components/common/LoadingSpinner";
import defaultProfileImage from "../../assets/images/default-profile-image.webp";
import { useSelector } from "react-redux";
import { selectUserAuth } from "../../store/features/auth/userAuthSlice";

const TutorDetails = () => {
    const { tutorId } = useParams();
    const navigate = useNavigate();
    const [tutorData, setTutorData] = useState(null);
    const [loading, setLoading] = useState(true);

    const { user, isAuthenticated } = useSelector(selectUserAuth);

    useEffect(() => {
        fetchTutorDetails();
    }, [tutorId]);

    const fetchTutorDetails = async () => {
        try {
            setLoading(true);
            const url = user?._id ? `/tutors/${tutorId}?userId=${user._id}` : `/tutors/${tutorId}`;
            const response = await userAxios.get(url);
            setTutorData(response.data.data);
        } catch (error) {
            console.error("Failed to fetch tutor details:", error);
            toast.error(error.response?.data?.message || "Failed to load tutor details");
        } finally {
            setLoading(false);
        }
    };

    const handleCourseClick = (courseId) => {
        navigate(`/user/courses/${courseId}`);
    };

    const formatDuration = (seconds) => {
        if (!seconds) return "0 sec";

        if (seconds < 60) {
            return `${seconds} sec`;
        }

        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;

        if (remainingSeconds === 0) {
            return `${minutes} min`;
        }

        return `${minutes} min ${remainingSeconds} sec`;
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const calculateSalePrice = (price, offerPercentage) => {
        if (!offerPercentage || offerPercentage === 0) return price;
        return price - (price * offerPercentage) / 100;
    };

    if (loading) {
        return <PageLoader />;
    }

    if (!tutorData) {
        return (
            <div className="min-h-screen bg-[#FDFDFD] flex items-center justify-center p-6">
                <div className="text-center bg-white p-12 rounded-[3rem] shadow-2xl shadow-blue-900/10 border border-slate-50 max-w-sm">
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <BadgeCheck size={40} className="text-slate-200" />
                    </div>
                    <h2 className="text-2xl font-black text-[#1E2EDE] mb-4 uppercase tracking-tight">Tutor Not Found</h2>
                    <button
                        onClick={() => navigate("/user/tutors")}
                        className="w-full py-4 bg-[#1E2EDE] text-[#E6D929] rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[#14C4E7] hover:text-white transition-all shadow-xl shadow-blue-100"
                    >
                        Back to Faculty
                    </button>
                </div>
            </div>
        );
    }

    const { tutor, courses, totalCourses, isEligibleToMessage } = tutorData;

    return (
        <div className="min-h-screen bg-[#FDFDFD] pb-20">
            {/* --- BRAND HERO SECTION --- */}
            <div className="bg-[#1E2EDE] relative overflow-hidden h-[300px] md:h-[400px]">
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-80 h-80 bg-[#14C4E7] opacity-10 rounded-full -translate-y-20 translate-x-20"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#E6D929] opacity-10 rounded-full translate-y-10 -translate-x-10"></div>

                <div className="max-w-7xl mx-auto px-6 pt-12 relative z-10">
                    <button
                        onClick={() => navigate("/user/tutors")}
                        className="group flex items-center gap-2 text-white/70 hover:text-[#E6D929] transition-all font-black text-[10px] uppercase tracking-[0.3em]"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Back to Tutors
                    </button>
                </div>
            </div>

            {/* --- TUTOR PROFILE OVERLAP CARD --- */}
            <div className="max-w-7xl mx-auto px-6 -mt-32 md:-mt-48 relative z-20">
                <div className="bg-white rounded-[3rem] shadow-2xl shadow-blue-900/10 border border-slate-50 overflow-hidden">
                    <div className="p-8 md:p-12">
                        <div className="flex flex-col lg:flex-row gap-12 items-start">
                            {/* Left: Visual Profile */}
                            <div className="flex flex-col items-center shrink-0 w-full lg:w-auto">
                                <div className="relative group">
                                    <div className="w-40 h-40 md:w-56 md:h-56 rounded-[2.5rem] border-4 border-white shadow-2xl overflow-hidden ring-4 ring-[#14C4E7]/20 transition-all group-hover:ring-[#E6D929]">
                                        <img
                                            src={tutor.profileImage || defaultProfileImage}
                                            alt={tutor.fullName}
                                            onError={(e) => (e.target.src = defaultProfileImage)}
                                            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                                        />
                                    </div>
                                    <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-[#E6D929] text-[#1E2EDE] px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg flex items-center gap-2 border-2 border-white">
                                        <BadgeCheck size={14} fill="white" /> Verified
                                    </div>
                                </div>

                                {/* Social Links */}
                                <div className="mt-12 flex items-center gap-3">
                                    {[
                                        { icon: <Instagram />, title: "Instagram", color: "hover:bg-pink-500" },
                                        { icon: <Youtube />, title: "YouTube", color: "hover:bg-red-600" },
                                        { icon: <Twitter />, title: "Twitter", color: "hover:bg-sky-400" },
                                        { icon: <Linkedin />, title: "LinkedIn", color: "hover:bg-blue-700" },
                                    ].map((social, idx) => (
                                        <button
                                            key={idx}
                                            onClick={(e) => e.preventDefault()}
                                            className={`p-3 bg-slate-50 text-slate-400 rounded-2xl transition-all hover:text-white shadow-sm hover:scale-110 ${social.color}`}
                                            title={social.title}
                                        >
                                            {React.cloneElement(social.icon, { size: 18 })}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Right: Info & Bio */}
                            <div className="flex-1 w-full">
                                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 border-b border-slate-50 pb-8">
                                    <div>
                                        <h1 className="text-4xl md:text-5xl font-black text-[#1E2EDE] leading-tight tracking-tight mb-2">
                                            {tutor.fullName}
                                        </h1>
                                        <div className="flex flex-wrap gap-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
                                            <div className="flex items-center gap-2">
                                                <Mail size={14} className="text-[#14C4E7]" /> {tutor.email}
                                            </div>
                                            {tutor.phone && (
                                                <div className="flex items-center gap-2">
                                                    <Phone size={14} className="text-[#14C4E7]" /> {tutor.phone}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <button
                                        disabled={!isEligibleToMessage}
                                        onClick={() => {
                                            if (isEligibleToMessage) {
                                                navigate("/user/chat", {
                                                    state: { tutorId: tutor?._id },
                                                    replace: true,
                                                });
                                            }
                                        }}
                                        className={`px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-3 transition-all ${
                                            isEligibleToMessage
                                                ? "bg-slate-900 text-white hover:bg-[#1E2EDE]"
                                                : "bg-slate-100 text-slate-400 cursor-not-allowed opacity-70"
                                        }`}
                                        title={
                                            !isEligibleToMessage
                                                ? "Enroll in a course to message this tutor"
                                                : "Send a message"
                                        }
                                    >
                                        <MessageSquare size={16} />
                                        {isEligibleToMessage ? "Send Message" : "Chat Locked"}
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                                    {/* Teaching Subjects */}
                                    {tutor.teachingSubjects && tutor.teachingSubjects.length > 0 && (
                                        <div>
                                            <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4">
                                                Subject Expertise
                                            </h3>
                                            <div className="flex flex-wrap gap-2">
                                                {tutor.teachingSubjects.map((subject, index) => (
                                                    <span
                                                        key={index}
                                                        className="px-4 py-2 bg-[#14C4E7]/5 text-[#14C4E7] rounded-xl text-xs font-black uppercase border border-[#14C4E7]/10"
                                                    >
                                                        {subject}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Bio / About */}
                                    <div>
                                        <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4">
                                            About the Tutor
                                        </h3>
                                        <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap font-medium">
                                            {tutor.bio ||
                                                `${tutor.fullName} is a high-ranking educator at Hokz Academy focused on measurable student progress.`}
                                        </p>
                                    </div>
                                </div>

                                {/* Custom Introduction Block */}
                                <div className="bg-slate-50 rounded-[2rem] p-8 border border-slate-100 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-[#E6D929]/5 rounded-full -translate-y-12 translate-x-12"></div>
                                    <p className="text-slate-700 leading-relaxed font-bold italic relative z-10">
                                        "{tutor.fullName} believes in consistent practice, real-world examples, and
                                        interactive teaching methods. Join this faculty member to experience structured
                                        learning and measurable progress."
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- COURSES SECTION --- */}
            <div className="max-w-7xl mx-auto px-6 mt-16">
                <div className="flex items-center justify-between mb-10 border-l-4 border-[#14C4E7] pl-6">
                    <div>
                        <h2 className="text-2xl md:text-3xl font-black text-[#1E2EDE] uppercase tracking-tight">
                            Active Courses
                        </h2>
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">
                            Curated by {tutor.fullName}
                        </p>
                    </div>
                    <span className="bg-[#14C4E7]/10 text-[#14C4E7] px-6 py-2 rounded-full font-black text-xs uppercase">
                        {totalCourses} Modules
                    </span>
                </div>

                {courses && courses.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {courses.map((course) => {
                            const salePrice = calculateSalePrice(course.price, course.offerPercentage);
                            return (
                                <div
                                    key={course._id}
                                    onClick={() => handleCourseClick(course._id)}
                                    className="group bg-white rounded-[2.5rem] border border-slate-100 flex flex-col hover:shadow-[0_20px_50px_rgba(30,46,222,0.1)] transition-all duration-500 overflow-hidden relative cursor-pointer transform hover:-translate-y-3"
                                >
                                    {/* Course Thumbnail */}
                                    <div className="relative h-60 m-4 overflow-hidden rounded-[2rem]">
                                        {course.thumbnailUrl ? (
                                            <img
                                                src={course.thumbnailUrl}
                                                alt={course.title}
                                                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-slate-50 flex items-center justify-center">
                                                <BookOpen className="w-16 h-16 text-slate-200" />
                                            </div>
                                        )}

                                        {/* Category Badge */}
                                        {course.category && (
                                            <div className="absolute top-4 right-4">
                                                <span className="px-4 py-1.5 bg-white/90 backdrop-blur-md text-[#1E2EDE] rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm">
                                                    {course.category.name}
                                                </span>
                                            </div>
                                        )}

                                        {course.offerPercentage > 0 && (
                                            <div className="absolute top-4 left-4 bg-[#E6D929] text-[#1E2EDE] px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">
                                                SAVE {course.offerPercentage}%
                                            </div>
                                        )}
                                    </div>

                                    {/* Course Info */}
                                    <div className="px-8 pb-8 flex-1 flex flex-col">
                                        <div className="flex items-center gap-2 mb-3">
                                            <span className="w-2 h-2 rounded-full bg-[#14C4E7]"></span>
                                            <span className="text-[10px] font-black uppercase tracking-widest text-[#14C4E7]">
                                                Academy Curriculum
                                            </span>
                                        </div>

                                        <h3 className="text-xl font-bold text-[#1E2EDE] mb-4 line-clamp-2 leading-tight group-hover:text-[#14C4E7] transition-colors">
                                            {course.title}
                                        </h3>

                                        <div className="flex items-center gap-4 mb-6 text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                                            {course.lessonsCount > 0 && (
                                                <div className="flex items-center gap-1">
                                                    <BookOpen className="w-4 h-4 text-[#14C4E7]" />
                                                    <span>{course.lessonsCount} lessons</span>
                                                </div>
                                            )}
                                            {course.totalDurationSeconds > 0 && (
                                                <div className="flex items-center gap-1">
                                                    <Clock className="w-4 h-4 text-[#14C4E7]" />
                                                    <span>{formatDuration(course.totalDurationSeconds)}</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Pricing Footer */}
                                        <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between">
                                            <div className="flex flex-col">
                                                {course.offerPercentage > 0 && (
                                                    <span className="text-[10px] text-slate-300 line-through font-bold">
                                                        {formatCurrency(course.price)}
                                                    </span>
                                                )}
                                                <span className="text-2xl font-black text-[#1E2EDE]">
                                                    {formatCurrency(salePrice)}
                                                </span>
                                            </div>
                                            <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-[#1E2EDE] group-hover:bg-[#1E2EDE] group-hover:text-[#E6D929] transition-all duration-500 shadow-sm">
                                                <Star size={20} fill="currentColor" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-24 bg-white rounded-[3rem] border-4 border-dashed border-slate-50">
                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <BookOpen className="w-10 h-10 text-slate-200" />
                        </div>
                        <h3 className="text-2xl font-black text-[#1E2EDE] uppercase tracking-tight">Library Empty</h3>
                        <p className="text-slate-400 font-medium">
                            This mentor is currently preparing new curriculum content.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TutorDetails;
