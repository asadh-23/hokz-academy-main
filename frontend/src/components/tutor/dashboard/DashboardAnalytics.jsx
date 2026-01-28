import React from 'react';
import AnimatedChart from './AnimatedChart'
import TopPerformingCourse from './TopPerformingCourse';

const DashboardAnalytics = ({ chartData, courses, formatCurrency }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      {/* Main Chart */}
      <div className="lg:col-span-2">
        <AnimatedChart 
          revenueData={chartData.revenue} 
          expenseData={chartData.expenses}
        />
      </div>

      {/* Top Performing Course Widget */}
      <TopPerformingCourse courses={courses} formatCurrency={formatCurrency} />
    </div>
  );
};

export default DashboardAnalytics;