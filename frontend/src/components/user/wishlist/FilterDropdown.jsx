import { X, ChevronDown } from "lucide-react";

const FilterDropdown = ({ tempFilters, onTempFilterChange, onApply, onClear, onClose, sortOptions }) => {
    return (
        <div className="absolute right-0 mt-4 w-full sm:w-80 bg-white rounded-[2rem] shadow-2xl border border-slate-100 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-7">
                <div className="flex items-center justify-between mb-6 border-b border-slate-50 pb-4">
                    <h3 className="text-xs font-black text-[#1E2EDE] uppercase tracking-widest">Filter Logic</h3>
                    <button onClick={onClose} className="text-slate-300 hover:text-red-500 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="mb-6">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">
                        Sort Results
                    </label>
                    <div className="relative">
                        <select
                            value={tempFilters.sort}
                            onChange={(e) => onTempFilterChange("sort", e.target.value)}
                            className="w-full px-5 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-[#1E2EDE] font-bold text-slate-700 appearance-none cursor-pointer"
                        >
                            {sortOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#1E2EDE] pointer-events-none" />
                    </div>
                </div>

                <div className="mb-8">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">
                        Price Bracket (₹)
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                        <input
                            type="number"
                            placeholder="Min"
                            value={tempFilters.minPrice}
                            onChange={(e) => onTempFilterChange("minPrice", e.target.value)}
                            className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-[#1E2EDE] font-bold text-slate-700"
                        />
                        <input
                            type="number"
                            placeholder="Max"
                            value={tempFilters.maxPrice}
                            onChange={(e) => onTempFilterChange("maxPrice", e.target.value)}
                            className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-[#1E2EDE] font-bold text-slate-700"
                        />
                    </div>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={onClear}
                        className="flex-1 px-4 py-3 border-2 border-slate-100 text-slate-400 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all"
                    >
                        Reset
                    </button>
                    <button
                        onClick={onApply}
                        className="flex-1 px-4 py-3 bg-[#1E2EDE] text-[#E6D929] rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-blue-100"
                    >
                        Apply
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FilterDropdown;
