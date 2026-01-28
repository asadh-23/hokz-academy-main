import React, { useState, useEffect } from "react";
import {
    Wallet,
    TrendingUp,
    ArrowUpRight,
    ArrowDownLeft,
    Search,
    Download,
    Calendar,
    User,
    CreditCard,
    DollarSign,
} from "lucide-react";
import { tutorAxios } from "../../api/tutorAxios";
import { toast } from "sonner";

const TutorWallet = () => {
    const [walletData, setWalletData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    // Fetch Wallet Data
    useEffect(() => {
        const fetchWallet = async () => {
            try {
                const response = await tutorAxios.get("/wallet");
                if (response.data.success) {
                    setWalletData(response.data.data);
                }
            } catch (error) {
                console.error("Wallet Error:", error);
                toast.error("Failed to load wallet details");
            } finally {
                setLoading(false);
            }
        };

        fetchWallet();
    }, []);

    const handleExport = () => {
        if (!walletData || walletData.transactions.length === 0) {
            toast.error("No transactions to export");
            return;
        }
        
        const headers = ["Transaction ID,Date,Student Name,Student Email,Course Name,Amount,Status"];

        const rows = walletData.transactions.map((txn) => {
            const date = new Date(txn.date).toLocaleDateString();
            const course = txn.courseName.replace(/,/g, " ");
            const student = txn.studentName.replace(/,/g, " ");

            return `${txn.transactionId},${date},${student},${txn.studentEmail},${course},${txn.amount},${txn.status}`;
        });

        // 3. Combine Headers and Rows
        const csvContent = [headers, ...rows].join("\n");

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `Tutor_Wallet_Report_${new Date().toISOString().split("T")[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        toast.success("Report downloaded successfully");
    };

    // Filter Transactions based on Search
    const filteredTransactions = walletData?.transactions.filter(
        (txn) =>
            txn.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            txn.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            txn.transactionId.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6 md:p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">My Wallet</h1>
                        <p className="text-gray-500 text-sm mt-1">Manage your earnings and payouts</p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={handleExport}
                            className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all"
                        >
                            <Download size={16} />
                            Export Report
                        </button>
                        <button className="flex items-center gap-2 bg-indigo-600 px-4 py-2 rounded-lg text-sm font-medium text-white hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">
                            <ArrowUpRight size={16} />
                            Withdraw Funds
                        </button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Total Revenue */}
                    <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white shadow-xl shadow-indigo-100">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-white/20 rounded-xl">
                                <Wallet className="w-6 h-6 text-white" />
                            </div>
                            <span className="flex items-center text-xs font-medium bg-white/20 px-2 py-1 rounded-full text-white">
                                <TrendingUp size={12} className="mr-1" /> +12.5%
                            </span>
                        </div>
                        <p className="text-indigo-100 text-sm font-medium">Total Revenue</p>
                        <h2 className="text-3xl font-bold mt-1">₹{walletData?.totalEarnings.toLocaleString()}</h2>
                    </div>

                    {/* Current Balance */}
                    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-emerald-50 rounded-xl">
                                <DollarSign className="w-6 h-6 text-emerald-600" />
                            </div>
                        </div>
                        <p className="text-gray-500 text-sm font-medium">Current Balance</p>
                        <h2 className="text-3xl font-bold mt-1 text-gray-900">
                            ₹{walletData?.currentBalance.toLocaleString()}
                        </h2>
                    </div>

                    {/* Total Transactions */}
                    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-blue-50 rounded-xl">
                                <CreditCard className="w-6 h-6 text-blue-600" />
                            </div>
                        </div>
                        <p className="text-gray-500 text-sm font-medium">Total Transactions</p>
                        <h2 className="text-3xl font-bold mt-1 text-gray-900">{walletData?.transactions.length}</h2>
                    </div>
                </div>

                {/* Transactions Section */}
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <h3 className="text-lg font-bold text-gray-900">Recent Transactions</h3>

                        {/* Search Bar */}
                        <div className="relative w-full md:w-72">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Search student or course..."
                                className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50/50 text-xs uppercase text-gray-500 font-semibold tracking-wider">
                                    <th className="px-6 py-4">Student</th>
                                    <th className="px-6 py-4">Course</th>
                                    <th className="px-6 py-4">Date & ID</th>
                                    <th className="px-6 py-4">Amount</th>
                                    <th className="px-6 py-4">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredTransactions && filteredTransactions.length > 0 ? (
                                    filteredTransactions.map((txn) => (
                                        <tr key={txn._id} className="hover:bg-gray-50/50 transition-colors">
                                            {/* Student Column */}
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs shrink-0 overflow-hidden">
                                                        {txn.studentProfileImage !== "N/A" ? (
                                                            <img
                                                                src={txn.studentProfileImage}
                                                                alt={txn.studentName}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        ) : (
                                                            txn.studentName.charAt(0)
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-semibold text-gray-900">
                                                            {txn.studentName}
                                                        </p>
                                                        <p className="text-xs text-gray-500">{txn.studentEmail}</p>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Course Column */}
                                            <td className="px-6 py-4">
                                                <p className="text-sm text-gray-700 font-medium line-clamp-1 max-w-[200px]">
                                                    {txn.courseName}
                                                </p>
                                            </td>

                                            {/* Date Column */}
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="text-sm text-gray-900 font-medium">
                                                        {new Date(txn.date).toLocaleDateString()}
                                                    </span>
                                                    <span className="text-xs text-gray-400 font-mono mt-0.5">
                                                        #{txn.transactionId.slice(-8).toUpperCase()}
                                                    </span>
                                                </div>
                                            </td>

                                            {/* Amount Column */}
                                            <td className="px-6 py-4">
                                                <p className="text-sm font-bold text-gray-900">+ ₹{txn.amount}</p>
                                            </td>

                                            {/* Status Column */}
                                            <td className="px-6 py-4">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                                                    {txn.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-12 text-center">
                                            <div className="flex flex-col items-center justify-center text-gray-400">
                                                <div className="p-3 bg-gray-50 rounded-full mb-3">
                                                    <Search size={24} />
                                                </div>
                                                <p className="text-sm">No transactions found matching your search.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Footer / Pagination (Optional) */}
                    <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/30 text-xs text-gray-500 text-center">
                        Showing {filteredTransactions?.length || 0} transactions
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TutorWallet;
