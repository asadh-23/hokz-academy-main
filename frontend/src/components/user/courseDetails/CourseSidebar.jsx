import { Play, Heart, Clock, FileText, Infinity, Smartphone, Award, Share2, ShoppingCart, CheckCircle, PlayCircle, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CourseSidebar = ({
    courseData,
    hours,
    minutes,
    seconds,
    totalLessons,
    onAddToCart,
    onToggleWishlist,
    isInWishlist,
    isInCart,
    isAddingToCart,
    isTogglingWishlist,
    onContinueLearning,
    isEnrolled, // ✅ 1. Accept this prop directly
}) => {
    
    // Safety check
    if (!courseData?.course) return null;

    const course = courseData.course;
    const navigate = useNavigate();

    // ✅ 2. Use the prop first, fallback to courseData if needed
    const isUserEnrolled = isEnrolled || courseData.isEnrolled || false;

    const handleEnrollNow = () => {
        navigate("/user/checkout", { state: { courseData } });
    };

    const handleCartAction = () => {
        if (isInCart) {
            navigate("/user/cart");
        } else {
            onAddToCart();
        }
    };

    return (
        <div className="sticky top-24">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden lg:-mt-64 relative z-10">
                
                {/* --- Thumbnail Section --- */}
                <div
                    className="relative aspect-video group cursor-pointer"
                    onClick={isUserEnrolled ? onContinueLearning : undefined}
                >
                    <img src={course.thumbnailUrl} alt={course.title} className="w-full h-full object-cover" />
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                        <div className="bg-white/90 rounded-full p-4 shadow-lg group-hover:scale-110 transition-transform">
                            {isUserEnrolled ? (
                                <PlayCircle className="w-8 h-8 text-emerald-600 ml-0.5" />
                            ) : (
                                <Play className="w-8 h-8 text-indigo-600 ml-1" />
                            )}
                        </div>
                    </div>
                    
                    <div className="absolute bottom-4 left-0 right-0 text-center">
                        <span className="font-bold text-white drop-shadow-md">
                            {isUserEnrolled ? "Continue Watching" : "Preview this course"}
                        </span>
                    </div>
                </div>

                <div className="p-6">
                    {/* --- Price / Status Section --- */}
                    {isUserEnrolled ? (
                        <div className="flex items-center gap-3 mb-6 p-4 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-100">
                            <CheckCircle className="w-6 h-6" />
                            <div>
                                <h3 className="font-bold text-sm uppercase tracking-wide">Purchased</h3>
                                <p className="font-medium text-lg">You own this course</p>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-end gap-3 mb-6">
                            {course.price === 0 ? (
                                <span className="text-3xl font-bold text-emerald-600">Free</span>
                            ) : (
                                <>
                                    <span className="text-3xl font-bold text-gray-900">
                                        ₹{courseData.subTotal || course.price}
                                    </span>
                                    {course.offerPercentage > 0 && (
                                        <>
                                            <span className="text-gray-400 line-through mb-1">₹{course.price}</span>
                                            <span className="text-indigo-600 font-bold mb-1 ml-auto">
                                                {course.offerPercentage}% off
                                            </span>
                                        </>
                                    )}
                                </>
                            )}
                        </div>
                    )}

                    {/* --- Action Buttons --- */}
                    {isUserEnrolled ? (
                        <button
                            onClick={onContinueLearning}
                            className="w-full py-4 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg hover:shadow-emerald-200 flex items-center justify-center gap-2 transition-all mb-6 active:scale-[0.98]"
                        >
                            <PlayCircle className="w-6 h-6" />
                            Continue Learning
                        </button>
                    ) : (
                        <>
                            {/* Cart & Wishlist Buttons */}
                            <div className="flex gap-3 mb-3">
                                {/* Only show Add to Cart if not free (Optional logic, removing cart for free items is standard) */}
                                <button
                                    onClick={handleCartAction}
                                    disabled={isAddingToCart}
                                    className={`flex-1 py-3 px-4 font-bold rounded-xl shadow-lg transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${
                                        isInCart
                                            ? "bg-purple-600 hover:bg-purple-700 hover:shadow-purple-200 text-white"
                                            : "bg-indigo-600 hover:bg-indigo-700 hover:shadow-indigo-200 text-white"
                                    }`}
                                >
                                    <ShoppingCart className={`w-5 h-5 ${isAddingToCart ? "animate-spin" : ""}`} />
                                    {isAddingToCart ? "Adding..." : isInCart ? "Go to Cart" : "Add to Cart"}
                                </button>

                                <button
                                    onClick={onToggleWishlist}
                                    disabled={isTogglingWishlist}
                                    className={`p-3 border-2 rounded-xl transition-all group disabled:opacity-50 disabled:cursor-not-allowed ${
                                        isInWishlist
                                            ? "bg-red-50 border-red-400"
                                            : "bg-white border-gray-200 hover:border-red-400 hover:bg-red-50"
                                    }`}
                                    title={isInWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
                                >
                                    <Heart
                                        className={`w-6 h-6 transition-all ${
                                            isInWishlist
                                                ? "text-red-500 fill-red-500"
                                                : "text-gray-600 group-hover:text-red-500 group-hover:fill-red-500"
                                        } ${isTogglingWishlist ? "animate-pulse" : ""}`}
                                    />
                                </button>
                            </div>

                            {/* Buy Now / Enroll Now Button */}
                            <button
                                onClick={handleEnrollNow}
                                className="relative w-full py-3.5 px-6 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-600 hover:via-teal-600 hover:to-cyan-600 text-white font-bold rounded-xl transition-all mb-6 shadow-lg hover:shadow-xl hover:shadow-emerald-200 active:scale-[0.98] group overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                                <span className="relative flex items-center justify-center gap-2">
                                    <Sparkles className="w-5 h-5 animate-pulse" />
                                    <span className="text-base">Enroll Now</span>
                                    <Sparkles className="w-5 h-5 animate-pulse" />
                                </span>
                            </button>

                            <p className="text-center text-xs text-gray-500 mb-6">30-Day Money-Back Guarantee</p>
                        </>
                    )}

                    {/* --- Course Features List --- */}
                    <div className="space-y-3">
                        <h4 className="font-bold text-sm text-gray-900">This course includes:</h4>
                        <ul className="text-sm text-gray-600 space-y-2.5">
                            <li className="flex items-center gap-3">
                                <Clock className="w-4 h-4 text-gray-400" />
                                {hours > 0 && `${hours}h `}
                                {minutes > 0 && `${minutes}m `}
                                {seconds}s on-demand video
                            </li>
                            <li className="flex items-center gap-3">
                                <FileText className="w-4 h-4 text-gray-400" />
                                {totalLessons} lessons
                            </li>
                            <li className="flex items-center gap-3">
                                <Infinity className="w-4 h-4 text-gray-400" />
                                Full lifetime access
                            </li>
                            <li className="flex items-center gap-3">
                                <Smartphone className="w-4 h-4 text-gray-400" />
                                Access on mobile and desktop
                            </li>
                            <li className="flex items-center gap-3">
                                <Award className="w-4 h-4 text-gray-400" />
                                Certificate of completion
                            </li>
                        </ul>
                    </div>

                    {/* Share Button */}
                    <div className="flex justify-center pt-6 mt-6 border-t border-gray-100">
                        <button className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors">
                            <Share2 className="w-4 h-4" />
                            Share this course
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseSidebar;
