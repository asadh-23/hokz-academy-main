import React, { useEffect, useState } from "react";
import { Users, GraduationCap, BookOpen, DollarSign, TrendingUp, ArrowRight, Activity } from "lucide-react";
import { toast } from "sonner";
import { adminAxios } from "../../api/adminAxios";
import AnimatedChart from "../../components/common/AnimatedChart";
import AdminDashboardHeader from "../../components/admin/dashboard/DashboardHeader";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
const navigte = useNavigate();
    // 1. Fetch Real Data from Backend
    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await adminAxios.get("/dashboard");
                if (response.data.success) {
                    setDashboardData(response.data.data);
                }
            } catch (error) {
                console.error("Fetch Stats Error:", error);
                // Only show error for actual failures, not when data is empty/zero
                if (error.response?.status !== 404 && error.response?.data?.message) {
                    toast.error("Failed to load dashboard data");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    // Safe destructuring of data
    const stats = dashboardData?.stats || {};
    const chartData = dashboardData?.chart || { revenue: [], profit: [] };
    const recentOrders = dashboardData?.recentOrders || [];

    // Currency Formatter
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0,
        }).format(amount || 0);
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6 md:p-8 font-sans">
            {/* Header */}
            <AdminDashboardHeader />

            {/* 2. Stats Cards (All 5 Important Metrics) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
                <StatCard
                    title="Total Revenue"
                    value={formatCurrency(stats.totalRevenue)}
                    icon={<DollarSign className="text-emerald-600" />}
                    subText="Gross Sales"
                    color="bg-emerald-50"
                />

                <StatCard
                    title="Admin Profit"
                    value={formatCurrency(stats.adminProfit)}
                    icon={<TrendingUp className="text-indigo-600" />}
                    subText="Net Commission"
                    color="bg-indigo-50"
                />

                <StatCard
                    title="Total Students"
                    value={stats.totalStudents}
                    icon={<Users className="text-blue-600" />}
                    subText="Active Learners"
                    color="bg-blue-50"
                />

                <StatCard
                    title="Total Tutors"
                    value={stats.totalTutors}
                    icon={<GraduationCap className="text-purple-600" />}
                    subText="Verified Tutors"
                    color="bg-purple-50"
                />

                <StatCard
                    title="Total Courses"
                    value={stats.totalCourses}
                    icon={<BookOpen className="text-orange-600" />}
                    subText="On Platform"
                    color="bg-orange-50"
                />
            </div>

            {/* 3. Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Revenue Chart (Takes 2/3 space) */}
                <div className="lg:col-span-2">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-bold text-gray-800 flex items-center gap-2">
                                <Activity size={20} className="text-indigo-600" />
                                Financial Overview
                            </h3>
                            <span className="text-xs text-gray-400 font-medium bg-gray-50 px-2 py-1 rounded">
                                Last 7 Months
                            </span>
                        </div>

                        
                        <div className="h-[350px]">
                            <AnimatedChart
                                revenueData={chartData.revenue}
                                expenseData={chartData.expenses}
                                labels={chartData.labels}
                                label1="Total Revenue"
                                label2="Admin Profit"
                            />
                        </div>
                    </div>
                </div>

                {/* Right Column: Recent Transactions (Takes 1/3 space) */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 h-full flex flex-col">
                        <h3 className="font-bold text-gray-800 mb-4">Recent Transactions</h3>

                        {recentOrders.length > 0 ? (
                            <div className="space-y-4 flex-1 overflow-y-auto custom-scrollbar pr-2 max-h-[400px]">
                                {recentOrders.map((order) => (
                                    <div
                                        key={order._id}
                                        className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-sm shrink-0 overflow-hidden">
                                                {order.user?.profileImage ? (
                                                    <img
                                                        src={order.user.profileImage}
                                                        alt=""
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    (order.user?.fullName?.[0] || "U").toUpperCase()
                                                )}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-sm font-bold text-gray-900 truncate max-w-[120px]">
                                                    {order.user?.fullName || "User"}
                                                </p>
                                                <p className="text-xs text-gray-500 truncate max-w-[120px]">
                                                    {order.items?.[0]?.course?.title || "Course Purchase"}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right shrink-0">
                                            <p className="text-sm font-bold text-emerald-600">
                                                {formatCurrency(order.totalAmount)}
                                            </p>
                                            <p className="text-[10px] text-gray-400">
                                                {new Date(order.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-40 text-gray-400">
                                <p>No recent transactions</p>
                            </div>
                        )}

                        <button
                        onClick={()=> navigte("/admin/orders")}
                        className="w-full mt-4 flex items-center justify-center gap-2 text-indigo-600 text-sm font-medium hover:bg-indigo-50 py-2.5 rounded-xl transition-colors">
                            View All Transactions <ArrowRight size={14} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- Reusable Stat Card Sub-Component ---
const StatCard = ({ title, value, icon, subText, color }) => (
    <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start mb-3">
            <div className={`p-3 rounded-xl ${color}`}>{icon}</div>
        </div>
        <div>
            <p className="text-gray-500 text-xs font-medium uppercase tracking-wider">{title}</p>
            <h3 className="text-2xl font-bold text-gray-900 mt-1">{value}</h3>
            {subText && <p className="text-xs text-gray-400 mt-1">{subText}</p>}
        </div>
    </div>
);

export default AdminDashboard;
