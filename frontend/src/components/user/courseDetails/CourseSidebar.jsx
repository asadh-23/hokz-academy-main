import React from "react";
import {
    Play,
    Heart,
    Clock,
    FileText,
    Infinity,
    Smartphone,
    Award,
    Share2,
    ShoppingCart,
    CheckCircle,
    PlayCircle,
    Sparkles,
} from "lucide-react";
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
    isEnrolled,
    isAuthenticated,
}) => {
    // Safety check
    if (!courseData?.course) return null;

    const course = courseData.course;
    const navigate = useNavigate();

    // ✅ 2. Use the prop first, fallback to courseData if needed
    const isUserEnrolled = isEnrolled || courseData.isEnrolled || false;
    console.log(isEnrolled, "truuuuuuuuuuuuuuuuuuuuu");

    const handleEnrollNow = () => {
        // Redirect to login if not authenticated
        if (!isAuthenticated) {
            navigate("/user/login");
            return;
        }
        navigate("/user/checkout", { state: { courseData } });
    };

    const handleLoginToPurchase = () => {
        navigate("/user/login");
    };

    const handleCartAction = () => {
        if (isInCart) {
            navigate("/user/cart");
        } else {
            onAddToCart();
        }
    };

    return (
        /* Sticky positioning: starts below the 80px header (top-24) */
        <div className="lg:sticky lg:top-24 self-start w-full transition-all duration-500">
            <div className="bg-[#FDFDFD] rounded-[2.5rem] shadow-2xl shadow-blue-900/15 border border-slate-100 overflow-hidden group/sidebar hover:shadow-blue-900/20 transition-all">
                {/* --- 1. MEDIA PREVIEW (Sleeker Video Card) --- */}
                <div
                    className="relative aspect-video m-4 overflow-hidden rounded-[2rem] group cursor-pointer shadow-lg"
                    onClick={isUserEnrolled ? onContinueLearning : undefined}
                >
                    <img
                        src={course.thumbnailUrl}
                        alt={course.title}
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    />

                    {/* Branded Glassmorphism Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1E2EDE]/40 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-[#FDFDFD] text-[#1E2EDE] rounded-full p-5 shadow-[0_0_30px_rgba(30,46,222,0.3)] transform transition-all duration-500 group-hover:scale-110 group-hover:bg-[#E6D929] group-hover:text-[#1E2EDE]">
                            {isUserEnrolled ? (
                                <PlayCircle size={32} className="animate-pulse" />
                            ) : (
                                <Play size={32} fill="currentColor" className="ml-1" />
                            )}
                        </div>
                    </div>

                    <div className="absolute bottom-5 inset-x-0 text-center">
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white bg-black/30 backdrop-blur-md px-5 py-2 rounded-full border border-white/10 shadow-xl">
                            {isUserEnrolled ? "Resume Journey" : "Preview Syllabus"}
                        </span>
                    </div>
                </div>

                <div className="px-8 pb-8 pt-2">
                    {/* --- 2. PRICING & STATUS (Hierarchy Optimized) --- */}
                    <div className="mb-8">
                        {isUserEnrolled ? (
                            <div className="flex items-center gap-4 p-5 bg-[#14C4E7]/5 rounded-[1.5rem] border border-[#14C4E7]/20 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-16 h-16 bg-[#14C4E7]/10 rounded-bl-full"></div>
                                <CheckCircle className="text-[#14C4E7]" size={28} />
                                <div>
                                    <h3 className="font-black text-[9px] text-[#14C4E7] uppercase tracking-[0.2em] mb-1">
                                        Ownership Verified
                                    </h3>
                                    <p className="font-black text-[#1E2EDE] text-lg uppercase tracking-tight">
                                        Full Lifetime Access
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center justify-between">
                                <div className="flex flex-col">
                                    <span className="text-4xl font-black text-[#1E2EDE] tracking-tighter">
                                        {course.price === 0 ? "FREE" : `₹${courseData.subTotal || course.price}`}
                                    </span>
                                    {course.offerPercentage > 0 && (
                                        <span className="text-slate-300 line-through text-sm font-bold tracking-tight">
                                            ₹{course.price}
                                        </span>
                                    )}
                                </div>
                                {course.offerPercentage > 0 && (
                                    <div className="bg-[#E6D929] text-[#1E2EDE] px-4 py-2 rounded-2xl font-black text-xs uppercase shadow-lg shadow-yellow-100 animate-bounce-subtle">
                                        {course.offerPercentage}% OFF
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* --- 3. DYNAMIC ACTIONS (Mobile Friendly Targets) --- */}
                    <div className="space-y-4 mb-10">
                        {isUserEnrolled ? (
                            <button
                                onClick={onContinueLearning}
                                className="w-full py-5 bg-[#1E2EDE] text-[#FDFDFD] font-black rounded-2xl shadow-xl shadow-blue-100 flex items-center justify-center gap-3 transition-all hover:bg-[#14C4E7] active:scale-95 uppercase text-[11px] tracking-[0.2em]"
                            >
                                <PlayCircle size={22} />
                                Continue Learning
                            </button>
                        ) : (
                            <>
                                <div className="flex gap-4">
                                    <button
                                        onClick={handleCartAction}
                                        disabled={isAddingToCart}
                                        className={`flex-1 py-4 font-black rounded-2xl shadow-xl transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3 uppercase text-[10px] tracking-widest ${
                                            isInCart ? "bg-slate-900 text-[#FDFDFD]" : "bg-[#1E2EDE] text-[#FDFDFD]"
                                        }`}
                                    >
                                        {isAddingToCart ? (
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        ) : (
                                            <ShoppingCart size={18} />
                                        )}
                                        {isInCart ? "View Cart" : "Add to Cart"}
                                    </button>

                                    {isAuthenticated && (
                                        <button
                                            onClick={onToggleWishlist}
                                            disabled={isTogglingWishlist}
                                            className={`p-4 border-2 rounded-2xl transition-all active:scale-95 disabled:opacity-50 ${
                                                isInWishlist
                                                    ? "bg-red-50 border-red-200 text-red-500 shadow-inner"
                                                    : "bg-white border-slate-100 text-slate-300 hover:border-red-200 hover:text-red-500 shadow-sm"
                                            }`}
                                        >
                                            <Heart
                                                size={24}
                                                className={`${isInWishlist ? "fill-current" : ""} ${isTogglingWishlist ? "animate-pulse" : ""}`}
                                            />
                                        </button>
                                    )}
                                </div>

                                <button
                                    onClick={handleEnrollNow}
                                    className="w-full py-5 bg-[#E6D929] text-[#1E2EDE] font-black rounded-2xl shadow-xl shadow-yellow-200 hover:shadow-2xl transition-all active:scale-95 flex items-center justify-center gap-3 uppercase text-[11px] tracking-[0.2em]"
                                >
                                    <Sparkles size={20} />
                                    Enroll Now
                                </button>

                                {!isAuthenticated && (
                                    <button
                                        onClick={handleLoginToPurchase}
                                        className="w-full py-4 border-2 border-slate-100 text-slate-400 font-black rounded-2xl hover:border-[#1E2EDE] hover:text-[#1E2EDE] transition-all text-[10px] uppercase tracking-widest"
                                    >
                                        Login to Purchase
                                    </button>
                                )}
                            </>
                        )}
                    </div>

                    {/* --- 4. ACADEMY EXCELLENCE LIST --- */}
                    <div className="pt-8 border-t border-slate-50">
                        <h4 className="font-black text-[10px] text-slate-300 uppercase tracking-[0.3em] mb-6 flex items-center gap-3">
                            <span className="w-8 h-px bg-slate-100"></span>
                            Course Benefits
                            <span className="w-8 h-px bg-slate-100"></span>
                        </h4>
                        <ul className="space-y-5">
                            {[
                                { icon: <Clock />, text: `${hours}h ${minutes}m Content` },
                                { icon: <FileText />, text: `${totalLessons} Lessons` },
                                { icon: <Infinity />, text: "Lifetime Access" },
                                { icon: <Smartphone />, text: "Mobile Compatible" },
                                { icon: <Award />, text: "Verified Certificate" },
                            ].map((feature, index) => (
                                <li
                                    key={index}
                                    className="flex items-center gap-4 text-xs font-bold text-slate-600 group/item"
                                >
                                    <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center text-[#14C4E7] shrink-0 transition-colors group-hover/item:bg-[#14C4E7] group-hover/item:text-white">
                                        {React.cloneElement(feature.icon, { size: 16 })}
                                    </div>
                                    <span className="group-hover/item:text-[#1E2EDE] transition-colors">
                                        {feature.text}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* --- 5. FOOTER ACTIONS --- */}
                    <div className="mt-12 flex flex-col items-center gap-4">
                        <button className="flex items-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-[#1E2EDE] transition-colors group">
                            <Share2 size={16} className="group-hover:rotate-12 transition-transform" />
                            Spread the Knowledge
                        </button>
                        {isAuthenticated && !isUserEnrolled && (
                            <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-full border border-slate-100">
                                <CheckCircle size={12} className="text-green-500" />
                                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">
                                    30-Day Money-Back Guarantee
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseSidebar;
