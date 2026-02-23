import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    ArrowLeft,
    Calendar,
    User,
    Mail,
    Phone,
    CreditCard,
    CheckCircle,
    XCircle,
    AlertCircle,
    Download,
    Tag,
    ShieldCheck,
    Receipt,
    GraduationCap,
    Copy,
} from "lucide-react";
import { toast } from "sonner";
import { adminAxios } from "../../api/adminAxios";
import autoTable from "jspdf-autotable";
import jsPDF from "jspdf";

const OrderDetails = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const response = await adminAxios.get(`/orders/${orderId}`);
                if (response.data.success) {
                    setData(response.data.data);
                }
            } catch (error) {
                console.error("Fetch Error:", error);
                toast.error("Failed to load order details");
                navigate("/admin/orders");
            } finally {
                setLoading(false);
            }
        };
        fetchDetails();
    }, [orderId, navigate]);

    // --- Helpers ---
    const formatCurrency = (amount) =>
        new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0,
        }).format(amount || 0);

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-IN", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        toast.success("Transaction ID copied");
    };
    const downloadInvoice = () => {
        try {
            const doc = new jsPDF();

            const displayId = order.orderId?.split("_")[1] || order._id.slice(-6).toUpperCase();

            const cleanPrice = (amount) => `INR ${Number(amount).toLocaleString("en-IN")}`;

            doc.setFontSize(22);
            doc.setTextColor(79, 70, 229); // Indigo color
            doc.setFont("helvetica", "bold");
            doc.text("HOKZ ACADEMY", 14, 20);

            doc.setFontSize(10);
            doc.setTextColor(100);
            doc.setFont("helvetica", "normal");
            doc.text("Official Course Purchase Invoice", 14, 28);

            doc.setTextColor(0);
            doc.setFontSize(10);
            doc.text(`Invoice No: INV-${displayId}`, 140, 20);
            doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`, 140, 26);
            doc.text(`Status: ${order.status.toUpperCase()}`, 140, 32);

            // വര
            doc.setDrawColor(230);
            doc.line(14, 40, 196, 40);

            doc.setFontSize(12);
            doc.setFont("helvetica", "bold");
            doc.text("Billed To:", 14, 50);

            doc.setFontSize(10);
            doc.setFont("helvetica", "normal");
            doc.text(customer.fullName, 14, 56);
            doc.text(customer.email, 14, 62);
            if (customer.phone) doc.text(customer.phone, 14, 68);

            const tableData = items.map((item, index) => [
                index + 1,
                item.title,
                `By ${item.tutor?.fullName || "N/A"}`,
                cleanPrice(item.originalPrice),
                cleanPrice(item.pricePaid),
            ]);

            autoTable(doc, {
                startY: 75,
                head: [["#", "Course Description", "Instructor", "MRP", "Final Price"]],
                body: tableData,
                theme: "striped",
                headStyles: { fillColor: [79, 70, 229], textColor: 255 },
                styles: { fontSize: 9, font: "helvetica" },
                columnStyles: {
                    1: { cellWidth: 70 },
                    3: { halign: "right" },
                    4: { halign: "right" },
                },
            });

            const finalY = doc.lastAutoTable.finalY + 10;

            doc.setFontSize(10);
            doc.setTextColor(0);
            doc.text("Summary:", 140, finalY);
            doc.text(`Subtotal:`, 140, finalY + 7);
            doc.text(cleanPrice(order.totalAmount), 196, finalY + 7, { align: "right" });

            if (order.discountAmount > 0) {
                doc.setTextColor(22, 163, 74);
                doc.text(`Total Discount:`, 140, finalY + 14);
                doc.text(`-${cleanPrice(order.discountAmount)}`, 196, finalY + 14, { align: "right" });
            }

            doc.setTextColor(0);
            doc.text(`Tax (GST):`, 140, finalY + 21);
            doc.text(`+${cleanPrice(order.taxAmount)}`, 196, finalY + 21, { align: "right" });

            doc.setFillColor(243, 244, 246);
            doc.rect(138, finalY + 25, 58, 12, "F");
            doc.setFont("helvetica", "bold");
            doc.text(`Grand Total:`, 140, finalY + 33);
            doc.text(cleanPrice(order.finalAmount), 196, finalY + 33, { align: "right" });

            doc.setFontSize(8);
            doc.setTextColor(150);
            doc.setFont("helvetica", "normal");
            doc.text("This is a computer-generated invoice and does not require a physical signature.", 105, 285, {
                align: "center",
            });

            doc.save(`Invoice_${displayId}.pdf`);
            toast.success("Invoice downloaded successfully");
        } catch (error) {
            console.error("PDF Error:", error);
            toast.error("Failed to generate invoice");
        }
    };

    const getStatusBadge = (status) => {
        const styles = {
            paid: "bg-[#14C4E7]/10 text-[#14C4E7] border-[#14C4E7]/20",
            pending: "bg-[#E6D929]/10 text-[#a89e1a] border-[#E6D929]/30",
            failed: "bg-red-50 text-red-600 border-red-100",
        };
        const icons = {
            paid: <CheckCircle size={14} />,
            pending: <AlertCircle size={14} />,
            failed: <XCircle size={14} />,
        };
        return (
            <span
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border-2 ${styles[status] || styles.pending}`}
            >
                {icons[status] || icons.pending} {status}
            </span>
        );
    };

    if (loading) {
        return (
            <div className="flex flex-col justify-center items-center h-screen bg-[#FDFDFD]">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#14C4E7]/20 border-t-[#1E2EDE]"></div>
                <p className="mt-4 text-[#1E2EDE] font-black uppercase tracking-widest text-xs">Loading Order Details...</p>
            </div>
        );
    }

    if (!data) return null;

    const { order, customer, items, financials } = data;

    return (
        <div className="min-h-screen bg-[#FDFDFD] bg-gradient-to-br from-[#FDFDFD] via-[#14C4E7]/5 to-[#1E2EDE]/5 p-4 md:p-8 font-sans">
            {/* --- HEADER SECTION --- */}
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
                <div className="flex items-center gap-5">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-3 bg-white border-2 border-[#1E2EDE]/10 rounded-2xl text-[#1E2EDE] hover:bg-[#1E2EDE] hover:text-white transition-all shadow-sm group"
                    >
                        <ArrowLeft size={22} className="group-hover:-translate-x-1 transition-transform" />
                    </button>
                    <div>
                        <div className="flex flex-wrap items-center gap-3 mb-2">
                            <h1 className="text-2xl md:text-3xl font-black text-[#1E2EDE] tracking-tighter">
                                Order #{order.orderId?.split("_")[1] || order._id.slice(-6).toUpperCase()}
                            </h1>
                            {getStatusBadge(order.status)}
                        </div>
                        <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                            <span className="flex items-center gap-1.5">
                                <Calendar size={14} className="text-[#14C4E7]" /> {formatDate(order.createdAt)}
                            </span>
                            <span className="w-1.5 h-1.5 bg-[#E6D929] rounded-full"></span>
                            <span className="flex items-center gap-1.5">
                                <CreditCard size={14} className="text-[#14C4E7]" /> {order.paymentMethod}
                            </span>
                        </div>
                    </div>
                </div>

                <button
                    onClick={downloadInvoice}
                    className="w-full md:w-auto flex items-center justify-center gap-2 px-8 py-3.5 bg-[#14C4E7] text-white font-black rounded-2xl hover:bg-[#1E2EDE] transition-all shadow-lg shadow-[#14C4E7]/20 text-xs uppercase tracking-widest active:scale-95"
                >
                    <Download size={18} /> Download Invoice
                </button>
            </div>

            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* ================= LEFT COLUMN ================= */}
                <div className="lg:col-span-2 space-y-8">
                    {/* 1. PURCHASED COURSES */}
                    <div className="bg-white rounded-[2rem] shadow-xl shadow-blue-900/5 border border-white overflow-hidden">
                        <div className="px-8 py-6 border-b border-gray-50 bg-[#1E2EDE]/5 flex justify-between items-center">
                            <h2 className="font-black text-[#1E2EDE] flex items-center gap-3 uppercase text-sm tracking-widest">
                                <GraduationCap size={22} className="text-[#14C4E7]" />
                                Curriculum Inventory ({items.length})
                            </h2>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-gray-50/50 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100">
                                        <th className="px-8 py-4 text-left">Course Asset</th>
                                        <th className="px-4 py-4 text-right">Market Price</th>
                                        <th className="px-4 py-4 text-right">Applied Offer</th>
                                        <th className="px-8 py-4 text-right">Net Paid</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {items.map((item, index) => (
                                        <tr key={index} className="group hover:bg-[#14C4E7]/5 transition-colors">
                                            <td className="px-8 py-5">
                                                <div className="flex items-center gap-4">
                                                    <img
                                                        src={item.thumbnail}
                                                        alt=""
                                                        className="w-16 h-10 rounded-xl object-cover border-2 border-white shadow-sm group-hover:scale-110 transition-transform"
                                                    />
                                                    <div>
                                                        <h3 className="font-bold text-[#1E2EDE] text-sm line-clamp-1">
                                                            {item.title}
                                                        </h3>
                                                        <p className="text-[10px] font-bold text-[#14C4E7] uppercase tracking-tighter">
                                                            Instructor: {item.tutor?.fullName}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-5 text-right text-xs text-gray-400 line-through">
                                                {formatCurrency(item.originalPrice)}
                                            </td>
                                            <td className="px-4 py-5 text-right text-xs font-bold text-[#14C4E7]">
                                                {formatCurrency(item.offerPrice)}
                                            </td>
                                            <td className="px-8 py-5 text-right">
                                                <p className="font-black text-[#1E2EDE]">
                                                    {formatCurrency(item.pricePaid)}
                                                </p>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* 2. REVENUE DISTRIBUTION */}
                    <div className="bg-white rounded-[2rem] shadow-xl shadow-blue-900/5 border border-white overflow-hidden">
                        <div className="px-8 py-6 border-b border-gray-50 bg-[#14C4E7]/5 flex flex-col sm:flex-row justify-between items-center gap-4">
                            <h2 className="font-black text-[#1E2EDE] flex items-center gap-3 uppercase text-sm tracking-widest">
                                <ShieldCheck size={22} className="text-[#14C4E7]" /> Financial Split
                            </h2>
                            <div className="flex flex-col items-end">
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                                    Platform Profit
                                </span>
                                <span className="text-lg font-black text-[#1E2EDE] bg-[#E6D929] px-4 py-1 rounded-xl shadow-inner">
                                    {formatCurrency(financials.totalAdminProfit)}
                                </span>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50/50 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100">
                                    <tr>
                                        <th className="px-8 py-4">Tutor Entity</th>
                                        <th className="px-4 py-4 text-right">Gross Sales</th>
                                        <th className="px-4 py-4 text-right">Admin Comm.</th>
                                        <th className="px-8 py-4 text-right">Tutor Payout</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {financials.breakdown.map((split, idx) => (
                                        <tr key={idx} className="hover:bg-[#E6D929]/5 transition-colors">
                                            <td className="px-8 py-5">
                                                <div className="flex items-center gap-3">
                                                    {split.tutorProfile ? (
                                                        <img
                                                            src={split.tutorProfile}
                                                            alt=""
                                                            className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
                                                        />
                                                    ) : (
                                                        <div className="w-10 h-10 rounded-full bg-[#1E2EDE] text-white flex items-center justify-center font-black text-xs">
                                                            {split.tutorName.charAt(0)}
                                                        </div>
                                                    )}
                                                    <div>
                                                        <p className="font-bold text-[#1E2EDE] text-sm">
                                                            {split.tutorName}
                                                        </p>
                                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
                                                            {split.tutorEmail}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-5 text-right text-xs font-bold text-gray-600">
                                                {formatCurrency(split.salesAmount)}
                                            </td>
                                            <td className="px-4 py-5 text-right font-black text-[#14C4E7] text-xs">
                                                {formatCurrency(split.adminCommission)}
                                            </td>
                                            <td className="px-8 py-5 text-right font-black text-emerald-600">
                                                {formatCurrency(split.tutorEarnings)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* ================= RIGHT COLUMN ================= */}
                <div className="space-y-8">
                    {/* CUSTOMER CARD */}
                    <div className="bg-white p-8 rounded-[2rem] shadow-xl shadow-blue-900/5 border border-white relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-[#14C4E7]/5 rounded-full -mr-12 -mt-12 transition-all group-hover:scale-150"></div>
                        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2 relative z-10">
                            <User size={16} className="text-[#14C4E7]" /> Learner Profile
                        </h3>
                        <div className="flex items-center gap-5 mb-8 relative z-10">
                            {customer.profileImage ? (
                                <img
                                    src={customer.profileImage}
                                    alt=""
                                    className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                                />
                            ) : (
                                <div className="w-10 h-10 rounded-full bg-[#1E2EDE] text-white flex items-center justify-center font-black text-xs">
                                    {customer.fullName.charAt(0)}
                                </div>
                            )}
                            <div>
                                <h4 className="font-black text-[#1E2EDE] text-xl leading-tight mb-1">
                                    {customer.fullName}
                                </h4>
                                <span
                                    className={`text-[9px] uppercase font-black px-3 py-1 rounded-full border-2 ${
                                        customer.isBlocked
                                            ? "bg-red-50 text-red-600 border-red-100"
                                            : "bg-[#14C4E7]/10 text-[#14C4E7] border-[#14C4E7]/20"
                                    }`}
                                >
                                    {customer.isBlocked ? "Restricted" : "Verified Learner"}
                                </span>
                            </div>
                        </div>
                        <div className="space-y-3 relative z-10">
                            <div className="flex items-center gap-3 text-xs font-bold text-gray-600 p-4 bg-gray-50/50 rounded-2xl border border-gray-100 transition-colors hover:border-[#14C4E7]/30">
                                <Mail size={16} className="text-[#14C4E7]" />
                                <span className="truncate">{customer.email}</span>
                            </div>
                            {customer.phone && (
                                <div className="flex items-center gap-3 text-xs font-bold text-gray-600 p-4 bg-gray-50/50 rounded-2xl border border-gray-100">
                                    <Phone size={16} className="text-[#14C4E7]" />
                                    <span>{customer.phone}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* PAYMENT SUMMARY CARD */}
                    <div className="bg-white rounded-[2rem] shadow-2xl shadow-blue-900/10 border border-white overflow-hidden">
                        <div className="p-8">
                            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                                <Receipt size={16} className="text-[#14C4E7]" /> Order Summary
                            </h3>

                            <div className="space-y-4 mb-8">
                                <div className="flex justify-between text-xs font-bold text-gray-500">
                                    <span className="uppercase tracking-tighter">Gross Assets (MRP)</span>
                                    <span>{formatCurrency(order.totalAmount)}</span>
                                </div>

                                {order.couponDiscount > 0 && (
                                    <div className="flex justify-between items-center p-3 bg-emerald-50 rounded-xl border-2 border-dashed border-emerald-200">
                                        <span className="flex items-center gap-2 text-[10px] font-black text-emerald-700 uppercase tracking-widest">
                                            <Tag size={12} /> Voucher Savings
                                        </span>
                                        <span className="text-xs font-black text-emerald-700">
                                            -{formatCurrency(order.couponDiscount)}
                                        </span>
                                    </div>
                                )}

                                <div className="flex justify-between text-xs font-bold text-gray-500">
                                    <span className="uppercase tracking-tighter">Promotional Markdown</span>
                                    <span className="text-emerald-600">-{formatCurrency(order.discountAmount)}</span>
                                </div>

                                <div className="flex justify-between text-xs font-bold text-gray-500">
                                    <span className="uppercase tracking-tighter">Service Tax (GST 3%)</span>
                                    <span className="text-[#1E2EDE]">+{formatCurrency(order.taxAmount)}</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-[#1E2EDE] p-8 text-white relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[#14C4E7]/10 rounded-full -mr-16 -mt-16"></div>
                            <div className="flex justify-between items-center relative z-10">
                                <div>
                                    <span className="text-[10px] text-[#E6D929] font-black uppercase tracking-[0.25em]">
                                        Final Remittance
                                    </span>
                                    <div className="flex items-center gap-2 mt-1 opacity-80">
                                        <CreditCard size={14} />
                                        <span className="text-[10px] font-black uppercase tracking-widest">
                                            {order.paymentMethod}
                                        </span>
                                    </div>
                                </div>
                                <span className="text-3xl font-black tracking-tighter">
                                    {formatCurrency(order.finalAmount)}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* TRANSACTION ID */}
                    <div className="bg-white p-6 rounded-2xl shadow-xl shadow-blue-900/5 border border-white">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest text-center mb-3">
                            System Trace ID
                        </p>
                        <div className="group flex items-center justify-between gap-3 bg-gray-50 px-4 py-3 rounded-xl border-2 border-gray-100 hover:border-[#14C4E7]/30 transition-colors">
                            <p className="font-mono text-[10px] font-black text-[#1E2EDE] truncate select-all">
                                {order.transactionId || "N/A"}
                            </p>
                            {order.transactionId && (
                                <button
                                    onClick={() => copyToClipboard(order.transactionId)}
                                    className="text-gray-400 hover:text-[#14C4E7] transition-all p-1"
                                >
                                    <Copy size={14} />
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetails;
