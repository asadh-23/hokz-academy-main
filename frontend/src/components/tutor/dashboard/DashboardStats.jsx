import React from 'react';
import { Users, BookOpen, DollarSign, CheckCircle, TrendingUp } from 'lucide-react';

const StatCard = ({ icon, title, value, subValue, color, iconBg }) => (
  <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <p className="text-gray-600 text-sm font-medium mb-2">{title}</p>
        <h3 className="text-3xl font-bold text-gray-800 mb-1">{value}</h3>
        {subValue && <p className="text-xs text-gray-500">{subValue}</p>}
      </div>
      <div className={`p-3 rounded-xl ${iconBg || 'bg-gray-100'} shadow-inner`}>
        {icon}
      </div>
    </div>
    <div className={`h-1 w-full rounded-full mt-4 ${color}`}></div>
  </div>
);

const DashboardStats = ({ stats, formatCurrency }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatCard 
        icon={<DollarSign className="text-emerald-600" />} 
        title="Total Revenue"
        value={formatCurrency(stats.totalRevenue)} 
        subValue="After platform fees"
        color="bg-gradient-to-br from-emerald-50 to-emerald-100"
        iconBg="bg-emerald-500/10"
      />
      <StatCard 
        icon={<Users className="text-blue-600" />} 
        title="Total Students" 
        value={stats.totalStudents} 
        subValue="Enrolled students"
        color="bg-gradient-to-br from-blue-50 to-blue-100"
        iconBg="bg-blue-500/10"
      />
      <StatCard 
        icon={<BookOpen className="text-purple-600" />} 
        title="Total Courses" 
        value={stats.totalCourses} 
        subValue={`${stats.activeCourses} Published`}
        color="bg-gradient-to-br from-purple-50 to-purple-100"
        iconBg="bg-purple-500/10"
      />
      <StatCard 
        icon={<CheckCircle className="text-indigo-600" />} 
        title="Active Courses" 
        value={stats.activeCourses} 
        subValue="Currently live"
        color="bg-gradient-to-br from-indigo-50 to-indigo-100"
        iconBg="bg-indigo-500/10"
      />
    </div>
  );
};

export default DashboardStats;