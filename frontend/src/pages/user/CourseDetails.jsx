import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import {
    Star,
    PlayCircle,
    Clock,
    Award,
    FileText,
    Download,
    Smartphone,
    Infinity,
    Check,
    ChevronDown,
    ChevronUp,
    Globe,
    AlertCircle,
    Share2,
    Heart,
    Play,
    ArrowLeft,
} from "lucide-react";
import {
    fetchUserCourseDetails,
    selectUserSelectedCourse,
    selectUserCourseDetailsLoading,
} from "../../store/features/user/userCoursesSlice";
import { PageLoader } from "../../components/common/LoadingSpinner";

const CourseDetails = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const course = useSelector(selectUserSelectedCourse);
    const loading = useSelector(selectUserCourseDetailsLoading);

    const [expandedSections, setExpandedSections] = useState({});

    // Fetch course details on mount
    useEffect(() => {
        const loadCourseDetails = async () => {
            try {
                await dispatch(fetchUserCourseDetails(courseId)).unwrap();
            } catch (error) {
                toast.error(error || "Failed to load course details");
                navigate("/user/courses", { replace: true });
            }
        };

        if (courseId) {
            loadCourseDetails();
        }
    }, [courseId, dispatch, navigate]);

    const toggleSection = (sectionId) => {
        setExpandedSections((prev) => ({
            ...prev,
            [sectionId]: !prev[sectionId],
        }));
    };

    if (loading || !course) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-50">
                <PageLoader text="Loading course details..." />
            </div>
        );
    }

    // Calculate totals from denormalized fields
    const totalLessons = course.lessonsCount || 0;
    const totalDurationSeconds = course.totalDurationSeconds || 0;
    const hours = Math.floor(totalDurationSeconds / 3600);
    const minutes = Math.floor((totalDurationSeconds % 3600) / 60);
    const seconds = totalDurationSeconds % 60;

    // Calculate offer price
    const offerPrice =
        course.offerPercentage > 0 ? (course.price * (1 - course.offerPercentage / 100)).toFixed(2) : course.price;

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
            {/* --- Navbar --- */}
            <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 h-16 flex items-center shadow-sm">
                <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate("/user/courses")}
                            className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 transition"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            <span className="hidden sm:inline">Back to Courses</span>
                        </button>
                    </div>
                    <div className="font-bold text-xl text-gray-800">LearnFlow</div>
                    <div className="w-24"></div>
                </div>
            </nav>

            {/* --- Hero Section (Dark Theme) --- */}
            <header className="bg-gray-900 text-white pt-10 pb-12 lg:pb-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="lg:w-2/3 pr-0 lg:pr-8">
                        {/* Breadcrumbs */}
                        <div className="flex items-center gap-2 text-indigo-300 text-sm font-medium mb-4">
                            <span>Courses</span>
                            <span className="text-gray-500">/</span>
                            <span>{course.category?.name || "Uncategorized"}</span>
                        </div>

                        <h1 className="text-3xl sm:text-4xl font-bold mb-4 leading-tight">{course.title}</h1>
                        <p className="text-lg text-gray-300 mb-6 leading-relaxed">{course.description}</p>

                        {/* Ratings & Info */}
                        <div className="flex flex-wrap items-center gap-4 text-sm mb-6">
                            <div className="flex items-center gap-1">
                                <span className="text-amber-400 font-bold">{course.averageRating || 0}</span>
                                <div className="flex text-amber-400">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className={`w-4 h-4 ${
                                                i < Math.floor(course.averageRating || 0) ? "fill-current" : ""
                                            }`}
                                        />
                                    ))}
                                </div>
                                <span className="text-indigo-200 ml-1">
                                    ({course.totalReviews || 0} {course.totalReviews === 1 ? "review" : "reviews"})
                                </span>
                            </div>
                            <span className="text-gray-500 hidden sm:block">•</span>
                            <span className="text-gray-300">{course.enrolledCount || 0} students enrolled</span>
                        </div>

                        <div className="flex flex-wrap gap-y-2 gap-x-6 text-sm text-gray-300">
                            <div className="flex items-center gap-2">
                                <AlertCircle className="w-4 h-4" />
                                Last updated{" "}
                                {new Date(course.updatedAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                            </div>
                            <div className="flex items-center gap-2">
                                <Globe className="w-4 h-4" />
                                {course.language || "English"}
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* --- Main Layout (Grid) --- */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="lg:grid lg:grid-cols-3 lg:gap-12">
                    {/* --- Left Column (Content) --- */}
                    <div className="lg:col-span-2 space-y-10">
                        {/* Course Overview */}
                        <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Course Overview</h2>
                            <div className="grid sm:grid-cols-2 gap-6">
                                <div className="flex items-center gap-3">
                                    <div className="p-3 bg-cyan-50 rounded-lg">
                                        <PlayCircle className="w-6 h-6 text-cyan-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Total Lessons</p>
                                        <p className="text-lg font-bold text-gray-900">{totalLessons}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="p-3 bg-emerald-50 rounded-lg">
                                        <Clock className="w-6 h-6 text-emerald-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Duration</p>
                                        <p className="text-lg font-bold text-gray-900">
                                            {hours > 0 && `${hours}h `}
                                            {minutes > 0 && `${minutes}m `}
                                            {seconds}s
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="p-3 bg-purple-50 rounded-lg">
                                        <Award className="w-6 h-6 text-purple-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Level</p>
                                        <p className="text-lg font-bold text-gray-900 capitalize">
                                            {course.level || "All"}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="p-3 bg-amber-50 rounded-lg">
                                        <Globe className="w-6 h-6 text-amber-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Language</p>
                                        <p className="text-lg font-bold text-gray-900">{course.language || "English"}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Motivational Section */}
                        <div className="relative overflow-hidden bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-2xl p-8 border border-indigo-100 shadow-sm">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-indigo-200/30 to-purple-200/30 rounded-full blur-3xl -mr-32 -mt-32"></div>
                            <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-pink-200/30 to-purple-200/30 rounded-full blur-3xl -ml-24 -mb-24"></div>
                            
                            <div className="relative">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg">
                                        <Award className="w-6 h-6 text-white" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900">Why This Course?</h3>
                                </div>
                                
                                <p className="text-gray-700 leading-relaxed mb-4">
                                    This course is designed to give you <span className="font-semibold text-indigo-700">real, practical skills</span> you can actually use. Every lesson is structured to help you understand concepts clearly, apply them confidently, and make real progress step by step.
                                </p>
                                
                                <p className="text-gray-700 leading-relaxed mb-4">
                                    Whether you're starting fresh or trying to take your skills to the next level, this course gives you everything you need in one place — <span className="font-semibold text-purple-700">clear explanations</span>, <span className="font-semibold text-purple-700">guided examples</span>, <span className="font-semibold text-purple-700">hands-on learning</span>, and support whenever you need it.
                                </p>
                                
                                <div className="flex items-start gap-3 p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-indigo-200/50">
                                    <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex-shrink-0 mt-1">
                                        <Check className="w-5 h-5 text-white" />
                                    </div>
                                    <p className="text-gray-800 leading-relaxed font-medium">
                                        If you're serious about upgrading your knowledge and building a stronger future, this is the right place to begin.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Curriculum */}
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Course Content</h2>
                            <div className="text-sm text-gray-500 mb-4 flex gap-2">
                                <span>{totalLessons} lessons</span> •{" "}
                                <span>
                                    {hours > 0 && `${hours}h `}
                                    {minutes > 0 && `${minutes}m `}
                                    {seconds}s total length
                                </span>
                            </div>

                            <div className="border border-gray-200 rounded-xl overflow-hidden bg-white p-6">
                                <div className="flex items-center justify-center flex-col gap-4 py-8">
                                    <div className="p-4 bg-gray-100 rounded-full">
                                        <PlayCircle className="w-12 h-12 text-gray-400" />
                                    </div>
                                    <div className="text-center">
                                        <p className="text-lg font-semibold text-gray-900 mb-2">
                                            Course Content Available After Enrollment
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            This course contains {totalLessons} lessons with{" "}
                                            {hours > 0 && `${hours} hours, `}
                                            {minutes > 0 && `${minutes} minutes, `}
                                            and {seconds} seconds of video content.
                                        </p>
                                        <p className="text-sm text-gray-600 mt-2">
                                            Enroll now to access all course materials and start learning!
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Description</h2>
                            <div className="prose prose-indigo text-gray-600 max-w-none">
                                <p className="whitespace-pre-wrap">{course.description}</p>
                            </div>
                        </div>

                        {/* Instructor */}
                        {course.tutor && (
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">Instructor</h2>
                                <div>
                                    <h3 className="font-bold text-indigo-600 text-lg mb-1">{course.tutor.fullName}</h3>
                                    <p className="text-gray-500 mb-4">Course Instructor</p>

                                    <div className="flex items-start gap-4 sm:gap-6">
                                        {course.tutor.profileImage ? (
                                            <img
                                                src={course.tutor.profileImage}
                                                alt={course.tutor.fullName}
                                                className="w-24 h-24 rounded-full object-cover border-2 border-gray-100"
                                            />
                                        ) : (
                                            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-cyan-500 to-emerald-500 flex items-center justify-center text-white text-3xl font-bold">
                                                {course.tutor.fullName.charAt(0).toUpperCase()}
                                            </div>
                                        )}
                                        <div className="space-y-2 text-sm text-gray-600">
                                            <div className="flex items-center gap-2">
                                                <Award className="w-4 h-4 text-gray-900" />
                                                <span>Professional Instructor</span>
                                            </div>
                                            {course.tutor.email && (
                                                <div className="flex items-center gap-2">
                                                    <Globe className="w-4 h-4 text-gray-900" />
                                                    <span>{course.tutor.email}</span>
                                                </div>
                                            )}
                                            <div className="flex items-center gap-2">
                                                <Star className="w-4 h-4 text-gray-900" />
                                                <span>{course.averageRating || 0} Course Rating</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* --- Right Column (Sticky Sidebar) --- */}
                    <div className="lg:col-span-1 relative">
                        <div className="sticky top-24">
                            {/* Card Container - floats over hero slightly on large screens */}
                            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden lg:-mt-64 relative z-10">
                                {/* Preview Video Image */}
                                <div className="relative aspect-video group cursor-pointer">
                                    <img
                                        src={course.thumbnailUrl}
                                        alt={course.title}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                                        <div className="bg-white/90 rounded-full p-4 shadow-lg group-hover:scale-110 transition-transform">
                                            <Play className="w-8 h-8 text-indigo-600 ml-1" />
                                        </div>
                                    </div>
                                    <div className="absolute bottom-4 left-0 right-0 text-center">
                                        <span className="font-bold text-white drop-shadow-md">Preview this course</span>
                                    </div>
                                </div>

                                {/* Card Content */}
                                <div className="p-6">
                                    <div className="flex items-end gap-3 mb-6">
                                        {course.price === 0 ? (
                                            <span className="text-3xl font-bold text-emerald-600">Free</span>
                                        ) : (
                                            <>
                                                <span className="text-3xl font-bold text-gray-900">₹{offerPrice}</span>
                                                {course.offerPercentage > 0 && (
                                                    <>
                                                        <span className="text-gray-400 line-through mb-1">
                                                            ₹{course.price}
                                                        </span>
                                                        <span className="text-indigo-600 font-bold mb-1 ml-auto">
                                                            {course.offerPercentage}% off
                                                        </span>
                                                    </>
                                                )}
                                            </>
                                        )}
                                    </div>

                                    <div className="flex gap-3 mb-3">
                                        <button className="flex-1 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg hover:shadow-indigo-200 transition-all active:scale-[0.98]">
                                            Add to Cart
                                        </button>
                                        <button 
                                            className="p-3 bg-white border-2 border-gray-200 hover:border-red-400 hover:bg-red-50 rounded-xl transition-all group"
                                            title="Add to Wishlist"
                                        >
                                            <Heart className="w-6 h-6 text-gray-600 group-hover:text-red-500 group-hover:fill-red-500 transition-all" />
                                        </button>
                                    </div>
                                    <button className="w-full py-3 px-4 bg-white border-2 border-gray-200 hover:border-gray-300 text-gray-700 font-bold rounded-xl transition-all mb-6">
                                        Buy Now
                                    </button>

                                    <p className="text-center text-xs text-gray-500 mb-6">30-Day Money-Back Guarantee</p>

                                    {/* Includes List */}
                                    <div className="space-y-3">
                                        <h4 className="font-bold text-sm text-gray-900">This course includes:</h4>
                                        <ul className="text-sm text-gray-600 space-y-2.5">
                                            <li className="flex items-center gap-3">
                                                <Clock className="w-4 h-4 text-gray-400" />{" "}
                                                {hours > 0 && `${hours}h `}
                                                {minutes > 0 && `${minutes}m `}
                                                {seconds}s on-demand video
                                            </li>
                                            <li className="flex items-center gap-3">
                                                <FileText className="w-4 h-4 text-gray-400" /> {totalLessons} lessons
                                            </li>
                                            <li className="flex items-center gap-3">
                                                <Infinity className="w-4 h-4 text-gray-400" /> Full lifetime access
                                            </li>
                                            <li className="flex items-center gap-3">
                                                <Smartphone className="w-4 h-4 text-gray-400" /> Access on mobile and
                                                desktop
                                            </li>
                                            <li className="flex items-center gap-3">
                                                <Award className="w-4 h-4 text-gray-400" /> Certificate of completion
                                            </li>
                                        </ul>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex justify-center pt-6 mt-6 border-t border-gray-100">
                                        <button className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors">
                                            <Share2 className="w-4 h-4" /> Share this course
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* --- Footer --- */}
            <footer className="bg-white border-t border-gray-200 mt-20 py-12">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <div className="font-bold text-xl text-gray-800 mb-4">LearnFlow</div>
                    <p className="text-gray-500 text-sm">&copy; 2024 LearnFlow Inc. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default CourseDetails;
