import { Calendar, User, Eye } from "lucide-react";
import StatusBadge from "./StatusBadge";

const OrderTable = ({ orders, onViewOrder, loading }) => {
    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(price);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
                <div className="p-12 flex justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                </div>
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
                <div className="p-12 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <User size={24} className="text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No orders found</h3>
                    <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Order Details
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Student
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Course
                            </th>
                            <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Earnings
                            </th>
                            <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {orders.map((order) => (
                            <tr key={order.orderId} className="hover:bg-gray-50 transition-colors">
                                {/* Order Details */}
                                <td className="px-6 py-4">
                                    <div className="space-y-1">
                                        <div className="font-mono text-sm font-semibold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md w-fit">
                                            #{order.displayId}
                                        </div>
                                        <div className="flex items-center gap-1 text-xs text-gray-500">
                                            <Calendar size={12} />
                                            {formatDate(order.orderDate)}
                                        </div>
                                    </div>
                                </td>

                                {/* Student */}
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden flex-shrink-0">
                                            {order.student.profileImage ? (
                                                <img 
                                                    src={order.student.profileImage} 
                                                    alt={order.student.name}
                                                    className="w-full h-full object-cover" 
                                                />
                                            ) : (
                                                <User size={16} className="text-gray-500" />
                                            )}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="text-sm font-medium text-gray-900 truncate">
                                                {order.student.name}
                                            </p>
                                            <p className="text-xs text-gray-500 truncate">
                                                {order.student.email}
                                            </p>
                                        </div>
                                    </div>
                                </td>

                                {/* Course */}
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0 border border-gray-200">
                                            <img 
                                                src={order.course.thumbnail} 
                                                alt={order.course.title}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    e.target.src = "https://via.placeholder.com/48x48?text=Course";
                                                }}
                                            />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="text-sm font-medium text-gray-900 line-clamp-2" title={order.course.title}>
                                                {order.course.title}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {order.course.category}
                                            </p>
                                        </div>
                                    </div>
                                </td>

                                {/* Earnings */}
                                <td className="px-6 py-4 text-right">
                                    <div className="space-y-1">
                                        <p className="text-sm font-bold text-emerald-600">
                                            {formatPrice(order.payment.tutorEarning)}
                                        </p>
                                        <p className="text-xs text-gray-400">
                                            from {formatPrice(order.payment.soldPrice)}
                                        </p>
                                    </div>
                                </td>

                                {/* Status */}
                                <td className="px-6 py-4 text-center">
                                    <StatusBadge status={order.status} />
                                </td>

                                {/* Actions */}
                                <td className="px-6 py-4 text-center">
                                    <button 
                                        onClick={() => onViewOrder(order)}
                                        className="p-2 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                                        title="View order details"
                                    >
                                        <Eye size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default OrderTable;