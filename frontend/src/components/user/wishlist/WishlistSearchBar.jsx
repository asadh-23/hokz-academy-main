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
        <div className="flex gap-3">
            <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                    type="text"
                    className="block w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                    placeholder="Search courses by title or instructor..."
                    value={searchQuery}
                    onChange={onSearchChange}
                />
                {searchQuery && (
                    <button
                        onClick={onClearSearch}
                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
                    >
                        <X className="h-5 w-5" />
                    </button>
                )}
            </div>

            {/* Filter Dropdown Button */}
            <div className="relative" ref={filterDropdownRef}>
                <button
                    onClick={onToggleFilter}
                    className={`flex items-center gap-2 px-6 py-3.5 rounded-xl font-medium transition-all ${
                        hasActiveFilters
                            ? "bg-gradient-to-r from-cyan-500 to-emerald-500 text-white shadow-lg"
                            : "bg-white border-2 border-gray-300 text-gray-700 hover:border-cyan-500"
                    }`}
                >
                    <SlidersHorizontal className="h-5 w-5" />
                    <span>Filters</span>
                    {hasActiveFilters && (
                        <span className="bg-white text-cyan-600 text-xs font-bold px-2 py-0.5 rounded-full">
                            Active
                        </span>
                    )}
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
