import React from 'react';
import { Filter } from 'lucide-react';

const CourseEmptyState = ({ onClearFilters }) => {
     return (
        <div className="flex flex-col items-center justify-center py-24 bg-white rounded-[3rem] border-2 border-dashed border-gray-100">
            <div className="bg-[#FDFDFD] p-8 rounded-full shadow-inner mb-6">
                <Filter className="w-12 h-12 text-[#14C4E7]" />
            </div>
            <h3 className="text-2xl font-black text-[#1E2EDE] mb-2">Zero Matches Found</h3>
            <p className="text-gray-400 font-medium mb-8">Refine your filters to discover more courses.</p>
            <button 
                onClick={onClearFilters} 
                className="px-8 py-3 bg-[#E6D929] text-[#1E2EDE] rounded-2xl font-black hover:shadow-lg transition-all"
            >
                Reset Exploration
            </button>
        </div>
    );
};

export default CourseEmptyState;