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
import CategoryTabs from "../../components/admin/courses/CategoryTabs";

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
        <div className="min-h-screen bg-[#FDFDFD] p-4 md:p-8">
            {/* Header Section */}
            <div className="mb-10">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-black text-[#1E2EDE] tracking-tight mb-2">
                            COURSE <span className="text-[#14C4E7]">MANAGEMENT</span>
                        </h1>
                        <div className="flex items-center gap-2">
                            <div className="h-1 w-12 bg-[#E6D929] rounded-full"></div>
                            <p className="text-gray-500 font-medium">Platform-wide curriculum oversight</p>
                        </div>
                    </div>

                    <CourseStatsCards
                        totalCourses={pagination.totalCourses}
                        publishedCourses={courses.filter((c) => c.isListed).length}
                    />
                </div>
            </div>

            {/* Search Bar */}
            <div className="bg-white rounded-[2rem] shadow-xl shadow-blue-900/5 border border-gray-100 overflow-hidden mb-8">
                <div className="bg-gradient-to-r from-[#1E2EDE] to-[#14C4E7] px-8 py-6">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md">
                            <Search className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white">Search Inventory</h3>
                            <p className="text-blue-100 text-sm opacity-80">
                                Locate courses via title, keywords, or instructors
                            </p>
                        </div>
                    </div>
                </div>

                <div className="p-8">
                    <div className="relative group">
                        <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-[#14C4E7] group-focus-within:text-[#1E2EDE] w-5 h-5 transition-colors" />
                        <input
                            type="text"
                            name="search"
                            value={filters.search}
                            onChange={handleFilterChange}
                            placeholder="Search for courses or tutors..."
                            className="w-full pl-14 pr-12 py-4.5 bg-gray-50 border-2 border-transparent rounded-[1.5rem] focus:bg-white focus:border-[#14C4E7] focus:ring-4 focus:ring-[#14C4E7]/10 outline-none transition-all font-medium text-gray-700"
                        />
                        {filters.search && (
                            <button
                                onClick={() => dispatch(setAdminCourseFilters({ search: "" }))}
                                className="absolute right-5 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Category Management */}
            <CategoryTabs
                categories={categories}
                selectedCategoryId={filters.categoryId}
                onCategorySelect={handleCategorySelect}
            />

            {/* Filters Section */}
            <CourseFilters filters={filters} onFilterChange={handleFilterChange} onClearFilters={clearFilters} />

            {/* Main Content Area */}
            <div className="mt-8">
                {!loading && courses.length === 0 ? (
                    <CourseEmptyState onClearFilters={clearFilters} />
                ) : (
                    <CourseGrid courses={courses} formatCurrency={formatCurrency} navigate={navigate} loading={loading} />
                )}
            </div>

            {/* Pagination */}
            {!loading && courses.length > 0 && (
                <div className="mt-12 bg-white p-4 rounded-[1.5rem] shadow-sm border border-gray-100">
                    <Pagination
                        currentPage={filters.page}
                        totalPages={pagination.totalPages}
                        totalItems={pagination.totalCourses}
                        itemsPerPage={filters.limit}
                        onPageChange={handlePageChange}
                        label="Courses"
                    />
                </div>
            )}
        </div>
    );
};

export default Courses;
