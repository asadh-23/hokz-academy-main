import { Heart, RefreshCw, Trash2, ShoppingCart } from "lucide-react";

const WishlistHeader = ({ 
    itemCount, 
    totalValue, 
    onRefresh, 
    onClearAll, 
    onViewCart, 
    loading 
}) => {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-lg">
                        <Heart className="h-6 w-6 text-white fill-white" />
                    </div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-600 to-emerald-600 bg-clip-text text-transparent">
                        My Wishlist
                    </h1>
                </div>
                <p className="text-gray-600">
                    {itemCount} {itemCount === 1 ? "item" : "items"} saved • Total Value:{" "}
                    <span className="font-bold text-cyan-600">₹{Math.round(totalValue)}</span>
                </p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
                <button
                    onClick={onRefresh}
                    disabled={loading}
                    className="flex items-center gap-2 px-4 py-2.5 bg-white border-2 border-gray-300 text-gray-700 rounded-xl font-medium hover:border-cyan-500 hover:text-cyan-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Refresh wishlist"
                >
                    <RefreshCw className={`h-5 w-5 ${loading ? "animate-spin" : ""}`} />
                    <span className="hidden sm:inline">Refresh</span>
                </button>

                <button
                    onClick={onClearAll}
                    disabled={itemCount === 0 || loading}
                    className="flex items-center gap-2 px-4 py-2.5 bg-white border-2 border-red-300 text-red-600 rounded-xl font-medium hover:bg-red-50 hover:border-red-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Clear all items"
                >
                    <Trash2 className="h-5 w-5" />
                    <span className="hidden sm:inline">Clear All</span>
                </button>

                <button
                    onClick={onViewCart}
                    className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-xl font-medium hover:from-emerald-600 hover:to-cyan-600 transition-all shadow-md"
                    title="Go to cart"
                >
                    <ShoppingCart className="h-5 w-5" />
                    <span className="hidden sm:inline">View Cart</span>
                </button>
            </div>
        </div>
    );
};

export default WishlistHeader;
