import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { X } from "lucide-react";
import { toast } from "sonner";
import {
    createTutorCoupon,
    updateTutorCoupon,
    selectCouponCreateLoading,
    selectCouponUpdateLoading,
} from "../../../store/features/tutor/tutorCouponSlice";

const CreateCouponModal = ({ isOpen, onClose, editData = null }) => {
    const dispatch = useDispatch();
    const isEditMode = !!editData;
    const createLoading = useSelector(selectCouponCreateLoading);
    const updateLoading = useSelector(selectCouponUpdateLoading);
    const isSubmitting = isEditMode ? updateLoading : createLoading;

    const [formData, setFormData] = useState({
        code: "",
        title: "",
        description: "",
        discountType: "percentage",
        discountValue: "",
        maxDiscount: null,
        minPurchase: "",
        usagePerUser: "1",
        startDate: "",
        expiryDate: "",
        totalUsageLimit: "",
    });

    const formatDateForInput = (isoDate) => {
        if (!isoDate) return "";
        return new Date(isoDate).toISOString().split("T")[0];
    };

    useEffect(() => {
        if (editData) {
            setFormData({
                code: editData.code || "",
                title: editData.title || "",
                description: editData.description || "",
                discountType: editData.discountType || "percentage",

                discountValue: editData.discountValue?.toString() || "",
                // Only set maxDiscount if the discount type is percentage
                maxDiscount: editData.discountType === "percentage" 
                    ? (editData.maxDiscountAmount?.toString() || "") 
                    : "",
                minPurchase: editData.minPurchaseAmount?.toString() || "",

                usagePerUser: editData.usagePerUser?.toString() || "1",

                startDate: formatDateForInput(editData.startDate),
                expiryDate: formatDateForInput(editData.expiryDate),

                totalUsageLimit: editData.usageLimit?.toString() || "",
            });
        } else {
            // Reset form for create mode
            setFormData({
                code: "",
                title: "",
                description: "",
                discountType: "percentage",
                discountValue: "",
                maxDiscount: "",
                minPurchase: "",
                usagePerUser: "1",
                startDate: "",
                expiryDate: "",
                totalUsageLimit: "",
            });
        }
    }, [editData, isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "code") {
            setFormData((prev) => ({ ...prev, [name]: value.toUpperCase() }));
            return;
        }

        // Handle discount type change - clear max discount when switching to fixed
        if (name === "discountType") {
            setFormData((prev) => ({
                ...prev,
                [name]: value,
                // Clear max discount when switching to fixed amount
                maxDiscount: value === "fixed" ? null : prev.maxDiscount,
            }));
            return;
        }

        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.code.trim()) return toast.error("Coupon code is required");
        if (!formData.title.trim()) return toast.error("Title is required");
        if (!formData.discountValue) return toast.error("Discount value is required");
        if (!formData.startDate) return toast.error("Start date is required");
        if (!formData.expiryDate) return toast.error("Expiry date is required");

        // ✅ Logical Validations
        if (Number(formData.discountValue) < 0) {
            return toast.error("Discount value cannot be negative");
        }

        if (formData.discountType === "percentage" && Number(formData.discountValue) > 100) {
            return toast.error("Percentage discount cannot exceed 100%");
        }

        if (new Date(formData.startDate) >= new Date(formData.expiryDate)) {
            return toast.error("Expiry date must be after the start date");
        }

        // Validate max discount for percentage type
        if (formData.discountType === "percentage" && formData.maxDiscount) {
            if (Number(formData.maxDiscount) <= 0) {
                return toast.error("Max discount must be greater than 0");
            }
        }

        const couponData = {
            code: formData.code.toUpperCase(),
            title: formData.title,
            description: formData.description,
            discountType: formData.discountType,

            discountValue: Number(formData.discountValue),
            // Only include maxDiscountAmount for percentage type
            maxDiscountAmount: formData.discountType === "percentage" && formData.maxDiscount 
                ? Number(formData.maxDiscount) 
                : undefined,
            minPurchaseAmount: formData.minPurchase ? Number(formData.minPurchase) : 0,

            startDate: formData.startDate,
            expiryDate: formData.expiryDate,

            usagePerUser: Number(formData.usagePerUser),
            usageLimit: formData.totalUsageLimit ? Number(formData.totalUsageLimit) : undefined,
        };

        try {
            if (isEditMode) {
                await dispatch(
                    updateTutorCoupon({
                        couponId: editData._id,
                        couponData,
                    })
                ).unwrap();
                toast.success("Coupon updated successfully!");
            } else {
                await dispatch(createTutorCoupon(couponData)).unwrap();
                toast.success("Coupon created successfully!");
            }
            onClose();
        } catch (error) {
            toast.error(error || (isEditMode ? "Failed to update coupon" : "Failed to create coupon"));
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
                    <h2 className="text-2xl font-bold text-gray-900">{isEditMode ? "Edit Coupon" : "Create New Coupon"}</h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Row 1: Code and Title */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Coupon Code <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="code"
                                value={formData.code}
                                onChange={handleChange}
                                placeholder="SAVE20"
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent uppercase"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Title <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="20% Off on All Courses"
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                required
                            />
                        </div>
                    </div>

                    {/* Row 2: Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Special discount for new students"
                            rows={3}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                        />
                    </div>

                    {/* Row 3: Discount Type, Value, Max Discount */}
                    <div className={`grid grid-cols-1 gap-4 ${formData.discountType === "percentage" ? "md:grid-cols-3" : "md:grid-cols-2"}`}>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Discount Type <span className="text-red-500">*</span>
                            </label>
                            <select
                                name="discountType"
                                value={formData.discountType}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            >
                                <option value="percentage">Percentage (%)</option>
                                <option value="fixed">Fixed Amount (₹)</option>
                            </select>
                            <p className="text-xs text-gray-500 mt-1">
                                {formData.discountType === "percentage" 
                                    ? "Discount as a percentage of the total amount"
                                    : "Fixed discount amount in rupees"
                                }
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Discount Value <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <input
                                    type="number"
                                    name="discountValue"
                                    value={formData.discountValue}
                                    onChange={handleChange}
                                    placeholder={formData.discountType === "percentage" ? "20" : "500"}
                                    min="0"
                                    max={formData.discountType === "percentage" ? "100" : undefined}
                                    className="w-full px-4 py-2.5 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    required
                                />
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                    <span className="text-gray-500 text-sm">
                                        {formData.discountType === "percentage" ? "%" : "₹"}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Conditionally render Max Discount field only for percentage type */}
                        {formData.discountType === "percentage" && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Max Discount (₹)
                                    <span className="text-xs text-gray-500 ml-1">(Optional)</span>
                                </label>
                                <input
                                    type="number"
                                    name="maxDiscount"
                                    value={formData.maxDiscount}
                                    onChange={handleChange}
                                    placeholder="1000"
                                    min="0"
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    Cap the maximum discount amount
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Row 4: Min Purchase and Usage Per User */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Min Purchase Amount (₹)</label>
                            <input
                                type="number"
                                name="minPurchase"
                                value={formData.minPurchase}
                                onChange={handleChange}
                                placeholder="0"
                                min="0"
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Usage Per User</label>
                            <input
                                type="number"
                                name="usagePerUser"
                                value={formData.usagePerUser}
                                onChange={handleChange}
                                placeholder="1"
                                min="1"
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    {/* Row 5: Dates and Total Usage */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Start Date <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="date"
                                name="startDate"
                                value={formData.startDate}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Expiry Date <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="date"
                                name="expiryDate"
                                value={formData.expiryDate}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Total Usage Limit</label>
                            <input
                                type="number"
                                name="totalUsageLimit"
                                value={formData.totalUsageLimit}
                                onChange={handleChange}
                                placeholder="Unlimited"
                                min="1"
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting
                                ? isEditMode
                                    ? "Updating..."
                                    : "Creating..."
                                : isEditMode
                                ? "Update Coupon"
                                : "Create Coupon"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateCouponModal;
