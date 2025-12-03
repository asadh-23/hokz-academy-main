import { Star, AlertCircle, Globe } from "lucide-react";

const CourseHero = ({ course }) => {
    // 1. Safety Check: If course is not loaded yet, show nothing or a skeleton
    if (!course) return null;

    return (
        <header className="bg-gray-900 text-white pt-10 pb-12 lg:pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="lg:w-2/3 pr-0 lg:pr-8">
                    {/* Breadcrumbs */}
                    <div className="flex items-center gap-2 text-indigo-300 text-sm font-medium mb-4">
                        <span className="cursor-pointer hover:text-white transition">Courses</span>
                        <span className="text-gray-500">/</span>
                        <span className="cursor-pointer hover:text-white transition">
                            {course.category?.name || "Uncategorized"}
                        </span>
                    </div>

                    <h1 className="text-3xl sm:text-4xl font-bold mb-4 leading-tight">
                        {course.title}
                    </h1>

                    {/* 2. Use shortSummary instead of description */}
                    <p className="text-lg text-gray-300 mb-6 leading-relaxed line-clamp-3">
                        {course.shortSummary || course.description}
                    </p>

                    {/* Ratings & Info */}
                    <div className="flex flex-wrap items-center gap-4 text-sm mb-6">
                        <div className="flex items-center gap-1">
                            <span className="text-amber-400 font-bold text-base">
                                {course.averageRating || 0}
                            </span>
                            <div className="flex text-amber-400">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className={`w-4 h-4 ${
                                            // 3. Changed Math.floor to Math.round for better accuracy
                                            i < Math.round(course.averageRating || 0) 
                                                ? "fill-current text-amber-400" 
                                                : "text-gray-600"
                                        }`}
                                    />
                                ))}
                            </div>
                            <span className="text-indigo-200 ml-1 hover:underline cursor-pointer">
                                ({course.totalReviews || 0} {course.totalReviews === 1 ? "review" : "reviews"})
                            </span>
                        </div>
                        
                        <span className="text-gray-500 hidden sm:block">•</span>
                        <span className="text-gray-300">{course.enrolledCount || 0} students enrolled</span>
                    </div>

                    <div className="flex flex-wrap gap-y-2 gap-x-6 text-sm text-gray-300">
                        <div className="flex items-center gap-2">
                            <AlertCircle className="w-4 h-4" />
                            Last updated{" "}
                            {/* 4. Date Safety Fix */}
                            {course.updatedAt 
                                ? new Date(course.updatedAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })
                                : "Recently"}
                        </div>
                        <div className="flex items-center gap-2">
                            <Globe className="w-4 h-4" />
                            {course.language || "English"}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default CourseHero;