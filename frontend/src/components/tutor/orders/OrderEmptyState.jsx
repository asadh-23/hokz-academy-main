import { ShoppingBag, Search, Filter } from "lucide-react";

const OrderEmptyState = ({ hasFilters, onClearFilters }) => {
    if (hasFilters) {
        return (
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
                <div className="p-12 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Search size={24} className="text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No orders match your filters</h3>
                    <p className="text-gray-500 mb-4">
                        Try adjusting your search criteria or clearing the filters.
                    </p>
                    <button
                        onClick={onClearFilters}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                        <Filter size={16} />
                        Clear Filters
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
            <div className="p-12 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <ShoppingBag size={32} className="text-indigo-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No orders yet</h3>
                <p className="text-gray-500 mb-6 max-w-md mx-auto">
                    When students purchase your courses, their orders will appear here. 
                    Start promoting your courses to get your first sale!
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <button className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                        View My Courses
                    </button>
                    <button className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                        Create New Course
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OrderEmptyState;