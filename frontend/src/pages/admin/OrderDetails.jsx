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
            paid: "bg-emerald-100 text-emerald-700 border-emerald-200",
            pending: "bg-amber-100 text-amber-700 border-amber-200",
            failed: "bg-red-100 text-red-700 border-red-200",
        };
        const icons = {
            paid: <CheckCircle size={14} />,
            pending: <AlertCircle size={14} />,
            failed: <XCircle size={14} />,
        };
        return (
            <span
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase border ${styles[status] || styles.pending}`}
            >
                {icons[status] || icons.pending} {status}
            </span>
        );
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (!data) return null;

    const { order, customer, items, financials } = data;

    return (
        <div className="min-h-screen bg-gray-50 p-6 md:p-8 font-sans">
            {/* --- HEADER SECTION --- */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 bg-white border border-gray-200 rounded-full hover:bg-gray-100 transition shadow-sm"
                    >
                        <ArrowLeft size={20} className="text-gray-600" />
                    </button>
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <h1 className="text-2xl font-bold text-gray-900">
                                Order #{order.orderId?.split("_")[1] || order._id.slice(-6).toUpperCase()}
                            </h1>
                            {getStatusBadge(order.status)}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Calendar size={14} />
                            Placed on {formatDate(order.createdAt)} via{" "}
                            <span className="uppercase font-semibold">{order.paymentMethod}</span>
                        </div>
                    </div>
                </div>

                <button
                    onClick={downloadInvoice}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition shadow-sm text-sm"
                >
                    <Download size={16} /> Download Invoice
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* ================= LEFT COLUMN (Items & Financial Breakdown) ================= */}
                <div className="lg:col-span-2 space-y-8">
                    {/* 1. PURCHASED COURSES */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                            <h2 className="font-bold text-gray-800 flex items-center gap-2">
                                <GraduationCap size={18} className="text-indigo-600" />
                                Purchased Courses ({items.length})
                            </h2>
                        </div>

                        {/* Table Header */}
                        <div className="grid grid-cols-12 px-6 py-3 bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            <div className="col-span-6">Course Details</div>
                            <div className="col-span-2 text-right">MRP</div>
                            <div className="col-span-2 text-right">Offer Price</div>
                            <div className="col-span-2 text-right">Paid</div>
                        </div>

                        <div className="divide-y divide-gray-100">
                            {items.map((item, index) => (
                                <div
                                    key={index}
                                    className="grid grid-cols-12 px-6 py-4 items-center hover:bg-gray-50/50 transition"
                                >
                                    {/* Course Info */}
                                    <div className="col-span-6 flex gap-4">
                                        <img
                                            src={item.thumbnail}
                                            alt={item.title}
                                            className="w-16 h-12 rounded object-cover border border-gray-100"
                                        />
                                        <div>
                                            <h3 className="font-bold text-gray-900 text-sm line-clamp-1">{item.title}</h3>
                                            <p className="text-xs text-gray-500 mt-0.5">By {item.tutor?.fullName}</p>
                                        </div>
                                    </div>

                                    {/* MRP */}
                                    <div className="col-span-2 text-right text-sm text-gray-400 line-through">
                                        {formatCurrency(item.originalPrice)}
                                    </div>

                                    {/* Offer Price */}
                                    <div className="col-span-2 text-right text-sm font-medium text-gray-600">
                                        {formatCurrency(item.offerPrice)}
                                    </div>

                                    {/* Final Paid */}
                                    <div className="col-span-2 text-right">
                                        <p className="font-bold text-gray-900">{formatCurrency(item.pricePaid)}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 2. REVENUE DISTRIBUTION */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 bg-indigo-50/40 flex justify-between items-center">
                            <h2 className="font-bold text-indigo-900 flex items-center gap-2">
                                <ShieldCheck size={18} /> Revenue Distribution
                            </h2>
                            <span className="text-xs font-bold bg-indigo-600 text-white px-3 py-1 rounded-lg shadow-sm">
                                Total Admin Profit: {formatCurrency(financials.totalAdminProfit)}
                            </span>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-100">
                                    <tr>
                                        <th className="px-6 py-3">Instructor</th>
                                        <th className="px-6 py-3 text-right">Sales Amount</th>
                                        <th className="px-6 py-3 text-right text-indigo-600">Admin Commission</th>
                                        <th className="px-6 py-3 text-right text-emerald-600">Tutor Earnings</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {financials.breakdown.map((split, idx) => (
                                        <tr key={idx}>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    {split.tutorProfile ? (
                                                        <img
                                                            src={split.tutorProfile}
                                                            alt=""
                                                            className="w-8 h-8 rounded-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xs">
                                                            {split.tutorName.charAt(0)}
                                                        </div>
                                                    )}
                                                    <div>
                                                        <p className="font-bold text-gray-900">{split.tutorName}</p>
                                                        <p className="text-xs text-gray-500">{split.tutorEmail}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right font-medium text-gray-600">
                                                {formatCurrency(split.salesAmount)}
                                            </td>
                                            <td className="px-6 py-4 text-right font-bold text-indigo-600 bg-indigo-50/20">
                                                {formatCurrency(split.adminCommission)}
                                            </td>
                                            <td className="px-6 py-4 text-right font-bold text-emerald-600">
                                                {formatCurrency(split.tutorEarnings)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* ================= RIGHT COLUMN (Customer & Payment Summary) ================= */}
                <div className="space-y-6">
                    {/* CUSTOMER CARD */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                            <User size={14} /> Customer Details
                        </h3>
                        <div className="flex items-center gap-4 mb-6">
                            <img
                                src={customer.profileImage || "https://via.placeholder.com/100"}
                                alt={customer.fullName}
                                className="w-14 h-14 rounded-full border border-gray-100 object-cover shadow-sm"
                            />
                            <div>
                                <h4 className="font-bold text-gray-900 text-lg">{customer.fullName}</h4>
                                <span
                                    className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                                        customer.isBlocked ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"
                                    }`}
                                >
                                    {customer.isBlocked ? "Blocked" : "Active"}
                                </span>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3 text-sm text-gray-600 p-2 bg-gray-50 rounded-lg">
                                <Mail size={16} className="text-gray-400" />
                                <span className="truncate">{customer.email}</span>
                            </div>
                            {customer.phone && (
                                <div className="flex items-center gap-3 text-sm text-gray-600 p-2 bg-gray-50 rounded-lg">
                                    <Phone size={16} className="text-gray-400" />
                                    <span>{customer.phone}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* PAYMENT SUMMARY CARD */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                            <Receipt size={14} /> Payment Summary
                        </h3>

                        <div className="space-y-3 mb-6">
                            {/* MRP Total */}
                            <div className="flex justify-between text-sm text-gray-600">
                                <span>Subtotal (MRP)</span>
                                <span>{formatCurrency(order.totalAmount)}</span>
                            </div>
                            {order.couponDiscount > 0 && (
                                <div className="flex justify-between text-sm text-emerald-700 bg-emerald-50 px-2.5 py-1.5 rounded-lg border border-emerald-100">
                                    <span className="flex items-center gap-1.5 font-medium">
                                        <Tag size={12} /> Coupon Savings
                                    </span>
                                    <span className="font-bold">-{formatCurrency(order.couponDiscount)}</span>
                                </div>
                            )}

                            {/* Total Discount */}
                            <div className="flex justify-between text-sm text-gray-600">
                                <span>Total Discount</span>
                                <span className="text-green-600 font-medium">-{formatCurrency(order.discountAmount)}</span>
                            </div>

                            {/* Tax */}
                            <div className="flex justify-between text-sm text-gray-600">
                                <span>Tax (GST 3%)</span>
                                <span>+{formatCurrency(order.taxAmount)}</span>
                            </div>
                        </div>

                        {/* Grand Total */}
                        <div className="pt-4 border-t border-dashed border-gray-200 flex justify-between items-end bg-gray-50 -mx-6 -mb-6 p-6 rounded-b-2xl">
                            <div>
                                <span className="text-xs text-gray-500 font-medium uppercase">Total Paid</span>
                                <div className="flex items-center gap-1.5 mt-1">
                                    <CreditCard size={14} className="text-gray-400" />
                                    <span className="text-xs font-bold text-gray-500 uppercase">{order.paymentMethod}</span>
                                </div>
                            </div>
                            <span className="text-2xl font-bold text-gray-900">{formatCurrency(order.finalAmount)}</span>
                        </div>
                    </div>

                    {/* TRANSACTION ID */}
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 text-center">
                        <p className="text-xs text-gray-500 mb-1">Transaction ID</p>
                        <div className="flex items-center justify-center gap-2 bg-gray-50 p-2 rounded border border-gray-100">
                            <p className="font-mono text-xs font-medium text-gray-900 break-all select-all">
                                {order.transactionId || "N/A"}
                            </p>
                            {order.transactionId && (
                                <button
                                    onClick={() => copyToClipboard(order.transactionId)}
                                    className="text-gray-400 hover:text-indigo-600"
                                >
                                    <Copy size={12} />
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
