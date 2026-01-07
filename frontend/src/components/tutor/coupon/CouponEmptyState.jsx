import { Ticket, Plus } from "lucide-react";

const CouponEmptyState = ({ searchQuery, onCreateClick }) => {
    return (
        <div className="text-center py-12">
            <Ticket className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No coupons found</h3>
            <p className="text-gray-600 mb-6">
                {searchQuery ? "Try adjusting your search" : "Create your first coupon to get started"}
            </p>
            {!searchQuery && (
                <button
                    onClick={onCreateClick}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl transition-colors"
                >
                    <Plus className="w-5 h-5" />
                    Create Coupon
                </button>
            )}
        </div>
    );
};

export default CouponEmptyState;
