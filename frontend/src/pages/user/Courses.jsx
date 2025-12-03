import { useState, useEffect, useRef, useMemo } from "react";
import { Search, Star, SlidersHorizontal, Heart, X, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import {
    fetchUserCourses,
    fetchUserListedCategories,
    setUserCourseFilters,
    clearUserCourseFilters,
    selectUserCourses,
    selectUserCategories,
    selectUserCourseFilters,
    selectUserCoursePagination,
    selectUserCoursesLoading,
} from "../../store/features/user/userCoursesSlice";
import {
    toggleUserWishlist,
    fetchUserWishlist,
    selectUserWishlist,
    selectUserWishlistLoadingById,
} from "../../store/features/user/userWishlistSlice";
import Pagination from "../../components/common/Pagination";
import { Link } from "react-router-dom";

const Courses = () => {
    const dispatch = useDispatch();
    const filterDropdownRef = useRef(null);

    // Redux selectors
    const courses = useSelector(selectUserCourses);
    const categories = useSelector(selectUserCategories);
    const filters = useSelector(selectUserCourseFilters);
    const pagination = useSelector(selectUserCoursePagination);
    const loading = useSelector(selectUserCoursesLoading);

    const wishlist = useSelector(selectUserWishlist);
    const loadingById = useSelector(selectUserWishlistLoadingById);

    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [tempFilters, setTempFilters] = useState({
        minPrice: "",
        maxPrice: "",
        sort: "",
    });

    // Fetch categories and wishlist on mount
    useEffect(() => {
        dispatch(fetchUserListedCategories());
        dispatch(fetchUserWishlist());
    }, [dispatch]);

    // Fetch courses when filters change
    useEffect(() => {
        const fetchCourses = async () => {
            const params = {
                search: filters.search,
                category: filters.category,
                sort: filters.sort,
                minPrice: filters.minPrice,
                maxPrice: filters.maxPrice,
                page: filters.page,
                limit: filters.limit,
            };

            try {
                await dispatch(fetchUserCourses(params)).unwrap();
            } catch (error) {
                toast.error(error || "Failed to load courses");
            }
        };

        fetchCourses();
    }, [dispatch, filters]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (filterDropdownRef.current && !filterDropdownRef.current.contains(event.target)) {
                setIsFilterOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Sync temp filters with Redux filters
    useEffect(() => {
        setTempFilters({
            minPrice: filters.minPrice,
            maxPrice: filters.maxPrice,
            sort: filters.sort,
        });
    }, [filters]);

    const handleSearchChange = (e) => {
        dispatch(setUserCourseFilters({ search: e.target.value }));
    };

    const handleCategoryClick = (categoryId) => {
        dispatch(setUserCourseFilters({ category: categoryId }));
    };

    const handleTempFilterChange = (field, value) => {
        setTempFilters((prev) => ({ ...prev, [field]: value }));
    };

    const handleApplyFilters = () => {
        dispatch(setUserCourseFilters(tempFilters));
        setIsFilterOpen(false);
    };

    const handleClearFilters = () => {
        dispatch(clearUserCourseFilters());
        setTempFilters({ minPrice: "", maxPrice: "", sort: "" });
        setIsFilterOpen(false);
    };

    const handlePageChange = (page) => {
        dispatch(setUserCourseFilters({ page }));
    };

    const handleToggleWishlist = async (courseId, title) => {
        try {
            const result = await dispatch(toggleUserWishlist(courseId)).unwrap();
            if (result.action === "added") {
                toast.success(`${title} Added to wishlist`);
            } else {
                toast.success(`${title} Removed from wishlist`);
            }
        } catch (error) {
            toast.error(error || "Failed to update wishlist");
        }
    };

    const wishlistCourseIds = useMemo(() => {
        if (!Array.isArray(wishlist)) return new Set();

        return new Set(wishlist.map((item) => item.course?._id));
    }, [wishlist]);

    // Now checking is Instant
    const isInWishlist = (courseId) => {
        return wishlistCourseIds.has(courseId);
    };

    const sortOptions = [
        { value: "", label: "Default" },
        { value: "newest", label: "Newest First" },
        { value: "oldest", label: "Oldest First" },
        { value: "low-high", label: "Price: Low to High" },
        { value: "high-low", label: "Price: High to Low" },
    ];

    const hasActiveFilters = filters.minPrice || filters.maxPrice || filters.sort;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            {/* Header Section */}
            <div className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="mb-6">
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-600 to-emerald-600 bg-clip-text text-transparent mb-2">
                            Discover Courses
                        </h1>
                        <p className="text-gray-600">Learn from expert tutors and advance your skills</p>
                    </div>

                    {/* Search Bar with Filter Button */}
                    <div className="flex gap-3">
                        <div className="relative flex-1">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Search className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                className="block w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                                placeholder="Search for courses..."
                                value={filters.search}
                                onChange={handleSearchChange}
                            />
                        </div>

                        {/* Filter Dropdown Button */}
                        <div className="relative" ref={filterDropdownRef}>
                            <button
                                onClick={() => setIsFilterOpen(!isFilterOpen)}
                                className={`flex items-center gap-2 px-6 py-3.5 rounded-xl font-medium transition-all ${
                                    hasActiveFilters
                                        ? "bg-gradient-to-r from-cyan-500 to-emerald-500 text-white shadow-lg"
                                        : "bg-white border-2 border-gray-300 text-gray-700 hover:border-cyan-500"
                                }`}
                            >
                                <SlidersHorizontal className="h-5 w-5" />
                                <span>Filters</span>
                                {hasActiveFilters && (
                                    <span className="bg-white text-cyan-600 text-xs font-bold px-2 py-0.5 rounded-full">
                                        Active
                                    </span>
                                )}
                            </button>

                            {/* Filter Dropdown */}
                            {isFilterOpen && (
                                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                                    <div className="p-5">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="text-lg font-bold text-gray-900">Filter Options</h3>
                                            <button
                                                onClick={() => setIsFilterOpen(false)}
                                                className="text-gray-400 hover:text-gray-600 transition-colors"
                                            >
                                                <X className="h-5 w-5" />
                                            </button>
                                        </div>

                                        {/* Sort By */}
                                        <div className="mb-4">
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Sort By
                                            </label>
                                            <div className="relative">
                                                <select
                                                    value={tempFilters.sort}
                                                    onChange={(e) => handleTempFilterChange("sort", e.target.value)}
                                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 appearance-none bg-white cursor-pointer"
                                                >
                                                    {sortOptions.map((option) => (
                                                        <option key={option.value} value={option.value}>
                                                            {option.label}
                                                        </option>
                                                    ))}
                                                </select>
                                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                                            </div>
                                        </div>

                                        {/* Price Range */}
                                        <div className="mb-5">
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Price Range
                                            </label>
                                            <div className="grid grid-cols-2 gap-3">
                                                <div>
                                                    <input
                                                        type="number"
                                                        placeholder="Min ₹"
                                                        value={tempFilters.minPrice}
                                                        onChange={(e) => handleTempFilterChange("minPrice", e.target.value)}
                                                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                                    />
                                                </div>
                                                <div>
                                                    <input
                                                        type="number"
                                                        placeholder="Max ₹"
                                                        value={tempFilters.maxPrice}
                                                        onChange={(e) => handleTempFilterChange("maxPrice", e.target.value)}
                                                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex gap-2">
                                            <button
                                                onClick={handleClearFilters}
                                                className="flex-1 px-4 py-2.5 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                                            >
                                                Clear
                                            </button>
                                            <button
                                                onClick={handleApplyFilters}
                                                className="flex-1 px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-emerald-500 text-white rounded-lg font-medium hover:from-cyan-600 hover:to-emerald-600 transition-all shadow-md"
                                            >
                                                Apply
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Category Pills */}
                <div className="mb-8">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">Browse by Category</h2>
                    <div className="flex flex-wrap gap-3">
                        <button
                            onClick={() => handleCategoryClick("")}
                            className={`px-5 py-2.5 rounded-full font-medium transition-all ${
                                filters.category === ""
                                    ? "bg-gradient-to-r from-cyan-500 to-emerald-500 text-white shadow-lg scale-105"
                                    : "bg-white text-gray-700 border-2 border-gray-300 hover:border-cyan-500"
                            }`}
                        >
                            All Categories
                        </button>
                        {categories.map((cat) => (
                            <button
                                key={cat._id}
                                onClick={() => handleCategoryClick(cat._id)}
                                className={`px-5 py-2.5 rounded-full font-medium transition-all ${
                                    filters.category === cat._id
                                        ? "bg-gradient-to-r from-cyan-500 to-emerald-500 text-white shadow-lg scale-105"
                                        : "bg-white text-gray-700 border-2 border-gray-300 hover:border-cyan-500"
                                }`}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Course Grid */}
                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="relative">
                            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-cyan-600"></div>
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                                <div className="h-8 w-8 bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-full"></div>
                            </div>
                        </div>
                    </div>
                ) : courses.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {courses.map((course) => (
                                <Link
                                    to={`/user/courses/${course._id}`}
                                    key={course._id}
                                    className="group bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col cursor-pointer transform hover:-translate-y-2"
                                >
                                    {/* Course Image */}
                                    <div className="relative h-48 overflow-hidden bg-gradient-to-br from-gray-200 to-gray-300">
                                        <img
                                            src={course.thumbnailUrl}
                                            alt={course.title}
                                            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                                        />

                                        {course.offerPercentage > 0 && (
                                            <div className="absolute top-3 left-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-lg">
                                                {course.offerPercentage}% OFF
                                            </div>
                                        )}

                                        <button
                                            disabled={loadingById[course._id]}
                                            className="absolute top-3 right-3 p-2.5 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all group/heart"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                handleToggleWishlist(course._id, course.title);
                                            }}
                                        >
                                            {loadingById[course._id] ? (
                                                <div className="w-5 h-5 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                                            ) : (
                                                <Heart
                                                    className={`w-5 h-5 transition-all ${
                                                        isInWishlist(course._id)
                                                            ? "text-red-500 fill-red-500"
                                                            : "text-gray-700 group-hover/heart:text-red-500 group-hover/heart:fill-red-500"
                                                    }`}
                                                />
                                            )}
                                        </button>
                                    </div>

                                    {/* Course Details */}
                                    <div className="p-5 flex-1 flex flex-col">
                                        <div className="mb-2">
                                            <span className="inline-block bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 px-3 py-1 rounded-full text-xs font-semibold">
                                                {course.category?.name}
                                            </span>
                                        </div>

                                        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 leading-tight group-hover:text-cyan-600 transition-colors">
                                            {course.title}
                                        </h3>

                                        <p className="text-gray-500 text-sm mb-3 line-clamp-1">
                                            {course.tutor?.fullName || "Unknown Instructor"}
                                        </p>

                                        <div className="flex items-center gap-1 mb-4">
                                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                            <span className="text-sm font-semibold text-gray-900">
                                                {course.rating || "4.5"}
                                            </span>
                                            <span className="text-sm text-gray-500">({course.reviews || "0"})</span>
                                        </div>

                                        <div className="mt-auto pt-4 border-t border-gray-100">
                                            <div className="flex items-center gap-2">
                                                <span className="text-2xl font-bold bg-gradient-to-r from-cyan-600 to-emerald-600 bg-clip-text text-transparent">
                                                    ₹
                                                    {Math.round(
                                                        course.price - (course.price * course.offerPercentage) / 100
                                                    )}
                                                </span>

                                                {course.offerPercentage > 0 && (
                                                    <span className="text-base text-gray-400 line-through">
                                                        ₹{course.price}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>

                        {/* Pagination */}
                        <Pagination
                            currentPage={pagination.currentPage}
                            totalPages={pagination.totalPages}
                            totalItems={pagination.totalItems}
                            itemsPerPage={filters.limit}
                            onPageChange={handlePageChange}
                            label="Courses"
                        />
                    </>
                ) : (
                    <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-gray-300">
                        <div className="mx-auto h-20 w-20 text-gray-300 mb-4">
                            <Search size={80} strokeWidth={1.5} />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">No courses found</h3>
                        <p className="text-gray-500 mb-6 max-w-md mx-auto">
                            Try adjusting your search or filters to find what you're looking for.
                        </p>
                        <button
                            onClick={handleClearFilters}
                            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-cyan-500 to-emerald-500 text-white font-semibold rounded-xl hover:from-cyan-600 hover:to-emerald-600 transition-all shadow-lg"
                        >
                            Clear all filters
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Courses;
