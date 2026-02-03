import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Search,
    Filter,
    Eye,
    Calendar,
    User,
    ShoppingBag,
    TrendingUp,
    DollarSign,
    BookOpen,
    AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import { tutorAxios } from "../../api/tutorAxios";
import Pagination from "../../components/common/Pagination";

const TutorOrders = () => {
    const navigate = useNavigate();

    // --- STATE ---
    const [orders, setOrders] = useState([]);
    const [stats, setStats] = useState({
        totalGrossRevenue: 0,
        totalNetEarnings: 0,
        totalPaidOrders: 0,
    });
    const [loading, setLoading] = useState(true);

    // Filters
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

    // --- FETCH DATA ---
    const fetchOrders = async () => {
        setLoading(true);
        try {
            const params = {
                page: filters.page,
                limit: filters.limit,
                search: filters.search,
                ...(filters.status && { status: filters.status }),
            };

            const response = await tutorAxios.get("/orders", { params });

            if (response.data.success) {
                setOrders(response.data.data.orders);
                setStats(response.data.data.stats);
                setPagination(response.data.data.pagination);
            }
        } catch (error) {
            console.error("Fetch Orders Error:", error);
            toast.error("Failed to load orders");
        } finally {
            setLoading(false);
        }
    };

    // Debounced Search Effect
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchOrders();
        }, 500);
        return () => clearTimeout(timer);
    }, [filters]);

    // --- HANDLERS ---
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters((prev) => ({ ...prev, [name]: value, page: 1 }));
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= pagination.totalPages) {
            setFilters((prev) => ({ ...prev, page: newPage }));
        }
    };

    const handleViewDetails = (orderId) => {
        navigate(`/tutor/orders/${orderId}`);
    };

    // --- HELPERS ---
    const formatCurrency = (amount) =>
        new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0,
        }).format(amount || 0);

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-IN", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };

    const getStatusBadge = (status) => {
        const styles = {
            paid: "bg-emerald-100 text-emerald-700 border-emerald-200",
            pending: "bg-amber-100 text-amber-700 border-amber-200",
            failed: "bg-red-100 text-red-700 border-red-200",
        };
        return (
            <span
                className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border ${styles[status] || styles.pending}`}
            >
                {status}
            </span>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6 font-sans">
            {/* --- PAGE HEADER --- */}
            <div className="mb-8 flex flex-col md:flex-row justify-between md:items-end gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">My Orders & Earnings</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Manage your sales, track revenue, and view transaction details.
                    </p>
                </div>
            </div>

            {/* --- STATS CARDS --- */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Card 1: My Net Earnings (Highlighted) */}
                <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-2xl p-6 text-white shadow-xl shadow-indigo-100 transform hover:scale-[1.01] transition-transform">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-indigo-100 text-xs font-bold uppercase tracking-wider mb-1">
                                Total Net Earnings
                            </p>
                            <h2 className="text-3xl font-extrabold tracking-tight">
                                {formatCurrency(stats.totalNetEarnings)}
                            </h2>
                        </div>
                        <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                            <TrendingUp size={24} className="text-white" />
                        </div>
                    </div>
                    <div className="mt-4 flex items-center gap-2">
                        <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded font-medium text-white">
                            Cash in Hand
                        </span>
                        <span className="text-xs text-indigo-200 opacity-80">after platform fees</span>
                    </div>
                </div>

                {/* Card 2: Gross Sales */}
                <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">
                                Total Gross Sales
                            </p>
                            <h2 className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalGrossRevenue)}</h2>
                        </div>
                        <div className="p-2 bg-green-50 rounded-lg">
                            <DollarSign size={24} className="text-green-600" />
                        </div>
                    </div>
                    <p className="mt-4 text-xs text-gray-400">Total sales volume (Tax included)</p>
                </div>

                {/* Card 3: Paid Orders */}
                <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">
                                Successful Orders
                            </p>
                            <h2 className="text-2xl font-bold text-gray-900">{stats.totalPaidOrders}</h2>
                        </div>
                        <div className="p-2 bg-blue-50 rounded-lg">
                            <ShoppingBag size={24} className="text-blue-600" />
                        </div>
                    </div>
                    <p className="mt-4 text-xs text-gray-400">Completed transactions</p>
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
                        placeholder="Search by Order ID, Student Name..."
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm transition"
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
                                    <th className="px-6 py-4">Order ID & Date</th>
                                    <th className="px-6 py-4">Student</th>
                                    <th className="px-6 py-4">Purchased Courses</th>
                                    <th className="px-6 py-4 text-right">My Net Earning</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {orders.map((order) => (
                                    <tr
                                        key={order._id}
                                        onClick={() => handleViewDetails(order._id)}
                                        className="hover:bg-gray-50 transition-colors cursor-pointer group"
                                    >
                                        {/* 1. ID & Date */}
                                        <td className="px-6 py-4">
                                            <div className="font-mono text-xs font-medium text-gray-600 mb-1 bg-gray-100 w-fit px-1.5 py-0.5 rounded border border-gray-200">
                                                #{order.displayId}
                                            </div>
                                            <div className="flex items-center gap-1 text-xs text-gray-400 mt-1">
                                                <Calendar size={12} />
                                                {formatDate(order.date)}
                                            </div>
                                        </td>

                                        {/* 2. Student */}
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                {order.student?.image ? (
                                                    <img
                                                        src={order.student.image}
                                                        alt=""
                                                        className="w-8 h-8 rounded-full object-cover border border-gray-200"
                                                    />
                                                ) : (
                                                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 border border-gray-200">
                                                        <User size={14} />
                                                    </div>
                                                )}
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900 line-clamp-1">
                                                        {order.student?.name}
                                                    </p>
                                                    <p className="text-xs text-gray-500 line-clamp-1">
                                                        {order.student?.email}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>

                                        {/* 3. Courses (Summary) */}
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-2">
                                                {order.items?.slice(0, 1).map((item, idx) => (
                                                    <div key={idx} className="flex items-center gap-2">
                                                        <img
                                                            src={item.thumbnail || "https://via.placeholder.com/40"}
                                                            alt=""
                                                            className="w-8 h-6 rounded object-cover border border-gray-100"
                                                        />
                                                        <div className="max-w-[150px]">
                                                            <p
                                                                className="text-xs font-medium text-gray-900 truncate"
                                                                title={item.title}
                                                            >
                                                                {item.title}
                                                            </p>
                                                            <p className="text-[10px] text-gray-500 truncate">
                                                                {item.category}
                                                            </p>
                                                        </div>
                                                    </div>
                                                ))}
                                                {order.items?.length > 1 && (
                                                    <span className="text-[10px] text-indigo-600 font-medium pl-1 flex items-center gap-1">
                                                        <BookOpen size={10} /> +{order.items.length - 1} more courses
                                                    </span>
                                                )}
                                            </div>
                                        </td>

                                        {/* 4. Financials (Detailed Breakdown: Net, Gross, Fee, Tax) */}
                                        <td className="px-6 py-4 text-right">
                                            {order.status === "paid" ? (
                                                <div className="flex flex-col items-end gap-1">
                                                    {/* A. My Net Earning (Main Highlight) */}
                                                    <span
                                                        className="text-sm font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded border border-emerald-100"
                                                        title="Cash in Hand (Net Earning)"
                                                    >
                                                        {formatCurrency(order.financials?.myNetEarning)}
                                                    </span>

                                                    {/* B. Detailed Breakdown (Small Text) */}
                                                    <div className="flex flex-col items-end text-[10px] text-gray-500 leading-tight gap-0.5 mt-0.5">
                                                        {/* Gross Amount */}
                                                        <span className="font-medium text-gray-700" title="Total User Paid">
                                                            Gross: {formatCurrency(order.financials?.totalOrderValue)}
                                                        </span>

                                                        {/* Deductions Row */}
                                                        <div className="flex items-center gap-1.5 text-gray-400 text-[9px]">
                                                            <span title="Platform Fee (10%)">
                                                                Fee: -{formatCurrency(order.financials?.adminCommission)}
                                                            </span>
                                                            <span className="w-px h-2 bg-gray-300"></span> {/* Separator */}
                                                            <span title="Tax Collected (3%)">
                                                                Tax: -{formatCurrency(order.financials?.taxCollected)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : (
                                                <span className="text-xs text-gray-400 font-medium">-</span>
                                            )}
                                        </td>

                                        {/* 5. Status */}
                                        <td className="px-6 py-4">{getStatusBadge(order.status)}</td>

                                        {/* 6. Action */}
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation(); // Prevent row click
                                                    handleViewDetails(order._id);
                                                }}
                                                className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
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
                            <AlertCircle className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900">No orders found</h3>
                        <p className="text-sm text-gray-500 mt-1 max-w-xs">
                            {filters.search ? "Try adjusting your search criteria." : "You haven't made any sales yet."}
                        </p>
                    </div>
                )}

                {/* --- PAGINATION --- */}
                {!loading && orders.length > 0 && (
                    <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                        <Pagination
                            currentPage={pagination.currentPage}
                            totalPages={pagination.totalPages}
                            totalItems={pagination.totalOrders}
                            itemsPerPage={filters.limit}
                            onPageChange={handlePageChange}
                            label="orders"
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default TutorOrders;
