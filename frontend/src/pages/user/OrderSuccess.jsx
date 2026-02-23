import React, { useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { CheckCircle, PlayCircle, Download, Search, Receipt, ChevronRight, Mail, ExternalLink, CreditCard, Calendar } from "lucide-react";
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

    // ANIMATION REMOVED AS REQUESTED

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
        <div className="min-h-screen bg-[#FDFDFD] py-10 md:py-16 px-4">
            <div className="max-w-5xl mx-auto">
                {/* --- HEADER SECTION --- */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-green-50 rounded-full mb-6 relative">
                        <CheckCircle className="w-12 h-12 text-green-500 relative z-10" />
                        <div className="absolute inset-0 bg-green-200 rounded-full animate-ping opacity-20"></div>
                    </div>
                    <h1 className="text-3xl md:text-5xl font-black text-[#1E2EDE] mb-4 tracking-tight">
                        PAYMENT <span className="text-[#14C4E7]">SUCCESSFUL!</span>
                    </h1>
                    <p className="text-slate-500 text-base md:text-lg max-w-xl mx-auto font-medium">
                        Thank you for your purchase. A confirmation email has been sent to 
                        <span className="text-[#1E2EDE] font-bold block md:inline ml-1">{orderData.email}</span>
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* --- LEFT: COURSE LIST --- */}
                    <div className="lg:col-span-8 space-y-6">
                        <div className="bg-white rounded-[2rem] shadow-[0_20px_50px_rgba(30,46,222,0.05)] border border-slate-100 overflow-hidden">
                            <div className="px-8 py-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
                                <h2 className="font-black text-[#1E2EDE] text-sm uppercase tracking-widest">Enrollment Details</h2>
                                <span className="text-[10px] bg-[#14C4E7] text-white font-black px-3 py-1 rounded-full uppercase tracking-tighter">
                                    {purchasedCourses.length} {purchasedCourses.length === 1 ? 'Course' : 'Courses'}
                                </span>
                            </div>

                            <div className="divide-y divide-slate-50">
                                {purchasedCourses.map((course) => (
                                    <div key={course._id} className="p-6 md:p-8 flex flex-col md:flex-row gap-6 hover:bg-slate-50/30 transition-colors">
                                        <div className="relative shrink-0">
                                            <img
                                                src={course.thumbnailUrl}
                                                alt={course.title}
                                                className="w-full md:w-48 h-32 object-cover rounded-2xl shadow-sm"
                                            />
                                            <div className="absolute top-2 right-2 bg-[#E6D929] text-[#1E2EDE] p-1.5 rounded-lg">
                                                <PlayCircle size={16} fill="currentColor" className="text-white" />
                                            </div>
                                        </div>

                                        <div className="flex-1 flex flex-col justify-between">
                                            <div>
                                                <h3 className="font-black text-[#1E2EDE] text-xl leading-tight mb-1">{course.title}</h3>
                                                <p className="text-sm text-[#14C4E7] font-bold uppercase tracking-wide">
                                                    By {course.tutor?.fullName || "Hokz Academy"}
                                                </p>
                                            </div>

                                            <div className="mt-6 flex justify-between items-center">
                                                <button
                                                    onClick={() => navigate(`/user/learn/${course._id}`)}
                                                    className="group flex items-center gap-2 text-[#1E2EDE] font-black text-sm hover:text-[#14C4E7] transition-colors"
                                                >
                                                    <span className="w-8 h-8 rounded-full bg-[#1E2EDE]/5 flex items-center justify-center group-hover:bg-[#14C4E7]/10">
                                                        <PlayCircle size={16} />
                                                    </span>
                                                    START LEARNING
                                                </button>
                                                <span className="font-black text-xl text-[#1E2EDE]">₹{course.price}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* --- ACTIONS --- */}
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link
                                to="/user/courses"
                                className="flex-1 flex justify-center items-center gap-3 bg-[#1E2EDE] text-[#E6D929] font-black py-5 rounded-2xl hover:shadow-xl hover:shadow-[#1E2EDE]/20 transition-all uppercase tracking-widest text-sm"
                            >
                                <Search size={20} />
                                Explore More
                            </Link>

                            <PDFDownloadLink
                                document={<InvoicePDF orderData={orderData} courses={purchasedCourses} student={user} />}
                                fileName={`hokz academy-Invoice_${orderData.razorpayOrderId}.pdf`}
                                className="flex-1"
                            >
                                {({ blob, url, loading, error }) => (
                                    <button
                                        disabled={loading}
                                        className="w-full h-full flex justify-center items-center gap-3 border-2 border-slate-100 bg-white hover:bg-slate-50 text-[#1E2EDE] py-5 rounded-2xl font-black transition-all disabled:opacity-50 uppercase tracking-widest text-sm"
                                    >
                                        <Download size={20} className="text-[#14C4E7]" />
                                        {loading ? "Generating..." : "Get Invoice"}
                                    </button>
                                )}
                            </PDFDownloadLink>
                        </div>
                    </div>

                    {/* --- RIGHT: ORDER SUMMARY --- */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="bg-white rounded-[2rem] shadow-[0_20px_50px_rgba(30,46,222,0.05)] border border-slate-100 p-8">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-10 h-10 bg-[#1E2EDE]/5 rounded-xl flex items-center justify-center text-[#1E2EDE]">
                                    <Receipt size={22} />
                                </div>
                                <h2 className="font-black text-[#1E2EDE] uppercase tracking-wider">Order Receipt</h2>
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between items-center text-xs">
                                    <span className="text-slate-400 font-bold uppercase flex items-center gap-2"><CreditCard size={14}/> Order ID</span>
                                    <span className="font-mono text-[#1E2EDE] font-bold">{orderData.razorpayOrderId}</span>
                                </div>
                                <div className="flex justify-between items-center text-xs">
                                    <span className="text-slate-400 font-bold uppercase flex items-center gap-2"><Calendar size={14}/> Date</span>
                                    <span className="text-slate-700 font-bold">{formatDate(orderData.createdAt)}</span>
                                </div>
                                <div className="flex justify-between items-center text-xs">
                                    <span className="text-slate-400 font-bold uppercase">Payment Mode</span>
                                    <span className="text-green-600 font-black">Online (Razorpay)</span>
                                </div>

                                <div className="pt-6 mt-6 border-t border-dashed border-slate-200 space-y-3">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-500 font-medium">Subtotal</span>
                                        <span className="font-bold text-[#1E2EDE]">₹{orderData.totalAmount}</span>
                                    </div>

                                    {orderData.couponDiscount > 0 && (
                                        <div className="flex justify-between text-sm">
                                            <span className="text-green-600 font-medium">Discount</span>
                                            <span className="font-bold text-green-600">-₹{orderData.couponDiscount}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-500 font-medium">GST / Tax</span>
                                        <span className="font-bold text-slate-700">₹{orderData.taxAmount}</span>
                                    </div>
                                    
                                    <div className="pt-4 flex justify-between items-center">
                                        <span className="text-[#1E2EDE] font-black text-sm uppercase">Total Paid</span>
                                        <span className="text-3xl font-black text-[#1E2EDE] tracking-tighter">
                                            ₹{orderData.finalAmount}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* --- SUPPORT CARD --- */}
                        <div className="bg-gradient-to-br from-[#1E2EDE] to-[#14C4E7] p-8 rounded-[2rem] text-white relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110"></div>
                            <h3 className="font-black flex items-center gap-2 uppercase tracking-widest text-sm relative z-10">
                                <Mail size={18} className="text-[#E6D929]" /> Support
                            </h3>
                            <p className="text-white/80 text-xs mt-3 leading-relaxed relative z-10 font-medium">
                                If you experience any issues accessing your courses, please contact our help desk immediately.
                            </p>
                            <div className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest mt-5 transition-all relative z-10">
                                Contact Support <ChevronRight size={14} />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-16 text-center">
                    <Link to="/user/dashboard" className="inline-flex items-center gap-2 text-slate-400 hover:text-[#1E2EDE] font-bold text-sm transition-all">
                        Back to My Dashboard <ExternalLink size={16} />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default OrderSuccess;