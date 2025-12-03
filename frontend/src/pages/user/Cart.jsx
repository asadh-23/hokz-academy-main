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

    // Redux selectors
    const cart = useSelector(selectUserCart);
    const loading = useSelector(selectUserCartLoading);
    const clearLoading = useSelector(selectUserClearCartLoading);

    const cartItems = cart?.items || [];
    const subTotal = cart?.subTotal || 0;
    const tax = cart?.tax || 0;
    const totalAmount = cart?.totalAmount || 0;

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

    const handleRemoveFromCart = async (itemId, courseTitle) => {
        try {
            await dispatch(removeFromUserCart(itemId)).unwrap();
            toast.success(`${courseTitle} removed from cart`);
        } catch (error) {
            toast.error(error || "Failed to remove from cart");
        }
    };

    const handleMoveToWishlist = async (courseId, itemId, courseTitle) => {
        try {
            await dispatch(toggleUserWishlist(courseId)).unwrap();

            await dispatch(removeFromUserCart(itemId)).unwrap();

            toast.success(`${courseTitle} moved to wishlist`);
        } catch (error) {
            console.error("Move failed:", error);
            toast.error("Failed to move to wishlist");
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
        // TODO: Implement checkout
        toast.info("Checkout feature coming soon!");
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            {/* Header Section */}
            <div className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-lg">
                                    <ShoppingCart className="h-6 w-6 text-white" />
                                </div>
                                <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-600 to-emerald-600 bg-clip-text text-transparent">
                                    Shopping Cart
                                </h1>
                            </div>
                            <p className="text-gray-600">
                                {cartItems.length} {cartItems.length === 1 ? "course" : "courses"} in your cart
                            </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-3">
                            <button
                                onClick={loadCart}
                                disabled={loading}
                                className="flex items-center gap-2 px-4 py-2.5 bg-white border-2 border-gray-300 text-gray-700 rounded-xl font-medium hover:border-cyan-500 hover:text-cyan-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                title="Refresh cart"
                            >
                                <RefreshCw className={`h-5 w-5 ${loading ? "animate-spin" : ""}`} />
                                <span className="hidden sm:inline">Refresh</span>
                            </button>

                            <button
                                onClick={handleClearCart}
                                disabled={cartItems.length === 0 || clearLoading}
                                className="flex items-center gap-2 px-4 py-2.5 bg-white border-2 border-red-300 text-red-600 rounded-xl font-medium hover:bg-red-50 hover:border-red-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                title="Clear cart"
                            >
                                <Trash2 className={`h-5 w-5 ${clearLoading ? "animate-spin" : ""}`} />
                                <span className="hidden sm:inline">{clearLoading ? "Clearing..." : "Clear Cart"}</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {loading && !cart ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="relative">
                            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-cyan-600"></div>
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                                <div className="h-8 w-8 bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-full"></div>
                            </div>
                        </div>
                    </div>
                ) : cartItems.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Cart Items */}
                        <div className="lg:col-span-2 space-y-4">
                            {cartItems.map((item) => (
                                <CartItem
                                    key={item._id || item.course._id}
                                    item={item}
                                    onRemove={handleRemoveFromCart}
                                    onMoveToWishlist={handleMoveToWishlist}
                                />
                            ))}
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                            <OrderSummary
                                subtotal={subTotal}
                                tax={tax}
                                total={totalAmount}
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
