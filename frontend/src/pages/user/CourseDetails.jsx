import { useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import {
    fetchUserCourseDetails,
    selectUserSelectedCourse,
    selectUserCourseDetailsLoading,
} from "../../store/features/user/userCoursesSlice";
import {
    addToUserCart,
    fetchUserCart,
    selectUserAddCartLoadingById,
    selectUserCart,
} from "../../store/features/user/userCartSlice";
import {
    toggleUserWishlist,
    fetchUserWishlist,
    selectUserWishlistLoadingById,
    selectIsInWishlist,
} from "../../store/features/user/userWishlistSlice";
import { PageLoader } from "../../components/common/LoadingSpinner";
import CourseHero from "../../components/user/courseDetails/CourseHero";
import CourseOverview from "../../components/user/courseDetails/CourseOverview";
import CourseMotivation from "../../components/user/courseDetails/CourseMotivation";
import CourseCurriculum from "../../components/user/courseDetails/CourseCurriculum";
import CourseInstructor from "../../components/user/courseDetails/CourseInstructor";
import CourseSidebar from "../../components/user/courseDetails/CourseSidebar";
import { selectUserAuth } from "../../store/features/auth/userAuthSlice";

const CourseDetails = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { isAuthenticated, user } = useSelector(selectUserAuth);

    const courseData = useSelector(selectUserSelectedCourse);
    const loading = useSelector(selectUserCourseDetailsLoading);

    const cart = useSelector(selectUserCart);
    const addToCartLoadingById = useSelector(selectUserAddCartLoadingById);

    const wishlistLoadingById = useSelector(selectUserWishlistLoadingById);
    const isInWishlist = useSelector(selectIsInWishlist(courseId));

    useEffect(() => {
        const loadPageData = async () => {
            try {
                await dispatch(fetchUserCourseDetails({ courseId, userId: user?._id })).unwrap();
                if (isAuthenticated) {
                    await Promise.allSettled([dispatch(fetchUserCart()), dispatch(fetchUserWishlist())]);
                }
            } catch (error) {
                console.error("Failed to load course:", error);
                toast.error("Could not load course details");
                navigate("/user/courses", { replace: true });
            }
        };

        if (courseId) {
            loadPageData();
        }
    }, [courseId, dispatch, navigate, isAuthenticated]);

    // Extract Course and Enrollment Status
    const course = courseData?.course;
    const isEnrolled = courseData?.isEnrolled || false;

    // Memoized Time Calculation
    const { totalLessons, hours, minutes, seconds } = useMemo(() => {
        if (!course) return { totalLessons: 0, hours: 0, minutes: 0, seconds: 0 };

        const totalLessons = course.lessonsCount || 0;
        const totalDurationSeconds = course.totalDurationSeconds || 0;
        const hours = Math.floor(totalDurationSeconds / 3600);
        const minutes = Math.floor((totalDurationSeconds % 3600) / 60);
        const seconds = totalDurationSeconds % 60;

        return { totalLessons, hours, minutes, seconds };
    }, [course]);

    const handleContinueLearning = () => {
        navigate(`/user/learn/${courseId}`);
    };

    const handleAddToCart = async () => {
        // Redirect to login if not authenticated
        if (!isAuthenticated) {
            navigate("/user/login");
            return;
        }

        if (isEnrolled) {
            navigate(`/user/learn/${courseId}`);
            return;
        }

        const isInCart = cart?.items?.some((item) => item.course?._id === courseId);
        if (isInCart) {
            toast.info("Course is already in your cart");
            navigate("/user/cart");
            return;
        }

        try {
            await dispatch(addToUserCart(courseId)).unwrap();
            toast.success("Course added to cart successfully!");
        } catch (error) {
            toast.error(error || "Failed to add course to cart");
        }
    };

    // Handle Wishlist Toggle
    const handleToggleWishlist = async () => {
        // Redirect to login if not authenticated
        if (!isAuthenticated) {
            navigate("/user/login");
            return;
        }

        try {
            const result = await dispatch(toggleUserWishlist(courseId)).unwrap();
            if (result.action === "added") {
                toast.success("Course added to wishlist!");
            } else {
                toast.success("Course removed from wishlist");
            }
        } catch (error) {
            toast.error(error || "Failed to update wishlist");
        }
    };

    if (loading || !courseData || !course) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-50">
                <PageLoader text="Loading course details..." />
            </div>
        );
    }

    const isAddingToCart = addToCartLoadingById[courseId] || false;
    const isTogglingWishlist = wishlistLoadingById[courseId] || false;
    const isInCart = cart?.items?.some((item) => item.course?._id === courseId) || false;

   return (
        <div className="min-h-screen bg-[#FDFDFD]">
            {/* BRANDED HERO */}
            <CourseHero courseData={courseData} />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex flex-col lg:flex-row gap-12">
                    
                    {/* LEFT: CONTENT (66% Width) */}
                    <div className="flex-1 space-y-16">
                        <CourseOverview
                            courseData={courseData}
                            totalLessons={totalLessons}
                            hours={hours}
                            minutes={minutes}
                            seconds={seconds}
                        />

                        <CourseMotivation />

                        <CourseCurriculum
                            courseData={courseData}
                            totalLessons={totalLessons}
                            hours={hours}
                            minutes={minutes}
                            seconds={seconds}
                        />

                        {/* Description Section */}
                        <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm">
                            <h2 className="text-2xl font-black text-[#1E2EDE] mb-6 uppercase tracking-tight">
                                Deep Dive <span className="text-[#14C4E7]">Description</span>
                            </h2>
                            <div className="text-slate-600 leading-relaxed font-medium">
                                <p className="whitespace-pre-wrap">{course.description}</p>
                            </div>
                        </div>

                        <CourseInstructor tutor={course.tutor} averageRating={course.averageRating} />
                    </div>

                    {/* RIGHT: SIDEBAR (33% Width) */}
                    <aside className="w-full lg:w-[400px] shrink-0">
                        <CourseSidebar
                            courseData={courseData}
                            hours={hours}
                            minutes={minutes}
                            seconds={seconds}
                            totalLessons={totalLessons}
                            onAddToCart={handleAddToCart}
                            onToggleWishlist={handleToggleWishlist}
                            isInWishlist={isInWishlist}
                            isInCart={isInCart}
                            isAddingToCart={isAddingToCart}
                            isTogglingWishlist={isTogglingWishlist}
                            onContinueLearning={handleContinueLearning}
                            isEnrolled={isEnrolled}
                            isAuthenticated={isAuthenticated}
                        />
                    </aside>
                </div>
            </main>

            <footer className="bg-[#1E2EDE] py-16 mt-20 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#14C4E7] opacity-5 rounded-full -translate-y-20 translate-x-20"></div>
                <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
                    <div className="text-2xl font-black text-[#FDFDFD] mb-4">HOKZ<span className="text-[#E6D929]">ACADEMY</span></div>
                    <p className="text-[#FDFDFD]/50 text-xs font-bold uppercase tracking-widest">
                        &copy; {new Date().getFullYear()} Hokz Academy. Sculpting the future of education.
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default CourseDetails;
