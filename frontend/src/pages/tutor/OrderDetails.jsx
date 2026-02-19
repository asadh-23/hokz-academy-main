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
        <div className="min-h-screen bg-gray-50 p-6 font-sans print:bg-white print:p-0">
            {/* --- HEADER --- */}
            <div className="max-w-6xl mx-auto mb-6 print:hidden">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition mb-4 text-sm"
                >
                    <ArrowLeft size={16} /> Back to Orders
                </button>

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl font-bold text-gray-900">Order #{orderInfo.displayId}</h1>
                            <span
                                className={`px-3 py-1 rounded-full text-xs font-bold uppercase border ${getStatusStyles(orderInfo.status)}`}
                            >
                                {orderInfo.status}
                            </span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                            <Calendar size={14} /> Placed on {formatDate(orderInfo.date)}
                        </p>
                    </div>

                    <button
                        onClick={downloadInvoice}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium transition shadow-sm"
                    >
                        <Download size={16} /> Download Invoice
                    </button>
                </div>
            </div>

            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* ================= LEFT COLUMN (Items & Student) ================= */}
                <div className="lg:col-span-2 space-y-6">
                    {/* 1. PURCHASED ITEMS CARD */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                            <h3 className="font-bold text-gray-800 flex items-center gap-2">
                                <FileText size={18} className="text-indigo-600" /> Purchased Courses
                            </h3>
                            <span className="text-xs text-gray-500">{items.length} Items</span>
                        </div>

                        <div className="divide-y divide-gray-100">
                            {items.map((item) => {
                                // Discount Percentage Calculation for Badge
                                const discountPercent =
                                    item.originalPrice > item.soldPrice
                                        ? Math.round(((item.originalPrice - item.soldPrice) / item.originalPrice) * 100)
                                        : 0;

                                return (
                                    <div
                                        key={item.courseId}
                                        className="p-6 flex flex-col sm:flex-row gap-4 hover:bg-gray-50 transition"
                                    >
                                        <img
                                            src={item.thumbnail || "https://via.placeholder.com/150"}
                                            alt={item.title}
                                            className="w-full sm:w-24 h-32 sm:h-16 object-cover rounded-lg border border-gray-200 shadow-sm"
                                        />

                                        <div className="flex-1">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h4 className="font-semibold text-gray-900 line-clamp-1">
                                                        {item.title}
                                                    </h4>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                                                            {item.category}
                                                        </span>
                                                        {/* Offer Badge */}
                                                        {discountPercent > 0 && (
                                                            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100">
                                                                {discountPercent}% OFF
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-bold text-gray-900">
                                                        {formatCurrency(item.soldPrice)}
                                                    </p>
                                                    {item.originalPrice > item.soldPrice && (
                                                        <p className="text-xs text-gray-400 line-through">
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
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <User size={18} className="text-indigo-600" /> Student Information
                        </h3>
                        <div className="flex items-center gap-4">
                            {/* Avatar with Fallback Logic */}
                            {student.image ? (
                                <img
                                    src={student.image}
                                    alt=""
                                    className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-md"
                                />
                            ) : (
                                <div className="w-14 h-14 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 text-xl font-bold border-2 border-white shadow-md uppercase">
                                    {student.name.charAt(0)}
                                </div>
                            )}

                            <div className="flex-1">
                                <h4 className="font-bold text-gray-900 text-lg">{student.name}</h4>
                                <div className="flex flex-wrap gap-4 mt-1">
                                    <div className="flex items-center gap-1.5 text-sm text-gray-600">
                                        <Mail size={14} className="text-gray-400" /> {student.email}
                                    </div>
                                    <div className="flex items-center gap-1.5 text-sm text-gray-600">
                                        <Phone size={14} className="text-gray-400" /> {student.phone}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ================= RIGHT COLUMN (Financials & Meta) ================= */}
                <div className="space-y-6">
                    {/* 3. FINANCIAL SUMMARY */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                        <div className="bg-gray-900 px-6 py-4 text-white">
                            <h3 className="font-bold flex items-center gap-2">
                                <CreditCard size={18} /> Financial Summary
                            </h3>
                        </div>

                        <div className="p-6 space-y-5">
                            {/* A. Student Payment Section */}
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                                    Student Payment
                                </p>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between text-gray-600">
                                        <span>Item Total (MRP)</span>
                                        <span>{formatCurrency(financials.itemTotal)}</span>
                                    </div>

                                    {/* --- COUPON DISPLAY LOGIC START --- */}
                                    {financials.couponDeduction > 0 && (
                                        <div className="py-1">
                                            {/* Case 1: Multiple Coupons (Show detailed list) */}
                                            {financials.couponDetails?.list && financials.couponDetails.list.length > 1 ? (
                                                <div className="space-y-1 bg-emerald-50/50 p-2 rounded border border-emerald-100">
                                                    <p className="text-[10px] text-emerald-800 font-bold mb-1">
                                                        Coupons Applied:
                                                    </p>
                                                    {financials.couponDetails.list.map((coupon, idx) => (
                                                        <div
                                                            key={idx}
                                                            className="flex justify-between text-emerald-600 text-xs"
                                                        >
                                                            <span className="flex items-center gap-1">
                                                                <Tag size={10} /> {coupon.code}
                                                            </span>
                                                            <span>-{formatCurrency(coupon.discountAmount)}</span>
                                                        </div>
                                                    ))}
                                                    <div className="border-t border-emerald-200 my-1"></div>
                                                    <div className="flex justify-between text-emerald-700 font-medium text-xs">
                                                        <span>Total Savings</span>
                                                        <span>-{formatCurrency(financials.couponDeduction)}</span>
                                                    </div>
                                                </div>
                                            ) : (
                                                // Case 2: Single Coupon
                                                <div className="flex justify-between text-emerald-600 font-medium">
                                                    <span className="flex items-center gap-1">
                                                        <Tag size={12} /> Coupon ({financials.couponDetails?.code})
                                                    </span>
                                                    <span>-{formatCurrency(financials.couponDeduction)}</span>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                    {/* --- COUPON DISPLAY LOGIC END --- */}

                                    <div className="flex justify-between text-gray-500 text-xs">
                                        <span>Tax (GST 3%)</span>
                                        <span>+{formatCurrency(financials.taxCollected)}</span>
                                    </div>

                                    <div className="border-t border-gray-200 my-1"></div>

                                    <div className="flex justify-between font-bold text-gray-900 text-base">
                                        <span>Total Paid by Student</span>
                                        <span>{formatCurrency(financials.totalPaidByStudent)}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="border-t border-dashed border-gray-200"></div>

                            {/* B. Tutor Payout Section */}
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                                    Payout Breakdown
                                </p>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between text-gray-500 text-xs">
                                        <span>Tax Deduction (Govt)</span>
                                        <span>-{formatCurrency(financials.taxCollected)}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-500 text-xs">
                                        <span>Platform Fee (10%)</span>
                                        <span>-{formatCurrency(financials.adminFee)}</span>
                                    </div>
                                    <div className="border-t border-gray-200 my-2"></div>

                                    {/* Net Earnings Highlight */}
                                    <div className="flex justify-between items-center bg-gradient-to-r from-emerald-50 to-teal-50 p-3 rounded-lg border border-emerald-100">
                                        <div>
                                            <span className="block text-xs font-bold text-emerald-800 uppercase tracking-wider">
                                                Net Earnings
                                            </span>
                                            <span className="text-[10px] text-emerald-600">Credited to wallet</span>
                                        </div>
                                        <span className="text-xl font-bold text-emerald-700">
                                            {formatCurrency(financials.netEarnings)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 4. VISUAL TIMELINE */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                        <h3 className="font-bold text-gray-800 mb-4 text-sm uppercase">Order Activity</h3>
                        <div className="relative border-l-2 border-indigo-100 ml-2 space-y-6">
                            {/* Placed Node */}
                            <div className="relative pl-6">
                                <div className="absolute -left-[7px] top-1 w-3.5 h-3.5 rounded-full bg-indigo-500 border-2 border-white shadow-sm"></div>
                                <h4 className="text-sm font-semibold text-gray-900">Order Placed</h4>
                                <p className="text-xs text-gray-500 mt-0.5">{formatDate(timeline.orderedAt)}</p>
                            </div>

                            {/* Verified Node */}
                            <div className="relative pl-6">
                                <div className="absolute -left-[7px] top-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white shadow-sm"></div>
                                <h4 className="text-sm font-semibold text-gray-900">Payment Verified</h4>
                                <p className="text-xs text-gray-500 mt-0.5">via {orderInfo.paymentMethod}</p>

                                {/* Transaction ID with Copy */}
                                <div className="flex items-center gap-2 mt-2 bg-gray-50 p-1.5 rounded border border-gray-200 w-fit">
                                    <code className="text-[10px] font-mono text-gray-600">
                                        {orderInfo.transactionId || "N/A"}
                                    </code>
                                    <button
                                        onClick={() => copyToClipboard(orderInfo.transactionId)}
                                        className="text-gray-400 hover:text-indigo-600 transition"
                                        title="Copy Transaction ID"
                                    >
                                        <Copy size={12} />
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
