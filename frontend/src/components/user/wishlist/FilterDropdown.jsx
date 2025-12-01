import { X, ChevronDown } from "lucide-react";

const FilterDropdown = ({
    tempFilters,
    onTempFilterChange,
    onApply,
    onClear,
    onClose,
    sortOptions,
}) => {
    return (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="p-5">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-900">Filter Options</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Sort By */}
                <div className="mb-4">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Sort By
                    </label>
                    <div className="relative">
                        <select
                            value={tempFilters.sort}
                            onChange={(e) => onTempFilterChange("sort", e.target.value)}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 appearance-none bg-white cursor-pointer"
                        >
                            {sortOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                    </div>
                </div>

                {/* Price Range */}
                <div className="mb-5">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Price Range
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <input
                                type="number"
                                placeholder="Min ₹"
                                value={tempFilters.minPrice}
                                onChange={(e) => onTempFilterChange("minPrice", e.target.value)}
                                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                            />
                        </div>
                        <div>
                            <input
                                type="number"
                                placeholder="Max ₹"
                                value={tempFilters.maxPrice}
                                onChange={(e) => onTempFilterChange("maxPrice", e.target.value)}
                                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                            />
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                    <button
                        onClick={onClear}
                        className="flex-1 px-4 py-2.5 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                    >
                        Clear
                    </button>
                    <button
                        onClick={onApply}
                        className="flex-1 px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-emerald-500 text-white rounded-lg font-medium hover:from-cyan-600 hover:to-emerald-600 transition-all shadow-md"
                    >
                        Apply
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FilterDropdown;
