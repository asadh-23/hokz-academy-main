import React from 'react';
import { Layers, Hash } from 'lucide-react';

const CategoryTabs = ({ categories, selectedCategoryId, onCategorySelect }) => {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 px-6 py-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-100 rounded-lg">
                        <Layers className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">Browse by Category</h3>
                        <p className="text-sm text-gray-600">Filter courses by their categories</p>
                    </div>
                </div>
            </div>

            {/* Category Tabs */}
            <div className="p-6">
                <div className="flex flex-wrap gap-3">
                    {/* All Categories Tab */}
                    <button
                        onClick={() => onCategorySelect("")}
                        className={`
                            flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 
                            ${!selectedCategoryId 
                                ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/25 transform scale-105' 
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md'
                            }
                        `}
                    >
                        <Hash className="w-4 h-4" />
                        All Categories
                        <span className={`
                            px-2 py-0.5 rounded-full text-xs font-semibold
                            ${!selectedCategoryId 
                                ? 'bg-white/20 text-white' 
                                : 'bg-gray-200 text-gray-600'
                            }
                        `}>
                            All
                        </span>
                    </button>

                    {/* Individual Category Tabs */}
                    {categories.map((category) => (
                        <button
                            key={category._id}
                            onClick={() => onCategorySelect(category._id)}
                            className={`
                                flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 
                                ${selectedCategoryId === category._id
                                    ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/25 transform scale-105' 
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md'
                                }
                            `}
                        >
                            <Layers className="w-4 h-4" />
                            {category.name}
                            {category.courseCount && (
                                <span className={`
                                    px-2 py-0.5 rounded-full text-xs font-semibold
                                    ${selectedCategoryId === category._id
                                        ? 'bg-white/20 text-white' 
                                        : 'bg-gray-200 text-gray-600'
                                    }
                                `}>
                                    {category.courseCount}
                                </span>
                            )}
                        </button>
                    ))}
                </div>

                {/* Selected Category Info */}
                {selectedCategoryId && (
                    <div className="mt-4 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg border border-emerald-100">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                            <span className="text-sm font-medium text-emerald-800">
                                Showing courses in: {categories.find(cat => cat._id === selectedCategoryId)?.name}
                            </span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CategoryTabs;