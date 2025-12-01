import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiSearch, FiPlus, FiEdit2, FiSettings } from "react-icons/fi";
import { MdOutlineSchool } from "react-icons/md";
import sampleImage from "../../assets/images/CourseImage1.jpg";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
// Redux thunks and selectors
import {
    fetchTutorCourses,
    toggleTutorCourseStatus,
    selectTutorCourses,
    selectTutorCourseStats,
    selectTutorCourseFilters,
    setTutorCourseFilters,
    selectTutorCoursePagination,
} from "../../store/features/tutor/tutorCoursesSlice";
import Pagination from "../../components/common/Pagination";
import StatsCards from "../../components/common/StatsCards";
import { PageLoader } from "../../components/common/LoadingSpinner";

const ManageCourses = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const filters = useSelector(selectTutorCourseFilters);
    const pagination = useSelector(selectTutorCoursePagination);
    const stats = useSelector(selectTutorCourseStats);

    const courses = useSelector(selectTutorCourses);

    const [firstLoad, setFirstLoad] = useState(true);

    const loadCourses = async () => {
        try {
            await dispatch(
                fetchTutorCourses({
                    page: filters.page,
                    limit: filters.limit,
                    search: filters.search,
                    status: filters.status,
                })
            ).unwrap();
            setFirstLoad(false);
        } catch (error) {
            console.error("Fetch course loading error:", error);
            toast.error(error || "Failed to load courses");
        }
    };

    useEffect(() => {
        loadCourses();
    }, [filters.page, filters.status]);

    useEffect(() => {
        dispatch(setTutorCourseFilters({ page: 1 }));
    }, [filters.search, filters.status]);

    useEffect(() => {
        const delay = setTimeout(() => {
            loadCourses();
        }, 500);
        return () => clearTimeout(delay);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filters.search]);

    const handleSearchChange = (e) => {
        dispatch(setTutorCourseFilters({ search: e.target.value }));
    };
    const handleStatusChange = (e) => {
        dispatch(setTutorCourseFilters({ status: e.target.value }));
    };
    const handlePageChange = (page) => {
        dispatch(setTutorCourseFilters({ page }));
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
                            })
                        ).unwrap();

                        toast.success(`${courseTitle} ${actionText}ed successfully`);
                        loadCourses();
                    } catch (err) {
                        console.log("Failed to update course listing:", err);
                        toast.error(err || "Failed to update listing");
                    }
                },
            },
            cancel: { label: "Cancel" },
        });
    };

    const handleExam = (courseId) => {
        console.log("Manage exam:", courseId);
    };

    const handleSettings = (courseId) => {
        console.log("Course settings:", courseId);
    };

    if (firstLoad) {
        return <PageLoader />;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
            <div className="max-w-[1800px] mx-auto">
                {/* Header Section */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-6 mb-8">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <StatsCards stats={stats} label={"Courses"} />

                        {/* Search & Filter */}
                        <div className="flex flex-wrap items-center gap-3">
                            {/* Search */}
                            <div className="relative">
                                <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
                                <input
                                    type="text"
                                    placeholder="Search courses..."
                                    value={filters.search}
                                    onChange={handleSearchChange}
                                    className="pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl 
                   focus:ring-2 focus:ring-teal-500 focus:border-teal-500
                   outline-none focus:outline-none w-72 bg-white shadow-sm"
                                />
                            </div>

                            {/* Filter */}
                            <select
                                value={filters.status}
                                onChange={handleStatusChange}
                                className="px-5 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white font-medium shadow-sm"
                            >
                                <option value="all">All Courses</option>
                                <option value="listed">Listed</option>
                                <option value="unlisted">Unlisted</option>
                            </select>

                            {/* Add Course */}
                            <button
                                onClick={() => {
                                    navigate("/tutor/courses/add-course");
                                }}
                                className="px-6 py-3 bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-xl font-semibold hover:from-teal-700 hover:to-cyan-700 transition-all shadow-lg hover:shadow-xl flex items-center gap-2 whitespace-nowrap"
                            >
                                <FiPlus className="text-xl" />
                                Add New Course
                            </button>
                        </div>
                    </div>
                </div>

                {/* Courses Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-7">
                    {courses.map((course) => (
                        <div
                            key={course._id}
                            className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 hover:border-teal-200 hover:-translate-y-1"
                        >
                            {/* Course Thumbnail */}
                            <div className="relative h-[240px] w-full overflow-hidden">
                                <img
                                    src={course.thumbnailUrl || sampleImage}
                                    alt={course.title}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                />

                                {/* Status Badge */}
                                <span
                                    className={`absolute top-4 right-4 px-4 py-1.5 rounded-full text-xs font-bold shadow-lg backdrop-blur-sm ${
                                        course.isListed ? "bg-green-500/90 text-white" : "bg-red-500/90 text-white"
                                    }`}
                                >
                                    {course.isListed ? "Listed" : "Unlisted"}
                                </span>
                            </div>

                            <div className="p-7">
                                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-teal-600 transition-colors">
                                    {course.title}
                                </h3>

                                <p className="text-sm text-gray-600 mb-5 line-clamp-2 leading-relaxed">
                                    {course.shortSummary || course.description}
                                </p>

                                {/* Price */}
                                <div className="flex items-center gap-3 mb-4">
                                    {/* Final Price After Discount */}
                                    <span className="text-2xl font-bold text-teal-600">
                                        ₹{Math.round(course.price - (course.price * course.offerPercentage) / 100)}
                                    </span>

                                    {/* Original Price */}
                                    {course.offerPercentage > 0 && (
                                        <span className="text-base text-gray-400 line-through">₹{course.price}</span>
                                    )}

                                    {/* Discount Badge */}
                                    {course.offerPercentage > 0 && (
                                        <span className="text-xs bg-gradient-to-r from-red-500 to-pink-500 text-white px-2.5 py-1 rounded-full font-bold shadow-md">
                                            {course.offerPercentage}% OFF
                                        </span>
                                    )}
                                </div>

                                {/* Enrollment */}
                                <div className="flex items-center gap-2 text-sm text-gray-600 mb-6 pb-6 border-b-2 border-gray-100">
                                    <MdOutlineSchool className="text-lg text-teal-600" />
                                    <span className="font-semibold">{course.enrolledCount} students enrolled</span>
                                </div>

                                {/* Buttons */}
                                <div className="space-y-3">
                                    {/* Edit + List */}
                                    <div className="grid grid-cols-2 gap-3">
                                        <button
                                            onClick={() => navigate(`/tutor/courses/${course._id}/edit`)}
                                            className="px-4 py-3 bg-gradient-to-r from-pink-50 to-rose-50 text-pink-600 rounded-xl text-sm font-bold hover:from-pink-100 hover:to-rose-100 transition-all flex items-center justify-center gap-2 border-2 border-pink-200 hover:border-pink-300 shadow-sm"
                                        >
                                            <FiEdit2 className="text-base" />
                                            Edit
                                        </button>

                                        <button
                                            onClick={() =>
                                                handleToggleListCourse(course._id, course.title, course.isListed)
                                            }
                                            className="px-4 py-3 bg-gradient-to-r from-teal-50 to-cyan-50 text-teal-600 rounded-xl text-sm font-bold hover:from-teal-100 hover:to-cyan-100 transition-all border-2 border-teal-200 hover:border-teal-300 shadow-sm"
                                        >
                                            {course.isListed ? "Unlist" : "List"}
                                        </button>
                                    </div>

                                    {/* Manage Lessons */}
                                    <button
                                        onClick={() =>
                                            navigate(`/tutor/courses/${course._id}/add-lesson`, {
                                                state: { courseTitle: course.title },
                                            })
                                        }
                                        className="w-full px-4 py-3.5 bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-xl text-sm font-bold hover:from-teal-700 hover:to-cyan-700 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                                    >
                                        <FiPlus className="text-lg" />
                                        MANAGE LESSONS
                                    </button>

                                    {/* Exam + Settings */}
                                    <div className="grid grid-cols-2 gap-3">
                                        <button
                                            onClick={() => handleExam(course._id)}
                                            className="px-4 py-3 bg-gradient-to-r from-purple-50 to-violet-50 text-purple-600 rounded-xl text-sm font-bold hover:from-purple-100 hover:to-violet-100 transition-all flex items-center justify-center gap-2 border-2 border-purple-200 hover:border-purple-300 shadow-sm"
                                        >
                                            <MdOutlineSchool className="text-lg" />
                                            Exam
                                        </button>

                                        <button
                                            onClick={() => handleSettings(course._id)}
                                            className="px-4 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-600 rounded-xl text-sm font-bold hover:from-blue-100 hover:to-indigo-100 transition-all flex items-center justify-center gap-2 border-2 border-blue-200 hover:border-blue-300 shadow-sm"
                                        >
                                            <FiSettings className="text-base" />
                                            Settings
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <Pagination
                    currentPage={pagination.currentPage}
                    totalPages={pagination.totalPages}
                    totalItems={pagination.totalCourses}
                    itemsPerPage={filters.limit}
                    onPageChange={handlePageChange}
                />

                {/* EMPTY STATE */}
                {courses.length === 0 && (
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-20 text-center">
                        <div className="max-w-lg mx-auto">
                            <div className="w-24 h-24 bg-gradient-to-br from-teal-100 to-cyan-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                                <FiPlus className="text-5xl text-teal-600" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-3">No courses found</h3>
                            <p className="text-gray-600 mb-8 text-lg">
                                Start creating your first course to share your knowledge with students around the world.
                            </p>
                            <button
                                onClick={() => {
                                    navigate("/tutor/courses/add-course");
                                }}
                                className="px-8 py-4 bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-xl font-bold hover:from-teal-700 hover:to-cyan-700 transition-all shadow-lg hover:shadow-xl inline-flex items-center gap-3 text-lg"
                            >
                                <FiPlus className="text-xl" />
                                Create Your First Course
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManageCourses;
