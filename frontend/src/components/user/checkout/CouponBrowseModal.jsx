import { useState, useEffect } from "react";
import { X, TicketPercent, Calendar, Tag, Percent, IndianRupee, Info, Loader2 } from "lucide-react";
import { userAxios } from "../../../api/userAxios";
import { toast } from "sonner";

const CouponBrowseModal = ({ isOpen, onClose, tutorId, tutorName, totalAmount, onApplyCoupon, appliedCoupons = {} }) => {
    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(false);
    const [applying, setApplying] = useState(null);

    // Helper to ensure we always work with an array
    const getAppliedCouponsArray = () => {
        const data = appliedCoupons[tutorId];
        if (!data) return [];
        return Array.isArray(data) ? data : [data];
    };

    const currentTutorAppliedCoupons = getAppliedCouponsArray();

    const fetchTutorCoupons = async () => {
        setLoading(true);
        try {
            const response = await userAxios.get(`/payment/tutor-coupons/${tutorId}`);
            setCoupons(response.data.coupons || []);
        } catch (error) {
            console.error("Error fetching coupons:", error);
            toast.error("Failed to load coupons");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isOpen && tutorId) {
            fetchTutorCoupons();
        }
    }, [isOpen, tutorId]);

    const handleApplyClick = (coupon) => {
        if (totalAmount < coupon.minPurchaseAmount) {
            toast.error(`Minimum purchase amount is ₹${coupon.minPurchaseAmount}`);
            return;
        }
        setApplying(true);

        onApplyCoupon(coupon.code);

        onClose();
    };

    const calculateDiscount = (coupon) => {
        if (coupon.discountType === "percentage") {
            let discount = (totalAmount * coupon.discountValue) / 100;
            if (coupon.maxDiscountAmount) {
                discount = Math.min(discount, coupon.maxDiscountAmount);
            }
            return Math.round(discount);
        } else {
            return Math.min(coupon.discountValue, totalAmount);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Available Coupons</h2>
                        <p className="text-sm text-gray-500 mt-1">Coupons from {tutorName}</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
                            <span className="ml-3 text-gray-600">Loading coupons...</span>
                        </div>
                    ) : coupons.length === 0 ? (
                        <div className="text-center py-12">
                            <TicketPercent className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No Coupons Available</h3>
                            <p className="text-gray-500">This tutor hasn't created any active coupons yet.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {coupons.map((coupon) => {
                                const discountAmount = calculateDiscount(coupon);
                                const isEligible = totalAmount >= coupon.minPurchaseAmount;

                                // ✅ Logic uses 'isCouponApplied'
                                const isCouponApplied = currentTutorAppliedCoupons.some(
                                    (c) => c.code.toUpperCase() === coupon.code.toUpperCase()
                                );

                                const isApplyingThis = applying === coupon._id;

                                return (
                                    <div
                                        key={coupon._id}
                                        // ✅ FIXED: Using 'isCouponApplied' everywhere below
                                        className={`border rounded-xl p-4 transition-all ${
                                            isCouponApplied
                                                ? "border-yellow-200 bg-yellow-50/30"
                                                : isEligible
                                                ? "border-indigo-200 bg-indigo-50/30 hover:bg-indigo-50/50"
                                                : "border-gray-200 bg-gray-50/50"
                                        }`}
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                {/* Coupon Header */}
                                                <div className="flex items-center gap-3 mb-3">
                                                    <div
                                                        className={`p-2 rounded-lg ${
                                                            isEligible
                                                                ? "bg-indigo-100 text-indigo-600"
                                                                : "bg-gray-100 text-gray-400"
                                                        }`}
                                                    >
                                                        <TicketPercent className="w-5 h-5" />
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <span
                                                                className={`font-bold text-lg ${
                                                                    isCouponApplied
                                                                        ? "text-yellow-700"
                                                                        : isEligible
                                                                        ? "text-indigo-900"
                                                                        : "text-gray-500"
                                                                }`}
                                                            >
                                                                {coupon.code}
                                                            </span>
                                                            <span
                                                                className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                                    isCouponApplied
                                                                        ? "bg-yellow-100 text-yellow-700"
                                                                        : isEligible
                                                                        ? "bg-green-100 text-green-700"
                                                                        : "bg-gray-100 text-gray-500"
                                                                }`}
                                                            >
                                                                {isCouponApplied
                                                                    ? "Already Applied"
                                                                    : isEligible
                                                                    ? "Eligible"
                                                                    : "Not Eligible"}
                                                            </span>
                                                        </div>
                                                        <h3
                                                            className={`font-semibold ${
                                                                isEligible ? "text-gray-900" : "text-gray-500"
                                                            }`}
                                                        >
                                                            {coupon.title}
                                                        </h3>
                                                    </div>
                                                </div>

                                                {/* Coupon Details */}
                                                <div className="grid grid-cols-2 gap-4 mb-3">
                                                    <div className="flex items-center gap-2 text-sm">
                                                        {coupon.discountType === "percentage" ? (
                                                            <Percent className="w-4 h-4 text-gray-400" />
                                                        ) : (
                                                            <IndianRupee className="w-4 h-4 text-gray-400" />
                                                        )}
                                                        <span className="text-gray-600">
                                                            {coupon.discountType === "percentage"
                                                                ? `${coupon.discountValue}% off`
                                                                : `₹${coupon.discountValue} off`}
                                                            {coupon.maxDiscountAmount &&
                                                                coupon.discountType === "percentage" && (
                                                                    <span className="text-xs text-gray-500">
                                                                        {" "}
                                                                        (max ₹{coupon.maxDiscountAmount})
                                                                    </span>
                                                                )}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-sm">
                                                        <Calendar className="w-4 h-4 text-gray-400" />
                                                        <span className="text-gray-600">
                                                            Valid till {formatDate(coupon.expiryDate)}
                                                        </span>
                                                    </div>
                                                </div>

                                                {coupon.description && (
                                                    <p className="text-sm text-gray-600 mb-3">{coupon.description}</p>
                                                )}

                                                {coupon.minPurchaseAmount > 0 && (
                                                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                                                        <Info className="w-3 h-3" />
                                                        <span>Minimum purchase: ₹{coupon.minPurchaseAmount}</span>
                                                    </div>
                                                )}

                                                {/* Savings Display */}
                                                {isEligible && !isCouponApplied && (
                                                    <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-3">
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-sm font-medium text-green-800">
                                                                You'll save:
                                                            </span>
                                                            <span className="text-lg font-bold text-green-600">
                                                                ₹{discountAmount}
                                                            </span>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Already Applied Message */}
                                                {isCouponApplied && (
                                                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-3">
                                                        <span className="text-sm text-yellow-700 font-medium">
                                                            This coupon is already applied in your order
                                                        </span>
                                                    </div>
                                                )}

                                                {/* Not Eligible Message */}
                                                {!isCouponApplied && !isEligible && (
                                                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-3">
                                                        <span className="text-sm text-gray-600">
                                                            Add ₹{coupon.minPurchaseAmount - totalAmount} more to use this
                                                            coupon
                                                        </span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Apply Button */}
                                            <div className="ml-4">
                                                <button
                                                    onClick={() => handleApplyClick(coupon)}
                                                    disabled={!isEligible || isApplyingThis || isCouponApplied}
                                                    className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                                                        isCouponApplied
                                                            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                                            : isEligible
                                                            ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                                                            : "bg-gray-200 text-gray-400 cursor-not-allowed"
                                                    }`}
                                                >
                                                    {isApplyingThis ? (
                                                        <div className="flex items-center gap-2">
                                                            <Loader2 className="w-4 h-4 animate-spin" />
                                                            Applying...
                                                        </div>
                                                    ) : isCouponApplied ? (
                                                        "Applied"
                                                    ) : (
                                                        "Apply"
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CouponBrowseModal;
