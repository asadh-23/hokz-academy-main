import React from 'react';
import { Filter } from 'lucide-react';

const CourseEmptyState = ({ onClearFilters }) => {
    return (
        <div className="flex flex-col items-center justify-center h-64 bg-white rounded-lg border border-dashed border-gray-300">
            <div className="bg-gray-100 p-4 rounded-full mb-4">
                <Filter className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No courses found</h3>
            <p className="text-gray-500 mb-4 text-center">
                No courses match your current filters.
            </p>
            <button 
                onClick={onClearFilters} 
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
                Clear filters
            </button>
        </div>
    );
};

export default CourseEmptyState;