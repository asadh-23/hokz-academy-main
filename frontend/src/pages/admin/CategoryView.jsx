import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { PageLoader } from "../../components/common/LoadingSpinner";
import { toast } from "sonner";
import { adminAxios } from "../../api/adminAxios";

const CategoryView = () => {
    const { categoryId } = useParams();
    const navigate = useNavigate();

    // -------------------- STATE --------------------
    const [category, setCategory] = useState(null);
    const [courses, setCourses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("All Courses");

    // -------------------- FETCH DATA --------------------
    const fetchCategoryData = async () => {
        setIsLoading(true);
        try {
            // Fetch category details
            const categoryResponse = await adminAxios.get(`/categories/${categoryId}`);
            if (categoryResponse.data?.success) {
                setCategory(categoryResponse.data.category);
            }

            // Fetch courses in this category
            const coursesResponse = await adminAxios.get(`/categories/${categoryId}/courses`, {
                params: {
                    search: searchTerm,
                    status: filterStatus === "All Courses" ? "" : filterStatus,
                },
            });
            if (coursesResponse.data?.success) {
                setCourses(coursesResponse.data.courses || []);
            }
        } catch (error) {
            console.error("Error fetching category data:", error);
            toast.error(error.response?.data?.message || "Failed to load category data");
        } finally {
            setIsLoading(false);
        }
    };

    // -------------------- EFFECTS --------------------
    useEffect(() => {
        if (categoryId) {
            fetchCategoryData();
        }
    }, [categoryId, searchTerm, filterStatus]);

    // -------------------- HANDLERS --------------------
    const handleSearch = (e) => setSearchTerm(e.target.value);
    const handleFilterChange = (e) => setFilterStatus(e.target.value);

    const handleBackToCategories = () => {
        navigate("/admin/categories");
    };

    const getInitials = (name) => {
        return (
            name
                ?.split(" ")
                .map((n) => n[0]?.toUpperCase())
                .join("")
                .slice(0, 2) || "C"
        );
    };

    const getRandomColor = () => {
        const colors = [
            "bg-blue-500",
            "bg-green-500",
            "bg-purple-500",
            "bg-pink-500",
            "bg-indigo-500",
            "bg-red-500",
            "bg-yellow-500",
            "bg-teal-500",
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    };

    // -------------------- FILTERED COURSES --------------------
    const filteredCourses = courses.filter((course) => {
        const matchesSearch = course.title?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter =
            filterStatus === "All Courses" ||
            (filterStatus === "Active" && course.status === "Active") ||
            (filterStatus === "Inactive" && course.status === "Inactive");

        return matchesSearch && matchesFilter;
    });

    // -------------------- RENDER --------------------
    // if (isLoading) {
    //     return (
    //         <div className="flex flex-col min-h-screen bg-gray-50">
    //             <div className="flex flex-1">
    //                 <div className="flex justify-center items-center flex-1">
    //                     <PageLoader text="Loading Category..." />
    //                 </div>
    //             </div>
    //         </div>
    //     );
    // }

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <div className="flex flex-1">
                <div className="flex-1 p-6 md:p-8 overflow-y-auto">
                    {/* Back Button */}
                    <button
                        onClick={handleBackToCategories}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6 transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to Categories
                    </button>

                    {/* Category Header */}
                    <div className="flex items-center gap-4 mb-8">
                        <div
                            className={`w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-bold ${getRandomColor()}`}
                        >
                            {getInitials(category?.name)}
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800">{category?.name || "Category"}</h1>
                            <p className="text-gray-600">{category?.description || "No description available"}</p>
                        </div>
                    </div>

                    {/* Search and Filter Controls */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            {/* Left: Course Count */}
                            <div>
                                <h2 className="text-lg font-semibold text-gray-800">
                                    {filteredCourses.length} Course{filteredCourses.length !== 1 ? "s" : ""} Found
                                </h2>
                            </div>

                            {/* Right: Search + Filter */}
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Search Courses"
                                        value={searchTerm}
                                        onChange={handleSearch}
                                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 w-64"
                                    />
                                    <svg
                                        className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                        />
                                    </svg>
                                </div>

                                <select
                                    value={filterStatus}
                                    onChange={handleFilterChange}
                                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                                >
                                    <option value="All Courses">Filter</option>
                                    <option value="Active">Active</option>
                                    <option value="Inactive">Inactive</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Courses Grid */}
                    {filteredCourses.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredCourses.map((course) => (
                                <div
                                    key={course._id}
                                    className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
                                >
                                    {/* Course Image */}
                                    <div className="relative h-48 bg-gradient-to-br from-blue-500 to-purple-600">
                                        {course.thumbnail ? (
                                            <img
                                                src={course.thumbnail}
                                                alt={course.title}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="flex items-center justify-center h-full text-white text-2xl font-bold">
                                                {getInitials(course.title)}
                                            </div>
                                        )}

                                        {/* Status Badge */}
                                        <span className="absolute top-3 left-3 bg-green-500 text-white px-2 py-1 rounded text-xs font-medium">
                                            {course.status || "Active"}
                                        </span>
                                    </div>

                                    {/* Course Content */}
                                    <div className="p-4">
                                        {/* Instructor */}
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
                                                <span className="text-xs font-medium text-gray-600">
                                                    {getInitials(course.instructor?.name || "Instructor")}
                                                </span>
                                            </div>
                                            <span className="text-xs text-gray-500">
                                                {course.instructor?.name || "Instructor"}
                                            </span>
                                        </div>

                                        {/* Course Title */}
                                        <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">{course.title}</h3>

                                        {/* Rating */}
                                        <div className="flex items-center gap-2 mb-3">
                                            <div className="flex items-center">
                                                {[...Array(5)].map((_, i) => (
                                                    <svg
                                                        key={i}
                                                        className={`w-4 h-4 ${
                                                            i < Math.floor(course.rating || 0)
                                                                ? "text-yellow-400"
                                                                : "text-gray-300"
                                                        }`}
                                                        fill="currentColor"
                                                        viewBox="0 0 20 20"
                                                    >
                                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                    </svg>
                                                ))}
                                            </div>
                                            <span className="text-sm text-gray-600">
                                                {course.rating?.toFixed(1) || "0.0"}
                                            </span>
                                            <span className="text-xs text-gray-500">
                                                ({course.reviewCount || 0} reviews)
                                            </span>
                                        </div>

                                        {/* Price and Action */}
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <button className="bg-red-500 text-white px-3 py-1 rounded text-sm font-medium">
                                                    VIEW COURSE
                                                </button>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-lg font-bold text-green-600">
                                                    ₹{course.price || "Free"}
                                                </span>
                                                {course.originalPrice && course.originalPrice > course.price && (
                                                    <>
                                                        <span className="text-sm text-gray-500 line-through ml-2">
                                                            ₹{course.originalPrice}
                                                        </span>
                                                        <span className="text-xs text-red-500 ml-1">
                                                            {Math.round(
                                                                ((course.originalPrice - course.price) /
                                                                    course.originalPrice) *
                                                                    100
                                                            )}
                                                            % OFF
                                                        </span>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                            <div className="text-gray-400 mb-4">
                                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={1}
                                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                                    />
                                </svg>
                            </div>
                            <h3 className="text-lg font-medium text-gray-800 mb-2">No courses found</h3>
                            <p className="text-gray-500 text-sm">There are no courses in this category yet.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CategoryView;
