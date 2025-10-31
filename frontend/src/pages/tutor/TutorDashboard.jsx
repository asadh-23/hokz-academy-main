import TutorHeader from "../../components/tutor/TutorHeader";
import TutorSidebar from "../../components/tutor/TutorSidebar";
import TutorFooter from "../../components/tutor/TutorFooter";
import AnimatedChart from "../../components/tutor/AnimatedChart";

const TutorDashboard = () => {
    const courseData = [
        {
            name: "Web Development",
            students: 120,
            enrolled: 80,
            drafts: 5,
            rating: 4.5,
            notice: 11,
            price: "₹2000",
            status: "Published",
        },
        {
            name: "Data Science",
            students: 95,
            enrolled: 60,
            drafts: 2,
            rating: 4.2,
            notice: 14,
            price: "₹1800",
            status: "Published",
        },
        {
            name: "Graphic Design",
            students: 70,
            enrolled: 0,
            drafts: 3,
            rating: 3.9,
            notice: 13,
            price: "₹2500",
            status: "Inactive",
        },
    ];

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <TutorHeader />

            <div className="flex flex-1">
                <TutorSidebar />

                <div className="flex-1 p-8 overflow-y-auto">
                    {/* Dashboard Header */}
                    <div className="mb-8">
                        <div className="flex justify-between items-center bg-gradient-to-r from-cyan-400 to-emerald-500 text-white p-6 rounded-2xl">
                            <h2 className="text-2xl font-semibold m-0">Dashboard</h2>
                            <div className="flex gap-4">
                                <button className="bg-white text-emerald-600 font-medium py-2 px-4 rounded-lg text-sm transition-all hover:bg-emerald-600 hover:text-white border border-transparent">
                                    Download PDF
                                </button>
                                <button className="bg-white text-emerald-600 font-medium py-2 px-4 rounded-lg text-sm transition-all hover:bg-emerald-600 hover:text-white border border-transparent">
                                    Download Excel
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 bg-gradient-to-br from-emerald-100 to-emerald-200 p-8 rounded-2xl">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-emerald-500 flex items-center justify-center text-2xl">
                                💰
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-gray-800 m-0">1,674,267</h3>
                                <p className="text-gray-600 text-sm m-0">All Earnings</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-cyan-500 flex items-center justify-center text-2xl">
                                👥
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-gray-800 m-0">957</h3>
                                <p className="text-gray-600 text-sm m-0">Total Students</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-2xl">
                                📚
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-gray-800 m-0">57,461,767</h3>
                                <p className="text-gray-600 text-sm m-0">Total Courses</p>
                            </div>
                        </div>
                    </div>

                    {/* Market Overview Chart */}
                    <div className="bg-white rounded-2xl p-8 mb-8 shadow-sm">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-xl font-semibold text-gray-800 m-0">Market Overview</h3>
                            <select className="py-2 px-4 border border-gray-300 rounded-lg bg-white cursor-pointer">
                                <option>This week</option>
                                <option>This month</option>
                                <option>This year</option>
                            </select>
                        </div>
                        <AnimatedChart />
                    </div>

                    {/* Course Table */}
                    <div className="bg-white rounded-2xl p-8 shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr>
                                        <th className="text-left p-4 border-b-2 border-gray-200 font-semibold text-gray-700 text-sm">
                                            Course Name
                                        </th>
                                        <th className="text-left p-4 border-b-2 border-gray-200 font-semibold text-gray-700 text-sm">
                                            Students
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
                                            <td className="p-4 border-b border-gray-100 text-sm">{course.students}</td>
                                            <td className="p-4 border-b border-gray-100 text-sm">{course.enrolled}</td>
                                            <td className="p-4 border-b border-gray-100 text-sm">{course.drafts}</td>
                                            <td className="p-4 border-b border-gray-100 text-sm">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-yellow-400">⭐</span>
                                                    <span>{course.rating} stars</span>
                                                </div>
                                            </td>
                                            <td className="p-4 border-b border-gray-100 text-sm">{course.notice}</td>
                                            <td className="p-4 border-b border-gray-100 text-sm">
                                                <span
                                                    className={`py-1 px-3 rounded-full text-xs font-medium ${
                                                        course.status.toLowerCase() === "published"
                                                            ? "bg-emerald-100 text-emerald-700"
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

            <TutorFooter />
        </div>
    );
};

export default TutorDashboard;
