import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, CreditCard, User, Mail, Phone, Download, Tag, FileText, Copy, Clock } from "lucide-react";
import { toast } from "sonner";
import { tutorAxios } from "../../api/tutorAxios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const OrderDetails = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    // --- FETCH DATA ---
    useEffect(() => {
        const fetchOrderDetails = async () => {
            try {
                const response = await tutorAxios.get(`/orders/${orderId}`);
                if (response.data.success) {
                    setOrder(response.data.data);
                }
            } catch (error) {
                console.error("Fetch Order Error:", error);
                toast.error("Failed to load order details");
            } finally {
                setLoading(false);
            }
        };

        fetchOrderDetails();
    }, [orderId]);

    // --- HELPERS ---
    const formatCurrency = (amount) =>
        new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0,
        }).format(amount || 0);

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-IN", {
            month: "long",
            day: "numeric",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const copyToClipboard = (text) => {
        if (!text) return;
        navigator.clipboard.writeText(text);
        toast.success("Copied to clipboard");
    };

    const downloadInvoice = () => {
        try {
            if (!order) return; // ഡാറ്റ ഉണ്ടെന്ന് ഉറപ്പുവരുത്തുക

            const cleanPrice = (amount) => `INR ${Number(amount).toLocaleString("en-IN")}`;

            // ഇവിടെ 'data' എന്നതിന് പകരം 'order' എന്ന് മാറ്റണം
            const { orderInfo, student, items, financials } = order;

            const doc = new jsPDF();

            // --- ഇൻവോയ്സ് ഹെഡർ ---
            doc.setFontSize(22);
            doc.setTextColor(79, 70, 229);
            doc.setFont("helvetica", "bold");
            doc.text("HOKZ ACADEMY", 14, 20);

            doc.setFontSize(10);
            doc.setTextColor(100);
            doc.setFont("helvetica", "normal");
            doc.text("Course Purchase Invoice (Instructor Copy)", 14, 28);

            // ഇൻവോയ്സ് ഇൻഫോ
            doc.setTextColor(0);
            doc.text(`Order ID: #${orderInfo.displayId}`, 140, 20);
            doc.text(`Date: ${new Date(orderInfo.date).toLocaleDateString()}`, 140, 26);
            doc.text(`Status: ${orderInfo.status.toUpperCase()}`, 140, 32);

            doc.setDrawColor(230);
            doc.line(14, 40, 196, 40);

            // സ്റ്റുഡന്റ് ഡീറ്റെയിൽസ്
            doc.setFontSize(12);
            doc.setFont("helvetica", "bold");
            doc.text("Student Details:", 14, 50);

            doc.setFontSize(10);
            doc.setFont("helvetica", "normal");
            doc.text(student.name, 14, 56);
            doc.text(student.email, 14, 62);
            doc.text(`Phone: ${student.phone}`, 14, 68);

            // ടേബിൾ ഡാറ്റ
            const tableData = items.map((item, index) => [
                index + 1,
                item.title,
                item.category || "N/A",
                cleanPrice(item.originalPrice),
                cleanPrice(item.soldPrice),
            ]);

            autoTable(doc, {
                startY: 75,
                head: [["#", "Course Title", "Category", "Original Price", "Sold Price"]],
                body: tableData,
                theme: "striped",
                headStyles: { fillColor: [79, 70, 229], textColor: 255 },
                styles: { fontSize: 9, font: "helvetica" },
                columnStyles: { 3: { halign: "right" }, 4: { halign: "right" } },
            });

            // ഫിനാൻഷ്യൽ സമ്മറി
            const finalY = doc.lastAutoTable.finalY + 10;

            doc.setFontSize(10);
            doc.setFont("helvetica", "bold");
            doc.text("Financial Breakdown:", 130, finalY);

            doc.setFont("helvetica", "normal");
            doc.text("Item Total:", 130, finalY + 7);
            doc.text(cleanPrice(financials.itemTotal), 196, finalY + 7, { align: "right" });

            if (financials.couponDeduction > 0) {
                doc.setTextColor(22, 163, 74);
                doc.text("Coupon Discount:", 130, finalY + 14);
                doc.text(`-${cleanPrice(financials.couponDeduction)}`, 196, finalY + 14, { align: "right" });
            }

            doc.setTextColor(0);
            doc.text("Tax (GST):", 130, finalY + 21);
            doc.text(`+${cleanPrice(financials.taxCollected)}`, 196, finalY + 21, { align: "right" });

            doc.setDrawColor(200);
            doc.line(130, finalY + 24, 196, finalY + 24);

            doc.setFont("helvetica", "bold");
            doc.text("Your Net Earnings:", 130, finalY + 30);
            doc.text(cleanPrice(financials.netEarnings), 196, finalY + 30, { align: "right" });

            // ഫൂട്ടർ
            doc.setFontSize(8);
            doc.setTextColor(150);
            doc.setFont("helvetica", "normal");
            doc.text("This is an instructor copy of the purchase invoice generated by Hokz Academy.", 105, 285, {
                align: "center",
            });

            doc.save(`Invoice_${orderInfo.displayId}.pdf`);
            toast.success("Invoice downloaded successfully");
        } catch (error) {
            console.error("PDF Error:", error);
            toast.error("Failed to generate invoice");
        }
    };

    const getStatusStyles = (status) => {
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

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
                <h2 className="text-xl font-bold text-gray-800">Order Not Found</h2>
                <button onClick={() => navigate(-1)} className="mt-4 text-indigo-600 hover:underline">
                    Go Back
                </button>
            </div>
        );
    }

    const { orderInfo, student, items, financials, timeline } = order;

    return (
    <div className="min-h-screen bg-[#FDFDFD] bg-gradient-to-br from-[#FDFDFD] via-[#14C4E7]/5 to-[#1E2EDE]/5 p-4 md:p-8 font-sans print:bg-white print:p-0">
        {/* --- HEADER --- */}
        <div className="max-w-6xl mx-auto mb-8 print:hidden">
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-[#1E2EDE] hover:text-[#14C4E7] transition-all mb-6 font-bold group"
            >
                <div className="p-2 bg-white rounded-full shadow-sm group-hover:shadow-md">
                    <ArrowLeft size={18} />
                </div>
                Back to Orders
            </button>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 bg-white p-6 rounded-[2rem] shadow-sm border border-[#14C4E7]/10">
                <div>
                    <div className="flex flex-wrap items-center gap-3">
                        <h1 className="text-2xl md:text-3xl font-black text-[#1E2EDE]">Order #{orderInfo.displayId}</h1>
                        <span
                            className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border-2 ${getStatusStyles(orderInfo.status)}`}
                        >
                            {orderInfo.status}
                        </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-2 flex items-center gap-2 font-medium">
                        <Calendar size={16} className="text-[#14C4E7]" /> 
                        Placed on <span className="text-gray-800">{formatDate(orderInfo.date)}</span>
                    </p>
                </div>

                <button
                    onClick={downloadInvoice}
                    className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-[#14C4E7] text-white rounded-2xl hover:bg-[#1E2EDE] transition-all font-bold shadow-lg shadow-[#14C4E7]/20 active:scale-95"
                >
                    <Download size={18} /> Download Invoice
                </button>
            </div>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* ================= LEFT COLUMN (Items & Student) ================= */}
            <div className="lg:col-span-2 space-y-8">
                
                {/* 1. PURCHASED ITEMS CARD */}
                <div className="bg-white rounded-[2rem] shadow-xl shadow-blue-900/5 border border-white overflow-hidden">
                    <div className="px-8 py-5 border-b border-gray-50 bg-[#1E2EDE]/5 flex justify-between items-center">
                        <h3 className="font-black text-[#1E2EDE] flex items-center gap-3 uppercase tracking-tighter">
                            <FileText size={20} className="text-[#14C4E7]" /> Purchased Courses
                        </h3>
                        <span className="px-3 py-1 bg-white rounded-lg text-xs font-bold text-[#14C4E7] shadow-sm">
                            {items.length} {items.length === 1 ? 'Course' : 'Items'}
                        </span>
                    </div>

                    <div className="divide-y divide-gray-50">
                        {items.map((item) => {
                            const discountPercent =
                                item.originalPrice > item.soldPrice
                                    ? Math.round(((item.originalPrice - item.soldPrice) / item.originalPrice) * 100)
                                    : 0;

                            return (
                                <div
                                    key={item.courseId}
                                    className="p-6 md:p-8 flex flex-col sm:flex-row gap-6 hover:bg-[#FDFDFD] transition group"
                                >
                                    <div className="relative flex-shrink-0">
                                        <img
                                            src={item.thumbnail || "https://via.placeholder.com/150"}
                                            alt={item.title}
                                            className="w-full sm:w-32 h-40 sm:h-20 object-cover rounded-2xl border-2 border-white shadow-md group-hover:scale-105 transition-transform duration-300"
                                        />
                                        {discountPercent > 0 && (
                                            <div className="absolute -top-2 -left-2 bg-[#E6D929] text-[#1E2EDE] text-[10px] font-black px-2 py-1 rounded-lg shadow-md">
                                                {discountPercent}% OFF
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex-1">
                                        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                                            <div className="max-w-md">
                                                <h4 className="font-bold text-[#1E2EDE] text-lg leading-tight mb-2">
                                                    {item.title}
                                                </h4>
                                                <span className="text-[10px] font-black text-[#14C4E7] bg-[#14C4E7]/10 px-3 py-1 rounded-full uppercase tracking-widest">
                                                    {item.category}
                                                </span>
                                            </div>
                                            <div className="text-left sm:text-right bg-gray-50 sm:bg-transparent p-3 sm:p-0 rounded-xl w-full sm:w-auto">
                                                <p className="font-black text-[#1E2EDE] text-xl">
                                                    {formatCurrency(item.soldPrice)}
                                                </p>
                                                {item.originalPrice > item.soldPrice && (
                                                    <p className="text-xs text-gray-400 line-through font-medium">
                                                        {formatCurrency(item.originalPrice)}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* 2. STUDENT DETAILS CARD */}
                <div className="bg-white rounded-[2rem] shadow-xl shadow-blue-900/5 border border-white p-8">
                    <h3 className="font-black text-[#1E2EDE] mb-6 flex items-center gap-3 uppercase tracking-tighter">
                        <User size={20} className="text-[#14C4E7]" /> Student Profile
                    </h3>
                    <div className="flex flex-col sm:flex-row items-center gap-6">
                        {student.image ? (
                            <img
                                src={student.image}
                                alt=""
                                className="w-20 h-20 rounded-[1.5rem] object-cover border-4 border-[#FDFDFD] shadow-lg"
                            />
                        ) : (
                            <div className="w-20 h-20 rounded-[1.5rem] bg-[#14C4E7] flex items-center justify-center text-white text-3xl font-black shadow-lg uppercase">
                                {student.name.charAt(0)}
                            </div>
                        )}

                        <div className="flex-1 text-center sm:text-left">
                            <h4 className="font-black text-[#1E2EDE] text-2xl">{student.name}</h4>
                            <div className="flex flex-col sm:flex-row flex-wrap justify-center sm:justify-start gap-3 mt-3">
                                <div className="flex items-center gap-2 text-sm font-medium text-gray-600 bg-gray-50 px-4 py-2 rounded-xl border border-gray-100">
                                    <Mail size={16} className="text-[#14C4E7]" /> {student.email}
                                </div>
                                <div className="flex items-center gap-2 text-sm font-medium text-gray-600 bg-gray-50 px-4 py-2 rounded-xl border border-gray-100">
                                    <Phone size={16} className="text-[#14C4E7]" /> {student.phone}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ================= RIGHT COLUMN (Financials & Meta) ================= */}
            <div className="space-y-8">
                {/* 3. FINANCIAL SUMMARY */}
                <div className="bg-white rounded-[2rem] shadow-2xl shadow-blue-900/10 border border-white overflow-hidden">
                    <div className="bg-[#1E2EDE] px-8 py-6 text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#14C4E7]/20 rounded-full -mr-16 -mt-16"></div>
                        <h3 className="font-black text-xl flex items-center gap-3 relative z-10 uppercase tracking-tighter">
                            <CreditCard size={22} className="text-[#E6D929]" /> Payment Summary
                        </h3>
                    </div>

                    <div className="p-8 space-y-6">
                        {/* A. Student Payment Section */}
                        <div className="bg-gray-50/50 p-5 rounded-2xl border border-gray-100">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">
                                Billing Details
                            </p>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between font-bold text-gray-600">
                                    <span>Base Total</span>
                                    <span>{formatCurrency(financials.itemTotal)}</span>
                                </div>

                                {financials.couponDeduction > 0 && (
                                    <div className="py-1">
                                        {financials.couponDetails?.list && financials.couponDetails.list.length > 1 ? (
                                            <div className="space-y-2 bg-[#E6D929]/10 p-3 rounded-xl border border-[#E6D929]/30">
                                                <p className="text-[10px] text-[#1E2EDE] font-black uppercase tracking-wider mb-1">
                                                    Coupons:
                                                </p>
                                                {financials.couponDetails.list.map((coupon, idx) => (
                                                    <div key={idx} className="flex justify-between text-[#1E2EDE] text-xs font-bold">
                                                        <span className="flex items-center gap-1.5"><Tag size={12} className="text-[#14C4E7]"/> {coupon.code}</span>
                                                        <span>-{formatCurrency(coupon.discountAmount)}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="flex justify-between text-[#14C4E7] font-black bg-[#14C4E7]/5 p-3 rounded-xl border border-[#14C4E7]/10">
                                                <span className="flex items-center gap-2 uppercase tracking-tighter"><Tag size={14} /> {financials.couponDetails?.code}</span>
                                                <span>-{formatCurrency(financials.couponDeduction)}</span>
                                            </div>
                                        )}
                                    </div>
                                )}

                                <div className="flex justify-between text-gray-400 font-bold text-[11px] uppercase tracking-wider">
                                    <span>GST (3%)</span>
                                    <span>+{formatCurrency(financials.taxCollected)}</span>
                                </div>

                                <div className="pt-4 border-t-2 border-dashed border-gray-200">
                                    <div className="flex justify-between font-black text-[#1E2EDE] text-xl">
                                        <span className="uppercase tracking-tighter">Total Paid</span>
                                        <span>{formatCurrency(financials.totalPaidByStudent)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* B. Tutor Payout Section */}
                        <div className="space-y-4">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                                Revenue Split
                            </p>
                            <div className="space-y-2 px-1">
                                <div className="flex justify-between text-xs font-bold text-gray-500">
                                    <span>Tax Withheld</span>
                                    <span>-{formatCurrency(financials.taxCollected)}</span>
                                </div>
                                <div className="flex justify-between text-xs font-bold text-gray-500">
                                    <span>Platform Comm.</span>
                                    <span>-{formatCurrency(financials.adminFee)}</span>
                                </div>
                            </div>

                            {/* Net Earnings Highlight */}
                            <div className="flex justify-between items-center bg-gradient-to-r from-[#1E2EDE] to-[#14C4E7] p-5 rounded-2xl shadow-lg shadow-blue-900/20 relative overflow-hidden group">
                                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <div className="relative z-10">
                                    <span className="block text-[10px] font-black text-[#E6D929] uppercase tracking-widest">
                                        Your Earnings
                                    </span>
                                    <span className="text-[10px] text-white/80 font-bold">Transferred to Wallet</span>
                                </div>
                                <span className="text-2xl font-black text-white relative z-10">
                                    {formatCurrency(financials.netEarnings)}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 4. VISUAL TIMELINE */}
                <div className="bg-white rounded-[2rem] shadow-xl shadow-blue-900/5 border border-white p-8">
                    <h3 className="font-black text-[#1E2EDE] mb-8 text-[11px] uppercase tracking-[0.2em] border-b border-gray-50 pb-4">Order Tracking</h3>
                    <div className="relative ml-2 space-y-10">
                        {/* Timeline Connector */}
                        <div className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-gradient-to-b from-[#14C4E7] to-[#1E2EDE]"></div>

                        {/* Placed Node */}
                        <div className="relative pl-8 group">
                            <div className="absolute left-0 top-1 w-4 h-4 rounded-full bg-white border-4 border-[#14C4E7] shadow-md group-hover:scale-125 transition-transform z-10"></div>
                            <h4 className="text-sm font-black text-[#1E2EDE] uppercase tracking-tight">Order Placed</h4>
                            <p className="text-xs text-gray-500 font-bold mt-1">{formatDate(timeline.orderedAt)}</p>
                        </div>

                        {/* Verified Node */}
                        <div className="relative pl-8 group">
                            <div className="absolute left-0 top-1 w-4 h-4 rounded-full bg-white border-4 border-[#E6D929] shadow-md group-hover:scale-125 transition-transform z-10"></div>
                            <h4 className="text-sm font-black text-[#1E2EDE] uppercase tracking-tight">Payment Verified</h4>
                            <p className="text-xs text-gray-500 font-bold mt-1 uppercase tracking-tighter">Via {orderInfo.paymentMethod}</p>

                            <div className="flex items-center gap-2 mt-3 bg-[#FDFDFD] p-3 rounded-xl border border-[#14C4E7]/20 w-full shadow-inner group-hover:border-[#14C4E7] transition-colors">
                                <code className="text-[10px] font-black text-[#14C4E7] truncate">
                                    ID: {orderInfo.transactionId || "N/A"}
                                </code>
                                <button
                                    onClick={() => copyToClipboard(orderInfo.transactionId)}
                                    className="text-[#1E2EDE] hover:text-[#14C4E7] transition-all ml-auto"
                                    title="Copy Transaction ID"
                                >
                                    <Copy size={14} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
);
};

export default OrderDetails;
