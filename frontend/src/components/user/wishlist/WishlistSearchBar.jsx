import { useRef } from "react";
import { Search, X, SlidersHorizontal } from "lucide-react";
import FilterDropdown from "./FilterDropdown";

const WishlistSearchBar = ({
    searchQuery,
    onSearchChange,
    onClearSearch,
    isFilterOpen,
    onToggleFilter,
    hasActiveFilters,
    tempFilters,
    onTempFilterChange,
    onApplyFilters,
    onClearFilters,
    sortOptions,
}) => {
    const filterDropdownRef = useRef(null);

    return (
        <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1 group">
                <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-[#14C4E7] group-focus-within:scale-110 transition-transform" />
                </div>
                <input
                    type="text"
                    className="block w-full pl-16 pr-12 py-5 bg-slate-50 border-2 border-transparent focus:border-[#1E2EDE] rounded-2xl font-bold text-[#1E2EDE] placeholder-slate-400 transition-all outline-none"
                    placeholder="Search your wishlist..."
                    value={searchQuery}
                    onChange={onSearchChange}
                />
                {searchQuery && (
                    <button
                        onClick={onClearSearch}
                        className="absolute inset-y-0 right-0 pr-6 flex items-center text-slate-300 hover:text-red-500"
                    >
                        <X className="h-6 w-6" />
                    </button>
                )}
            </div>

            <div className="relative" ref={filterDropdownRef}>
                <button
                    onClick={onToggleFilter}
                    className={`w-full md:w-auto flex items-center justify-center gap-3 px-8 py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-md active:scale-95 ${
                        hasActiveFilters ? "bg-[#E6D929] text-[#1E2EDE]" : "bg-[#1E2EDE] text-white hover:bg-[#14C4E7]"
                    }`}
                >
                    <SlidersHorizontal size={18} />
                    <span>Refine</span>
                </button>

                {isFilterOpen && (
                    <FilterDropdown
                        tempFilters={tempFilters}
                        onTempFilterChange={onTempFilterChange}
                        onApply={onApplyFilters}
                        onClear={onClearFilters}
                        onClose={() => onToggleFilter()}
                        sortOptions={sortOptions}
                    />
                )}
            </div>
        </div>
    );
};

export default WishlistSearchBar;
