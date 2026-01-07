import { Edit2, Copy, Trash2, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

const CouponTable = ({ coupons, onEdit, onDelete, onToggle, deleteLoading, toggleLoading }) => {
    const handleCopyCoupon = (code) => {
        navigator.clipboard.writeText(code);
        toast.success(`Coupon code "${code}" copied!`);
    };

    // Helper function to derive status
    const getCouponStatus = (coupon) => {
        const now = new Date();
        const start = new Date(coupon.startDate); // Start date edukku
        const expiry = new Date(coupon.expiryDate);

        if (!coupon.isActive) return "inactive";
        if (expiry < now) return "expired";
        if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) return "sold out";
        if (now < start) return "scheduled";

        return "active";
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "active":
                return "bg-green-100 text-green-800";
            case "expired":
                return "bg-red-100 text-red-800";
            case "sold out":
                return "bg-orange-100 text-orange-800";
            case "scheduled":
                return "bg-blue-100 text-blue-800"; // Blue color for scheduled
            default:
                return "bg-gray-100 text-gray-800"; // inactive
        }
    };

    return (
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Code
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Title
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Discount
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Usage
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Validity
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Status
                        </th>
                        <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {coupons.map((coupon) => {
                        // Calculate status for this specific row
                        const status = getCouponStatus(coupon);

                        return (
                            <tr key={coupon._id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <code className="px-3 py-1.5 bg-gray-100 text-gray-900 font-mono text-sm font-semibold rounded-lg">
                                            {coupon.code}
                                        </code>
                                        <button
                                            onClick={() => handleCopyCoupon(coupon.code)}
                                            className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors"
                                            title="Copy code"
                                        >
                                            <Copy className="w-4 h-4 text-gray-600" />
                                        </button>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div>
                                        <p className="font-medium text-gray-900">{coupon.title}</p>
                                        <p className="text-sm text-gray-500">{coupon.description}</p>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div>
                                        <p className="font-semibold text-gray-900">
                                            {/* CHANGED: discount -> discountValue */}
                                            {coupon.discountType === "percentage"
                                                ? `${coupon.discountValue}%`
                                                : `₹${coupon.discountValue}`}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {/* CHANGED: minPurchase -> minPurchaseAmount */}
                                            Min: ₹{coupon.minPurchaseAmount}
                                        </p>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div>
                                        <p className="font-medium text-gray-900">
                                            {/* CHANGED: usage -> usedCount */}
                                            {coupon.usedCount} / {coupon.usageLimit || "∞"}
                                        </p>
                                        <div className="w-24 h-2 bg-gray-200 rounded-full mt-1">
                                            <div
                                                className="h-full bg-indigo-600 rounded-full"
                                                style={{
                                                    // Handle infinite limit case for progress bar
                                                    width: coupon.usageLimit
                                                        ? `${(coupon.usedCount / coupon.usageLimit) * 100}%`
                                                        : "0%",
                                                }}
                                            ></div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-sm">
                                        {/* CHANGED: validFrom -> startDate */}
                                        <p className="text-gray-900">{new Date(coupon.startDate).toLocaleDateString()}</p>
                                        {/* CHANGED: validTo -> expiryDate */}
                                        <p className="text-gray-500">
                                            to {new Date(coupon.expiryDate).toLocaleDateString()}
                                        </p>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span
                                        className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                                            status
                                        )}`}
                                    >
                                        {status.charAt(0).toUpperCase() + status.slice(1)}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center justify-end gap-2">
                                        <button
                                            onClick={() => onToggle(coupon._id, coupon.code, coupon.isActive)}
                                            disabled={toggleLoading[coupon._id]}
                                            className={`p-2 rounded-lg transition-colors disabled:opacity-50 ${
                                                coupon.isActive
                                                    ? "hover:bg-orange-50 text-orange-600"
                                                    : "hover:bg-green-50 text-green-600"
                                            }`}
                                            title={coupon.isActive ? "Unlist coupon" : "List coupon"}
                                        >
                                            {toggleLoading[coupon._id] ? (
                                                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                            ) : coupon.isActive ? (
                                                <EyeOff className="w-4 h-4" />
                                            ) : (
                                                <Eye className="w-4 h-4" />
                                            )}
                                        </button>
                                        <button
                                            onClick={() => onEdit(coupon)}
                                            className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => onDelete(coupon._id, coupon.code)}
                                            disabled={deleteLoading[coupon._id]}
                                            className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors disabled:opacity-50"
                                        >
                                            <Trash2
                                                className={`w-4 h-4 ${deleteLoading[coupon._id] ? "animate-spin" : ""}`}
                                            />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default CouponTable;
