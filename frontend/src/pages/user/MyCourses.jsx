import React, { useEffect, useState } from "react";
import { Search, TrendingUp, Award, BookOpen, Star, Grid, List, ChevronRight, PlayCircle } from "lucide-react";
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
    }, [dispatch, navigate]);

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
        <div className="min-h-screen bg-[#FDFDFD]">
            {/* --- BRANDED HERO SECTION --- */}
            <div className="relative bg-[#1E2EDE] overflow-hidden pt-12 pb-24 md:pt-16 md:pb-32 px-6">
                {/* Decorative Brand Shapes */}
                <div className="absolute top-0 right-0 w-72 h-72 bg-[#14C4E7] opacity-10 rounded-full -translate-y-24 translate-x-24"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#E6D929] opacity-10 rounded-full translate-y-12 -translate-x-12"></div>

                <div className="relative max-w-7xl mx-auto z-10 text-center">
                    <h1 className="text-4xl md:text-6xl font-black text-[#FDFDFD] tracking-tight mb-4">
                        My Learning <span className="text-[#E6D929]">Journey</span>
                    </h1>
                    <p className="text-[#FDFDFD]/70 text-lg font-medium max-w-2xl mx-auto mb-12 uppercase tracking-widest text-sm">
                        Continue your path to excellence
                    </p>

                    {/* STATISTICS CARDS - Floating style */}
                    {totalCourses > 0 && (
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 max-w-6xl mx-auto">
                            {[
                                { icon: <BookOpen />, label: "Total Courses", val: totalCourses, color: "#14C4E7" },
                                { icon: <TrendingUp />, label: "In Progress", val: inProgressCount, color: "#E6D929" },
                                { icon: <Award />, label: "Completed", val: completedCount, color: "#14C4E7" },
                                { icon: <Star />, label: "Avg Progress", val: `${averageProgress}%`, color: "#E6D929" },
                            ].map((stat, i) => (
                                <div
                                    key={i}
                                    className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-[2rem] flex flex-col items-center transition-transform hover:scale-105"
                                >
                                    <div
                                        className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                                        style={{ backgroundColor: stat.color, color: "#1E2EDE" }}
                                    >
                                        {stat.icon}
                                    </div>
                                    <div className="text-2xl font-black text-[#FDFDFD]">{stat.val}</div>
                                    <div className="text-[#FDFDFD]/60 text-[10px] font-black uppercase tracking-widest mt-1">
                                        {stat.label}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* --- MAIN CONTENT AREA --- */}
            <div className="max-w-7xl mx-auto px-6 -mt-12 relative z-20 pb-20">
                {/* SEARCH & FILTERS BAR */}
                <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-blue-900/5 p-4 md:p-6 border border-slate-50 mb-12">
                    <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
                        {/* Search Input */}
                        <div className="relative w-full lg:max-w-md group">
                            <Search
                                className="absolute left-6 top-1/2 -translate-y-1/2 text-[#14C4E7] group-focus-within:scale-110 transition-transform"
                                size={20}
                            />
                            <input
                                type="text"
                                placeholder="Search your library..."
                                className="w-full pl-14 pr-6 py-4 bg-slate-50 border-2 border-transparent focus:border-[#1E2EDE] rounded-2xl outline-none font-bold text-[#1E2EDE] transition-all"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        {/* Controls */}
                        <div className="flex items-center gap-4 w-full lg:w-auto">
                            <select
                                value={filterBy}
                                onChange={(e) => setFilterBy(e.target.value)}
                                className="flex-1 lg:flex-none px-6 py-4 bg-slate-50 border-none rounded-2xl font-black text-[10px] uppercase tracking-widest text-[#1E2EDE] focus:ring-2 focus:ring-[#14C4E7] outline-none cursor-pointer"
                            >
                                <option value="all">All Library</option>
                                <option value="progress">Ongoing</option>
                                <option value="completed">Completed</option>
                            </select>

                            <div className="flex bg-slate-100 rounded-2xl p-1.5">
                                <button
                                    onClick={() => setViewMode("grid")}
                                    className={`p-3 rounded-xl transition-all ${viewMode === "grid" ? "bg-white shadow-md text-[#1E2EDE]" : "text-slate-400 hover:text-[#1E2EDE]"}`}
                                >
                                    <Grid size={20} />
                                </button>
                                <button
                                    onClick={() => setViewMode("list")}
                                    className={`p-3 rounded-xl transition-all ${viewMode === "list" ? "bg-white shadow-md text-[#1E2EDE]" : "text-slate-400 hover:text-[#1E2EDE]"}`}
                                >
                                    <List size={20} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- COURSE LISTINGS --- */}
                {courses?.length === 0 ? (
                    <div className="bg-white rounded-[3rem] p-16 text-center border-4 border-dashed border-slate-50">
                        <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                            <BookOpen size={40} className="text-slate-300" />
                        </div>
                        <h2 className="text-2xl font-black text-[#1E2EDE] mb-2 uppercase tracking-tight">Library Empty</h2>
                        <p className="text-slate-400 font-medium mb-10 max-w-sm mx-auto">
                            You haven't embarked on a learning path yet. Explore our expert-led courses.
                        </p>
                        <button
                            onClick={() => navigate("/user/courses")}
                            className="bg-[#1E2EDE] text-[#E6D929] font-black px-10 py-4 rounded-2xl transition-all transform hover:scale-105 shadow-xl shadow-blue-200 uppercase text-xs tracking-widest"
                        >
                            Explore Courses
                        </button>
                    </div>
                ) : (
                    <div className="space-y-16">
                        {filterBy === "all" ? (
                            <>
                                {/* In Progress Section */}
                                {enrolled.length > 0 && (
                                    <section>
                                        <div className="flex items-center justify-between mb-8 border-l-4 border-[#14C4E7] pl-5">
                                            <div>
                                                <h2 className="text-2xl font-black text-[#1E2EDE]">Continue Learning</h2>
                                                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">
                                                    {enrolled.length} Modules in Progress
                                                </p>
                                            </div>
                                            <TrendingUp className="text-[#14C4E7]" size={32} />
                                        </div>
                                        <div
                                            className={`grid gap-8 ${viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3" : "grid-cols-1"}`}
                                        >
                                            {enrolled.map((course) => (
                                                <CourseCard key={course._id} course={course} viewMode={viewMode} />
                                            ))}
                                        </div>
                                    </section>
                                )}

                                {/* Completed Section */}
                                {completed.length > 0 && (
                                    <section>
                                        <div className="flex items-center justify-between mb-8 border-l-4 border-[#E6D929] pl-5">
                                            <div>
                                                <h2 className="text-2xl font-black text-[#1E2EDE]">Completed Courses</h2>
                                                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">
                                                    Total {completed.length} courses completed
                                                </p>
                                            </div>
                                            <Award className="text-[#E6D929]" size={32} />
                                        </div>
                                        <div
                                            className={`grid gap-8 ${viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3" : "grid-cols-1"}`}
                                        >
                                            {completed.map((course) => (
                                                <CourseCard key={course._id} course={course} viewMode={viewMode} />
                                            ))}
                                        </div>
                                    </section>
                                )}
                            </>
                        ) : (
                            /* Filtered Single View */
                            <section>
                                <div className="flex items-center justify-between mb-8 border-l-4 border-[#14C4E7] pl-5">
                                    <div>
                                        <h2 className="text-2xl font-black text-[#1E2EDE]">
                                            {filterBy === "progress" ? "Current Studies" : "Achievements"}
                                        </h2>
                                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">
                                            {filteredCourses.length}{" "}
                                            {filterBy === "progress" ? "In Progress" : "Completed Items"}
                                        </p>
                                    </div>
                                    {filterBy === "progress" ? (
                                        <PlayCircle className="text-[#14C4E7]" size={32} />
                                    ) : (
                                        <Award className="text-[#E6D929]" size={32} />
                                    )}
                                </div>

                                {filteredCourses.length > 0 ? (
                                    <div
                                        className={`grid gap-8 ${viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3" : "grid-cols-1"}`}
                                    >
                                        {filteredCourses.map((course) => (
                                            <CourseCard key={course._id} course={course} viewMode={viewMode} />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-20 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
                                        <Search className="text-slate-200 mx-auto mb-4" size={48} />
                                        <p className="text-[#1E2EDE] font-black uppercase text-xs tracking-widest">
                                            No matching courses found
                                        </p>
                                    </div>
                                )}
                            </section>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyCourses;
