import { Users, CheckCircle, XCircle, Percent, BarChart2 } from 'lucide-react';
import ExamStatsCard from './ExamStatsCard';
import StudentAttemptsTable from './StudentAttemptsTable';

const ExamAnalyticsView = ({ analytics }) => {
    if (!analytics) {
        return (
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-16 text-center">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <BarChart2 size={48} className="text-gray-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">No Analytics Data</h3>
                <p className="text-gray-600 text-lg">
                    Analytics data will appear here once students start taking the exam.
                </p>
            </div>
        );
    }

    const { stats, students } = analytics;

    return (
        <div className="space-y-8">
            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <ExamStatsCard 
                    icon={<Users size={28} />} 
                    label="Total Students" 
                    value={stats.totalStudents} 
                    color="bg-gradient-to-br from-blue-50 to-blue-100 text-blue-600" 
                />
                <ExamStatsCard 
                    icon={<CheckCircle size={28} />} 
                    label="Passed" 
                    value={stats.totalPassedStudents} 
                    color="bg-gradient-to-br from-green-50 to-green-100 text-green-600" 
                />
                <ExamStatsCard 
                    icon={<XCircle size={28} />} 
                    label="Failed" 
                    value={stats.totalFailedStudents} 
                    color="bg-gradient-to-br from-red-50 to-red-100 text-red-600" 
                />
                <ExamStatsCard 
                    icon={<Percent size={28} />} 
                    label="Pass Rate" 
                    value={`${stats.passRate}%`} 
                    color="bg-gradient-to-br from-orange-50 to-orange-100 text-orange-600" 
                />
            </div>

            {/* Students Table */}
            <StudentAttemptsTable students={students} />
        </div>
    );
};

export default ExamAnalyticsView;