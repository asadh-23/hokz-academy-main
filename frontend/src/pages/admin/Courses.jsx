import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { Search, X, Layers, Hash } from "lucide-react";
import {
    fetchAdminCourses,
    setAdminCourseFilters,
    clearAdminCourseFilters,
    setAdminCoursePage,
    selectAdminCourses,
    selectAdminCourseLoading,
    selectAdminCourseFilters,
    selectAdminCoursePagination,
    selectAdminAllCategories,
    fetchAdminAllCategories,
} from "../../store/features/admin/adminCourseSlice";

// Components
import CourseStatsCards from "../../components/admin/courses/CourseStatsCards";
import CourseFilters from "../../components/admin/courses/CourseFilters";
import CourseGrid from "../../components/admin/courses/CourseGrid";
import CourseEmptyState from "../../components/admin/courses/CourseEmptyState";
import Pagination from "../../components/common/Pagination";

const Courses = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    
    // Redux selectors
    const courses = useSelector(selectAdminCourses);
    const loading = useSelector(selectAdminCourseLoading);
    const filters = useSelector(selectAdminCourseFilters);
    const pagination = useSelector(selectAdminCoursePagination);
    const categories = useSelector(selectAdminAllCategories);

    // 1. Fetch Categories (For Dropdown)
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                await dispatch(fetchAdminAllCategories()).unwrap(); 
            } catch (err) {
                console.error("Failed to load categories");
            }
        };
        fetchCategories();
    }, [dispatch]);

    // 2. Fetch Courses (Debounced)
    useEffect(() => {
        const fetchCourses = async () => {
            try {
                await dispatch(fetchAdminCourses(filters)).unwrap();
            } catch (err) {
                console.error("Fetch Error:", err);
                toast.error("Failed to fetch courses");
            }
        };

        // Debounce for search
        const timer = setTimeout(() => {
            fetchCourses();
        }, 500);

        return () => clearTimeout(timer);
    }, [dispatch, filters]);

    // Handlers
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        dispatch(setAdminCourseFilters({ [name]: value }));
    };

    const handleCategorySelect = (categoryId) => {
        dispatch(setAdminCourseFilters({ categoryId }));
    };

    const clearFilters = () => {
        dispatch(clearAdminCourseFilters());
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= pagination.totalPages) {
            dispatch(setAdminCoursePage(newPage));
        }
    };

    // Helper: Currency Formatter
    const formatCurrency = (amount) =>
        new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0,
        }).format(amount);

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            {/* Header */}
            <div className="mb-8">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Course Management</h1>
                        <p className="text-gray-600">
                            Manage and monitor all courses on the platform
                        </p>
                    </div>
                    
                    {/* Stats */}
                    <CourseStatsCards 
                        totalCourses={pagination.totalCourses}
                        publishedCourses={courses.filter(c => c.isListed).length}
                    />
                </div>
            </div>

            {/* Search Bar */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
                {/* Header */}
                <div className="bg-gradient-to-r from-emerald-50 to-teal-50 px-6 py-4 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-emerald-100 rounded-lg">
                            <Search className="w-5 h-5 text-emerald-600" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">Search Courses</h3>
                            <p className="text-sm text-gray-600">Find courses by title, description, or instructor name</p>
                        </div>
                    </div>
                </div>

                {/* Search Input */}
                <div className="p-6">
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-500 w-5 h-5 transition-colors duration-200" />
                        <input
                            type="text"
                            name="search"
                            value={filters.search}
                            onChange={handleFilterChange}
                            placeholder="Type to search courses, instructors, or keywords..."
                            className="w-full pl-12 pr-12 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm bg-gray-50 focus:bg-white transition-all duration-200 placeholder-gray-400 shadow-sm"
                        />
                        {filters.search && (
                            <button
                                onClick={() => dispatch(setAdminCourseFilters({ search: "" }))}
                                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors duration-200"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        )}
                    </div>

                    {/* Search Results Info */}
                    {filters.search && (
                        <div className="mt-4 p-3 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg border border-emerald-100">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                                <span className="text-sm font-medium text-emerald-800">
                                    Searching for: "{filters.search}"
                                </span>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Category Tabs */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
                {/* Header */}
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 px-6 py-4 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-100 rounded-lg">
                            <Layers className="w-5 h-5 text-indigo-600" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">Browse by Category</h3>
                            <p className="text-sm text-gray-600">Filter courses by their categories</p>
                        </div>
                    </div>
                </div>

                {/* Category Tabs */}
                <div className="p-6">
                    <div className="flex flex-wrap gap-3">
                        {/* All Categories Tab */}
                        <button
                            onClick={() => handleCategorySelect("")}
                            className={`
                                flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 
                                ${!filters.categoryId 
                                    ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/25 transform scale-105' 
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md'
                                }
                            `}
                        >
                            <Hash className="w-4 h-4" />
                            All Categories
                            <span className={`
                                px-2 py-0.5 rounded-full text-xs font-semibold
                                ${!filters.categoryId 
                                    ? 'bg-white/20 text-white' 
                                    : 'bg-gray-200 text-gray-600'
                                }
                            `}>
                                All
                            </span>
                        </button>

                        {/* Individual Category Tabs */}
                        {categories.map((category) => (
                            <button
                                key={category._id}
                                onClick={() => handleCategorySelect(category._id)}
                                className={`
                                    flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 
                                    ${filters.categoryId === category._id
                                        ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/25 transform scale-105' 
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md'
                                    }
                                `}
                            >
                                <Layers className="w-4 h-4" />
                                {category.name}
                                {category.courseCount && (
                                    <span className={`
                                        px-2 py-0.5 rounded-full text-xs font-semibold
                                        ${filters.categoryId === category._id
                                            ? 'bg-white/20 text-white' 
                                            : 'bg-gray-200 text-gray-600'
                                        }
                                    `}>
                                        {category.courseCount}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Selected Category Info */}
                    {filters.categoryId && (
                        <div className="mt-4 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg border border-emerald-100">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                                <span className="text-sm font-medium text-emerald-800">
                                    Showing courses in: {categories.find(cat => cat._id === filters.categoryId)?.name}
                                </span>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Filters */}
            <CourseFilters 
                filters={filters}
                onFilterChange={handleFilterChange}
                onClearFilters={clearFilters}
            />

            {/* Course Grid or Empty State */}
            {!loading && courses.length === 0 ? (
                <CourseEmptyState onClearFilters={clearFilters} />
            ) : (
                <CourseGrid 
                    courses={courses}
                    formatCurrency={formatCurrency}
                    navigate={navigate}
                    loading={loading}
                />
            )}

            {/* Pagination */}
            {!loading && courses.length > 0 && (
                <Pagination 
                    currentPage={filters.page}
                    totalPages={pagination.totalPages}
                    totalItems={pagination.totalCourses}
                    itemsPerPage={filters.limit}
                    onPageChange={handlePageChange}
                    label="Courses"
                />
            )}
        </div>
    );
};

export default Courses;
