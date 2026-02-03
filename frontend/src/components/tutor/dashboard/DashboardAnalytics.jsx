import React from "react";
import AnimatedChart from "../../../components/common/AnimatedChart";
import TopPerformingCourse from "./TopPerformingCourse";
import { Activity } from "lucide-react";
const DashboardAnalytics = ({ chartData, courses, formatCurrency }) => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Main Chart */}
            <div className="lg:col-span-2">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-gray-800 flex items-center gap-2">
                            <Activity size={20} className="text-indigo-600" />
                            Financial Overview
                        </h3>
                        <span className="text-xs text-gray-400 font-medium bg-gray-50 px-2 py-1 rounded">
                            Last 7 Months
                        </span>
                    </div>

                    <div className="h-[350px]">
                        <AnimatedChart
                            revenueData={chartData.revenue}
                            expenseData={chartData.expenses}
                            labels={chartData.labels}
                            label1="Total Revenue"
                            label2="Admin Profit"
                        />
                    </div>
                </div>
            </div>

            {/* Top Performing Course Widget */}
            <TopPerformingCourse courses={courses} formatCurrency={formatCurrency} />
        </div>
    );
};

export default DashboardAnalytics;
