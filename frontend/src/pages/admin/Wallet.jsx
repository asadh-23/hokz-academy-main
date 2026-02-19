import React, { useEffect, useState } from "react";
import {
    Wallet,
    TrendingUp,
    Landmark,
    History,
    ArrowUpRight,
    CreditCard,
    User,
    ShieldCheck,
    RefreshCw,
    DollarSign,
    ArrowDownLeft,
} from "lucide-react";
import { toast } from "sonner";
import { adminAxios } from "../../api/adminAxios";
import { formatText } from "../../utils/formatText";

const AdminWallet = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    // 1. Fetch Wallet Data
    useEffect(() => {
        const fetchWalletData = async () => {
            try {
                const response = await adminAxios.get("/wallet");
                if (response.data.success) {
                    setData(response.data.data);
                }
            } catch (error) {
                console.error("Wallet Fetch Error:", error);
                toast.error("Failed to load wallet data");
            } finally {
                setLoading(false);
            }
        };
        fetchWalletData();
    }, []);

    // --- Non-functional withdraw handler ---
    const handleWithdraw = () => {
        toast.info("Withdraw functionality is currently disabled");
    };
    // --- Formatters ---
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
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    const { stats, transactions } = data;

    return (
        <div className="min-h-screen bg-gray-50 p-6 md:p-8 font-sans">
            {/* --- HEADER --- */}
            <div className="mb-8 flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <Wallet className="text-indigo-600" /> Admin Wallet
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Track revenue streams, tax liabilities, and commission profits.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleWithdraw}
                        className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-50 to-green-50 text-emerald-600 rounded-xl text-sm font-semibold hover:from-emerald-100 hover:to-green-100 transition-all border-2 border-emerald-200 hover:border-emerald-300 shadow-sm"
                        title="Withdraw funds (Currently disabled)"
                    >
                        <ArrowDownLeft className="w-4 h-4" />
                        <span>Withdraw</span>
                    </button>
                    <button
                        onClick={() => window.location.reload()}
                        className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-white bg-gray-100 rounded-lg transition"
                        title="Refresh Data"
                    >
                        <RefreshCw size={18} />
                    </button>
                </div>
            </div>

            {/* --- STATS GRID --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* 1. Admin Net Profit (Highlighted) */}
                <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-2xl p-6 text-white shadow-xl shadow-indigo-100 transform hover:scale-[1.02] transition-transform">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-indigo-100 text-xs font-bold uppercase tracking-wider mb-1">Net Profit</p>
                            <h2 className="text-3xl font-extrabold tracking-tight">
                                {formatCurrency(stats.totalAdminProfit)}
                            </h2>
                        </div>
                        <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                            <TrendingUp size={24} className="text-white" />
                        </div>
                    </div>
                    <div className="mt-4 flex items-center gap-2">
                        <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded font-medium text-white">
                            10% Commission
                        </span>
                        <span className="text-xs text-indigo-100 opacity-80">from all sales</span>
                    </div>
                </div>

                {/* 2. Gross Revenue */}
                <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Gross Revenue</p>
                            <h2 className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalRevenue)}</h2>
                        </div>
                        <div className="p-2 bg-green-50 rounded-lg">
                            <DollarSign size={24} className="text-green-600" />
                        </div>
                    </div>
                    <p className="mt-4 text-xs text-gray-400">Total Sales + Tax Collected</p>
                </div>

                {/* 3. Tax Liability */}
                <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">
                                Tax Liability (GST)
                            </p>
                            <h2 className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalTaxCollected)}</h2>
                        </div>
                        <div className="p-2 bg-orange-50 rounded-lg">
                            <Landmark size={24} className="text-orange-600" />
                        </div>
                    </div>
                    <p className="mt-4 text-xs text-gray-400">Collected 3% extra from users</p>
                </div>

                {/* 4. Total Transactions */}
                <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">
                                Total Transactions
                            </p>
                            <h2 className="text-2xl font-bold text-gray-900">{stats.totalTransactions}</h2>
                        </div>
                        <div className="p-2 bg-blue-50 rounded-lg">
                            <CreditCard size={24} className="text-blue-600" />
                        </div>
                    </div>
                    <p className="mt-4 text-xs text-gray-400">Successful payment distributions</p>
                </div>
            </div>

            {/* --- RECENT TRANSACTIONS TABLE --- */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <h3 className="font-bold text-gray-800 flex items-center gap-2">
                        <History size={18} className="text-gray-500" /> Recent Distributions
                    </h3>
                    <span className="text-xs bg-indigo-50 text-indigo-600 px-2.5 py-1 rounded-full font-medium">
                        Last 10 Entries
                    </span>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50 text-gray-500 text-xs font-semibold uppercase tracking-wider border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4">Order ID & Date</th>
                                <th className="px-6 py-4">User</th>
                                <th className="px-6 py-4">Tutor</th>
                                <th className="px-6 py-4 text-right">Order Total</th>
                                <th className="px-6 py-4 text-right">Admin Profit</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-sm">
                            {transactions.length > 0 ? (
                                transactions.map((txn) => (
                                    <tr key={txn._id} className="hover:bg-gray-50/80 transition-colors group">
                                        {/* 1. Transaction Info */}
                                        <td className="px-6 py-4">
                                            <div className="font-mono text-xs font-medium text-gray-500 mb-1 bg-gray-100 w-fit px-1.5 py-0.5 rounded border border-gray-200">
                                                #{txn.orderId?.razorpayOrderId?.split("_")[1] || "N/A"}
                                            </div>
                                            <div className="text-gray-500 text-xs mt-1">{formatDate(txn.createdAt)}</div>
                                        </td>

                                        {/* 2. Student Info */}
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                {txn.orderId?.user?.profileImage ? (
                                                    <img
                                                        src={txn.orderId.user.profileImage}
                                                        alt=""
                                                        className="w-8 h-8 rounded-full object-cover border border-gray-200"
                                                    />
                                                ) : (
                                                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                                                        <User size={14} />
                                                    </div>
                                                )}
                                                <div>
                                                    <p className="font-medium text-gray-900 line-clamp-1">
                                                        {formatText(txn.orderId?.user?.fullName, 17) || "Unknown"}
                                                    </p>
                                                    <p className="text-xs text-gray-500 line-clamp-1">
                                                        {txn.orderId?.user?.email}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>

                                        {/* 3. Tutor Info */}
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <ShieldCheck size={16} className="text-gray-400" />
                                                <span className="text-gray-700 font-medium">
                                                    {formatText(txn.tutor?.fullName, 17) || "Tutor"}
                                                </span>
                                            </div>
                                        </td>

                                        {/* 4. Total Amount (Base + Tax) */}
                                        <td className="px-6 py-4 text-right font-medium text-gray-700">
                                            <div className="flex flex-col items-end">
                                                {/* Calculating Gross Amount for Display (Amount + Tax) */}
                                                <span className="text-gray-900 font-bold">
                                                    {formatCurrency(txn.totalAmount + (txn.taxCollected || 0))}
                                                </span>
                                                <span className="text-[10px] text-gray-400">
                                                    Base: {formatCurrency(txn.totalAmount)} + Tax:{" "}
                                                    {formatCurrency(txn.taxCollected || 0)}
                                                </span>
                                            </div>
                                        </td>

                                        {/* 5. Admin Profit */}
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-1 font-bold text-emerald-600 bg-emerald-50 w-fit ml-auto px-2 py-1 rounded">
                                                <ArrowUpRight size={14} />
                                                {formatCurrency(txn.adminShareAmount)}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                                        <div className="flex flex-col items-center gap-2">
                                            <History size={32} className="text-gray-300" />
                                            <p>No transactions found yet.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminWallet;
