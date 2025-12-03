import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";

const CartEmptyState = () => {
    return (
        <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-gray-300">
            <div className="mx-auto h-20 w-20 text-gray-300 mb-4">
                <ShoppingCart size={80} strokeWidth={1.5} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
                Looks like you haven't added any courses to your cart yet. Start learning today!
            </p>
            <div className="flex gap-3 justify-center">
                <Link
                    to="/user/courses"
                    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-cyan-500 to-emerald-500 text-white font-semibold rounded-xl hover:from-cyan-600 hover:to-emerald-600 transition-all shadow-lg"
                >
                    Browse Courses
                </Link>
                <Link
                    to="/user/wishlist"
                    className="inline-flex items-center px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:border-cyan-500 hover:text-cyan-600 transition-all"
                >
                    View Wishlist
                </Link>
            </div>
        </div>
    );
};

export default CartEmptyState;
