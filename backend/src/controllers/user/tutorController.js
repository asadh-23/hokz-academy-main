import Tutor from "../../models/user/Tutor.js";
import Course from "../../models/course/Course.js";
import mongoose from "mongoose";

export const getAllVerifiedTutors = async (req, res) => {
    try {
        const tutors = await Tutor.find({
            isVerified: true,
            isBlocked: false,
        })
            .select("fullName profileImage")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: tutors.length,
            data: tutors,
        });
    } catch (error) {
        console.error("Get All Tutors Error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch tutors",
            error: error.message,
        });
    }
};

export const getTutorDetails = async (req, res) => {
    try {
        const { tutorId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(tutorId)) {
            return res.status(400).json({ success: false, message: "Invalid Tutor ID" });
        }

        const tutor = await Tutor.findOne({ 
            _id: tutorId, 
            isBlocked: false 
        }).select("-password -passwordResetToken -passwordResetExpiry -fcmToken -googleId");

        if (!tutor) {
            return res.status(404).json({ 
                success: false, 
                message: "Tutor not found or account is suspended." 
            });
        }

        const courses = await Course.find({
            tutor: tutorId,
            isBanned: false,
            isListed: true,
            isDeleted: false
        })
        .select("title thumbnailUrl price offerPercentage averageRating lessonsCount totalDurationSeconds category")
        .populate("category", "name")
        .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: {
                tutor,
                courses,
                totalCourses: courses.length
            }
        });

    } catch (error) {
        console.error("Error in getTutorDetails:", error);
        res.status(500).json({ 
            success: false, 
            message: "Server Error", 
            error: error.message 
        });
    }
};
