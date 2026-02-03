import Tutor from "../../models/user/Tutor.js";
import mongoose from "mongoose";
import Course from "../../models/course/Course.js";
import PaymentDistribution from "../../models/finance/PaymentDistribution.js";
import Enrollment from "../../models/course/Enrollment.js";

export const getAllTutors = async (req, res, next) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 8;
        const skip = (page - 1) * limit;

        const searchTerm = req.query.search || "";
        const statusFilter = req.query.status || "";

        const query = { role: "tutor" };

        // 🔍 Search filter
        if (searchTerm) {
            const searchRegex = new RegExp(searchTerm, "i");
            query.$or = [{ fullName: searchRegex }, { email: searchRegex }];
        }

        if (statusFilter) {
            if (statusFilter === "Blocked") query.isBlocked = true;
            else if (statusFilter === "Active") {
                query.isBlocked = false;
                query.isVerified = true;
            } else if (statusFilter === "Inactive") query.isVerified = false;
        }

        const totalFilteredTutors = await Tutor.countDocuments(query);

        const tutors = await Tutor.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean();

        // 🧩 Format tutors with computed status
        const formattedTutors = tutors.map((tutor) => {
            let computedStatus;
            if (tutor.isBlocked) {
                computedStatus = "Blocked";
            } else if (!tutor.isVerified) {
                computedStatus = "Inactive";
            } else {
                computedStatus = "Active";
            }

            return {
                ...tutor,
                status: computedStatus,
            };
        });

        // 📊 Global stats (not affected by filters)
        const [total, active, blocked, inactive] = await Promise.all([
            Tutor.countDocuments({ role: "tutor" }),
            Tutor.countDocuments({ role: "tutor", isBlocked: false, isVerified: true }),
            Tutor.countDocuments({ role: "tutor", isBlocked: true }),
            Tutor.countDocuments({ role: "tutor", isVerified: false }),
        ]);

        const totalPages = Math.ceil(totalFilteredTutors / limit);

        // ✅ Final Response
        res.status(200).json({
            success: true,
            tutors: formattedTutors,
            pagination: {
                currentPage: page,
                totalPages,
                totalFilteredTutors,
            },
            stats: {
                total,
                active,
                blocked,
                inactive,
            },
        });
    } catch (error) {
        console.error("Error in getAllTutors controller:", error);
        next(error);
    }
};

export const toggleBlockTutor = async (req, res, next) => {
    try {
        const { tutorId } = req.params;

        // Fetch tutor
        const tutor = await Tutor.findById(tutorId);
        if (!tutor) {
            return res.status(404).json({
                success: false,
                message: "Tutor not found",
            });
        }

        // Toggle logic
        tutor.isBlocked = !tutor.isBlocked;
        await tutor.save();

        // Response message
        const statusMessage = tutor.isBlocked ? "blocked" : "unblocked";

        return res.status(200).json({
            success: true,
            message: `${tutor.fullName} has been ${statusMessage} successfully`,
        });
    } catch (error) {
        console.error("Error in toggle block tutor controller:", error);
        next(error);
    }
};

export const getTutorDetails = async (req, res) => {
    try {
        const { tutorId } = req.params;

        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(tutorId)) {
            return res.status(400).json({ success: false, message: "Invalid Tutor ID" });
        }

        const objectIdTutor = new mongoose.Types.ObjectId(tutorId);

        // 1. Fetch Basic Tutor Profile Details
        const tutorProfile = await Tutor.findById(tutorId).select("-password");

        if (!tutorProfile) {
            return res.status(404).json({ success: false, message: "Tutor not found" });
        }

        // 2. Fetch All Courses by this Tutor
        const courses = await Course.find({ tutor: tutorId })
            .select(
                "title description category price offerPercentage thumbnailUrl isListed enrolledCount lessonsCount totalDurationSeconds  createdAt",
            )
            .populate("category", "name")
            .sort({ createdAt: -1 });

        const [studentCount, financialStats] = await Promise.all([
            Enrollment.distinct("user", { tutor: tutorId }).then((users) => users.length),

            PaymentDistribution.aggregate([
                { $match: { tutor: objectIdTutor } },
                {
                    $group: {
                        _id: null,
                        totalGrossSales: {
                            $sum: { $add: ["$totalAmount", { $ifNull: ["$taxCollected", 0] }] },
                        },
                        totalTutorEarnings: { $sum: "$tutorShareAmount" }, // How much this tutor earned
                        totalAdminCommission: { $sum: "$adminShareAmount" }, // How much admin earned from this tutor
                    },
                },
            ]),
        ]);

        // Extract Financial Data (Handle empty data case)
        const financials = financialStats[0] || {
            totalGrossSales: 0,
            totalTutorEarnings: 0,
            totalAdminCommission: 0,
        };

        // 4. Prepare Final Response
        const stats = {
            totalCourses: courses.length,
            activeCourses: courses.filter((c) => c.isListed).length,
            totalStudents: studentCount,
            totalGrossSales: financials.totalGrossSales,
            totalTutorEarnings: financials.totalTutorEarnings,
            totalAdminCommission: financials.totalAdminCommission, // This is useful for Admin to see profit from this tutor
        };

        res.status(200).json({
            success: true,
            message: "Tutor details fetched successfully",
            data: {
                tutor: tutorProfile,
                stats: stats,
                courses: courses,
            },
        });
    } catch (error) {
        console.error("Get Tutor Details Error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch tutor details",
            error: error.message,
        });
    }
};
