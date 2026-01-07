import { Ticket, Calendar, TrendingUp, Percent } from "lucide-react";

const CouponStats = ({ stats }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-blue-50 rounded-xl">
                        <Ticket className="w-6 h-6 text-blue-600" />
                    </div>
                    <span className="text-sm font-medium text-gray-500">Total</span>
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-1">{stats.totalCoupons}</h3>
                <p className="text-sm text-gray-600">Total Coupons</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-green-50 rounded-xl">
                        <Calendar className="w-6 h-6 text-green-600" />
                    </div>
                    <span className="text-sm font-medium text-gray-500">Active</span>
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-1">{stats.activeCoupons}</h3>
                <p className="text-sm text-gray-600">Active Coupons</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-purple-50 rounded-xl">
                        <TrendingUp className="w-6 h-6 text-purple-600" />
                    </div>
                    <span className="text-sm font-medium text-gray-500">Usage</span>
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-1">{stats.totalUsage}</h3>
                <p className="text-sm text-gray-600">Total Usage</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-orange-50 rounded-xl">
                        <Percent className="w-6 h-6 text-orange-600" />
                    </div>
                    <span className="text-sm font-medium text-gray-500">Discount</span>
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-1">₹{stats.totalDiscount.toLocaleString()}</h3>
                <p className="text-sm text-gray-600">Total Discount Given</p>
            </div>
        </div>
    );
};

export default CouponStats;
