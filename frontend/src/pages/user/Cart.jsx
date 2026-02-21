import { useEffect } from "react";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ShoppingCart, RefreshCw, Trash2 } from "lucide-react";
import {
    fetchUserCart,
    removeFromUserCart,
    clearUserCart,
    selectUserCart,
    selectUserCartLoading,
    selectUserClearCartLoading,
} from "../../store/features/user/userCartSlice";
import { toggleUserWishlist, fetchUserWishlist } from "../../store/features/user/userWishlistSlice";
import CartItem from "../../components/user/cart/CartItem";
import CartEmptyState from "../../components/user/cart/CartEmptyState";
import OrderSummary from "../../components/user/cart/OrderSummary";

const Cart = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Redux selectors
    const cart = useSelector(selectUserCart);
    const cartItems = cart?.items || [];
    const loading = useSelector(selectUserCartLoading);
    const clearLoading = useSelector(selectUserClearCartLoading);

    useEffect(() => {
        loadCart();
        dispatch(fetchUserWishlist());
    }, []);

    const loadCart = async () => {
        try {
            await dispatch(fetchUserCart()).unwrap();
        } catch (error) {
            toast.error(error || "Failed to load cart");
        }
    };

    const handleRemoveFromCart = async (cartItemId, courseTitle) => {
        try {
            await dispatch(removeFromUserCart(cartItemId)).unwrap();
            toast.success(`${courseTitle} removed from cart`);
        } catch (error) {
            toast.error(error || "Failed to remove from cart");
        }
    };

    const handleMoveToWishlist = async (courseId, cartItemId, courseTitle) => {
        try {
            await dispatch(toggleUserWishlist(courseId)).unwrap();
            await dispatch(removeFromUserCart(cartItemId)).unwrap();

            toast.success(`${courseTitle} moved to wishlist`);
        } catch (error) {
            toast.error(error || "Failed to move to wishlist");
        }
    };

    const handleClearCart = async () => {
        if (cartItems.length === 0) {
            toast.info("Your cart is already empty");
            return;
        }

        if (window.confirm("Are you sure you want to clear your entire cart?")) {
            try {
                await dispatch(clearUserCart()).unwrap();
                toast.success("Cart cleared successfully");
            } catch (error) {
                toast.error("Failed to clear cart");
            }
        }
    };

    const handleCheckout = () => {
        if (cartItems.length === 0) {
            toast.info("Your cart is empty");
            return;
        }
        navigate("/user/checkout");
    };

    return (
        <div className="min-h-screen bg-[#FDFDFD]">
            {/* --- BRANDED HEADER SECTION --- */}
            <div className="bg-[#1E2EDE] relative overflow-hidden py-10 md:py-16">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#14C4E7] opacity-10 rounded-full -translate-y-20 translate-x-20"></div>
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-[#E6D929] opacity-10 rounded-full translate-y-10 -translate-x-10"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div>
                            <div className="flex items-center gap-4 mb-3">
                                <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
                                    <ShoppingCart className="h-7 w-7 text-[#E6D929]" />
                                </div>
                                <h1 className="text-3xl md:text-5xl font-black text-[#FDFDFD] tracking-tight">
                                    My <span className="text-[#E6D929]">Cart</span>
                                </h1>
                            </div>
                            <p className="text-[#FDFDFD]/70 font-bold uppercase tracking-widest text-xs">
                                {cartItems.length} {cartItems.length === 1 ? "Course" : "Courses"} Selected
                            </p>
                        </div>

                        {/* Top Action Buttons */}
                        <div className="flex items-center gap-3">
                            <button
                                onClick={loadCart}
                                disabled={loading}
                                className="flex items-center gap-2 px-5 py-3 bg-white/10 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-white/20 transition-all border border-white/10 disabled:opacity-50"
                            >
                                <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
                                <span>Refresh</span>
                            </button>

                            <button
                                onClick={handleClearCart}
                                disabled={cartItems.length === 0 || clearLoading}
                                className="flex items-center gap-2 px-5 py-3 bg-red-500/10 text-red-100 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all border border-red-500/20 disabled:opacity-50"
                            >
                                <Trash2 className={`h-4 w-4 ${clearLoading ? "animate-spin" : ""}`} />
                                <span>{clearLoading ? "Clearing..." : "Clear All"}</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- CONTENT SECTION --- */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 pb-20 relative z-20">
                {loading ? (
                    <div className="flex flex-col justify-center items-center py-32 bg-white rounded-[3rem] shadow-xl border border-slate-50">
                        <div className="relative">
                            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-[#1E2EDE]"></div>
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-[#E6D929] rounded-lg rotate-45"></div>
                        </div>
                        <p className="mt-6 text-[10px] font-black uppercase tracking-widest text-slate-400 animate-pulse">
                            Syncing Cart...
                        </p>
                    </div>
                ) : cartItems.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {/* Cart Items List */}
                        <div className="lg:col-span-8 space-y-6">
                            {cartItems.map((item) => (
                                <CartItem
                                    key={item._id}
                                    item={item}
                                    onRemove={handleRemoveFromCart}
                                    onMoveToWishlist={handleMoveToWishlist}
                                />
                            ))}
                        </div>

                        {/* Order Summary Side */}
                        <div className="lg:col-span-4">
                            <OrderSummary
                                subtotal={cart.subTotal || 0}
                                tax={cart.taxAmount || 0}
                                total={cart.totalAmount || 0}
                                itemCount={cartItems.length}
                                onCheckout={handleCheckout}
                                loading={loading}
                            />
                        </div>
                    </div>
                ) : (
                    <CartEmptyState />
                )}
            </div>
        </div>
    );
};

export default Cart;
