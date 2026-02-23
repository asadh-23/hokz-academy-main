import { useState, useEffect, useRef, useMemo } from "react";
import { Search, SlidersHorizontal, X, ChevronDown, Star, Heart, BookOpen, Clock } from "lucide-react";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import {
    fetchUserCourses,
    setUserCourseFilters,
    clearUserCourseFilters,
    selectUserCourses,
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
import { fetchListedCategories, selectListedCategories } from "../../store/features/public/categorySlice";
import { selectUserIsAuthenticated } from "../../store/features/auth/userAuthSlice";

const Courses = () => {
    const dispatch = useDispatch();
    const filterDropdownRef = useRef(null);

    const isAuthenticated = useSelector(selectUserIsAuthenticated);
    // Redux selectors
    const courses = useSelector(selectUserCourses);
    const categories = useSelector(selectListedCategories);
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
        dispatch(fetchListedCategories());
        // Only fetch wishlist if user is authenticated
        if (isAuthenticated) {
            dispatch(fetchUserWishlist());
        }
    }, [dispatch, isAuthenticated]);

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
        // Prevent wishlist actions if not authenticated
        if (!isAuthenticated) {
            toast.error("Please login to add courses to wishlist");
            return;
        }

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
        // Only process wishlist if authenticated
        if (!isAuthenticated || !Array.isArray(wishlist)) return new Set();

        return new Set(wishlist.map((item) => item.course?._id));
    }, [wishlist, isAuthenticated]);

    // Now checking is Instant
    const isInWishlist = (courseId) => {
        // Return false if not authenticated
        if (!isAuthenticated) return false;
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
        <div className="min-h-screen bg-[#FDFDFD]">
            {/* --- SEARCH & DISCOVER HEADER --- */}
            <section className="py-12 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
                        <div className="max-w-xl">
                            <h1 className="text-4xl md:text-5xl font-black text-[#1E2EDE] leading-tight">
                                Master New <span className="text-[#14C4E7]">Skills</span> <br />
                                with Hokz Academy
                            </h1>
                            <p className="mt-4 text-slate-500 font-medium">
                                Join over 5,000 students learning from top-tier professionals.
                            </p>
                        </div>

                        {/* Interactive Search Bar */}
                        <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
                            <div className="relative w-full sm:w-80 md:w-96">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#14C4E7]" size={20} />
                                <input
                                    type="text"
                                    value={filters.search}
                                    onChange={handleSearchChange}
                                    placeholder="Search for subjects..."
                                    className="w-full pl-12 pr-4 py-4 bg-white border-2 border-slate-100 rounded-2xl focus:border-[#1E2EDE] focus:ring-0 transition-all font-bold text-[#1E2EDE] shadow-sm"
                                />
                            </div>

                            {/* Filter Dropdown Logic */}
                            <div className="relative w-full sm:w-auto" ref={filterDropdownRef}>
                                <button
                                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                                    className={`w-full flex items-center justify-center gap-2 px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-md active:scale-95 ${
                                        hasActiveFilters
                                            ? "bg-[#E6D929] text-[#1E2EDE]"
                                            : "bg-[#1E2EDE] text-white hover:bg-[#14C4E7]"
                                    }`}
                                >
                                    <SlidersHorizontal size={18} />
                                    <span>Filter</span>
                                </button>

                                {isFilterOpen && (
                                    <div className="absolute right-0 mt-4 w-full sm:w-80 bg-white rounded-3xl shadow-2xl border border-slate-100 z-[100] p-6 animate-in fade-in zoom-in-95">
                                        <div className="flex justify-between items-center mb-6">
                                            <h4 className="font-black text-[#1E2EDE] uppercase text-xs tracking-widest">
                                                Sort & Filter
                                            </h4>
                                            <button onClick={() => setIsFilterOpen(false)}>
                                                <X size={20} className="text-slate-300 hover:text-red-500" />
                                            </button>
                                        </div>

                                        <div className="space-y-6">
                                            <div>
                                                <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">
                                                    Sort Order
                                                </label>
                                                <div className="relative">
                                                    <select
                                                        value={tempFilters.sort}
                                                        onChange={(e) => handleTempFilterChange("sort", e.target.value)}
                                                        className="w-full p-3 bg-slate-50 border-none rounded-xl font-bold text-[#1E2EDE] appearance-none cursor-pointer"
                                                    >
                                                        {sortOptions.map((opt) => (
                                                            <option key={opt.value} value={opt.value}>
                                                                {opt.label}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    <ChevronDown
                                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#1E2EDE]"
                                                        size={16}
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">
                                                    Price Range (₹)
                                                </label>
                                                <div className="flex gap-2">
                                                    <input
                                                        type="number"
                                                        placeholder="Min"
                                                        value={tempFilters.minPrice}
                                                        onChange={(e) => handleTempFilterChange("minPrice", e.target.value)}
                                                        className="w-1/2 p-3 bg-slate-50 border-none rounded-xl font-bold text-[#1E2EDE]"
                                                    />
                                                    <input
                                                        type="number"
                                                        placeholder="Max"
                                                        value={tempFilters.maxPrice}
                                                        onChange={(e) => handleTempFilterChange("maxPrice", e.target.value)}
                                                        className="w-1/2 p-3 bg-slate-50 border-none rounded-xl font-bold text-[#1E2EDE]"
                                                    />
                                                </div>
                                            </div>

                                            <div className="flex gap-2 pt-2">
                                                <button
                                                    onClick={handleClearFilters}
                                                    className="flex-1 py-3 font-black text-[10px] uppercase text-slate-400 hover:text-[#1E2EDE]"
                                                >
                                                    Reset
                                                </button>
                                                <button
                                                    onClick={handleApplyFilters}
                                                    className="flex-2 bg-[#1E2EDE] text-[#E6D929] px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-blue-100"
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
            </section>

            {/* --- CATEGORY SELECTOR --- */}
            <div className="max-w-7xl mx-auto px-4 mb-12">
                <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar">
                    <button
                        onClick={() => handleCategoryClick("")}
                        className={`shrink-0 px-6 py-3 rounded-full font-black text-[10px] uppercase tracking-widest transition-all ${
                            filters.category === ""
                                ? "bg-[#14C4E7] text-white shadow-lg"
                                : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                        }`}
                    >
                        All Classes
                    </button>
                    {categories.map((cat) => (
                        <button
                            key={cat._id}
                            onClick={() => handleCategoryClick(cat._id)}
                            className={`shrink-0 px-6 py-3 rounded-full font-black text-[10px] uppercase tracking-widest transition-all ${
                                filters.category === cat._id
                                    ? "bg-[#14C4E7] text-white shadow-lg"
                                    : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                            }`}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* --- MAIN GRID --- */}
            <div className="max-w-7xl mx-auto px-4 pb-20">
                {loading ? (
                    <div className="flex justify-center items-center py-40">
                        <div className="w-12 h-12 border-4 border-[#14C4E7] border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : courses.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {courses.map((course) => (
                            <Link
                                to={`/user/courses/${course._id}`}
                                key={course._id}
                                className="group bg-[#FDFDFD] rounded-[2.5rem] border border-slate-100 flex flex-col hover:shadow-[0_20px_50px_rgba(30,46,222,0.1)] transition-all duration-500 overflow-hidden relative"
                            >
                                {/* --- IMAGE SECTION --- */}
                                <div className="relative h-56 m-3 overflow-hidden rounded-[2rem]">
                                    <img
                                        src={course.thumbnailUrl}
                                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                                        alt={course.title}
                                    />

                                    {/* Glassmorphism Gradient Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                    {/* Floating Offer Badge - Using Golden for High Contrast */}
                                    {course.offerPercentage > 0 && (
                                        <div className="absolute top-4 left-4 z-10 bg-[#E6D929] text-[#1E2EDE] px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider shadow-lg">
                                            SAVE {course.offerPercentage}%
                                        </div>
                                    )}

                                    {/* Wishlist Button - Functional & Refined */}
                                    {isAuthenticated && (
                                        <button
                                            disabled={loadingById[course._id]}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                handleToggleWishlist(course._id, course.title);
                                            }}
                                            className="absolute top-4 right-4 w-11 h-11 bg-white/80 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-lg transition-all active:scale-90 group/heart"
                                        >
                                            {loadingById[course._id] ? (
                                                <div className="w-5 h-5 border-2 border-[#14C4E7] border-t-transparent rounded-full animate-spin" />
                                            ) : (
                                                <Heart
                                                    size={22}
                                                    className={`transition-all duration-300 ${
                                                        isInWishlist(course._id)
                                                            ? "fill-red-500 text-red-500 scale-110"
                                                            : "text-slate-400 group-hover/heart:text-red-500"
                                                    }`}
                                                />
                                            )}
                                        </button>
                                    )}
                                </div>

                                {/* --- CONTENT SECTION --- */}
                                <div className="px-7 pb-7 flex flex-col flex-1">
                                    {/* Category Label - Cyan Accent */}
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className="w-2 h-2 rounded-full bg-[#14C4E7]" />
                                        <span className="text-[10px] font-black uppercase tracking-[0.15em] text-[#14C4E7]">
                                            {course.category?.name}
                                        </span>
                                    </div>

                                    {/* Title - Slate base, Blue on Hover */}
                                    <h3 className="text-xl font-bold text-slate-800 leading-snug mb-3 line-clamp-2 transition-colors duration-300 group-hover:text-[#1E2EDE]">
                                        {course.title}
                                    </h3>

                                    {/* Rating Section - Golden Accent */}
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="flex items-center gap-1 bg-[#E6D929]/10 px-2 py-1 rounded-lg">
                                            <Star size={14} className="fill-[#E6D929] text-[#E6D929]" />
                                            <span className="text-xs font-black text-slate-700">
                                                {course.rating || "4.5"}
                                            </span>
                                        </div>
                                        <span className="text-[11px] text-slate-400 font-bold uppercase tracking-widest">
                                            ({course.reviews || "0"} Students)
                                        </span>
                                    </div>

                                    {/* --- FOOTER SECTION --- */}
                                    <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between">
                                        <div className="flex flex-col">
                                            {course.offerPercentage > 0 && (
                                                <span className="text-[11px] text-slate-300 line-through font-bold tracking-wide">
                                                    ₹{course.price}
                                                </span>
                                            )}
                                            <span className="text-2xl font-black text-slate-900 group-hover:text-[#1E2EDE] transition-colors">
                                                ₹{Math.round(course.price - (course.price * course.offerPercentage) / 100)}
                                            </span>
                                        </div>

                                        {/* CTA Icon Button - Transitions to Blue */}
                                        <div className="relative">
                                            <div className="w-12 h-12 bg-slate-50 text-[#14C4E7] rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:bg-[#1E2EDE] group-hover:text-[#E6D929] group-hover:rotate-[360deg] shadow-sm">
                                                <BookOpen size={20} />
                                            </div>
                                            {/* Visual "Plus" hint */}
                                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#14C4E7] rounded-full border-2 border-white group-hover:bg-[#E6D929] transition-colors" />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-32 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
                        <div className="bg-white w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl text-slate-200">
                            <Search size={32} />
                        </div>
                        <h2 className="text-2xl font-black text-[#1E2EDE] mb-2">No Courses Found</h2>
                        <p className="text-slate-400 mb-8 max-w-xs mx-auto">
                            We couldn't find anything matching your search criteria.
                        </p>
                        <button
                            onClick={handleClearFilters}
                            className="bg-[#1E2EDE] text-[#E6D929] px-8 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest shadow-lg"
                        >
                            Clear All Filters
                        </button>
                    </div>
                )}

                {/* --- PAGINATION --- */}
                {courses.length > 0 && (
                    <div className="mt-20 flex justify-center">
                        <Pagination
                            currentPage={pagination.currentPage}
                            totalPages={pagination.totalPages}
                            totalItems={pagination.totalItems}
                            itemsPerPage={filters.limit}
                            onPageChange={handlePageChange}
                            label="Courses"
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default Courses;
