import React, { useEffect, useState } from "react";
import { Search, Play, Award, User, BookOpen, Clock, TrendingUp, Star, Filter, Grid, List } from "lucide-react";
import CourseCard from "../../components/user/myCourses/CourseCard";
import { fetchMyCourses, selectMyCourses, selectMyCoursesLoading } from "../../store/features/user/userCoursesSlice";
import { PageLoader } from "../../components/common/LoadingSpinner";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const MyCourses = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");
    const [viewMode, setViewMode] = useState("grid");
    const [filterBy, setFilterBy] = useState("all");

    // 1. Redux State Access
    const courses = useSelector(selectMyCourses);
    const isLoading = useSelector(selectMyCoursesLoading);

    // 2. Fetch Data on Mount
    useEffect(() => {
        dispatch(fetchMyCourses());
    }, [dispatch]);

    // 3. Filter Logic (Real Data)
    let filteredCourses = courses?.filter((course) => course.title.toLowerCase().includes(searchQuery.toLowerCase())) || [];

    // Apply filter by status
    if (filterBy === "progress") {
        filteredCourses = filteredCourses.filter((c) => (c.progress || 0) < 100);
    } else if (filterBy === "completed") {
        filteredCourses = filteredCourses.filter((c) => (c.progress || 0) === 100);
    }

    const enrolled = filteredCourses.filter((c) => (c.progress || 0) < 100);
    const completed = filteredCourses.filter((c) => (c.progress || 0) === 100);

    // Statistics (based on all courses, not filtered)
    const totalCourses = courses?.length || 0;
    const allCompleted = courses?.filter((c) => (c.progress || 0) === 100) || [];
    const allInProgress = courses?.filter((c) => (c.progress || 0) < 100) || [];
    const completedCount = allCompleted.length;
    const inProgressCount = allInProgress.length;
    const averageProgress =
        totalCourses > 0 ? Math.round(courses.reduce((acc, course) => acc + (course.progress || 0), 0) / totalCourses) : 0;

    if (isLoading) {
        return <PageLoader text="Loading your courses..." />;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
            {/* Hero Section */}
            <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600">
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/90 to-purple-600/90"></div>

                {/* Decorative Elements */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
                    <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
                    <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
                </div>

                <div className="relative max-w-7xl mx-auto px-6 py-16 md:py-20">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
                            My Learning Journey
                        </h1>
                        <p className="text-xl text-indigo-100 max-w-2xl mx-auto leading-relaxed">
                            Track your progress, access certificates, and continue your path to mastery
                        </p>
                    </div>

                    {/* Statistics Cards */}
                    {totalCourses > 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8">
                            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/20">
                                <div className="bg-white/20 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3">
                                    <BookOpen className="text-white" size={24} />
                                </div>
                                <div className="text-2xl font-bold text-white mb-1">{totalCourses}</div>
                                <div className="text-indigo-100 text-sm">Total Courses</div>
                            </div>

                            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/20">
                                <div className="bg-white/20 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3">
                                    <TrendingUp className="text-white" size={24} />
                                </div>
                                <div className="text-2xl font-bold text-white mb-1">{inProgressCount}</div>
                                <div className="text-indigo-100 text-sm">In Progress</div>
                            </div>

                            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/20">
                                <div className="bg-white/20 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3">
                                    <Award className="text-white" size={24} />
                                </div>
                                <div className="text-2xl font-bold text-white mb-1">{completedCount}</div>
                                <div className="text-indigo-100 text-sm">Completed</div>
                            </div>

                            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/20">
                                <div className="bg-white/20 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3">
                                    <Star className="text-white" size={24} />
                                </div>
                                <div className="text-2xl font-bold text-white mb-1">{averageProgress}%</div>
                                <div className="text-indigo-100 text-sm">Avg Progress</div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-6 py-12">
                {/* Search and Filters */}
                <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6 mb-8">
                    <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                        {/* Search Bar */}
                        <div className="relative group flex-1 max-w-md">
                            <Search
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition-colors"
                                size={20}
                            />
                            <input
                                type="text"
                                placeholder="Search your courses..."
                                className="w-full pl-12 pr-4 py-4 bg-gray-50 border-0 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all text-gray-700 placeholder-gray-400"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        {/* Filter and View Controls */}
                        <div className="flex items-center gap-3">
                            <select
                                value={filterBy}
                                onChange={(e) => setFilterBy(e.target.value)}
                                className="px-4 py-3 bg-gray-50 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-gray-700"
                            >
                                <option value="all">All Courses</option>
                                <option value="progress">In Progress</option>
                                <option value="completed">Completed</option>
                            </select>

                            <div className="flex bg-gray-100 rounded-xl p-1">
                                <button
                                    onClick={() => setViewMode("grid")}
                                    className={`p-2 rounded-lg transition-all ${
                                        viewMode === "grid"
                                            ? "bg-white shadow-sm text-indigo-600"
                                            : "text-gray-500 hover:text-gray-700"
                                    }`}
                                >
                                    <Grid size={18} />
                                </button>
                                <button
                                    onClick={() => setViewMode("list")}
                                    className={`p-2 rounded-lg transition-all ${
                                        viewMode === "list"
                                            ? "bg-white shadow-sm text-indigo-600"
                                            : "text-gray-500 hover:text-gray-700"
                                    }`}
                                >
                                    <List size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {courses?.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm text-center">
                        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-8 rounded-full mb-6">
                            <BookOpen size={48} className="text-indigo-500" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-3">Start Your Learning Journey</h2>
                        <p className="text-gray-500 mb-8 max-w-md leading-relaxed">
                            You haven't enrolled in any courses yet. Discover amazing courses and start learning today!
                        </p>
                        <button
                            onClick={() => navigate("/courses")}
                            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold px-8 py-4 rounded-2xl transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
                        >
                            Browse Courses
                        </button>
                    </div>
                ) : (
                    <>
                        {/* Display courses based on filter */}
                        {filterBy === "all" ? (
                            <>
                                {/* Enrolled Courses Section */}
                                {enrolled.length > 0 && (
                                    <section className="mb-12">
                                        <div className="flex items-center gap-3 mb-8">
                                            <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-2xl shadow-lg">
                                                <TrendingUp size={24} />
                                            </div>
                                            <div>
                                                <h2 className="text-2xl font-bold text-gray-800">Continue Learning</h2>
                                                <p className="text-gray-500">{enrolled.length} courses in progress</p>
                                            </div>
                                        </div>

                                        <div
                                            className={`grid gap-6 ${
                                                viewMode === "grid"
                                                    ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                                                    : "grid-cols-1"
                                            }`}
                                        >
                                            {enrolled.map((course) => (
                                                <CourseCard key={course._id} course={course} viewMode={viewMode} />
                                            ))}
                                        </div>
                                    </section>
                                )}

                                {/* Completed Courses Section */}
                                {completed.length > 0 && (
                                    <section>
                                        <div className="flex items-center gap-3 mb-8">
                                            <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-2xl shadow-lg">
                                                <Award size={24} />
                                            </div>
                                            <div>
                                                <h2 className="text-2xl font-bold text-gray-800">Completed Courses</h2>
                                                <p className="text-gray-500">{completed.length} certificates earned</p>
                                            </div>
                                        </div>

                                        <div
                                            className={`grid gap-6 ${
                                                viewMode === "grid"
                                                    ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                                                    : "grid-cols-1"
                                            }`}
                                        >
                                            {completed.map((course) => (
                                                <CourseCard key={course._id} course={course} viewMode={viewMode} />
                                            ))}
                                        </div>
                                    </section>
                                )}
                            </>
                        ) : (
                            /* Single section for filtered results */
                            <section>
                                <div className="flex items-center gap-3 mb-8">
                                    <div
                                        className={`p-3 text-white rounded-2xl shadow-lg ${
                                            filterBy === "progress"
                                                ? "bg-gradient-to-br from-indigo-500 to-purple-600"
                                                : "bg-gradient-to-br from-emerald-500 to-teal-600"
                                        }`}
                                    >
                                        {filterBy === "progress" ? <TrendingUp size={24} /> : <Award size={24} />}
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-800">
                                            {filterBy === "progress" ? "In Progress Courses" : "Completed Courses"}
                                        </h2>
                                        <p className="text-gray-500">
                                            {filteredCourses.length}{" "}
                                            {filterBy === "progress" ? "courses in progress" : "certificates earned"}
                                        </p>
                                    </div>
                                </div>

                                {filteredCourses.length > 0 ? (
                                    <div
                                        className={`grid gap-6 ${
                                            viewMode === "grid"
                                                ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                                                : "grid-cols-1"
                                        }`}
                                    >
                                        {filteredCourses.map((course) => (
                                            <CourseCard key={course._id} course={course} viewMode={viewMode} />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12 bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl border-2 border-dashed border-gray-200">
                                        <div className="bg-gray-200 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                                            <Search className="text-gray-400" size={24} />
                                        </div>
                                        <p className="text-gray-500 text-lg">
                                            No {filterBy === "progress" ? "in progress" : "completed"} courses match your
                                            search
                                        </p>
                                    </div>
                                )}
                            </section>
                        )}

                        {/* Show message when no courses match any filter */}
                        {filteredCourses.length === 0 && (searchQuery || filterBy !== "all") && (
                            <div className="text-center py-12 bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl border-2 border-dashed border-gray-200">
                                <div className="bg-gray-200 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                                    <Search className="text-gray-400" size={24} />
                                </div>
                                <p className="text-gray-500 text-lg">No courses match your current filters</p>
                                <button
                                    onClick={() => {
                                        setSearchQuery("");
                                        setFilterBy("all");
                                    }}
                                    className="mt-4 text-indigo-600 hover:text-indigo-700 font-semibold"
                                >
                                    Clear filters
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default MyCourses;
