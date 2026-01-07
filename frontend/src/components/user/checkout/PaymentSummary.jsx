import { useState, useEffect } from "react";
import {
    Tag,
    Lock,
    X,
    TicketPercent,
    ShieldCheck,
    ArrowRight,
    ChevronRight,
    Info,
    User,
    Check,
    ChevronDown,
} from "lucide-react";
import { toast } from "sonner";
import { userAxios } from "../../../api/userAxios";
import CouponBrowseModal from "./CouponBrowseModal";

const PaymentSummary = ({
    totalMrp,
    totalDiscount,
    subtotal,
    tax,
    total,
    onCompletePayment,
    isProcessing,
    updateDiscountAmount,
    tutors,
    appliedCoupons,
    onToggleCoupon,
    courses = [],
}) => {
    const [couponCode, setCouponCode] = useState("");
    const [showCouponModal, setShowCouponModal] = useState(false);

    const [showTutorDropdown, setShowTutorDropdown] = useState(false);
    const [selectedTutorForCoupon, setSelectedTutorForCoupon] = useState(null);

    useEffect(() => {
        if (tutors.length === 1) {
            setSelectedTutorForCoupon(tutors[0]);
        }
    }, [tutors]);
    // Calculate total coupon discount from all applied coupons
    const totalCouponDiscount = Object.values(appliedCoupons).reduce((sum, tutorCoupons) => {
        if (Array.isArray(tutorCoupons)) {
            return sum + tutorCoupons.reduce((tutorSum, coupon) => tutorSum + coupon.discountAmount, 0);
        }
        return sum + (tutorCoupons.discountAmount || 0);
    }, 0);

    useEffect(() => {
        // Parent component-ine puthiya discount amount ariyikkunnu
        updateDiscountAmount(totalCouponDiscount);
    }, [totalCouponDiscount, updateDiscountAmount]);

    const getTutorSpecificTotal = () => {
        if (!selectedTutorForCoupon || !courses) return 0;

        // Filter courses belonging to the selected tutor
        return courses
            .filter((course) => course.tutor && course.tutor._id === selectedTutorForCoupon._id)
            .reduce((sum, course) => {
                const price = course.price || 0;
                const offer = course.offerPercentage || 0;
                const sellingPrice = Math.round(price - (price * offer) / 100);
                return sum + sellingPrice;
            }, 0);
    };

    const handleApplyCoupon = async (codeFromModal) => {
        const codeToApply = typeof codeFromModal === "string" ? codeFromModal : couponCode;

        if (!codeToApply || !codeToApply.trim()) {
            return toast.error("Please enter a coupon code");
        }

        if (!selectedTutorForCoupon) {
            return toast.error("Please select a tutor first");
        }

        const currentTutorTotal = getTutorSpecificTotal();

        const isAlreadyApplied = Object.values(appliedCoupons).some((tutorCoupons) => {
            const coupons = Array.isArray(tutorCoupons) ? tutorCoupons : [tutorCoupons];

            return coupons.some((c) => c.code.toUpperCase() === codeToApply.toUpperCase());
        });

        if (isAlreadyApplied) {
            toast.error("This coupon is already applied");
            setCouponCode(""); // Clear input if needed
            return;
        }

        try {
            const response = await userAxios.post("/payment/apply-coupon", {
                couponCode: codeToApply,
                totalAmount: currentTutorTotal,
                tutorId: selectedTutorForCoupon._id,
            });

            if (response.data.success) {
                toast.success(response.data.message);

                const newCoupon = {
                    tutorId: selectedTutorForCoupon._id,
                    tutorName: selectedTutorForCoupon.fullName,
                    code: codeToApply,
                    discountAmount: response.data.discountAmount,
                    title: response.data.coupon?.title || codeToApply,
                };

                onToggleCoupon(selectedTutorForCoupon._id, newCoupon);

                setCouponCode("");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Invalid Coupon");
            // Clear input only if it was manual entry
            if (!codeFromModal) setCouponCode("");
        }
    };

    const handleRemoveCoupon = (tutorId, couponCode = null) => {
        const tutorCoupons = appliedCoupons[tutorId];
        if (!tutorCoupons) return;

        const couponsArray = Array.isArray(tutorCoupons) ? tutorCoupons : [tutorCoupons];

        if (couponCode) {
            // Remove specific coupon
            const couponToRemove = couponsArray.find((c) => c.code === couponCode);
            if (couponToRemove) {
                onToggleCoupon(tutorId, couponToRemove); // Calls parent to remove
                toast.info(`Coupon ${couponCode} removed`);
            }
        } else {
            // Remove All for this tutor (Loop through and remove all)
            couponsArray.forEach((coupon) => {
                onToggleCoupon(tutorId, coupon);
            });
            toast.info(`All coupons removed for tutor`);
        }
    };

    const handleBrowseCoupons = () => {
        if (!selectedTutorForCoupon) {
            toast.error("Please select a tutor first");
            return;
        }
        setShowCouponModal(true);
    };

    const handleTutorSelect = (tutor) => {
        setSelectedTutorForCoupon(tutor);
        setShowTutorDropdown(false);
    };

    return (
        <>
            <div className="sticky top-24 font-sans">
                {/* Main Card */}
                <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-gray-100 overflow-hidden relative">
                    {/* Header */}
                    <div className="px-6 pt-6 pb-2">
                        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">Order Summary</h2>
                        <p className="text-xs text-slate-500 mt-1">Review your order details below</p>
                    </div>

                    <div className="p-6 space-y-6">
                        {/* --- Coupon Section --- */}
                        <div className="space-y-3">
                            {/* Tutor Selection Dropdown - Show only if multiple tutors */}
                            {tutors.length > 1 && (
                                <div className="space-y-2">
                                    <h3 className="text-sm font-semibold text-gray-700">Choose a Tutor</h3>
                                    <div className="relative">
                                        <button
                                            onClick={() => setShowTutorDropdown(!showTutorDropdown)}
                                            className="w-full flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                                                    <User className="w-4 h-4 text-indigo-600" />
                                                </div>
                                                <div className="text-left">
                                                    <p className="font-medium text-gray-900">
                                                        {selectedTutorForCoupon
                                                            ? selectedTutorForCoupon.fullName
                                                            : "Select a tutor"}
                                                    </p>
                                                    {selectedTutorForCoupon && (
                                                        <p className="text-xs text-gray-500">
                                                            {selectedTutorForCoupon.courseCount} course
                                                            {selectedTutorForCoupon.courseCount > 1 ? "s" : ""} in cart
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                            <ChevronDown
                                                className={`w-4 h-4 text-gray-400 transition-transform ${
                                                    showTutorDropdown ? "rotate-180" : ""
                                                }`}
                                            />
                                        </button>

                                        {showTutorDropdown && (
                                            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                                                {tutors.map((tutor) => (
                                                    <button
                                                        key={tutor._id}
                                                        onClick={() => handleTutorSelect(tutor)}
                                                        className="w-full flex items-center justify-between p-3 hover:bg-gray-50 transition-colors first:rounded-t-lg last:rounded-b-lg"
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                                                                <User className="w-4 h-4 text-indigo-600" />
                                                            </div>
                                                            <div className="text-left">
                                                                <p className="font-medium text-gray-900">
                                                                    {tutor.fullName}
                                                                </p>
                                                                <p className="text-xs text-gray-500">
                                                                    {tutor.courseCount} course
                                                                    {tutor.courseCount > 1 ? "s" : ""}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        {selectedTutorForCoupon &&
                                                            selectedTutorForCoupon._id === tutor._id && (
                                                                <Check className="w-4 h-4 text-green-600" />
                                                            )}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Browse Button */}
                            <button
                                onClick={handleBrowseCoupons}
                                disabled={tutors.length > 1 && !selectedTutorForCoupon}
                                className={`w-full flex items-center justify-between p-3 border rounded-xl transition-all group ${
                                    tutors.length === 1 || selectedTutorForCoupon
                                        ? "bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 border-blue-100"
                                        : "bg-gray-50 border-gray-200 cursor-not-allowed opacity-60"
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div
                                        className={`p-1.5 rounded-md shadow-sm ${
                                            tutors.length === 1 || selectedTutorForCoupon
                                                ? "bg-white text-blue-600"
                                                : "bg-gray-100 text-gray-400"
                                        }`}
                                    >
                                        <TicketPercent className="w-4 h-4" />
                                    </div>
                                    <div className="text-left">
                                        <span
                                            className={`block text-sm font-semibold ${
                                                tutors.length === 1 || selectedTutorForCoupon
                                                    ? "text-blue-900"
                                                    : "text-gray-500"
                                            }`}
                                        >
                                            Browse Coupons
                                        </span>
                                        <span
                                            className={`block text-[10px] ${
                                                tutors.length === 1 || selectedTutorForCoupon
                                                    ? "text-blue-600/80"
                                                    : "text-gray-400"
                                            }`}
                                        >
                                            {tutors.length === 1 || selectedTutorForCoupon
                                                ? "View available offers"
                                                : "Select a tutor first"}
                                        </span>
                                    </div>
                                </div>
                                <ChevronRight
                                    className={`w-4 h-4 transition-transform ${
                                        tutors.length === 1 || selectedTutorForCoupon
                                            ? "text-blue-400 group-hover:translate-x-1"
                                            : "text-gray-300"
                                    }`}
                                />
                            </button>

                            {/* Input Field */}
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Tag className="h-4 w-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                                </div>
                                <input
                                    type="text"
                                    value={couponCode}
                                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                    placeholder="Enter Coupon Code"
                                    disabled={tutors.length > 1 && !selectedTutorForCoupon}
                                    className={`block w-full pl-10 pr-24 py-3 border rounded-xl text-sm font-medium placeholder:text-gray-400 focus:ring-4 transition-all outline-none uppercase tracking-wide ${
                                        tutors.length === 1 || selectedTutorForCoupon
                                            ? "bg-gray-50 border-gray-200 focus:bg-white focus:border-blue-500 focus:ring-blue-500/10"
                                            : "bg-gray-100 border-gray-200 cursor-not-allowed text-gray-400"
                                    }`}
                                />
                                <button
                                    onClick={handleApplyCoupon}
                                    disabled={!couponCode || (tutors.length > 1 && !selectedTutorForCoupon)}
                                    className="absolute right-1.5 top-1.5 bottom-1.5 px-4 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    APPLY
                                </button>
                            </div>

                            {/* Applied Coupons Display */}
                            {Object.keys(appliedCoupons).length > 0 && (
                                <div className="space-y-2">
                                    <h4 className="text-sm font-semibold text-gray-700">Applied Coupons</h4>
                                    {Object.entries(appliedCoupons).map(([tutorId, tutorCoupons]) => {
                                        const couponsArray = Array.isArray(tutorCoupons) ? tutorCoupons : [tutorCoupons];
                                        const tutorName = couponsArray[0]?.tutorName || "Unknown Tutor";
                                        const totalTutorDiscount = couponsArray.reduce(
                                            (sum, coupon) => sum + coupon.discountAmount,
                                            0
                                        );

                                        return (
                                            <div key={tutorId} className="space-y-2">
                                                {/* Tutor Header (if multiple coupons) */}
                                                {couponsArray.length > 1 && (
                                                    <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                                                        <div className="flex items-center gap-2">
                                                            <User className="w-4 h-4 text-gray-600" />
                                                            <span className="text-sm font-medium text-gray-700">
                                                                {tutorName} ({couponsArray.length} coupons)
                                                            </span>
                                                            <span className="text-xs text-gray-500">
                                                                Total savings: ₹{totalTutorDiscount.toLocaleString()}
                                                            </span>
                                                        </div>
                                                        <button
                                                            onClick={() => handleRemoveCoupon(tutorId)}
                                                            className="text-xs text-red-500 hover:text-red-700 font-medium"
                                                        >
                                                            Remove All
                                                        </button>
                                                    </div>
                                                )}

                                                {/* Individual Coupons */}
                                                {couponsArray.map((coupon, index) => (
                                                    <div
                                                        key={`${tutorId}-${coupon.code}-${index}`}
                                                        className="relative overflow-hidden bg-emerald-50/60 border border-emerald-100 rounded-xl p-4"
                                                    >
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-3">
                                                                <div className="bg-white p-2 rounded-full shadow-sm text-emerald-600">
                                                                    <ShieldCheck className="w-5 h-5" />
                                                                </div>
                                                                <div>
                                                                    <p className="text-sm font-bold text-emerald-800 flex items-center gap-1">
                                                                        {coupon.code}
                                                                        <span className="px-1.5 py-0.5 bg-emerald-100 text-[10px] rounded text-emerald-700">
                                                                            APPLIED
                                                                        </span>
                                                                    </p>
                                                                    <p className="text-xs text-emerald-600 mt-0.5">
                                                                        {couponsArray.length === 1 ? coupon.tutorName : ""}
                                                                        {couponsArray.length === 1 && " • "}
                                                                        Savings: ₹{coupon.discountAmount.toLocaleString()}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <button
                                                                onClick={() => handleRemoveCoupon(tutorId, coupon.code)}
                                                                className="p-2 text-emerald-400 hover:text-red-500 hover:bg-white hover:shadow-sm rounded-full transition-all"
                                                            >
                                                                <X className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* --- Price Breakdown --- */}
                        <div className="space-y-3 pt-2">
                            {/* Original Price */}
                            <div className="flex justify-between text-sm text-slate-500">
                                <span>Total MRP</span>
                                <span>₹{(totalMrp || 0).toLocaleString()}</span>
                            </div>

                            {/* Coupon Discounts */}
                            {totalCouponDiscount > 0 && (
                                <div className="flex justify-between text-sm text-blue-600">
                                    <span>Coupon Discount</span>
                                    <span className="font-medium">- ₹{totalCouponDiscount.toLocaleString()}</span>
                                </div>
                            )}
                            {/* Product Discount */}
                            {totalDiscount > 0 && (
                                <div className="flex justify-between text-sm text-emerald-600">
                                    <span>Discount on MRP</span>
                                    <span className="font-medium">- ₹{totalDiscount.toLocaleString()}</span>
                                </div>
                            )}

                            {/* Subtotal (if needed visually, otherwise logic handles it in Total) */}
                            <div className="border-t border-gray-100 my-2 pt-2 flex justify-between text-sm text-slate-600">
                                <span>Subtotal</span>
                                <span className="font-medium text-slate-900">
                                    ₹{(subtotal - totalCouponDiscount).toLocaleString()}
                                </span>
                            </div>

                            {/* Tax */}
                            <div className="flex justify-between text-sm text-slate-600">
                                <span className="flex items-center gap-1">
                                    TAX(3%)
                                    <Info className="w-3 h-3 text-slate-400" />
                                </span>
                                <span className="font-medium text-slate-900">₹{tax.toLocaleString()}</span>
                            </div>
                        </div>

                        {/* Dashed Separator */}
                        <div className="border-t border-dashed border-gray-300 my-4 relative">
                            <div className="absolute -left-8 -top-3 w-6 h-6 rounded-full bg-gray-50/0"></div>
                            <div className="absolute -right-8 -top-3 w-6 h-6 rounded-full bg-gray-50/0"></div>
                        </div>

                        {/* --- Total --- */}
                        <div className="flex justify-between items-end mb-2">
                            <div>
                                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                    Total Amount
                                </p>
                                <p className="text-[10px] text-slate-400 font-light">Inclusive of all taxes</p>
                            </div>
                            <span className="text-3xl font-bold text-slate-900 tracking-tight">
                                ₹{total.toLocaleString()}
                            </span>
                        </div>

                        {/* Razorpay Button */}
                        <div className="space-y-4">
                            <button
                                onClick={onCompletePayment}
                                disabled={isProcessing}
                                className="w-full relative group py-4 bg-[#3399cc] hover:bg-[#2d88b6] text-white font-bold rounded-xl shadow-lg shadow-blue-900/10 transition-all duration-200 disabled:opacity-70 disabled:shadow-none flex items-center justify-center gap-3 overflow-hidden"
                            >
                                {isProcessing ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        <span>Processing...</span>
                                    </>
                                ) : (
                                    <>
                                        <Lock className="w-4 h-4" />
                                        <span>Pay Securely</span>
                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}

                                {/* Shine Effect */}
                                <div className="absolute top-0 -left-full w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-[shimmer_1.5s_infinite]" />
                            </button>

                            {/* Security Badge */}
                            <div className="flex items-center justify-center gap-2 opacity-60">
                                <ShieldCheck className="w-3 h-3 text-slate-500" />
                                <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wide">
                                    Secured by Razorpay
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Decorative Bottom Bar */}
                    <div className="h-1.5 w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>
                </div>
            </div>

            {/* Coupon Browse Modal */}
            <CouponBrowseModal
                isOpen={showCouponModal}
                onClose={() => setShowCouponModal(false)}
                tutorId={selectedTutorForCoupon?._id || (tutors.length === 1 ? tutors[0]._id : null)}
                tutorName={selectedTutorForCoupon?.fullName || (tutors.length === 1 ? tutors[0].fullName : null)}
                totalAmount={getTutorSpecificTotal()}
                onApplyCoupon={handleApplyCoupon}
                appliedCoupons={appliedCoupons}
            />
        </>
    );
};

export default PaymentSummary;
