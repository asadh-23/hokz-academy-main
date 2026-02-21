import { Heart, RefreshCw, Trash2, ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";

const WishlistHeader = ({ itemCount, totalValue, onRefresh, onClearAll, loading, clearLoading }) => {
    const navigate = useNavigate();
    return (
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
                <div className="flex items-center gap-4 mb-3">
                    <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
                        <Heart className="h-7 w-7 text-[#E6D929] fill-[#E6D929]" />
                    </div>
                    <h1 className="text-3xl md:text-5xl font-black text-[#FDFDFD] tracking-tight">
                        Saved <span className="text-[#E6D929]">Courses</span>
                    </h1>
                </div>
                <div className="flex items-center gap-3 text-[#FDFDFD]/70 font-bold uppercase tracking-widest text-[10px]">
                    <span>
                        {itemCount} {itemCount === 1 ? "Module" : "Modules"}
                    </span>
                    <span className="w-1 h-1 bg-[#14C4E7] rounded-full"></span>
                    <span>
                        Value: <span className="text-[#E6D929]">₹{Math.round(totalValue)}</span>
                    </span>
                </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
                <button
                    onClick={onRefresh}
                    disabled={loading}
                    className="flex items-center gap-2 px-5 py-3 bg-white/10 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-white/20 transition-all border border-white/10 disabled:opacity-50"
                >
                    <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
                    <span className="hidden sm:inline">Refresh</span>
                </button>

                <button
                    onClick={onClearAll}
                    disabled={itemCount === 0 || clearLoading}
                    className="flex items-center gap-2 px-5 py-3 bg-red-500/10 text-red-100 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all border border-red-500/20 disabled:opacity-50"
                >
                    <Trash2 className={`h-4 w-4 ${clearLoading ? "animate-spin" : ""}`} />
                    <span className="hidden sm:inline">Clear List</span>
                </button>

                <button
                    onClick={() => navigate("/user/cart")}
                    className="flex items-center gap-2 px-6 py-3 bg-[#E6D929] text-[#1E2EDE] rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-yellow-900/20 hover:bg-[#14C4E7] hover:text-white transition-all"
                >
                    <ShoppingCart className="h-4 w-4" />
                    <span>Go to Cart</span>
                </button>
            </div>
        </div>
    );
};

export default WishlistHeader;
