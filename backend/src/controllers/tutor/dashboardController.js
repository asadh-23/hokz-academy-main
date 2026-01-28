import Course from "../../models/course/Course.js";
import PaymentDistribution from "../../models/finance/PaymentDistribution.js";
import Enrollment from "../../models/course/Enrollment.js"; // Or Order model if Enrollment doesn't exist

export const getTutorDashboardStats = async (req, res) => {
    try {
        const tutorId = req.user._id;

        // 1. Total Courses & Active Courses
        const totalCourses = await Course.countDocuments({ tutor: tutorId });
        const activeCourses = await Course.countDocuments({ tutor: tutorId, isListed: true });

        // 2. Total Students (Unique enrollments)
        const totalStudents = await Enrollment.distinct("user", { tutor: tutorId }).then(users => users.length);

        // 3. Financial Stats (Revenue & Fees) from PaymentDistribution
        const financialStats = await PaymentDistribution.aggregate([
            { $match: { tutor: tutorId } },
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: "$tutorShareAmount" }, // 806
                    totalPlatformFees: { $sum: "$adminShareAmount" }, // 90
                    grossSales: { $sum: "$totalAmount" } // 896
                }
            }
        ]);

        const revenue = financialStats[0]?.totalRevenue || 0;

        // 4. Monthly Chart Data (Last 6 Months)
        const monthlyData = await PaymentDistribution.aggregate([
            { $match: { tutor: tutorId } },
            {
                $group: {
                    _id: { 
                        month: { $month: "$createdAt" }, 
                        year: { $year: "$createdAt" } 
                    },
                    monthlyRevenue: { $sum: "$tutorShareAmount" },
                    monthlyExpenses: { $sum: "$adminShareAmount" }
                }
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } },
            { $limit: 6 }
        ]);

        // Format Chart Data for Frontend (Array of values)
        const revenueData = monthlyData.map(d => d.monthlyRevenue);
        const expenseData = monthlyData.map(d => d.monthlyExpenses);

        // 5. Top Courses (Optional)
        const topCourses = await Course.find({ tutor: tutorId })
            .select("title description price enrolledCount isListed thumbnailUrl offerPercentage")
            .populate("category", "name")
            .sort({ enrolledCount: -1 })
            .limit(3);

        res.status(200).json({
            success: true,
            data: {
                stats: {
                    totalRevenue: revenue,
                    totalStudents: totalStudents,
                    totalCourses: totalCourses,
                    activeCourses: activeCourses,
                    avgRating: 4.8
                },
                chart: {
                    revenue: revenueData.length ? revenueData : [0,0,0,0,0,0],
                    expenses: expenseData.length ? expenseData : [0,0,0,0,0,0]
                },
                courses: topCourses
            }
        });

    } catch (error) {
        console.error("Dashboard Error:", error);
        res.status(500).json({ success: false, message: "Failed to fetch dashboard data" });
    }
};