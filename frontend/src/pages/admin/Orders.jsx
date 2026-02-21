import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Search,
    Filter,
    ChevronLeft,
    ChevronRight,
    Eye,
    ShoppingBag,
    Calendar,
    User,
    IndianRupee,
    BookOpen,
    Landmark,
    TrendingUp,
} from "lucide-react";
import { toast } from "sonner";
import { adminAxios } from "../../api/adminAxios";
import { formatText } from "../../utils/formatText";

const Orders = () => {
    const navigate = useNavigate();

    const [orders, setOrders] = useState([]);
    const [stats, setStats] = useState({
        totalRevenue: 0,
        totalTaxCollected: 0,
        totalCoursesSold: 0,
        totalOrders: 0,
    });
    const [loading, setLoading] = useState(true);

    // Filter & Pagination State
    const [filters, setFilters] = useState({
        search: "",
        status: "", // 'paid', 'pending', 'failed'
        page: 1,
        limit: 10,
    });

    const [pagination, setPagination] = useState({
        totalPages: 1,
        totalOrders: 0,
        currentPage: 1,
    });

    // 1. Fetch Orders Function
    const fetchOrders = async () => {
        setLoading(true);
        try {
            const params = {
                page: filters.page,
                limit: filters.limit,
                search: filters.search,
                ...(filters.status && { status: filters.status }),
            };

            const response = await adminAxios.get("/orders", { params });

            if (response.data.success) {
                setOrders(response.data.data.orders);
                setPagination(response.data.data.pagination);
                setStats(response.data.data.stats);
            }
        } catch (error) {
            console.error("Fetch Orders Error:", error);
            toast.error("Failed to load orders");
        } finally {
            setLoading(false);
        }
    };

    // 2. Debounced Search Effect
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchOrders();
        }, 500); // 500ms delay to prevent too many API calls while typing

        return () => clearTimeout(timer);
    }, [filters]);

    // Handlers
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters((prev) => ({ ...prev, [name]: value, page: 1 }));
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= pagination.totalPages) {
            setFilters((prev) => ({ ...prev, page: newPage }));
        }
    };

    // Formatters
    const formatCurrency = (amount) =>
        new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0,
        }).format(amount || 0);

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-IN", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "paid":
                return "bg-emerald-100 text-emerald-700 border-emerald-200";
            case "pending":
                return "bg-amber-100 text-amber-700 border-amber-200";
            case "failed":
                return "bg-red-100 text-red-700 border-red-200";
            default:
                return "bg-gray-100 text-gray-700 border-gray-200";
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6 md:p-8 font-sans">
            {/* --- PAGE HEADER --- */}

            <div className="mb-10 text-center md:text-left">
                <h2 className="text-3xl font-black text-[#1E2EDE] tracking-tighter uppercase">
                    Order <span className="text-[#14C4E7]">Details</span>
                </h2>
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.25em] mt-1">
                    Overview of all transactions and enrollments.
                </p>
                <div className="h-1 w-20 bg-[#E6D929] mt-4 rounded-full mx-auto md:mx-0"></div>
            </div>

            {/* --- STATS CARDS --- */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {/* Card 1: Total Revenue */}
                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-start justify-between">
                    <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Total Revenue</p>
                        <h3 className="text-xl font-bold text-gray-900 mt-1">{formatCurrency(stats.totalRevenue)}</h3>
                    </div>
                    <div className="p-2 bg-green-50 rounded-lg text-green-600">
                        <IndianRupee size={20} />
                    </div>
                </div>

                {/* Card 2: Total Orders */}
                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-start justify-between">
                    <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Total Orders</p>
                        <h3 className="text-xl font-bold text-gray-900 mt-1">{stats.totalOrders}</h3>
                    </div>
                    <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                        <ShoppingBag size={20} />
                    </div>
                </div>

                {/* Card 3: Courses Sold */}
                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-start justify-between">
                    <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Courses Sold</p>
                        <h3 className="text-xl font-bold text-gray-900 mt-1">{stats.totalCoursesSold}</h3>
                    </div>
                    <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
                        <BookOpen size={20} />
                    </div>
                </div>

                {/* Card 4: Tax Collected */}
                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-start justify-between">
                    <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Tax Collected</p>
                        <h3 className="text-xl font-bold text-gray-900 mt-1">{formatCurrency(stats.totalTaxCollected)}</h3>
                    </div>
                    <div className="p-2 bg-orange-50 rounded-lg text-orange-600">
                        <Landmark size={20} />
                    </div>
                </div>
            </div>

            {/* --- FILTER BAR --- */}
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm mb-6 flex flex-col md:flex-row gap-4 justify-between items-center">
                {/* Search */}
                <div className="relative flex-1 w-full md:max-w-md">
                    <Search className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
                    <input
                        type="text"
                        name="search"
                        value={filters.search}
                        onChange={handleFilterChange}
                        placeholder="Search by Order ID, Name or Email..."
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm"
                    />
                </div>

                {/* Status Filter */}
                <div className="relative w-full md:w-48">
                    <Filter className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
                    <select
                        name="status"
                        value={filters.status}
                        onChange={handleFilterChange}
                        className="w-full pl-10 pr-8 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm bg-white appearance-none cursor-pointer"
                    >
                        <option value="">All Status</option>
                        <option value="paid">Paid</option>
                        <option value="pending">Pending</option>
                        <option value="failed">Failed</option>
                    </select>
                </div>
            </div>

            {/* --- ORDERS TABLE --- */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                {loading ? (
                    <div className="h-64 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                    </div>
                ) : orders.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase text-gray-500 font-semibold">
                                    <th className="px-6 py-4">Order Info</th>
                                    <th className="px-6 py-4">Student</th>
                                    <th className="px-6 py-4">Courses</th>
                                    <th className="px-6 py-4">Financials</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {orders.map((order) => (
                                    <tr
                                        key={order._id}
                                        className="hover:bg-gray-50 transition-colors"
                                        onClick={() => navigate(`/admin/orders/${order._id}`)}
                                    >
                                        {/* 1. ID & Date */}
                                        <td className="px-6 py-4">
                                            <div className="font-mono text-xs font-medium text-gray-500 mb-1">
                                                #
                                                {order.razorpayOrderId
                                                    ? order.razorpayOrderId.split("_")[1]
                                                    : order._id.slice(-6).toUpperCase()}
                                            </div>
                                            <div className="flex items-center gap-1 text-xs text-gray-900 font-medium">
                                                <Calendar size={12} className="text-gray-400" />
                                                {formatDate(order.createdAt)}
                                            </div>
                                        </td>

                                        {/* 2. Student */}
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                {order.user?.profileImage ? (
                                                    <img
                                                        src={order.user.profileImage}
                                                        alt=""
                                                        className="w-8 h-8 rounded-full object-cover border border-gray-200"
                                                    />
                                                ) : (
                                                    <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                                                        <User size={14} />
                                                    </div>
                                                )}
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900">
                                                        {formatText(order.user?.fullName, 17) || "Unknown"}
                                                    </p>
                                                    <p className="text-xs text-gray-500">{order.user?.email}</p>
                                                </div>
                                            </div>
                                        </td>

                                        {/* 3. Courses */}
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-2">
                                                {order.items?.slice(0, 2).map((item, idx) => (
                                                    <div key={idx} className="flex items-center gap-2">
                                                        <img
                                                            src={
                                                                item.course?.thumbnailUrl ||
                                                                "https://via.placeholder.com/40"
                                                            }
                                                            alt=""
                                                            className="w-8 h-6 rounded object-cover border border-gray-100"
                                                        />
                                                        <div className="max-w-[150px]">
                                                            <p
                                                                className="text-xs font-medium text-gray-900 truncate"
                                                                title={item.course?.title}
                                                            >
                                                                {formatText(item.course?.title, 18)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                ))}
                                                {/* Show +More if multiple items */}
                                                {order.items?.length > 2 && (
                                                    <span className="text-[10px] text-gray-500 pl-1">
                                                        +{order.items.length - 2} more items...
                                                    </span>
                                                )}
                                            </div>
                                        </td>

                                        {/* 4. Financials (Total + Admin Profit) */}
                                        <td className="px-6 py-4">
                                            <div>
                                                <p className="text-sm font-bold text-gray-900">
                                                    {formatCurrency(order.finalAmount)}
                                                </p>
                                                {order.adminProfit > 0 && (
                                                    <div className="flex items-center gap-1 text-[10px] font-medium text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded w-fit mt-1">
                                                        <TrendingUp size={10} />
                                                        Profit: {formatCurrency(order.adminProfit)}
                                                    </div>
                                                )}
                                            </div>
                                        </td>

                                        {/* 5. Status */}
                                        <td className="px-6 py-4">
                                            <span
                                                className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase border ${getStatusColor(order.status)}`}
                                            >
                                                {order.status}
                                            </span>
                                        </td>

                                        {/* 6. Action */}
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => navigate(`/admin/orders/${order._id}`)}
                                                className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                                                title="View Details"
                                            >
                                                <Eye size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-80 text-center">
                        <div className="p-4 bg-gray-50 rounded-full mb-3">
                            <ShoppingBag className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900">No orders found</h3>
                        <p className="text-sm text-gray-500 mt-1 max-w-xs">Try adjusting your search or filters.</p>
                    </div>
                )}

                {/* --- PAGINATION --- */}
                {!loading && orders.length > 0 && (
                    <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50">
                        <p className="text-xs text-gray-500">
                            Page <span className="font-bold text-gray-800">{pagination.currentPage}</span> of{" "}
                            {pagination.totalPages}
                        </p>
                        <div className="flex gap-2">
                            <button
                                onClick={() => handlePageChange(filters.page - 1)}
                                disabled={filters.page === 1}
                                className="p-1.5 rounded-lg border border-gray-300 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                            >
                                <ChevronLeft size={16} />
                            </button>
                            <button
                                onClick={() => handlePageChange(filters.page + 1)}
                                disabled={filters.page === pagination.totalPages}
                                className="p-1.5 rounded-lg border border-gray-300 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                            >
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Orders;
