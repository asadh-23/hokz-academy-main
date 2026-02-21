import { Link } from "react-router-dom";
import { Star, Heart, ShoppingCart, PlayCircle, BadgeCheck, ChevronRight } from "lucide-react";


const WishlistCard = ({
    item,
    onRemove,
    removeWishlitLoadingById,
    onAddToCart,
    addToCartLoadingById,
    isInCart,
    onContinueLearning,
}) => {
    const course = item?.course;

    // Safety check: If course data is missing, don't render anything
    if (!course) return null;

    // Backend provides 'isEnrolled' inside the course object
    const isEnrolled = course?.isEnrolled || false;

    // Price Calculation
    const discountedPrice = Math.round(course.price - (course.price * course.offerPercentage) / 100);

    // Loading States
    const isRemovingFromWishlist = removeWishlitLoadingById?.[course._id] || false;
    const isAddingToCart = addToCartLoadingById?.[course._id] || false;

   return (
        <div className="group bg-white rounded-[2.5rem] border border-slate-100 flex flex-col hover:shadow-[0_30px_60px_rgba(30,46,222,0.12)] transition-all duration-500 overflow-hidden relative transform hover:-translate-y-2 h-full w-full">
            
            {/* --- THUMBNAIL SECTION (Increased height for better width-ratio) --- */}
            <div className="relative h-60 m-4 overflow-hidden rounded-[2rem] shrink-0">
                <Link to={`/user/course/${course._id}`} className="block h-full">
                    <img
                        src={course.thumbnailUrl}
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                        alt={course.title}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1E2EDE]/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </Link>

                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                    {course.offerPercentage > 0 && !isEnrolled && (
                        <div className="bg-[#E6D929] text-[#1E2EDE] px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider shadow-lg w-fit">
                            -{course.offerPercentage}% OFF
                        </div>
                    )}
                    {isEnrolled && (
                        <div className="bg-[#14C4E7] text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider shadow-lg flex items-center gap-2 w-fit">
                            <BadgeCheck size={14} /> Owned
                        </div>
                    )}
                </div>

                {/* Remove Button */}
                <button
                    className="absolute top-4 right-4 w-12 h-12 bg-white/90 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-lg transition-all active:scale-90 disabled:opacity-50 z-10"
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onRemove(course._id, course.title);
                    }}
                    disabled={isRemovingFromWishlist}
                >
                    <Heart
                        size={24}
                        className={`text-red-500 fill-red-500 ${isRemovingFromWishlist ? "animate-pulse" : "group-hover:scale-110"}`}
                    />
                </button>
            </div>

            {/* --- CONTENT SECTION --- */}
            <div className="px-8 pb-8 flex flex-col flex-1">
                {/* Category & Rating Row */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#14C4E7]" />
                        <span className="text-[10px] font-black uppercase tracking-[0.15em] text-[#14C4E7]">
                            {course.category?.name || "Hokz Special"}
                        </span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-[#E6D929]/10 px-2 py-1 rounded-lg">
                        <Star size={12} className="fill-[#E6D929] text-[#E6D929]" />
                        <span className="text-xs font-black text-slate-700">{course.averageRating || "4.5"}</span>
                    </div>
                </div>

                <Link to={`/user/course/${course._id}`}>
                    <h3 className="text-xl font-bold text-slate-800 leading-tight mb-4 line-clamp-2 transition-colors group-hover:text-[#1E2EDE]">
                        {course.title}
                    </h3>
                </Link>

                {/* Instructor Info */}
                <div className="flex items-center gap-3 mb-6 bg-slate-50 p-2 rounded-2xl w-fit pr-4">
                    <img
                        src={course.tutor?.profileImage || "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"}
                        className="w-8 h-8 rounded-xl object-cover border-2 border-white shadow-sm"
                    />
                    <div className="flex flex-col">
                        <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Instructor</span>
                        <span className="text-xs font-bold text-slate-700 leading-none">
                            {course.tutor?.fullName}
                        </span>
                    </div>
                </div>

                {/* --- FOOTER: ALIGNED PRICE & BUTTON --- */}
                <div className="mt-auto pt-6 border-t border-slate-100 flex items-center justify-between gap-4">
                    <div className="flex flex-col shrink-0">
                        {isEnrolled ? (
                            <span className="text-xs font-black text-[#14C4E7] uppercase tracking-widest">Unlocked</span>
                        ) : (
                            <>
                                {course.offerPercentage > 0 && (
                                    <span className="text-[10px] text-slate-300 line-through font-bold">₹{course.price}</span>
                                )}
                                <span className="text-2xl font-black text-slate-900 group-hover:text-[#1E2EDE] transition-colors leading-none">
                                    ₹{discountedPrice}
                                </span>
                            </>
                        )}
                    </div>

                    {/* Action Button: Dynamic Width based on state */}
                    <div className="flex-1">
                        {isEnrolled ? (
                            <button
                                onClick={() => onContinueLearning(course._id)}
                                className="w-full flex items-center justify-center gap-2 py-4 bg-[#14C4E7] text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-cyan-100 transition-all hover:bg-[#1E2EDE] active:scale-95"
                            >
                                <PlayCircle size={16} /> Resume
                            </button>
                        ) : isInCart ? (
                            <Link
                                to="/user/cart"
                                className="w-full flex items-center justify-center gap-2 py-4 bg-[#1E2EDE] text-[#E6D929] rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-blue-100 transition-all hover:bg-[#14C4E7] hover:text-white text-center active:scale-95"
                            >
                                <ShoppingCart size={16} /> In Cart
                            </Link>
                        ) : (
                            <button
                                onClick={() => onAddToCart(course._id, course.title)}
                                disabled={isAddingToCart}
                                className="w-full flex items-center justify-center gap-2 py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl transition-all hover:bg-[#1E2EDE] disabled:opacity-50 active:scale-95"
                            >
                                {isAddingToCart ? (
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                ) : (
                                    <ShoppingCart size={16} />
                                )}
                                Enroll
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WishlistCard;
