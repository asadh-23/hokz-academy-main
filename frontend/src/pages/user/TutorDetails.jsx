import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Mail, Phone, BookOpen, Users, Clock, Star, ArrowLeft, Instagram, Youtube, Twitter, Linkedin } from "lucide-react";
import { userAxios } from "../../api/userAxios";
import { toast } from "sonner";
import { PageLoader } from "../../components/common/LoadingSpinner";
import defaultProfileImage from "../../assets/images/default-profile-image.webp";

const TutorDetails = () => {
    const { tutorId } = useParams();
    const navigate = useNavigate();
    const [tutorData, setTutorData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTutorDetails();
    }, [tutorId]);

    const fetchTutorDetails = async () => {
        try {
            setLoading(true);
            const response = await userAxios.get(`/tutors/${tutorId}`);
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
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-6">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Tutor Not Found</h2>
                    <button
                        onClick={() => navigate("/user/tutors")}
                        className="px-6 py-3 bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-xl font-semibold hover:from-teal-700 hover:to-cyan-700 transition-all"
                    >
                        Back to Tutors
                    </button>
                </div>
            </div>
        );
    }

    const { tutor, courses, totalCourses } = tutorData;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Back Button */}
                <button
                    onClick={() => navigate("/user/tutors")}
                    className="mb-6 flex items-center gap-2 text-gray-600 hover:text-teal-600 transition-colors font-medium"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Back to Tutors
                </button>

                {/* Tutor Profile Card */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-8 mb-8">
                    <div className="flex flex-col md:flex-row gap-8">
                        {/* Profile Image */}
                        <div className="flex-shrink-0">
                            <div className="relative group">
                                <div className="absolute inset-0 bg-gradient-to-r from-teal-400 to-cyan-500 rounded-full animate-pulse opacity-20"></div>
                                <img
                                    src={tutor.profileImage || defaultProfileImage}
                                    alt={tutor.fullName}
                                    onError={(e) => (e.target.src = defaultProfileImage)}
                                    className="relative w-32 h-32 md:w-40 md:h-40 object-cover rounded-full border-4 border-white shadow-xl"
                                />
                            </div>
                        </div>

                        {/* Tutor Info */}
                        <div className="flex-1">
                            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent mb-4">
                                {tutor.fullName}
                            </h1>

                            {/* Tutor Introduction */}
                            <div className="mb-6 p-4 bg-gradient-to-r from-teal-50 to-cyan-50 rounded-xl border border-teal-100">
                                <p className="text-gray-700 leading-relaxed">
                                    {tutor.fullName} is a dedicated and passionate educator committed to helping students
                                    achieve their academic goals. With a strong understanding of core concepts,{" "}
                                    {tutor.fullName} focuses on building clarity and confidence in every session. Lessons
                                    are designed to be engaging, practical, and tailored to each student's learning style.{" "}
                                    {tutor.fullName} believes in consistent practice, real-world examples, and interactive
                                    teaching methods. Join {tutor.fullName} to experience structured learning and
                                    measurable progress.
                                </p>
                            </div>

                            {/* Contact Info */}
                            <div className="space-y-3 mb-6">
                                {tutor.email && (
                                    <div className="flex items-center gap-3 text-gray-700">
                                        <div className="p-2 bg-teal-50 rounded-lg">
                                            <Mail className="w-5 h-5 text-teal-600" />
                                        </div>
                                        <span className="font-medium">{tutor.email}</span>
                                    </div>
                                )}
                                {tutor.phone && (
                                    <div className="flex items-center gap-3 text-gray-700">
                                        <div className="p-2 bg-cyan-50 rounded-lg">
                                            <Phone className="w-5 h-5 text-cyan-600" />
                                        </div>
                                        <span className="font-medium">{tutor.phone}</span>
                                    </div>
                                )}
                            </div>

                            {/* Teaching Subjects */}
                            {tutor.teachingSubjects && tutor.teachingSubjects.length > 0 && (
                                <div className="mb-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Teaching Subjects</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {tutor.teachingSubjects.map((subject, index) => (
                                            <span
                                                key={index}
                                                className="px-4 py-2 bg-gradient-to-r from-teal-100 to-cyan-100 text-teal-800 rounded-full text-sm font-medium border border-teal-200"
                                            >
                                                {subject}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Bio */}
                            {tutor.bio && (
                                <div className="mb-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-3">About</h3>
                                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{tutor.bio}</p>
                                </div>
                            )}

                            {/* Social Media Links */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-3">Connect</h3>
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={(e) => e.preventDefault()}
                                        className="p-3 bg-gradient-to-br from-pink-500 to-rose-500 text-white rounded-xl hover:from-pink-600 hover:to-rose-600 transition-all shadow-md hover:shadow-lg hover:scale-110"
                                        title="Instagram"
                                    >
                                        <Instagram className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={(e) => e.preventDefault()}
                                        className="p-3 bg-gradient-to-br from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all shadow-md hover:shadow-lg hover:scale-110"
                                        title="YouTube"
                                    >
                                        <Youtube className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={(e) => e.preventDefault()}
                                        className="p-3 bg-gradient-to-br from-sky-400 to-blue-500 text-white rounded-xl hover:from-sky-500 hover:to-blue-600 transition-all shadow-md hover:shadow-lg hover:scale-110"
                                        title="Twitter"
                                    >
                                        <Twitter className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={(e) => e.preventDefault()}
                                        className="p-3 bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg hover:scale-110"
                                        title="LinkedIn"
                                    >
                                        <Linkedin className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Courses Section */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-8">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">Courses by {tutor.fullName}</h2>
                        <span className="px-4 py-2 bg-teal-50 text-teal-700 rounded-full font-medium text-sm">
                            {totalCourses} {totalCourses === 1 ? "Course" : "Courses"}
                        </span>
                    </div>

                    {courses && courses.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {courses.map((course) => {
                                const salePrice = calculateSalePrice(course.price, course.offerPercentage);
                                return (
                                    <div
                                        key={course._id}
                                        onClick={() => handleCourseClick(course._id)}
                                        className="group bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 hover:border-teal-200 hover:-translate-y-1 cursor-pointer"
                                    >
                                        {/* Course Thumbnail */}
                                        <div className="relative h-48 bg-gradient-to-br from-teal-100 to-cyan-100 overflow-hidden">
                                            {course.thumbnailUrl ? (
                                                <img
                                                    src={course.thumbnailUrl}
                                                    alt={course.title}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <BookOpen className="w-16 h-16 text-teal-300" />
                                                </div>
                                            )}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>

                                            {/* Category Badge */}
                                            {course.category && (
                                                <div className="absolute top-3 right-3">
                                                    <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-gray-700 rounded-full text-xs font-medium">
                                                        {course.category.name}
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Course Info */}
                                        <div className="p-5">
                                            <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-teal-600 transition-colors">
                                                {course.title}
                                            </h3>

                                            {/* Stats */}
                                            <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
                                                {course.lessonsCount > 0 && (
                                                    <div className="flex items-center gap-1">
                                                        <BookOpen className="w-4 h-4" />
                                                        <span>{course.lessonsCount} lessons</span>
                                                    </div>
                                                )}
                                                {course.totalDurationSeconds > 0 && (
                                                    <div className="flex items-center gap-1">
                                                        <Clock className="w-4 h-4" />
                                                        <span>{formatDuration(course.totalDurationSeconds)}</span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Price */}
                                            <div className="flex items-center gap-3">
                                                <span className="text-2xl font-bold text-teal-600">
                                                    {formatCurrency(salePrice)}
                                                </span>
                                                {course.offerPercentage > 0 && (
                                                    <>
                                                        <span className="text-sm text-gray-400 line-through">
                                                            {formatCurrency(course.price)}
                                                        </span>
                                                        <span className="text-xs bg-gradient-to-r from-red-500 to-pink-500 text-white px-2 py-1 rounded-full font-bold">
                                                            {course.offerPercentage}% OFF
                                                        </span>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <BookOpen className="w-10 h-10 text-gray-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Courses Available</h3>
                            <p className="text-gray-600">This tutor hasn't published any courses yet.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TutorDetails;
