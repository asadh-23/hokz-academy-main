import React from 'react';
import CourseCard from './CourseCard';

const CourseGrid = ({ courses, formatCurrency, navigate, loading }) => {
    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="bg-white h-80 rounded-lg animate-pulse border"></div>
                ))}
            </div>
        );
    }

    if (courses.length === 0) {
        return null; // Empty state will be handled by parent component
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {courses.map((course) => (
                <CourseCard 
                    key={course._id} 
                    course={course} 
                    formatCurrency={formatCurrency}
                    navigate={navigate}
                />
            ))}
        </div>
    );
};

export default CourseGrid;