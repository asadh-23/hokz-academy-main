import { Link } from "react-router-dom";
import { ShoppingCart, Compass, Heart } from "lucide-react";

const CartEmptyState = () => {
    return (
        <div className="text-center py-24 bg-white rounded-[3rem] border-4 border-dashed border-slate-50 shadow-2xl shadow-blue-900/5">
            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8">
                <ShoppingCart size={48} className="text-slate-200" />
            </div>
            <h3 className="text-3xl font-black text-[#1E2EDE] mb-3 uppercase tracking-tight">Your cart is empty</h3>
            <p className="text-slate-400 mb-10 max-w-sm mx-auto font-medium">
                Unlock your potential today. Discover expert-led courses and start your journey with Hokz Academy.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center px-6">
                <Link
                    to="/user/courses"
                    className="flex items-center justify-center gap-2 px-8 py-4 bg-[#1E2EDE] text-[#E6D929] font-black rounded-2xl shadow-xl shadow-blue-100 uppercase text-xs tracking-widest hover:bg-[#14C4E7] transition-all"
                >
                    <Compass size={18} />
                    Browse Courses
                </Link>
                <Link
                    to="/user/wishlist"
                    className="flex items-center justify-center gap-2 px-8 py-4 bg-white border-2 border-slate-100 text-slate-500 font-black rounded-2xl uppercase text-xs tracking-widest hover:border-[#1E2EDE] hover:text-[#1E2EDE] transition-all"
                >
                    <Heart size={18} />
                    My Wishlist
                </Link>
            </div>
        </div>
    );
};

export default CartEmptyState;
