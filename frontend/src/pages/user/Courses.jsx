import { useState, useEffect } from "react";
import { Search, Star, Filter, SlidersHorizontal, Heart } from "lucide-react";
import { userAxios } from "../../api/userAxios";
import { toast } from "sonner";

const Courses = () => {
    // --- State ---
    const [courses, setCourses] = useState([]);
    const [categories, setCategories] = useState([]);

    const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

    // Filter States
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [sortOption, setSortOption] = useState(""); // 'newest', 'oldest', 'low-high', 'high-low'
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");

    const fetchCourses = async () => {
        try {
            const response = await userAxios.get("/courses", {
                params: {
                    search: searchQuery,
                    category: selectedCategory === "All" ? "" : selectedCategory,
                    sort: sortOption,
                    minPrice,
                    maxPrice,
                },
            });

            if (response.data.success) {
                setCourses(response.data.courses);
            }
        } catch (error) {
            console.log("Failed to load courses", error);
            toast.error("Failed to load courses");
        }
    };

    useEffect(() => {
        fetchCourses();
    }, [searchQuery, selectedCategory]);

    const fetchCategories = async () => {
        try {
            const response = await userAxios.get("/categories/listed");
            if (response.data?.success) setCategories(response.data.categories);
        } catch (error) {
            console.log("Failed to load categories", error);
            toast.error("Failed to load categories");
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    // --- Logic ---
    const handleApplyFilters = () => {
        fetchCourses();
        setIsMobileFilterOpen(false);
    };

    const handleClearFilters = () => {
        setSearchQuery("");
        setSelectedCategory("All");
        setSortOption("");
        setMinPrice("");
        setMaxPrice("");
        fetchCourses(); // reset fetch
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
            {/* --- Header Section --- */}
            <div className="bg-white border-b border-gray-200 py-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-6">
                        <h1 className="text-4xl font-bold text-gray-900 mb-2">All Courses</h1>
                        <p className="text-gray-600">Discover amazing courses from expert tutors</p>
                    </div>

                    {/* Search and Filter Bar */}
                    <div className="flex flex-col sm:flex-row gap-4 items-center">
                        <div className="relative w-full sm:flex-1 sm:max-w-2xl">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Search className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                className="block w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                placeholder="Search courses..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        <div className="flex gap-3 w-full sm:w-auto relative">
                            {/* Filter Button */}
                            <div className="relative">
                                <button
                                    onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
                                    className="w-full sm:w-auto px-8 py-3 border border-gray-300 rounded-lg bg-white 
                       hover:bg-gray-50 transition-colors flex items-center gap-2 min-w-[160px] justify-center"
                                >
                                    <SlidersHorizontal className="h-5 w-5 text-gray-600" />
                                    <span className="text-gray-700 font-medium">Filters</span>
                                </button>

                                {/* Filter Dropdown */}
                                {isMobileFilterOpen && (
                                    <>
                                        <div
                                            className="fixed inset-0 z-10"
                                            onClick={() => setIsMobileFilterOpen(false)}
                                        ></div>

                                        <div
                                            className="absolute right-0 mt-2 w-80 bg-white rounded-xl 
                                shadow-2xl border border-gray-200 p-6 z-20"
                                        >
                                            <h3 className="text-lg font-bold text-gray-900 mb-4">Filters</h3>

                                            {/* Sort By */}
                                            <div className="mb-4">
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Sort By
                                                </label>
                                                <select
                                                    value={sortOption}
                                                    onChange={(e) => setSortOption(e.target.value)}
                                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg 
                                       focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white text-gray-700"
                                                >
                                                    <option value="">Newest First</option>
                                                    <option value="newest">Newest to Oldest</option>
                                                    <option value="oldest">Oldest to Newest</option>
                                                    <option value="low-high">Price: Low to High</option>
                                                    <option value="high-low">Price: High to Low</option>
                                                </select>
                                            </div>

                                            {/* Min Price */}
                                            <div className="mb-4">
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Min Price
                                                </label>
                                                <div className="relative">
                                                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                                                        ₹
                                                    </span>
                                                    <input
                                                        type="number"
                                                        placeholder="0"
                                                        value={minPrice}
                                                        onChange={(e) => setMinPrice(e.target.value)}
                                                        className="w-full pl-8 pr-4 py-2.5 border border-gray-300 rounded-lg 
                                           text-base focus:outline-none focus:ring-2 focus:ring-teal-500 
                                           focus:border-transparent"
                                                    />
                                                </div>
                                            </div>

                                            {/* Max Price */}
                                            <div className="mb-6">
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Max Price
                                                </label>
                                                <div className="relative">
                                                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                                                        ₹
                                                    </span>
                                                    <input
                                                        type="number"
                                                        placeholder="10000"
                                                        value={maxPrice}
                                                        onChange={(e) => setMaxPrice(e.target.value)}
                                                        className="w-full pl-8 pr-4 py-2.5 border border-gray-300 rounded-lg 
                                           text-base focus:outline-none focus:ring-2 focus:ring-teal-500 
                                           focus:border-transparent"
                                                    />
                                                </div>
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="flex gap-3">
                                                <button
                                                    onClick={handleApplyFilters}
                                                    className="flex-1 bg-teal-600 text-white py-2.5 px-4 rounded-lg 
                                       hover:bg-teal-700 transition-colors font-semibold"
                                                >
                                                    Apply Filters
                                                </button>

                                                <button
                                                    onClick={handleClearFilters}
                                                    className="flex-1 bg-white text-gray-700 border border-gray-300 py-2.5 px-4 
                                       rounded-lg hover:bg-gray-50 transition-colors font-semibold"
                                                >
                                                    Clear All
                                                </button>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Browse by Category */}
                <div className="mb-8">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Browse by Category</h2>
                    <div className="flex flex-wrap gap-3">
                        <button
                            onClick={() => setSelectedCategory("All")}
                            className={`px-5 py-2.5 rounded-full font-medium transition-all ${
                                selectedCategory === "All"
                                    ? "bg-teal-600 text-white shadow-md"
                                    : "bg-white text-gray-700 border border-gray-300 hover:border-teal-500 hover:text-teal-600"
                            }`}
                        >
                            All Categories
                        </button>

                        {categories.map((cat) => (
                            <button
                                key={cat._id}
                                onClick={() => setSelectedCategory(cat._id)}
                                className={`px-5 py-2.5 rounded-full font-medium transition-all ${
                                    selectedCategory === cat._id
                                        ? "bg-teal-600 text-white shadow-md"
                                        : "bg-white text-gray-700 border border-gray-300 hover:border-teal-500 hover:text-teal-600"
                                }`}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Results Count */}
                <div className="mb-6">
                    <p className="text-gray-600">
                        Showing <span className="font-bold text-gray-900">{courses.length}</span> of{" "}
                        <span className="font-bold text-gray-900">{courses.length}</span> courses
                    </p>
                </div>

                {/* Course Grid */}
                <main>
                    {courses.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {courses.map((course) => (
                                <div
                                    key={course._id}
                                    className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col cursor-pointer"
                                >
                                    {/* Course Image with Discount Badge and Wishlist */}
                                    <div className="relative h-44 overflow-hidden">
                                        <img
                                            src={course.thumbnailUrl}
                                            alt={course.title}
                                            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                                        />

                                        {course.offerPercentage > 0 && (
                                            <div className="absolute top-3 left-3 bg-yellow-400 text-gray-900 px-2.5 py-1 rounded-lg text-xs font-bold shadow-md">
                                                {course.offerPercentage}% OFF
                                            </div>
                                        )}

                                        {/* Wishlist Icon */}
                                        <button className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors">
                                            <Heart className="w-5 h-5 text-gray-700 hover:text-red-500 hover:fill-red-500 transition-colors" />
                                        </button>
                                    </div>

                                    {/* Course Details */}
                                    <div className="p-5 flex-1 flex flex-col">
                                        {/* Category Badge */}
                                        <div className="mb-2">
                                            <span className="inline-block bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-semibold">
                                                {course.category?.name}
                                            </span>
                                        </div>

                                        {/* Course Title */}
                                        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 leading-tight">
                                            {course.title}
                                        </h3>

                                        {/* Instructor Name */}
                                        <p className="text-gray-500 text-sm mb-3 line-clamp-1">
                                            {course.tutor?.name || "Unknown Instructor"}
                                        </p>

                                        {/* Divider */}
                                        <div className="border-t border-gray-200 my-3"></div>

                                        {/* Price Section */}
                                        <div className="flex items-center gap-2">
                                            <span className="text-2xl font-bold text-gray-900">
                                                ₹{Math.round(course.price - (course.price * course.offerPercentage) / 100)}
                                            </span>

                                            {course.offerPercentage > 0 && (
                                                <span className="text-base text-gray-400 line-through">
                                                    ₹{course.price}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-gray-300">
                            <div className="mx-auto h-16 w-16 text-gray-400 mb-4">
                                <Search size={64} strokeWidth={1.5} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">No courses found</h3>
                            <p className="text-gray-500 mb-6">
                                Try adjusting your search or filters to find what you're looking for.
                            </p>
                            <button
                                onClick={handleClearFilters}
                                className="inline-flex items-center px-6 py-3 border border-transparent shadow-md text-base font-semibold rounded-lg text-white bg-teal-600 hover:bg-teal-700 transition-colors"
                            >
                                Clear all filters
                            </button>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default Courses;
