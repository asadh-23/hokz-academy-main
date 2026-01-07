import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { selectUserCart, fetchUserCart, clearUserCart } from "../../store/features/user/userCartSlice";
import { selectUser } from "../../store/features/auth/userAuthSlice";
import StudentDetailsForm from "../../components/user/checkout/StudentDetailsForm";
import CoursesList from "../../components/user/checkout/CoursesList";
import PaymentSummary from "../../components/user/checkout/PaymentSummary";
import { userAxios } from "../../api/userAxios";
import { loadRazorpayScript } from "../../utils/razorpay";

const Checkout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();

    const cart = useSelector(selectUserCart);
    const user = useSelector(selectUser);

    const [couponDiscount, setCouponDiscount] = useState(0);
    const [appliedCoupons, setAppliedCoupons] = useState({});
    const [isProcessing, setIsProcessing] = useState(false);

    const courseData = location.state?.courseData || null;
    const isDirectPurchase = !!courseData;

    useEffect(() => {
        if (!isDirectPurchase) {
            dispatch(fetchUserCart());
        }
    }, [dispatch, isDirectPurchase]);

    let courses = [];
    let initialSubTotal = 0;
    let totalMrp = 0;
    let discountAmount = 0; // This is the COURSE/OFFER discount

    if (isDirectPurchase) {
        if (courseData) {
            courses = [courseData.course];
            initialSubTotal = courseData.subTotal;
            totalMrp = courseData.totalMrp;
            discountAmount = courseData.discountAmount;
        }
    } else {
        if (cart && cart.items) {
            courses = cart.items.map((item) => item.course).filter(Boolean);
            initialSubTotal = cart.subTotal || 0;
            totalMrp = cart.totalMrp;
            discountAmount = cart.discountAmount;
        }
    }

    let tutors = [];
    if (courses.length > 0) {
        const tutorMap = new Map();
        courses.forEach((course) => {
            if (course.tutor && course.tutor._id) {
                const tutorId = course.tutor._id;
                if (tutorMap.has(tutorId)) {
                    tutorMap.get(tutorId).courseCount++;
                } else {
                    tutorMap.set(tutorId, {
                        _id: tutorId,
                        fullName: course.tutor.fullName,
                        courseCount: 1,
                    });
                }
            }
        });
        tutors = Array.from(tutorMap.values());
    }

    // Logic: Subtotal (Price after offer) - Coupon Discount
    const newSubtotal = Math.max(0, initialSubTotal - couponDiscount);
    const finalTax = Math.round(newSubtotal * 0.03);
    const finalTotalAmount = Math.round(newSubtotal + finalTax);

    const toggleCoupon = (tutorId, coupon) => {
        setAppliedCoupons((prev) => {
            const currentTutorCoupons = prev[tutorId] || [];

            const exists = currentTutorCoupons.some((c) => c.code === coupon.code);

            let updatedTutorCoupons;
            if (exists) {
                updatedTutorCoupons = currentTutorCoupons.filter((c) => c.code !== coupon.code);
            } else {
                updatedTutorCoupons = [...currentTutorCoupons, coupon];
            }

            return {
                ...prev,
                [tutorId]: updatedTutorCoupons,
            };
        });
    };

    const updateDiscountAmount = (totalDiscountAmount, lastAppliedCode) => {
        setCouponDiscount(totalDiscountAmount);
    };

    const handleCompletePayment = async () => {
        if (courses.length === 0) {
            toast.error("No courses selected");
            return;
        }

        setIsProcessing(true);

        try {
            const isScriptLoaded = await loadRazorpayScript();
            if (!isScriptLoaded) {
                toast.error("Razorpay SDK failed to load");
                setIsProcessing(false);
                return;
            }

            const createOrderResponse = await userAxios.post("/payment/create-order", {
                courses: courses.map((c) => c._id),
                isDirectPurchase: isDirectPurchase,
                appliedCoupons: appliedCoupons,
            });

            const { order, validatedCoupons } = createOrderResponse.data;
            setAppliedCoupons(validatedCoupons);

            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                amount: order.amount,
                currency: order.currency,
                name: "Hokz Academy",
                description: "Course Enrollment",
                order_id: order.id,
                modal: {
                    ondismiss: function () {
                        setIsProcessing(false);
                        toast.info("Payment cancelled");
                    },
                },
                handler: async function (response) {
                    try {
                        const verifyRes = await userAxios.post("/payment/verify-payment", {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            courses: courses.map((c) => c._id),
                            isDirectPurchase: isDirectPurchase,
                            appliedCoupons: validatedCoupons,
                        });

                        if (verifyRes.data.success) {
                            toast.success("Enrolled Successfully! 🎉");
                            if (!isDirectPurchase) {
                                dispatch(clearUserCart());
                            }
                            navigate("/user/order-success", {
                                state: {
                                    purchasedCourses: courses,
                                    orderData: verifyRes.data.order,
                                },
                            });
                        }
                    } catch (error) {
                        console.error("Verification Error:", error);
                        toast.error("Payment verification failed");
                        setIsProcessing(false);
                    }
                },
                prefill: {
                    name: user?.fullName,
                    email: user?.email,
                    contact: user?.phone,
                },
                theme: {
                    color: "#0891b2",
                },
            };

            const rzp = new window.Razorpay(options);
            rzp.open();

            rzp.on("payment.failed", function (response) {
                toast.error(response.error.description || "Payment Failed");
                setIsProcessing(false);
            });
        } catch (error) {
            console.error("Payment Error:", error);
            toast.error("Failed to initiate payment");
            setIsProcessing(false);
        }
    };

    if (courses.length === 0 && !isProcessing) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">No courses selected</h2>
                    <button
                        onClick={() => navigate("/user/courses")}
                        className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                    >
                        Browse Courses
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        <StudentDetailsForm user={user} />
                        <CoursesList courses={courses} />
                    </div>

                    <div className="lg:col-span-1 space-y-6">
                        <PaymentSummary
                            totalMrp={totalMrp}
                            subtotal={initialSubTotal}
                            totalDiscount={discountAmount}
                            tax={finalTax}
                            total={finalTotalAmount}
                            onCompletePayment={handleCompletePayment}
                            updateDiscountAmount={updateDiscountAmount}
                            isProcessing={isProcessing}
                            tutors={tutors}
                            appliedCoupons={appliedCoupons}
                            onToggleCoupon={toggleCoupon}
                            courses={courses}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
