import React, { useState, useEffect } from 'react';
import { tutorAxios } from '../../api/tutorAxios';
import { toast } from 'sonner';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import DashboardHeader from '../../components/tutor/dashboard/DashboardHeader';
import DashboardStats from '../../components/tutor/dashboard/DashboardStats';
import DashboardAnalytics from '../../components/tutor/dashboard/DashboardAnalytics';
import TopSellerCourses from '../../components/tutor/dashboard/TopSellerCourses';

const TutorDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch Data from Backend
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await tutorAxios.get('/dashboard');
        if (response.data.success) {
          setDashboardData(response.data.data);
        }
      } catch (error) {
        console.error("Fetch Error:", error);
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  // Safe access to data
  const stats = dashboardData?.stats || { totalRevenue: 0, totalStudents: 0, totalCourses: 0, activeCourses: 0 };
  const courses = dashboardData?.courses || [];
  const chartData = dashboardData?.chart || { revenue: [], expenses: [] };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="p-6 bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/20 min-h-screen">
      <DashboardHeader />
      <DashboardStats stats={stats} formatCurrency={formatCurrency} />
      <DashboardAnalytics chartData={chartData} courses={courses} formatCurrency={formatCurrency} />
      <TopSellerCourses courses={courses} formatCurrency={formatCurrency} />
    </div>
  );
};

export default TutorDashboard;