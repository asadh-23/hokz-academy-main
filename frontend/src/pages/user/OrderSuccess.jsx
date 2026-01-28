import React, { useEffect, useMemo } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { CheckCircle, PlayCircle, Download, Search, Receipt, ChevronRight, Mail, ExternalLink } from "lucide-react";
import confetti from "canvas-confetti";
import InvoicePDF from "../../components/user/pdfs/InvoicePDF";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { useSelector } from "react-redux";
import { selectUser } from "../../store/features/auth/userAuthSlice";

const OrderSuccess = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const { purchasedCourses, orderData } = location.state || {};
    const user = useSelector(selectUser);

    useEffect(() => {
        if (!purchasedCourses || !orderData) {
            navigate("/user/courses", { replace: true });
        }
    }, [purchasedCourses, orderData, navigate]);

    useEffect(() => {
    if (!purchasedCourses || sessionStorage.getItem("confettiShown")) return;

    sessionStorage.setItem("confettiShown", "true");

    const end = Date.now() + 2000;

    (function frame() {
        confetti({
            particleCount: 3,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
        });
        confetti({
            particleCount: 3,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
        });

        if (Date.now() < end) requestAnimationFrame(frame);
    })();
}, [purchasedCourses]);

    const formatDate = (dateString) => {
        if (!dateString) return "";
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };


    if (!purchasedCourses || !orderData) return null;

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-10">
                    <div className="inline-flex p-3 bg-green-100 rounded-full mb-4">
                        <CheckCircle className="w-12 h-12 text-green-600" />
                    </div>
                    <h1 className="text-4xl font-extrabold text-slate-900 mb-2">Thank you for your order!</h1>
                    <p className="text-lg text-slate-600">
                        We've sent a confirmation email to{" "}
                        <span className="font-semibold text-slate-900">{orderData.email}</span>
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-2xl border overflow-hidden">
                            <div className="px-6 py-4 border-b bg-slate-50 flex justify-between">
                                <h2 className="font-bold text-sm uppercase">Your New Courses</h2>
                                <span className="text-xs bg-indigo-100 text-indigo-700 font-bold px-2 py-1 rounded">
                                    {purchasedCourses.length} ITEMS
                                </span>
                            </div>

                            {purchasedCourses.map((course) => (
                                <div key={course._id} className="p-6 flex gap-6 border-b last:border-b-0">
                                    <img
                                        src={course.thumbnailUrl}
                                        alt={course.title}
                                        className="w-40 h-24 object-cover rounded-lg"
                                    />

                                    <div className="flex-1">
                                        <h3 className="font-bold text-lg">{course.title}</h3>
                                        <p className="text-sm text-slate-500 italic">
                                            with {course.tutor?.fullName || "Hokz Academy"}
                                        </p>

                                        <div className="mt-4 flex justify-between items-center">
                                            <button
                                                onClick={() => navigate(`/user/learn/${course._id}`)}
                                                className="flex items-center gap-2 text-indigo-600 font-bold text-sm"
                                            >
                                                <PlayCircle size={18} />
                                                Start Learning Now
                                            </button>

                                            <span className="font-bold text-slate-900">₹{course.price}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="flex gap-4">
                            <Link
                                to="/user/courses"
                                className="flex-1 flex justify-center items-center gap-2 bg-slate-900 text-white py-4 rounded-xl"
                            >
                                <Search size={20} />
                                Browse More Courses
                            </Link>

                            <PDFDownloadLink
                                document={<InvoicePDF orderData={orderData} courses={purchasedCourses} student={user} />}
                                fileName={`hokz academy-Invoice_${orderData.razorpayOrderId}.pdf`}
                                className="flex-1"
                            >
                                {({ blob, url, loading, error }) => (
                                    <button
                                        disabled={loading}
                                        className="w-full flex justify-center items-center gap-2 border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 py-4 rounded-xl font-bold transition-all disabled:opacity-50"
                                    >
                                        <Download size={20} />
                                        {loading ? "Generating..." : "Download Invoice"}
                                    </button>
                                )}
                            </PDFDownloadLink>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-white rounded-2xl border p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <Receipt size={20} />
                                <h2 className="font-bold">Order Details</h2>
                            </div>

                            <div className="text-sm space-y-3">
                                <div className="flex justify-between">
                                    <span>Order ID</span>
                                    <span className="font-mono">{orderData.razorpayOrderId}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Date</span>
                                    <span>{formatDate(orderData.createdAt)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Payment</span>
                                    <span>Razorpay (Online)</span>
                                </div>

                                <div className="pt-4 border-t space-y-2">
                                    <div className="flex justify-between">
                                        <span>Subtotal</span>
                                        <span>₹{orderData.totalAmount}</span>
                                    </div>

                                    {orderData.couponDiscount > 0 && (
                                        <div className="flex justify-between text-green-600">
                                            <dt>Coupon Discount</dt>
                                            <dd>-₹{orderData.couponDiscount}</dd>
                                        </div>
                                    )}
                                    <div className="flex justify-between text-slate-600">
                                        <dt>Tax</dt>

                                        <dd>₹{orderData.taxAmount}</dd>
                                    </div>
                                    <div className="flex justify-between text-slate-900 font-bold text-lg pt-2">
                                        <dt>Total Paid</dt>
                                        {/* Final Amount directly from Backend */}
                                        <dd className="text-indigo-600 font-black">₹{orderData.finalAmount}</dd>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-indigo-50 p-6 rounded-2xl">
                            <h3 className="font-bold flex items-center gap-2">
                                <Mail size={18} /> Need help?
                            </h3>
                            <p className="text-sm mt-2">If you face any issue accessing your courses, contact support.</p>
                            <Link to="/support" className="text-indigo-600 text-sm font-bold flex items-center gap-1 mt-3">
                                Go to Help Center <ChevronRight size={14} />
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="mt-12 text-center">
                    <Link to="/dashboard" className="text-sm text-slate-500 flex justify-center items-center gap-2">
                        Return to Dashboard <ExternalLink size={14} />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default OrderSuccess;
