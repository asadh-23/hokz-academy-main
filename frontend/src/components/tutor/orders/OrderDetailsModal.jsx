import { X, User, BookOpen, CreditCard, Download, Mail, Smartphone } from "lucide-react";
import { toast } from "sonner";
import StatusBadge from "./StatusBadge";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

const OrderDetailsModal = ({ order, onClose }) => {
    if (!order) return null;

    const formatPrice = (price) => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0,
        }).format(price || 0);
    };

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleString("en-IN", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    // --- Calculations (Safe Version) ---
    const basePrice = order.payment?.soldPrice || 0;
    const taxAmount = order.payment?.tax || 0;
    const totalPaidByStudent = basePrice + taxAmount;
    const totalDiscount = (order.payment?.totalDiscount || 0) - (order.payment?.couponDiscount || 0);
    const earningPercentage = basePrice > 0 ? ((order.payment.tutorEarning / basePrice) * 100).toFixed(1) : 0;

    const handleDownloadInvoice = () => {
        const doc = new jsPDF();

        // Helper for formatting price with "Rs."
        const formatPriceForPDF = (price) => {
            return (
                "Rs. " +
                new Intl.NumberFormat("en-IN", {
                    maximumFractionDigits: 0,
                }).format(price || 0)
            );
        };

        // 1. Add Title & Header
        doc.setFontSize(22);
        doc.setTextColor(40, 40, 40);
        doc.text("INVOICE / STATEMENT", 14, 20); // Changed title slightly

        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.text(`Order ID: #${order.displayId}`, 14, 30);
        doc.text(`Date: ${new Date(order.orderDate).toLocaleDateString("en-IN")}`, 14, 35);
        doc.text(`Status: ${order.status.toUpperCase()}`, 14, 40);

        // 2. Student & Course Info
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.text("Student Details:", 14, 55);
        doc.setFontSize(10);
        doc.setTextColor(80, 80, 80);
        doc.text(`Name: ${order.student?.name || "N/A"}`, 14, 62);
        doc.text(`Email: ${order.student?.email || "N/A"}`, 14, 67);

        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.text("Course Details:", 110, 55);
        doc.setFontSize(10);
        doc.setTextColor(80, 80, 80);
        doc.text(`Title: ${order.course?.title || "Course"}`, 110, 62);
        doc.text(`Category: ${order.course?.category || "N/A"}`, 110, 67);

        // 3. Create Table
        autoTable(doc, {
            startY: 80,
            head: [["Description", "Amount (INR)"]],
            body: [
                // --- Student Payment Section ---
                ["Course MRP", formatPriceForPDF(order.payment.mrp)],
                ["Offer Discount", `-${formatPriceForPDF(totalDiscount)}`],
                order.payment.couponDiscount > 0
                    ? ["Coupon Discount", `-${formatPriceForPDF(order.payment.couponDiscount)}`]
                    : null,
                ["Taxable Value (Base Price)", formatPriceForPDF(basePrice)],
                ["GST / Tax (3%)", `+${formatPriceForPDF(taxAmount)}`],
                [
                    { content: "Total Paid by Student", styles: { fontStyle: "bold", fillColor: [240, 240, 240] } },
                    {
                        content: formatPriceForPDF(totalPaidByStudent),
                        styles: { fontStyle: "bold", fillColor: [240, 240, 240] },
                    },
                ],

                // --- Spacer Row (Empty) ---
                [{ content: "", colSpan: 2, styles: { cellPadding: 2, fillColor: [255, 255, 255] } }],

                // --- Tutor Payout Details (New Section) ---
                [
                    {
                        content: "Tutor Payout Details",
                        colSpan: 2,
                        styles: { fontStyle: "bold", textColor: [100, 100, 100], halign: "left" },
                    },
                ],

                ["Platform Fee (10%)", `-${formatPriceForPDF(order.payment.platformFee)}`],

                [
                    { content: "Net Tutor Earning", styles: { fontStyle: "bold", textColor: [79, 70, 229], fontSize: 11 } },
                    {
                        content: formatPriceForPDF(order.payment.tutorEarning),
                        styles: { fontStyle: "bold", textColor: [79, 70, 229], fontSize: 11 },
                    },
                ],
            ].filter(Boolean),
            theme: "grid",
            headStyles: { fillColor: [79, 70, 229] },
            styles: { fontSize: 10, cellPadding: 3 },
        });

        // 4. Footer
        const finalY = doc.lastAutoTable.finalY + 20;
        doc.setFontSize(10);
        doc.setTextColor(150, 150, 150);
        doc.text("This is a computer-generated document.", 14, finalY);

        // 5. Save PDF
        doc.save(`Statement_${order.displayId}.pdf`);
        toast.success("Statement downloaded successfully");
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200">
                {/* Modal Header */}
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <h2 className="text-xl font-bold text-gray-900">Order Details</h2>
                            <StatusBadge status={order.status} />
                        </div>
                        <p className="text-sm text-gray-500">
                            Order #{order.displayId} • Placed on {formatDate(order.orderDate)}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-gray-200 text-gray-500 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Modal Body */}
                <div className="p-6 overflow-y-auto flex-1 space-y-8 custom-scrollbar">
                    {/* Student & Course Info Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Student Information */}
                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
                            <div className="flex items-center gap-2 mb-4">
                                <User className="w-5 h-5 text-blue-600" />
                                <h3 className="text-sm font-bold uppercase text-blue-600 tracking-wider">
                                    Student Information
                                </h3>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-blue-600 font-bold text-xl overflow-hidden border-2 border-blue-200 shadow-sm flex-shrink-0">
                                    {order.student?.profileImage ? (
                                        <img
                                            src={order.student.profileImage}
                                            alt={order.student.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        (order.student?.name || "U").charAt(0).toUpperCase()
                                    )}
                                </div>

                                <div className="flex-1">
                                    <h4 className="font-bold text-gray-900 text-lg mb-2">
                                        {order.student?.name || "Unknown Student"}
                                    </h4>
                                    <div className="space-y-2 text-sm text-gray-600">
                                        <div className="flex items-center gap-2">
                                            <Mail size={14} className="text-gray-400" />
                                            <span>{order.student?.email}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Smartphone size={14} className="text-gray-400" />
                                            <span>{order.student?.phone || "N/A"}</span>
                                        </div>
                                    </div>
                                    <div className="mt-3 pt-3 border-t border-blue-200">
                                        <p className="text-xs text-blue-600">
                                            Member since {formatDate(order.student?.registeredAt)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Course Information */}
                        <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl p-6 border border-emerald-100">
                            <div className="flex items-center gap-2 mb-4">
                                <BookOpen className="w-5 h-5 text-emerald-600" />
                                <h3 className="text-sm font-bold uppercase text-emerald-600 tracking-wider">
                                    Course Details
                                </h3>
                            </div>

                            <div className="flex gap-4">
                                <div className="w-20 h-20 rounded-xl bg-white overflow-hidden flex-shrink-0 border border-emerald-200 shadow-sm">
                                    <img
                                        src={order.course?.thumbnail}
                                        alt={order.course?.title}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            e.target.src = "https://via.placeholder.com/80x80?text=Course";
                                        }}
                                    />
                                </div>

                                <div className="flex-1">
                                    <h4 className="font-bold text-gray-900 text-lg mb-2 line-clamp-2">
                                        {order.course?.title}
                                    </h4>
                                    <div className="space-y-1 text-sm text-gray-600">
                                        <p className="text-emerald-600 font-medium">{order.course?.category}</p>
                                        <p>{order.course?.lessonsCount} Lessons</p>
                                        <p>{order.course?.offerPercentage}% Discount Applied</p>
                                        {order.course?.description && (
                                            <p className="text-gray-500 text-xs line-clamp-2 mt-2">
                                                {order.course.description}
                                            </p>
                                        )}
                                        {order.course?.createdAt && (
                                            <p className="text-emerald-500 text-xs mt-1">
                                                Created: {formatDate(order.course.createdAt)}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Payment Breakdown */}
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <CreditCard className="w-5 h-5 text-indigo-600" />
                            <h3 className="text-lg font-bold text-gray-900">Payment Breakdown & Earnings</h3>
                        </div>

                        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                            <div className="p-6 space-y-3">
                                {/* 1. MRP */}
                                <div className="flex justify-between items-center text-gray-600 text-sm">
                                    <span>Course MRP</span>
                                    <span className="font-medium">{formatPrice(order.payment.mrp)}</span>
                                </div>

                                {/* 2. Offer Discount */}
                                <div className="flex justify-between items-center text-emerald-600 text-sm">
                                    <span>Offer Discount</span>
                                    <span className="font-medium">
                                        -{" "}
                                        {formatPrice(
                                            (order.payment.totalDiscount || 0) - (order.payment.couponDiscount || 0),
                                        )}
                                    </span>
                                </div>

                                {/* 3. Coupon Discount */}
                                {order.payment.couponDiscount > 0 && (
                                    <div className="flex justify-between items-center text-emerald-600 text-sm">
                                        <span>Coupon Discount</span>
                                        <span className="font-medium">- {formatPrice(order.payment.couponDiscount)}</span>
                                    </div>
                                )}

                                <div className="border-t border-dashed border-gray-200 my-2"></div>

                                {/* 4. Taxable Value (Base Price - 896) */}
                                <div className="flex justify-between items-center text-gray-500 text-sm">
                                    <span>Taxable Value (Base Price)</span>
                                    <span>{formatPrice(basePrice)}</span>
                                </div>

                                {/* 5. Tax (27) */}
                                <div className="flex justify-between items-center text-gray-500 text-sm">
                                    <span className="flex items-center gap-2">
                                        Tax (3%)
                                        <span className="bg-gray-100 text-[10px] px-1.5 py-0.5 rounded text-gray-500 font-medium border border-gray-200">
                                            Govt. Tax
                                        </span>
                                    </span>
                                    <span>+ {formatPrice(taxAmount)}</span>
                                </div>

                                <div className="border-t border-gray-200 my-2"></div>

                                {/* 6. Total Paid (923) */}
                                <div className="flex justify-between items-center font-bold text-gray-900 text-base bg-gray-50 p-3 rounded-lg">
                                    <span>Total Paid by Student</span>
                                    <span>{formatPrice(totalPaidByStudent)}</span>
                                </div>

                                {/* 7. Deductions */}
                                <div className="mt-4 pt-4">
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                                        Deductions (From Base Price)
                                    </p>
                                    <div className="flex justify-between items-center text-red-500 text-sm">
                                        <span>Platform Fee (10% of {formatPrice(basePrice)})</span>
                                        <span>- {formatPrice(order.payment.platformFee)}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Final Earning Highlight (806) */}
                            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 border-t border-indigo-100">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h4 className="text-indigo-900 font-bold text-lg">Net Tutor Earning</h4>
                                        <p className="text-indigo-600 text-xs">Credited to wallet (Base Price - Fees)</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-3xl font-black text-indigo-600">
                                            {formatPrice(order.payment.tutorEarning)}
                                        </p>
                                        <p className="text-sm text-indigo-500">{earningPercentage}% of base sale</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-200 bg-gray-50 flex justify-between items-center">
                    <div className="text-sm text-gray-500">
                        Payment ID:{" "}
                        <span className="font-mono text-xs bg-gray-200 px-2 py-1 rounded">{order.displayId || "N/A"}</span>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="px-6 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-200 transition-colors"
                        >
                            Close
                        </button>
                        <button
                            onClick={handleDownloadInvoice}
                            className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
                        >
                            <Download size={16} /> Download Invoice
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetailsModal;
