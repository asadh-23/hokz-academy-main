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
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose} />
            <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg max-h-[85vh] overflow-hidden relative z-10 animate-in zoom-in-95 duration-300">
                {/* Header */}
                <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <div>
                        <h2 className="text-2xl font-black text-slate-900">Best Offers</h2>
                        <p className="text-slate-500 text-sm mt-1">Available coupons for <span className="font-bold text-indigo-600">{tutorName}</span></p>
                    </div>
                    <button onClick={onClose} className="p-2.5 bg-white border border-slate-200 hover:bg-slate-50 rounded-full transition-all">
                        <X className="w-5 h-5 text-slate-500" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-8 overflow-y-auto max-h-[calc(85vh-160px)] custom-scrollbar">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-4">
                            <div className="w-12 h-12 border-4 border-indigo-50 border-t-indigo-600 rounded-full animate-spin"></div>
                            <span className="text-slate-400 font-bold uppercase text-xs tracking-widest">Searching...</span>
                        </div>
                    ) : coupons.length === 0 ? (
                        <div className="text-center py-20">
                            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                <TicketPercent className="w-10 h-10 text-slate-200" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900">No offers found</h3>
                            <p className="text-slate-500 text-sm">Check back later for seasonal promotions.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {coupons.map((coupon) => {
                                const isEligible = totalAmount >= coupon.minPurchaseAmount;
                                const isCouponApplied = currentTutorAppliedCoupons.some(c => c.code.toUpperCase() === coupon.code.toUpperCase());
                                
                                return (
                                    <div 
                                        key={coupon._id}
                                        className={`group relative p-5 rounded-2xl border-2 transition-all duration-300 ${
                                            isCouponApplied ? "border-emerald-500 bg-emerald-50/20" : 
                                            isEligible ? "border-slate-100 bg-white hover:border-indigo-500 hover:shadow-xl hover:shadow-indigo-500/5" : 
                                            "border-slate-50 bg-slate-50/30 opacity-70"
                                        }`}
                                    >
                                        <div className="flex justify-between items-start gap-4">
                                            <div className="space-y-3">
                                                <div className="flex items-center gap-2">
                                                    <span className={`text-lg font-black tracking-tighter ${isEligible ? "text-slate-900" : "text-slate-400"}`}>
                                                        {coupon.code}
                                                    </span>
                                                    {isCouponApplied && <span className="bg-emerald-500 text-white text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest">Active</span>}
                                                </div>
                                                
                                                <div className="space-y-1">
                                                    <h4 className="text-sm font-bold text-slate-700">{coupon.title}</h4>
                                                    <p className="text-xs text-slate-500 leading-relaxed">{coupon.description}</p>
                                                </div>

                                                <div className="flex items-center gap-3 pt-2">
                                                    <div className="flex items-center gap-1 text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md">
                                                        <Percent className="w-3 h-3" />
                                                        {coupon.discountType === 'percentage' ? `${coupon.discountValue}% OFF` : `₹${coupon.discountValue} OFF`}
                                                    </div>
                                                    <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400">
                                                        <Calendar className="w-3 h-3" />
                                                        {formatDate(coupon.expiryDate)}
                                                    </div>
                                                </div>
                                            </div>

                                            <button
                                                onClick={() => handleApplyClick(coupon)}
                                                disabled={!isEligible || applying === coupon._id || isCouponApplied}
                                                className={`shrink-0 px-5 py-2.5 rounded-xl font-black text-xs transition-all ${
                                                    isCouponApplied ? "bg-emerald-100 text-emerald-600 cursor-default" :
                                                    isEligible ? "bg-slate-900 text-white hover:bg-indigo-600 active:scale-95 shadow-lg shadow-slate-200" :
                                                    "bg-slate-200 text-slate-400 cursor-not-allowed"
                                                }`}
                                            >
                                                {applying === coupon._id ? "..." : isCouponApplied ? "APPLIED" : "APPLY"}
                                            </button>
                                        </div>

                                        {!isEligible && (
                                            <div className="mt-4 pt-4 border-t border-dashed border-slate-100">
                                                <p className="text-[10px] font-bold text-rose-500 uppercase tracking-tighter">
                                                    Spend ₹{coupon.minPurchaseAmount - totalAmount} more to unlock
                                                </p>
                                            </div>
                                        )}
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
