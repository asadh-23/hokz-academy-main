import { Link } from "react-router-dom";
import { Star, Heart, ShoppingCart } from "lucide-react";

const WishlistCard = ({ item, onRemove, onAddToCart }) => {
    const course = item.course;
    if (!course) return null;

    const discountedPrice = Math.round(
        course.price - (course.price * course.offerPercentage) / 100
    );

    return (
        <div className="group bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col transform hover:-translate-y-2">
            {/* Course Image */}
            <Link
                to={`/user/courses/${course._id}`}
                className="relative h-48 overflow-hidden bg-gradient-to-br from-gray-200 to-gray-300"
            >
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
                    className="absolute top-3 right-3 p-2.5 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-red-50 transition-all group/remove"
                    onClick={(e) => {
                        e.preventDefault();
                        onRemove(item._id, course.title);
                    }}
                    title="Remove from wishlist"
                >
                    <Heart className="w-5 h-5 text-red-500 fill-red-500 group-hover/remove:scale-110 transition-transform" />
                </button>
            </Link>

            {/* Course Details */}
            <div className="p-5 flex-1 flex flex-col">
                <div className="mb-2">
                    <span className="inline-block bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 px-3 py-1 rounded-full text-xs font-semibold">
                        {course.category?.name || "Uncategorized"}
                    </span>
                </div>

                <Link to={`/user/courses/${course._id}`}>
                    <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 leading-tight group-hover:text-cyan-600 transition-colors">
                        {course.title}
                    </h3>
                </Link>

                <p className="text-gray-500 text-sm mb-3 line-clamp-1">
                    {course.tutor?.fullName || "Unknown Instructor"}
                </p>

                <div className="flex items-center gap-1 mb-4">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-semibold text-gray-900">
                        {course.rating || "4.5"}
                    </span>
                    <span className="text-sm text-gray-500">
                        ({course.reviews || "0"})
                    </span>
                </div>

                <div className="mt-auto pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                            <span className="text-2xl font-bold bg-gradient-to-r from-cyan-600 to-emerald-600 bg-clip-text text-transparent">
                                ₹{discountedPrice}
                            </span>

                            {course.offerPercentage > 0 && (
                                <span className="text-base text-gray-400 line-through">
                                    ₹{course.price}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Add to Cart Button */}
                    <button
                        onClick={() => onAddToCart(course._id, course.title)}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-lg font-medium hover:from-emerald-600 hover:to-cyan-600 transition-all shadow-md"
                    >
                        <ShoppingCart className="h-4 w-4" />
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    );
};

export default WishlistCard;
