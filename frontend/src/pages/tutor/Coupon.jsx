import { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import {
    fetchTutorCoupons,
    fetchCouponStats,
    deleteTutorCoupon,
    toggleCouponStatus,
    selectTutorCoupons,
    selectCouponStats,
    selectCouponLoading,
    selectCouponDeleteLoading,
    selectCouponToggleLoading,
} from "../../store/features/tutor/tutorCouponSlice";
import { PageLoader } from "../../components/common/LoadingSpinner";
import CouponStats from "../../components/tutor/coupon/CouponStats";
import CouponActions from "../../components/tutor/coupon/CouponActions";
import CouponTable from "../../components/tutor/coupon/CouponTable";
import CouponEmptyState from "../../components/tutor/coupon/CouponEmptyState";
import CreateCouponModal from "../../components/tutor/coupon/CreateCouponModal";

const Coupon = () => {
    const dispatch = useDispatch();

    const [searchQuery, setSearchQuery] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [editingCoupon, setEditingCoupon] = useState(null);

    const coupons = useSelector(selectTutorCoupons);

    const stats = useSelector(selectCouponStats);
    const loading = useSelector(selectCouponLoading);
    const deleteLoading = useSelector(selectCouponDeleteLoading);
    const toggleLoading = useSelector(selectCouponToggleLoading);

    useEffect(() => {
        dispatch(fetchTutorCoupons());
        dispatch(fetchCouponStats());
    }, [dispatch]);

    const filteredCoupons = useMemo(() => {
        return coupons.filter((coupon) => {
            const matchesSearch =
                coupon.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                coupon.title.toLowerCase().includes(searchQuery.toLowerCase());

            // Helper function to derive status (same as in CouponTable)
            const getCouponStatus = (coupon) => {
                const now = new Date();
                const start = new Date(coupon.startDate);
                const expiry = new Date(coupon.expiryDate);

                if (!coupon.isActive) return "inactive";
                if (expiry < now) return "expired";
                if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) return "sold out";
                if (now < start) return "scheduled";

                return "active";
            };

            // Filter Logic (Fixed)
            let matchesFilter = true;
            if (filterStatus !== "all") {
                const couponStatus = getCouponStatus(coupon);
                matchesFilter = couponStatus === filterStatus;
            }

            return matchesSearch && matchesFilter;
        });
    }, [coupons, searchQuery, filterStatus]);

    const handleEditCoupon = (coupon) => {
        setEditingCoupon(coupon);
        setShowCreateModal(true);
    };

    const handleDeleteCoupon = (couponId, couponCode) => {
        toast.warning(`Are you sure you want to delete coupon "${couponCode}"?`, {
            action: {
                label: "Delete",
                onClick: async () => {
                    try {
                        await dispatch(deleteTutorCoupon(couponId)).unwrap();
                        toast.success("Coupon deleted successfully");
                    } catch (error) {
                        toast.error(error || "Failed to delete coupon");
                    }
                },
            },
            cancel: { label: "Cancel" },
        });
    };

    const handleToggleCoupon = (couponId, couponCode, isActive) => {
        const actionText = isActive ? "unlist" : "list";

        toast.warning(`Are you sure you want to ${actionText} coupon "${couponCode}"?`, {
            action: {
                label: isActive ? "Unlist" : "List",
                onClick: async () => {
                    try {
                        const result = await dispatch(toggleCouponStatus(couponId)).unwrap();
                        toast.success(`Coupon ${result.isActive ? "listed" : "unlisted"} successfully`);
                    } catch (error) {
                        toast.error(error || "Failed to toggle coupon status");
                    }
                },
            },
            cancel: { label: "Cancel" },
        });
    };

    const handleCloseModal = () => {
        setShowCreateModal(false);
        setEditingCoupon(null);
    };

    const handleCreateClick = () => {
        setShowCreateModal(true);
    };

    if (loading && coupons.length === 0) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-50">
                <PageLoader text="Loading coupons..." />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Coupon Management</h1>
                    <p className="text-gray-600">Create and manage discount coupons for your courses</p>
                </div>

                <CouponStats stats={stats} />

                <CouponActions
                    searchQuery={searchQuery}
                    onSearchChange={(e) => setSearchQuery(e.target.value)}
                    filterStatus={filterStatus}
                    onFilterChange={(e) => setFilterStatus(e.target.value)}
                    onCreateClick={handleCreateClick}
                />

                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    {filteredCoupons.length > 0 ? (
                        <CouponTable
                            coupons={filteredCoupons}
                            onEdit={handleEditCoupon}
                            onDelete={handleDeleteCoupon}
                            onToggle={handleToggleCoupon}
                            deleteLoading={deleteLoading}
                            toggleLoading={toggleLoading}
                        />
                    ) : (
                        <CouponEmptyState searchQuery={searchQuery} onCreateClick={handleCreateClick} />
                    )}
                </div>
            </div>

            <CreateCouponModal isOpen={showCreateModal} onClose={handleCloseModal} editData={editingCoupon} />
        </div>
    );
};

export default Coupon;
