import { Link } from "react-router-dom";
import { Heart, Compass, Search } from "lucide-react";

const WishlistEmptyState = ({ searchQuery, onClearSearch }) => {
    return (
        <div className="text-center py-24 bg-white rounded-[3rem] border-4 border-dashed border-slate-50 shadow-2xl shadow-blue-900/5">
            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8">
                {searchQuery ? (
                    <Search size={48} className="text-slate-200" />
                ) : (
                    <Heart size={48} className="text-slate-200" />
                )}
            </div>
            <h3 className="text-3xl font-black text-[#1E2EDE] mb-3 uppercase tracking-tight">
                {searchQuery ? "No Matches Found" : "Library of Heart Empty"}
            </h3>
            <p className="text-slate-400 mb-10 max-w-sm mx-auto font-medium">
                {searchQuery
                    ? `We couldn't find any courses matching "${searchQuery}". Please refine your search terms.`
                    : "Your favorites list is currently empty. Explore our courses to find modules that inspire your growth."}
            </p>
            {searchQuery ? (
                <button
                    onClick={onClearSearch}
                    className="inline-flex items-center gap-3 px-10 py-4 bg-[#1E2EDE] text-[#E6D929] font-black rounded-2xl shadow-xl shadow-blue-100 uppercase text-[10px] tracking-widest hover:bg-[#14C4E7] transition-all"
                >
                    Reset All Filters
                </button>
            ) : (
                <Link
                    to="/user/courses"
                    className="inline-flex items-center gap-3 px-10 py-4 bg-[#1E2EDE] text-[#E6D929] font-black rounded-2xl shadow-xl shadow-blue-100 uppercase text-[10px] tracking-widest hover:bg-[#14C4E7] transition-all"
                >
                    <Compass size={18} /> Discover Courses
                </Link>
            )}
        </div>
    );
};

export default WishlistEmptyState;
