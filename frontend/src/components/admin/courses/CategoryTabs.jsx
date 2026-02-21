import React from 'react';
import { Layers, Hash } from 'lucide-react';

const CategoryTabs = ({ categories, selectedCategoryId, onCategorySelect }) => {
 return (
        <div className="bg-white rounded-[2rem] shadow-lg shadow-blue-900/5 border border-gray-100 overflow-hidden mb-8">
            <div className="bg-[#14C4E7]/5 px-8 py-5 border-b border-gray-100">
                <div className="flex items-center gap-3">
                    <Layers className="w-5 h-5 text-[#14C4E7]" />
                    <h3 className="font-black text-[#1E2EDE] uppercase tracking-wider text-sm">Course Categories</h3>
                </div>
            </div>

            <div className="p-6">
                <div className="flex flex-wrap gap-3">
                    <button
                        onClick={() => onCategorySelect("")}
                        className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm transition-all duration-300 shadow-sm
                            ${!selectedCategoryId 
                                ? 'bg-[#1E2EDE] text-white shadow-[#1E2EDE]/20 scale-105' 
                                : 'bg-gray-100 text-gray-600 hover:bg-[#14C4E7]/10 hover:text-[#14C4E7]'}`}
                    >
                        <Hash className="w-4 h-4" />
                        All Content
                    </button>

                    {categories.map((category) => (
                        <button
                            key={category._id}
                            onClick={() => onCategorySelect(category._id)}
                            className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm transition-all duration-300 shadow-sm
                                ${selectedCategoryId === category._id
                                    ? 'bg-[#14C4E7] text-white shadow-[#14C4E7]/20 scale-105' 
                                    : 'bg-gray-100 text-gray-600 hover:bg-[#14C4E7]/10 hover:text-[#14C4E7]'}`}
                        >
                            <Layers className="w-4 h-4" />
                            {category.name}
                            {category.courseCount && (
                                <span className={`px-2 py-0.5 rounded-lg text-[10px] font-black
                                    ${selectedCategoryId === category._id ? 'bg-white/20' : 'bg-gray-200'}`}>
                                    {category.courseCount}
                                </span>
                            )}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CategoryTabs;