import { Search, Download, Plus } from "lucide-react";

const CouponActions = ({ 
    searchQuery, 
    onSearchChange, 
    filterStatus, 
    onFilterChange, 
    onCreateClick 
}) => {
    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex-1 max-w-md">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search coupons..."
                            value={searchQuery}
                            onChange={onSearchChange}
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <select
                        value={filterStatus}
                        onChange={onFilterChange}
                        className="px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                        <option value="all">All Status</option>
                        <option value="active">Active</option>
                        <option value="expired">Expired</option>
                        <option value="scheduled">Scheduled</option>
                        <option value="inactive">Inactive</option>
                        <option value="sold out">Sold Out</option>
                    </select>

                    

                    <button
                        onClick={onCreateClick}
                        className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl transition-colors shadow-lg shadow-indigo-200"
                    >
                        <Plus className="w-5 h-5" />
                        Create Coupon
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CouponActions;
