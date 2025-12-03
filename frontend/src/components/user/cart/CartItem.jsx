import { Link } from "react-router-dom";
import { Star, Trash2, Heart } from "lucide-react";

const CartItem = ({ item, onRemove, onMoveToWishlist }) => {
    const course = item.course;
    if (!course) return null;

    const priceToDisplay = course.currentPrice !== undefined 
        ? course.currentPrice 
        : Math.round(course.price - (course.price * (course.offerPercentage || 0)) / 100);

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-all">
            <div className="flex gap-4">
                {/* Course Image */}
                <Link
                    to={`/user/courses/${course._id}`}
                    className="flex-shrink-0 w-32 h-24 rounded-lg overflow-hidden bg-gradient-to-br from-gray-200 to-gray-300"
                >
                    <img
                        src={course.thumbnailUrl}
                        alt={course.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                </Link>

                {/* Course Details */}
                <div className="flex-1 min-w-0">
                    <Link to={`/user/courses/${course._id}`}>
                        <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-1 hover:text-cyan-600 transition-colors">
                            {course.title}
                        </h3>
                    </Link>

                    <div className="flex items-center gap-2 mb-2">
                        <img
                            src={course.tutor?.profileImage || "https://via.placeholder.com/40"}
                            alt={course.tutor?.fullName || "Unknown Instructor"}
                            className="w-6 h-6 rounded-full object-cover border border-gray-200"
                        />
                        <p className="text-sm text-gray-600">
                            By {course.tutor?.fullName || "Unknown Instructor"}
                        </p>
                    </div>

                    <div className="flex items-center gap-3 mb-2">
                        <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm font-semibold text-gray-900">
                               {course.averageRating || "4.5"}
                            </span>
                            <span className="text-sm text-gray-500">
                                ({course.reviews?.length || "0"})
                            </span>
                        </div>
                        <span className="text-sm text-gray-500">
                            {course.lessonsCount || 0} lessons
                        </span>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => onRemove(item._id, course.title)}
                            className="text-sm text-red-600 hover:text-red-700 font-medium flex items-center gap-1"
                        >
                            <Trash2 className="w-4 h-4" />
                            Remove
                        </button>
                        <button
                            onClick={() => onMoveToWishlist(course._id, item._id, course.title)}
                            className="text-sm text-cyan-600 hover:text-cyan-700 font-medium flex items-center gap-1"
                        >
                            <Heart className="w-4 h-4" />
                            Move to Wishlist
                        </button>
                    </div>
                </div>

                {/* Price */}
                <div className="flex-shrink-0 text-right">
                    <div className="text-2xl font-bold bg-gradient-to-r from-cyan-600 to-emerald-600 bg-clip-text text-transparent">
                        ₹{priceToDisplay}
                    </div>
                    {course.offerPercentage > 0 && (
                        <div className="text-sm text-gray-400 line-through">
                            ₹{course.price}
                        </div>
                    )}
                    {course.offerPercentage > 0 && (
                        <div className="text-xs text-emerald-600 font-semibold mt-1">
                            {course.offerPercentage}% OFF
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CartItem;
