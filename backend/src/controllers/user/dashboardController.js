import Enrollment from "../../models/course/Enrollment.js";
import Course from "../../models/course/Course.js";

export const getBestSellerCourses = async (req, res) => {
    try {
     
        const popularCourses = await Enrollment.aggregate([
            { $match: { status: "active" } }, 
            {
                $group: {
                    _id: "$course", 
                    enrollmentCount: { $sum: 1 }, 
                },
            },
            { $sort: { enrollmentCount: -1 } },
            { $limit: 9 },
        ]);

      
        const courseIds = popularCourses.map((item) => item._id);

        const bestSellers = await Course.find({
            _id: { $in: courseIds },
            isListed: true,
            isDeleted: false,
            isBanned: false
        })
        .populate("tutor", "fullName profileImage")
        .populate("category", "name")
        .select("title thumbnailUrl price offerPercentage averageRating totalDurationSeconds lessonsCount");

        const finalData = bestSellers.map(course => {
            const stats = popularCourses.find(p => p._id.toString() === course._id.toString());
            return {
                ...course.toObject(),
                studentCount: stats ? stats.enrollmentCount : 0
            };
        });

        res.status(200).json({
            success: true,
            data: finalData,
        });
    } catch (error) {
        console.error("Best Seller Fetch Error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch best sellers",
        });
    }
};