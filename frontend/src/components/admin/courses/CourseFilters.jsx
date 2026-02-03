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
        <div className="mb-6">
            {/* Filter Toggle Button */}
            <div className="flex items-center justify-between mb-4">
                <button
                    onClick={toggleFilter}
                    className={`
                        flex items-center gap-3 px-6 py-3 rounded-xl font-medium text-sm transition-all duration-200 
                        ${isFilterOpen 
                            ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/25' 
                            : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 hover:shadow-md'
                        }
                    `}
                >
                    <Filter className="w-5 h-5" />
                    Advanced Filters
                    {isFilterOpen ? (
                        <ChevronUp className="w-4 h-4" />
                    ) : (
                        <ChevronDown className="w-4 h-4" />
                    )}
                    {hasActiveFilters && !isFilterOpen && (
                        <span className="px-2 py-0.5 bg-red-100 text-red-600 text-xs font-semibold rounded-full">
                            {Object.values(filters).filter(Boolean).length - 2} {/* Exclude page and limit */}
                        </span>
                    )}
                </button>

                {hasActiveFilters && (
                    <button
                        onClick={onClearFilters}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-all duration-200 hover:shadow-md"
                    >
                        <X size={16} />
                        Clear All Filters
                    </button>
                )}
            </div>

            {/* Collapsible Filter Section */}
            <div className={`
                transition-all duration-300 ease-in-out overflow-hidden
                ${isFilterOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}
            `}>
                <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                    {/* Filter Header */}
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-100">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <Filter className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">Advanced Filters</h3>
                                    <p className="text-sm text-gray-600">Refine your search with detailed criteria</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Filters Content */}
                    <div className="p-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Status Filter */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Publication Status
                                </label>
                                <div className="relative group">
                                    <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 w-5 h-5 transition-colors" />
                                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                                    <select
                                        name="status"
                                        value={filters.status}
                                        onChange={onFilterChange}
                                        className="w-full pl-11 pr-10 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm appearance-none bg-gray-50 focus:bg-white transition-all duration-200 cursor-pointer"
                                    >
                                        <option value="">All Status</option>
                                        <option value="listed">Published</option>
                                        <option value="unlisted">Unlisted</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Price Range Section */}
                        <div className="mt-6 pt-6 border-t border-gray-100">
                            <div className="flex items-center gap-2 mb-3">
                                <DollarSign className="w-5 h-5 text-gray-600" />
                                <label className="text-sm font-medium text-gray-700">
                                    Price Range (₹)
                                </label>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md">
                                <div>
                                    <input
                                        type="number"
                                        name="minPrice"
                                        placeholder="Minimum price"
                                        value={filters.minPrice}
                                        onChange={onFilterChange}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-gray-50 focus:bg-white transition-all duration-200 placeholder-gray-400"
                                    />
                                </div>
                                <div>
                                    <input
                                        type="number"
                                        name="maxPrice"
                                        placeholder="Maximum price"
                                        value={filters.maxPrice}
                                        onChange={onFilterChange}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-gray-50 focus:bg-white transition-all duration-200 placeholder-gray-400"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Active Filters Display */}
                        {hasActiveFilters && (
                            <div className="mt-6 pt-6 border-t border-gray-100">
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="text-sm font-medium text-gray-700">Active Filters:</span>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {filters.status && (
                                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded-full">
                                            Status: {filters.status === 'listed' ? 'Published' : 'Unlisted'}
                                        </span>
                                    )}
                                    {(filters.minPrice || filters.maxPrice) && (
                                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-800 text-xs font-medium rounded-full">
                                            Price: ₹{filters.minPrice || '0'} - ₹{filters.maxPrice || '∞'}
                                        </span>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseFilters;