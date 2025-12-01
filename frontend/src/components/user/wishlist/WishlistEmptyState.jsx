import { Link } from "react-router-dom";
import { Heart } from "lucide-react";

const WishlistEmptyState = ({ searchQuery, onClearSearch }) => {
    return (
        <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-gray-300">
            <div className="mx-auto h-20 w-20 text-gray-300 mb-4">
                <Heart size={80} strokeWidth={1.5} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {searchQuery ? "No courses found" : "Your wishlist is empty"}
            </h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
                {searchQuery
                    ? "Try adjusting your search to find what you're looking for."
                    : "Start adding courses you love to your wishlist and come back to them later."}
            </p>
            {searchQuery ? (
                <button
                    onClick={onClearSearch}
                    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-cyan-500 to-emerald-500 text-white font-semibold rounded-xl hover:from-cyan-600 hover:to-emerald-600 transition-all shadow-lg"
                >
                    Clear search
                </button>
            ) : (
                <Link
                    to="/user/courses"
                    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-cyan-500 to-emerald-500 text-white font-semibold rounded-xl hover:from-cyan-600 hover:to-emerald-600 transition-all shadow-lg"
                >
                    Browse Courses
                </Link>
            )}
        </div>
    );
};

export default WishlistEmptyState;
