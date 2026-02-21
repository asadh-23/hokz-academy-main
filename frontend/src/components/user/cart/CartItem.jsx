import { Link } from "react-router-dom";
import { Star, Trash2, Heart, GraduationCap } from "lucide-react";

const CartItem = ({ item, onRemove, onMoveToWishlist }) => {
    const course = item.course;
    if (!course) return null;

    const priceToDisplay = course.currentPrice !== undefined 
        ? course.currentPrice 
        : Math.round(course.price - (course.price * (course.offerPercentage || 0)) / 100);

    return (
        <div className="group bg-white rounded-[2.5rem] border border-slate-100 p-5 md:p-6 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(30,46,222,0.08)]">
            <div className="flex flex-col md:flex-row gap-6">
                {/* Course Image Wrapper */}
                <Link
                    to={`/user/courses/${course._id}`}
                    className="shrink-0 w-full md:w-44 h-32 rounded-[2rem] overflow-hidden bg-slate-100 shadow-inner relative"
                >
                    <img
                        src={course.thumbnailUrl}
                        alt={course.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1E2EDE]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </Link>

                {/* Course Details */}
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                             <span className="w-2 h-2 rounded-full bg-[#14C4E7]"></span>
                             <span className="text-[10px] font-black uppercase tracking-widest text-[#14C4E7]">
                                {course.category?.name || "Premium Class"}
                             </span>
                        </div>
                        
                        <Link to={`/user/courses/${course._id}`}>
                            <h3 className="text-xl font-bold text-slate-800 mb-3 line-clamp-1 hover:text-[#1E2EDE] transition-colors">
                                {course.title}
                            </h3>
                        </Link>

                        <div className="flex flex-wrap items-center gap-4 mb-4">
                            <div className="flex items-center gap-2">
                                <img
                                    src={course.tutor?.profileImage || "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"}
                                    alt="tutor"
                                    className="w-6 h-6 rounded-full object-cover border border-[#14C4E7]/20"
                                />
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-tight">By {course.tutor?.fullName}</span>
                            </div>
                            <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1 rounded-lg">
                                <Star className="w-3.5 h-3.5 fill-[#E6D929] text-[#E6D929]" />
                                <span className="text-xs font-black text-[#1E2EDE]">{course.averageRating || "4.5"}</span>
                            </div>
                        </div>
                    </div>

                    {/* Desktop & Tablet Actions */}
                    <div className="flex items-center gap-4 mt-2">
                        <button
                            onClick={() => onRemove(item._id, course.title)}
                            className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-red-500 transition-all flex items-center gap-2"
                        >
                            <Trash2 className="w-4 h-4" />
                            Remove
                        </button>
                        <button
                            onClick={() => onMoveToWishlist(course._id, item._id, course.title)}
                            className="text-[10px] font-black uppercase tracking-widest text-[#14C4E7] hover:text-[#1E2EDE] transition-all flex items-center gap-2"
                        >
                            <Heart className="w-4 h-4" />
                            To Wishlist
                        </button>
                    </div>
                </div>

                {/* Price Display */}
                <div className="flex md:flex-col justify-between items-center md:items-end md:justify-center shrink-0 border-t md:border-t-0 md:border-l border-slate-50 pt-4 md:pt-0 md:pl-6">
                    <div className="text-right">
                        <div className="text-2xl font-black text-[#1E2EDE]">
                            ₹{priceToDisplay}
                        </div>
                        {course.offerPercentage > 0 && (
                            <div className="text-xs text-slate-300 line-through font-bold">
                                ₹{course.price}
                            </div>
                        )}
                    </div>
                    {course.offerPercentage > 0 && (
                        <div className="bg-[#E6D929] text-[#1E2EDE] text-[9px] font-black px-3 py-1 rounded-lg uppercase tracking-widest mt-2">
                            {course.offerPercentage}% OFF
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CartItem;
