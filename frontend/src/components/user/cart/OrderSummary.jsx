import { ShieldCheck, Zap } from "lucide-react";

const OrderSummary = ({ subtotal, tax, total, itemCount, onCheckout, loading }) => {
    return (
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 sticky top-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>

            <div className="space-y-3 mb-4 pb-4 border-b border-gray-200">
                <div className="flex justify-between text-gray-600">
                    <span>Subtotal ({itemCount} {itemCount === 1 ? "item" : "items"})</span>
                    <span className="font-semibold">₹{Math.round(subtotal)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                    <span>Tax (5%)</span>
                    <span className="font-semibold">₹{Math.round(tax)}</span>
                </div>
            </div>

            <div className="flex justify-between items-center mb-6">
                <span className="text-lg font-bold text-gray-900">Total</span>
                <span className="text-3xl font-bold bg-gradient-to-r from-cyan-600 to-emerald-600 bg-clip-text text-transparent">
                    ₹{Math.round(total)}
                </span>
            </div>

            <button
                onClick={onCheckout}
                disabled={loading || itemCount === 0}
                className="w-full py-3.5 bg-gradient-to-r from-cyan-500 to-emerald-500 text-white font-bold rounded-xl hover:from-cyan-600 hover:to-emerald-600 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
                Proceed to Checkout
                <span className="text-xl">→</span>
            </button>

            <div className="mt-6 space-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Zap className="w-4 h-4 text-emerald-500" />
                    <span>Instant access after purchase</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <ShieldCheck className="w-4 h-4 text-cyan-500" />
                    <span>Encrypted & Secure payments</span>
                </div>
            </div>
        </div>
    );
};

export default OrderSummary;
