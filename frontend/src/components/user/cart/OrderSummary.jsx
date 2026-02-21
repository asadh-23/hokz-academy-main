import { ShieldCheck, Zap, ChevronRight } from "lucide-react";

const OrderSummary = ({ subtotal, tax, total, itemCount, onCheckout, loading }) => {
    return (
        <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-blue-900/5 border border-slate-50 p-8 sticky top-24">
            <h2 className="text-2xl font-black text-[#1E2EDE] mb-8 uppercase tracking-tight">Summary</h2>

            <div className="space-y-4 mb-8 pb-8 border-b border-slate-50">
                <div className="flex justify-between items-center text-slate-400">
                    <span className="text-[10px] font-black uppercase tracking-widest">
                        Subtotal ({itemCount} {itemCount === 1 ? "Course" : "Courses"})
                    </span>
                    <span className="font-bold text-slate-700">₹{Math.round(subtotal)}</span>
                </div>
                <div className="flex justify-between items-center text-slate-400">
                    <span className="text-[10px] font-black uppercase tracking-widest">Processing Fee</span>
                    <span className="font-bold text-slate-700">₹{Math.round(tax)}</span>
                </div>
            </div>

            <div className="flex justify-between items-center mb-10">
                <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Total Pay</span>
                <span className="text-3xl font-black text-[#1E2EDE]">₹{Math.round(total)}</span>
            </div>

            <button
                onClick={onCheckout}
                disabled={loading || itemCount === 0}
                className="group w-full py-5 bg-[#1E2EDE] text-[#E6D929] font-black rounded-2xl shadow-xl shadow-blue-100 hover:bg-[#14C4E7] hover:text-white transition-all disabled:opacity-50 flex items-center justify-center gap-3 uppercase text-xs tracking-widest"
            >
                Checkout Now
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>

            {/* Trust Badges */}
            <div className="mt-10 space-y-4">
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-[#14C4E7] shadow-sm">
                        <Zap size={20} />
                    </div>
                    <p className="text-[10px] font-black text-[#1E2EDE] uppercase tracking-widest leading-tight">
                        Instant Access
                        <br />
                        <span className="text-slate-400">Start Learning Now</span>
                    </p>
                </div>
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-[#E6D929] shadow-sm">
                        <ShieldCheck size={20} />
                    </div>
                    <p className="text-[10px] font-black text-[#1E2EDE] uppercase tracking-widest leading-tight">
                        Secure Gateway
                        <br />
                        <span className="text-slate-400">SSL Encrypted Pay</span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default OrderSummary;
