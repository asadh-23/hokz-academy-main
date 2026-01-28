import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
    Search,
    Download,
    CheckCircle,
    Clock,
    XCircle,
    ChevronRight,
    BookOpen,
    AlertCircle,
    TicketPercent,
    LayoutGrid,
} from "lucide-react";
import { toast } from "sonner";
import { userAxios } from "../../api/userAxios";

const MyOrders = () => {
    const navigate = useNavigate();

    // Local State
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [activeTab, setActiveTab] = useState("All");

    // Fetch Orders directly on Mount
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                setLoading(true);
                const response = await userAxios.get("/payment/orders/my-orders");
                if (response.data.success) {
                    setOrders(response.data.data);
                }
            } catch (error) {
                console.error("Error fetching orders:", error);
                toast.error("Failed to load your orders");
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const handleViewDetails = (order) => {
        const formattedCourses = order.items.map((item) => ({
            ...item.course,
            price: item.discountedPrice,
        }));

        navigate("/user/order-success", {
            state: {
                orderData: order,
                purchasedCourses: formattedCourses,
            },
        });
    };

    // Helper: Get Status Styles
    const getStatusStyle = (status) => {
        switch (status?.toLowerCase()) {
            case "paid":
                return "bg-emerald-50 text-emerald-700 border-emerald-200";
            case "pending":
                return "bg-amber-50 text-amber-700 border-amber-200";
            case "failed":
                return "bg-red-50 text-red-700 border-red-200";
            default:
                return "bg-gray-50 text-gray-700 border-gray-200";
        }
    };

    // Logic: Filter Orders based on Tab & Search
    const filteredOrders = orders.filter((order) => {
        const matchesTab =
            activeTab === "All" ||
            (activeTab === "Success" && order.status === "paid") ||
            (activeTab === "Pending" && order.status === "pending") ||
            (activeTab === "Cancelled" && order.status === "failed");

        const searchLower = searchTerm.toLowerCase();
        const matchesSearch =
            order._id.toLowerCase().includes(searchLower) ||
            (order.razorpayOrderId && order.razorpayOrderId.toLowerCase().includes(searchLower)) ||
            order.items?.some((item) => item.course?.title?.toLowerCase().includes(searchLower));

        return matchesTab && matchesSearch;
    });

    // Skeleton Component
    const OrderSkeleton = () => (
        <div className="bg-white border border-gray-100 rounded-2xl p-6 space-y-4 animate-pulse">
            <div className="flex justify-between border-b pb-4">
                <div className="h-8 w-1/3 bg-gray-200 rounded"></div>
                <div className="h-8 w-20 bg-gray-200 rounded-full"></div>
            </div>
            <div className="flex gap-4">
                <div className="w-32 h-20 bg-gray-200 rounded-lg"></div>
                <div className="flex-1 space-y-2">
                    <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
                    <div className="h-3 w-1/4 bg-gray-200 rounded"></div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#f8fafc] py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
                {/* Breadcrumb & Navigation */}
                <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
                    <Link to="/" className="hover:text-blue-600 transition-colors">
                        Home
                    </Link>
                    <ChevronRight className="w-4 h-4" />
                    <span className="text-gray-900 font-medium">My Orders</span>
                </nav>

                {/* Header Section */}
                <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Purchase History</h1>
                        <p className="text-gray-500 mt-1">Manage your course enrollments and billing details.</p>
                    </div>

                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search Order ID or Course..."
                            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* Filters */}
                <div className="flex gap-2 mb-8 overflow-x-auto pb-2 no-scrollbar">
                    {["All", "Success", "Pending", "Cancelled"].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-5 py-2 rounded-full text-sm font-semibold transition-all whitespace-nowrap border ${
                                activeTab === tab
                                    ? "bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-200"
                                    : "bg-white text-gray-600 border-gray-200 hover:border-blue-300 hover:text-blue-600"
                            }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Orders List */}
                <div className="space-y-6">
                    {loading ? (
                        [1, 2, 3].map((i) => <OrderSkeleton key={i} />)
                    ) : filteredOrders.length > 0 ? (
                        filteredOrders.map((order) => (
                            <div
                                key={order._id}
                                className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden hover:border-blue-200 transition-all"
                            >
                                {/* Order Top Bar */}
                                <div className="bg-gray-50/80 p-5 border-b border-gray-100 flex flex-wrap justify-between items-center gap-4">
                                    <div className="grid grid-cols-2 sm:flex gap-4 md:gap-8">
                                        <div>
                                            <p className="text-[11px] uppercase font-bold text-gray-400 tracking-widest">
                                                Order ID
                                            </p>
                                            <p className="font-mono text-sm text-gray-700 font-semibold">
                                                #
                                                {order.razorpayOrderId
                                                    ? order.razorpayOrderId.slice(-10).toUpperCase()
                                                    : order._id.slice(-8).toUpperCase()}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-[11px] uppercase font-bold text-gray-400 tracking-widest">
                                                Date
                                            </p>
                                            <p className="text-sm text-gray-700 font-semibold">
                                                {new Date(order.createdAt).toLocaleDateString("en-US", {
                                                    month: "short",
                                                    day: "numeric",
                                                    year: "numeric",
                                                })}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-[11px] uppercase font-bold text-gray-400 tracking-widest">
                                                Status
                                            </p>
                                            <span
                                                className={`inline-flex items-center px-2.5 py-0.5 mt-0.5 rounded-full text-xs font-bold border ${getStatusStyle(order.status)}`}
                                            >
                                                {order.status === "paid" && <CheckCircle className="w-3 h-3 mr-1" />}
                                                {order.status === "pending" && <Clock className="w-3 h-3 mr-1" />}
                                                {order.status === "failed" && <XCircle className="w-3 h-3 mr-1" />}
                                                <span className="capitalize">{order.status}</span>
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 ml-auto sm:ml-0">
                                        {order.status === "paid" && (
                                            <button
                                                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                                title="Download Invoice"
                                            >
                                                <Download className="w-5 h-5" />
                                            </button>
                                        )}
                                        <button
                                            onClick={() => handleViewDetails(order)}
                                            className="inline-flex items-center bg-white border border-gray-300 text-gray-700 px-4 py-2
                                        rounded-lg text-sm font-bold hover:bg-gray-50 hover:border-gray-400 transition-all
                                        active:scale-95 shadow-sm"
                                        >
                                            View Details
                                            <ChevronRight className="w-4 h-4 ml-1" />
                                        </button>
                                    </div>
                                </div>

                                {/* Order Items */}
                                <div className="divide-y divide-gray-100">
                                    {order.items?.map((item) => (
                                        <div
                                            key={item._id}
                                            className="p-5 flex flex-col sm:flex-row items-start sm:items-center gap-5 group"
                                        >
                                            <div className="relative w-full sm:w-36 h-24 overflow-hidden rounded-xl border border-gray-100 flex-shrink-0 shadow-sm">
                                                <img
                                                    src={
                                                        item.course?.thumbnailUrl ||
                                                        "https://via.placeholder.com/300x200?text=Course"
                                                    }
                                                    alt={item.course?.title}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                />
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-gray-900 font-bold text-lg leading-tight truncate group-hover:text-blue-600 transition-colors">
                                                    {item.course?.title || "Course Details Unavailable"}
                                                </h3>
                                                <p className="text-sm text-gray-500 mt-1 flex items-center">
                                                    <span className="font-medium text-gray-700">Instructor:</span>
                                                    <span className="ml-1">
                                                        {item.course?.tutor?.fullName || "Hokz Academy"}
                                                    </span>
                                                </p>

                                                {order.status === "paid" && (
                                                    <div className="mt-3">
                                                        <button
                                                            onClick={() => navigate(`/user/learn/${item.course?._id}`)}
                                                            className="inline-flex items-center px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-xs font-bold hover:bg-blue-100 transition-colors"
                                                        >
                                                            <BookOpen className="w-3.5 h-3.5 mr-1.5" />
                                                            START LEARNING
                                                        </button>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="sm:text-right w-full sm:w-auto pt-4 sm:pt-0 border-t sm:border-0 border-gray-50">
                                                <p className="text-xl font-black text-gray-900">₹{item.discountedPrice}</p>
                                                {item.price > item.discountedPrice && (
                                                    <p className="text-sm text-gray-400 line-through font-medium">
                                                        ₹{item.price}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Order Total Footer */}
                                <div className="px-6 py-4 bg-gray-50/50 flex flex-col sm:flex-row justify-between items-center border-t border-gray-100">
                                    <p className="text-sm font-medium text-gray-500 mb-2 sm:mb-0">
                                        Total for{" "}
                                        <span className="text-gray-900 font-bold">{order.items?.length || 0} items</span>
                                    </p>
                                    {order.couponDiscount > 0 && (
                                        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-100">
                                            <TicketPercent size={14} />
                                            <span>Coupon Saved: ₹{order.couponDiscount}</span>
                                        </div>
                                    )}
                                    <div className="flex items-center gap-3">
                                        <span className="text-gray-500 text-sm font-medium">Amount Paid:</span>
                                        <span className="text-2xl font-black text-blue-600">₹{order.finalAmount}</span>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        /* Empty State */
                        <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-200">
                            <div className="mx-auto w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-5">
                                <LayoutGrid className="w-10 h-10 text-gray-300" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900">No orders found</h3>
                            <p className="text-gray-500 mt-2 max-w-sm mx-auto">
                                You haven't made any purchases matching your current selection.
                            </p>
                            <div className="mt-8 flex justify-center gap-4">
                                <button
                                    onClick={() => {
                                        setSearchTerm("");
                                        setActiveTab("All");
                                    }}
                                    className="px-6 py-2.5 rounded-xl font-bold text-gray-600 border border-gray-300 hover:bg-gray-50 transition-all"
                                >
                                    Clear Filters
                                </button>
                                <button
                                    onClick={() => navigate("/user/courses")}
                                    className="px-6 py-2.5 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all"
                                >
                                    Browse Courses
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Support Card */}
                <div className="mt-16 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl shadow-blue-100">
                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="flex items-center gap-5 text-center md:text-left">
                            <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-md">
                                <AlertCircle className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <h4 className="text-2xl font-bold">Having trouble with a payment?</h4>
                                <p className="text-blue-100 mt-1 text-lg">
                                    Our experts are available 24/7 to resolve your issues.
                                </p>
                            </div>
                        </div>
                        <button className="whitespace-nowrap bg-white text-blue-600 px-8 py-3.5 rounded-2xl font-black shadow-xl hover:bg-blue-50 transition-all active:scale-95">
                            Contact Support
                        </button>
                    </div>
                    {/* Decorative shapes */}
                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
                    <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-400/20 rounded-full blur-3xl"></div>
                </div>
            </div>
        </div>
    );
};

export default MyOrders;
