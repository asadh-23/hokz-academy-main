import React, { useState } from 'react';
import { Tag, X, Filter, DollarSign, ChevronDown, ChevronUp } from 'lucide-react';

const CourseFilters = ({ 
    filters, 
    onFilterChange, 
    onClearFilters 
}) => {
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const hasActiveFilters = filters.status || filters.minPrice || filters.maxPrice;

    const toggleFilter = () => {
        setIsFilterOpen(!isFilterOpen);
    };

    return (
        <div className="mb-8 px-2">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <button
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    className={`flex items-center justify-center gap-3 px-8 py-4 w-full sm:w-auto rounded-2xl font-black text-sm transition-all
                        ${isFilterOpen ? 'bg-[#1E2EDE] text-white shadow-xl' : 'bg-white text-[#1E2EDE] border-2 border-[#1E2EDE]/10 hover:border-[#14C4E7]'}`}
                >
                    <Filter className="w-5 h-5" />
                    {isFilterOpen ? 'Hide Preferences' : 'Advanced Filters'}
                    {hasActiveFilters && !isFilterOpen && (
                        <span className="w-2 h-2 bg-[#E6D929] rounded-full animate-ping"></span>
                    )}
                </button>

                {hasActiveFilters && (
                    <button onClick={onClearFilters} className="text-xs font-black text-red-500 uppercase tracking-widest hover:underline">
                        Reset All Filters
                    </button>
                )}
            </div>

            <div className={`transition-all duration-500 ease-in-out overflow-hidden ${isFilterOpen ? 'max-h-[500px] mt-6 opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="bg-white rounded-[2rem] border-2 border-[#14C4E7]/10 p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                        <label className="block text-[10px] font-black text-[#1E2EDE] uppercase tracking-widest mb-3">Status Filter</label>
                        <select
                            name="status"
                            value={filters.status}
                            onChange={onFilterChange}
                            className="w-full p-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-[#14C4E7] outline-none font-bold text-sm"
                        >
                            <option value="">All Statuses</option>
                            <option value="listed">Published Only</option>
                            <option value="unlisted">Drafts Only</option>
                        </select>
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-[10px] font-black text-[#1E2EDE] uppercase tracking-widest mb-3">Budget Range (₹)</label>
                        <div className="flex gap-4">
                            <input type="number" name="minPrice" placeholder="Min" value={filters.minPrice} onChange={onFilterChange}
                                className="w-1/2 p-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-[#14C4E7] outline-none font-bold" />
                            <input type="number" name="maxPrice" placeholder="Max" value={filters.maxPrice} onChange={onFilterChange}
                                className="w-1/2 p-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-[#14C4E7] outline-none font-bold" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseFilters;