import React, { useEffect, useState } from "react";
import {
    Wallet,
    TrendingUp,
    ArrowUpRight,
    ArrowDownLeft,
    Download,
    Calendar,
    CreditCard,
    DollarSign,
    Clock,
    CheckCircle,
    ShoppingBag,
    Layers,
} from "lucide-react";
import { toast } from "sonner";
import { tutorAxios } from "../../api/tutorAxios";
import { formatText } from "../../utils/formatText";

const TutorWallet = () => {
    const [walletData, setWalletData] = useState(null);
    const [loading, setLoading] = useState(true);

    // --- FETCH DATA ---
    useEffect(() => {
        const fetchWallet = async () => {
            try {
                const response = await tutorAxios.get("/wallet");
                if (response.data.success) {
                    setWalletData(response.data.data);
                }
            } catch (error) {
                console.error("Wallet Fetch Error:", error);
                toast.error("Failed to load wallet details");
            } finally {
                setLoading(false);
            }
        };

        fetchWallet();
    }, []);

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
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    const { stats, transactions } = walletData || { stats: {}, transactions: [] };

    return (
        <div className="min-h-screen bg-gray-50 p-6 font-sans">
            {/* --- HEADER --- */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div className="mb-10 text-center md:text-left">
                    <h2 className="text-3xl font-black text-[#1E2EDE] tracking-tighter uppercase">
                        Instructor <span className="text-[#14C4E7]">Wallet</span>
                    </h2>
                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.25em] mt-1">
                        Track your earnings, sales, and withdrawals.
                    </p>
                    <div className="h-1 w-20 bg-[#E6D929] mt-4 rounded-full mx-auto md:mx-0"></div>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium transition shadow-sm">
                        <Download size={16} /> Export
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium transition shadow-md shadow-indigo-200">
                        <ArrowUpRight size={16} /> Withdraw Funds
                    </button>
                </div>
            </div>

            {/* --- STATS CARDS (Dynamic Data) --- */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Card 1: Current Balance (Main Highlight) */}
                <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-2xl p-6 text-white shadow-xl shadow-indigo-100 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Wallet size={120} />
                    </div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="p-1.5 bg-white/20 rounded-lg backdrop-blur-sm">
                                <Wallet size={18} className="text-white" />
                            </div>
                            <p className="text-indigo-100 text-xs font-bold uppercase tracking-wider">Available Balance</p>
                        </div>
                        <h2 className="text-4xl font-bold mb-4">{formatCurrency(stats.currentBalance)}</h2>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 text-xs bg-white/20 px-3 py-1.5 rounded-full backdrop-blur-sm border border-white/10">
                                <CheckCircle size={12} /> Ready for payout
                            </div>

                            {/* 🔥 NEW: Pending Balance Indicator */}
                            {stats.pendingBalance > 0 && (
                                <div className="flex items-center gap-2 text-xs bg-yellow-400/20 text-yellow-100 px-3 py-1.5 rounded-full backdrop-blur-sm border border-yellow-400/30">
                                    <Clock size={12} /> {formatCurrency(stats.pendingBalance)} Clearing
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Card 2: Total Platform Sales (Gross) */}
                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition duration-300">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-blue-50 rounded-xl">
                            <TrendingUp size={24} className="text-blue-600" />
                        </div>
                        {/* Showing Net Earnings as a small badge here for full context */}
                        <span
                            className="text-[10px] font-medium text-emerald-700 bg-emerald-50 px-2 py-1 rounded border border-emerald-100"
                            title="Your Net Income"
                        >
                            Net: {formatCurrency(stats.totalEarnings)}
                        </span>
                    </div>
                    <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">Total Platform Sales</p>
                    <h3 className="text-2xl font-bold text-gray-900 mt-1">{formatCurrency(stats.totalPlatformSales)}</h3>
                    <p className="text-xs text-gray-400 mt-2">Gross revenue generated (Inc. Tax)</p>
                </div>

                {/* Card 3: Total Transactions Count */}
                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition duration-300">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-orange-50 rounded-xl">
                            <Layers size={24} className="text-orange-600" />
                        </div>
                    </div>
                    <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">Total Transactions</p>
                    <h3 className="text-2xl font-bold text-gray-900 mt-1">{stats.totalTransactions}</h3>
                    <p className="text-xs text-gray-400 mt-2">Successful orders processed</p>
                </div>
            </div>

            {/* --- RECENT ACTIVITY TITLE --- */}
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <Clock size={20} className="text-gray-400" /> Recent Transactions
                </h3>
                <span className="text-xs text-gray-500">Last 20 records</span>
            </div>

            {/* --- TRANSACTIONS TABLE --- */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                {transactions.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50/50 border-b border-gray-200 text-xs uppercase text-gray-500 font-semibold">
                                    <th className="px-6 py-4">ID & Date</th>
                                    <th className="px-6 py-4">Student</th>
                                    <th className="px-6 py-4">Items Sold</th>
                                    <th className="px-6 py-4 text-right">Credit Amount</th>
                                    <th className="px-6 py-4 text-right">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {transactions.map((txn) => (
                                    <tr key={txn._id} className="hover:bg-gray-50 transition-colors group">
                                        {/* 1. Transaction Info */}
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600 group-hover:bg-indigo-100 transition">
                                                    <ArrowDownLeft size={18} />
                                                </div>
                                                <div>
                                                    <p
                                                        className="text-xs font-mono font-medium text-gray-600 mb-0.5"
                                                        title={txn.transactionId}
                                                    >
                                                        #{txn.transactionId.slice(-8).toUpperCase()}
                                                    </p>
                                                    <div className="flex items-center gap-1 text-xs text-gray-400">
                                                        <Calendar size={12} /> {formatDate(txn.date)}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>

                                        {/* 2. Student Info */}
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                {/* Profile Image Container - Fixed Size & Rounding */}
                                                <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 border border-gray-100 shadow-sm">
                                                    {txn.student?.image ? (
                                                        <img
                                                            src={txn.student?.image}
                                                            alt={txn.student?.name || "User"}
                                                            className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                                                        />
                                                    ) : (
                                                        /* Fallback: Name initial with Blue Gradient */
                                                        <div className="w-full h-full bg-gradient-to-br from-[#1E2EDE] to-[#14C4E7] flex items-center justify-center text-white text-xs font-black">
                                                            {txn.student?.name
                                                                ? txn.student?.name.charAt(0).toUpperCase()
                                                                : "U"}
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Text Info */}
                                                <div className="max-w-[150px]">
                                                    <p className="text-sm font-bold text-gray-900 truncate">
                                                        {txn.student?.name || "Unknown"}
                                                    </p>
                                                    <p className="text-xs text-gray-500 truncate">{txn.student?.email}</p>
                                                </div>
                                            </div>
                                        </td>

                                        {/* 3. Courses (With Thumbnails) */}
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-2">
                                                {txn.items?.map((item, idx) => (
                                                    <div key={idx} className="flex items-center gap-3">
                                                        <div className="relative shrink-0">
                                                            <img
                                                                src={item.thumbnail}
                                                                alt=""
                                                                className="w-10 h-7 rounded object-cover border border-gray-200 shadow-sm"
                                                            />
                                                        </div>
                                                        <span
                                                            className="text-xs font-medium text-gray-700 truncate max-w-[200px]"
                                                            title={item.title}
                                                        >
                                                            {formatText(item.title, 18)}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </td>

                                        {/* 4. Amount */}
                                        <td className="px-6 py-4 text-right">
                                            <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-md border border-emerald-100">
                                                +{formatCurrency(txn.amount)}
                                            </span>
                                        </td>

                                        {/* 5. Status */}
                                        <td className="px-6 py-4 text-right">
                                            {txn.status === "success" ? (
                                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-emerald-700 border border-emerald-200">
                                                    <CheckCircle size={10} /> Success
                                                </span>
                                            ) : (
                                                <div className="flex flex-col items-end gap-1.5">
                                                    <span
                                                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-yellow-100 text-yellow-700 border border-yellow-200"
                                                        title="Funds will clear in 24 hours"
                                                    >
                                                        <Clock size={10} /> Pending
                                                    </span>

                                                    {txn.unlockDate && (
                                                        <span className="text-[10px] text-gray-500 font-medium bg-gray-100/80 px-2 py-0.5 rounded border border-gray-200">
                                                            Unlocks: {formatDate(txn.unlockDate)}
                                                        </span>
                                                    )}
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-80 text-center bg-gray-50/50">
                        <div className="p-4 bg-white border border-gray-100 shadow-sm rounded-full mb-3">
                            <CreditCard className="w-8 h-8 text-gray-300" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900">No transactions yet</h3>
                        <p className="text-sm text-gray-500 mt-1 max-w-xs mx-auto">
                            Once you make your first sale, the earnings details will appear here.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TutorWallet;
