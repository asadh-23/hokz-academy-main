import { useEffect } from "react";
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

const CourseDetails = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const courseData = useSelector(selectUserSelectedCourse);
    const loading = useSelector(selectUserCourseDetailsLoading);

    const cart = useSelector(selectUserCart);
    const addToCartLoadingById = useSelector(selectUserAddCartLoadingById);

    const wishlistLoadingById = useSelector(selectUserWishlistLoadingById);
    const isInWishlist = useSelector(selectIsInWishlist(courseId));

    useEffect(() => {
        const loadPageData = async () => {
            try {
                await dispatch(fetchUserCourseDetails(courseId)).unwrap();

                await Promise.allSettled([dispatch(fetchUserCart()), dispatch(fetchUserWishlist())]);
            } catch (error) {
                console.error("Failed to load course:", error);
                toast.error("Could not load course details");
                navigate("/user/courses", { replace: true });
            }
        };

        if (courseId) {
            loadPageData();
        }
    }, [courseId, dispatch, navigate]);


    const handleContinueLearning = () => {
        navigate(`/user/learn/${courseId}`);
    };

    const handleAddToCart = async () => {
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

    if (loading || !courseData) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-50">
                <PageLoader text="Loading course details..." />
            </div>
        );
    }

    // Calculate totals from denormalized fields
    const totalLessons = courseData.course.lessonsCount || 0;
    const totalDurationSeconds = courseData.course.totalDurationSeconds || 0;
    const hours = Math.floor(totalDurationSeconds / 3600);
    const minutes = Math.floor((totalDurationSeconds % 3600) / 60);
    const seconds = totalDurationSeconds % 60;

    const isAddingToCart = addToCartLoadingById[courseId] || false;
    const isTogglingWishlist = wishlistLoadingById[courseId] || false;
    const isInCart = cart?.items?.some((item) => item.course?._id === courseId) || false;

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
            <CourseHero courseData={courseData} />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="lg:grid lg:grid-cols-3 lg:gap-12">
                    {/* Left Column - Course Content */}
                    <div className="lg:col-span-2 space-y-10">
                        <CourseOverview
                            courseData={courseData}
                            totalLessons={totalLessons}
                            hours={hours}
                            minutes={minutes}
                            seconds={seconds}
                        />

                        <CourseMotivation />

                        <CourseCurriculum totalLessons={totalLessons} hours={hours} minutes={minutes} seconds={seconds} />

                        {/* Description */}
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Description</h2>
                            <div className="prose prose-indigo text-gray-600 max-w-none">
                                <p className="whitespace-pre-wrap">{courseData.course.description}</p>
                            </div>
                        </div>

                        <CourseInstructor tutor={courseData.course.tutor} averageRating={courseData.course.averageRating} />
                    </div>

                    {/* Right Column - Sidebar */}
                    <div className="lg:col-span-1 relative">
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
                        />
                    </div>
                </div>
            </main>

            {/* --- Footer --- */}
            <footer className="bg-white border-t border-gray-200 mt-20 py-12">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <div className="font-bold text-xl text-gray-800 mb-4">LearnFlow</div>
                    <p className="text-gray-500 text-sm">&copy; 2024 LearnFlow Inc. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default CourseDetails;
