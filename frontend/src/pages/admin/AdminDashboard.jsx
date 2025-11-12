import React from "react";
import AdminAnimatedChart from "../../components/admin/AdminAnimatedChart";

const AdminDashboard = () => {
    const courseData = [
        {
            name: "Web Development",
            enrolled: 80,
            drafts: 5,
            rating: 4.5,
            notice: "₹2000",
            status: "Published",
        },
        {
            name: "Data Science",
            enrolled: 60,
            drafts: 2,
            rating: 4.2,
            notice: "₹1800",
            status: "Published",
        },
        {
            name: "Graphic Design",
            enrolled: 0,
            drafts: 3,
            rating: 3.9,
            notice: "₹2500",
            status: "Inactive",
        },
    ];

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <div className="flex flex-1">
                <div className="flex-1 p-8 overflow-y-auto">
                    {/* Dashboard Header */}
                    <div className="mb-8">
                        <div className="flex justify-between items-center bg-gradient-to-r from-cyan-600 to-blue-700 text-white p-6 rounded-2xl shadow-md">
                            <h2 className="text-2xl font-semibold m-0">Dashboard</h2>
                            <div className="flex gap-4">
                                <button className="bg-white/20 text-white border border-white/30 py-2 px-4 rounded-lg text-sm hover:bg-white/30 transition">
                                    Download PDF
                                </button>
                                <button className="bg-white/20 text-white border border-white/30 py-2 px-4 rounded-lg text-sm hover:bg-white/30 transition">
                                    Download Excel
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-2xl font-bold text-gray-800 m-0">$200.00</h3>
                                    <p className="text-gray-600 text-sm m-0">Total Revenue</p>
                                </div>
                                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-2xl">
                                    💰
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-2xl font-bold text-gray-800 m-0">551</h3>
                                    <p className="text-gray-600 text-sm m-0">Total Tutors</p>
                                </div>
                                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-2xl">
                                    👨‍🏫
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-2xl font-bold text-gray-800 m-0">23</h3>
                                    <p className="text-gray-600 text-sm m-0">Total Courses</p>
                                </div>
                                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-2xl">
                                    📚
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-2xl font-bold text-gray-800 m-0">1,247</h3>
                                    <p className="text-gray-600 text-sm m-0">Total Students</p>
                                </div>
                                <div className="w-12 h-12 rounded-full bg-cyan-100 flex items-center justify-center text-2xl">
                                    👥
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Income & Expense Chart */}
                    <div className="bg-white rounded-2xl p-8 mb-8 shadow-sm">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-xl font-semibold text-gray-800 m-0">Income & Expense</h3>
                            <select className="py-2 px-4 border border-gray-300 rounded-lg bg-white cursor-pointer">
                                <option>Date filter</option>
                                <option>This week</option>
                                <option>This month</option>
                                <option>This year</option>
                            </select>
                        </div>
                        <AdminAnimatedChart />
                    </div>

                    {/* Course Management Table */}
                    <div className="bg-white rounded-2xl p-8 shadow-sm">
                        <h3 className="text-xl font-semibold text-gray-800 mb-6">Course Management</h3>
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr>
                                        <th className="text-left p-4 border-b-2 border-gray-200 font-semibold text-gray-700 text-sm">
                                            Course Name
                                        </th>
                                        <th className="text-left p-4 border-b-2 border-gray-200 font-semibold text-gray-700 text-sm">
                                            Enrolled
                                        </th>
                                        <th className="text-left p-4 border-b-2 border-gray-200 font-semibold text-gray-700 text-sm">
                                            Drafts
                                        </th>
                                        <th className="text-left p-4 border-b-2 border-gray-200 font-semibold text-gray-700 text-sm">
                                            Rating
                                        </th>
                                        <th className="text-left p-4 border-b-2 border-gray-200 font-semibold text-gray-700 text-sm">
                                            Notice
                                        </th>
                                        <th className="text-left p-4 border-b-2 border-gray-200 font-semibold text-gray-700 text-sm">
                                            Status
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {courseData.map((course, index) => (
                                        <tr key={index} className="hover:bg-gray-50 transition-colors">
                                            <td className="p-4 border-b border-gray-100 font-medium text-gray-800 text-sm">
                                                {course.name}
                                            </td>
                                            <td className="p-4 border-b border-gray-100 text-sm">{course.enrolled}</td>
                                            <td className="p-4 border-b border-gray-100 text-sm">{course.drafts}</td>
                                            <td className="p-4 border-b border-gray-100 text-sm">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-yellow-400">⭐</span>
                                                    <span>{course.rating} stars</span>
                                                </div>
                                            </td>
                                            <td className="p-4 border-b border-gray-100 text-sm font-medium text-gray-800">
                                                {course.notice}
                                            </td>
                                            <td className="p-4 border-b border-gray-100 text-sm">
                                                <span
                                                    className={`py-1 px-3 rounded-full text-xs font-medium ${
                                                        course.status.toLowerCase() === "published"
                                                            ? "bg-green-100 text-green-700"
                                                            : "bg-red-100 text-red-700"
                                                    }`}
                                                >
                                                    {course.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
