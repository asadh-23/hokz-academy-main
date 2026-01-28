import Exam from "../../models/course/Exam.js";
import Course from "../../models/course/Course.js";
import ExamAttempt from "../../models/course/ExamAttempt.js";

export const createExam = async (req, res) => {
    try {
        const tutorId = req.user._id;
        const { courseId, title, description, questions, settings } = req.body;

        if (!courseId || !title || !questions || questions.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Please provide course ID, title, and at least one question.",
            });
        }

        const existingExam = await Exam.findOne({ course: courseId });
        if (existingExam) {
            return res.status(400).json({
                success: false,
                message: "An exam already exists for this course. Please edit the existing one.",
            });
        }

        const newExam = new Exam({
            course: courseId,
            tutor: tutorId,
            title,
            description,
            questions,
            settings,
        });

        const savedExam = await newExam.save();

        await Course.findByIdAndUpdate(courseId, {
            exam: savedExam._id,
        });

        return res.status(201).json({
            success: true,
            message: "Exam created successfully!",
            data: savedExam,
        });
    } catch (error) {
        console.error("Error creating exam:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message,
        });
    }
};

export const getExamByCourse = async (req, res) => {
    try {
        const { courseId } = req.params;
        const exam = await Exam.findOne({ course: courseId });

        if (!exam) {
            return res.status(404).json({
                success: false,
                message: "No exam found for this course",
            });
        }

        return res.status(200).json({
            success: true,
            exam,
        });
    } catch (error) {
        console.error("Error fetching exam:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message,
        });
    }
};

export const getExamAnalytics = async (req, res) => {
    try {
        const { courseId } = req.params;

        // 1. Find the Exam ID for this course
        const exam = await Exam.findOne({ course: courseId });
        if (!exam) {
            return res.status(404).json({ success: false, message: "Exam not found" });
        }

        // 2. Aggregation Pipeline
        const analytics = await ExamAttempt.aggregate([
            { $match: { exam: exam._id } },

            // Join with User collection to get names
            {
                $lookup: {
                    from: "users",
                    localField: "user",
                    foreignField: "_id",
                    as: "userDetails",
                },
            },
            { $unwind: "$userDetails" }, // Convert array to object

            // Group by User to consolidate attempts
            {
                $group: {
                    _id: "$user", // Group by User ID
                    name: { $first: "$userDetails.fullName" },
                    email: { $first: "$userDetails.email" },
                    avatar: { $first: "$userDetails.profileImage" },
                    totalAttempts: { $sum: 1 },
                    passedCount: {
                        $sum: { $cond: [{ $eq: ["$isPassed", true] }, 1, 0] },
                    },
                    failedCount: {
                        $sum: { $cond: [{ $eq: ["$isPassed", false] }, 1, 0] },
                    },
                    bestScore: { $max: "$score" },
                    // Push details of each attempt into an array
                    attemptsHistory: {
                        $push: {
                            score: "$score",
                            isPassed: "$isPassed",
                            timeSpent: "$timeSpent", // Ensure you save this in DB
                            completedAt: "$completedAt",
                        },
                    },
                },
            },
        ]);

        // 3. Calculate Overall Stats
        const totalStudents = analytics.length;
        const totalAttemptsGlobal = analytics.reduce((acc, curr) => acc + curr.totalAttempts, 0);
        const totalPassedStudents = analytics.filter((s) => s.passedCount > 0).length;
        const passRate = totalStudents > 0 ? Math.round((totalPassedStudents / totalStudents) * 100) : 0;

        return res.status(200).json({
            success: true,
            data: {
                examTitle: exam.title,
                stats: {
                    totalStudents,
                    totalAttemptsGlobal,
                    totalPassedStudents,
                    totalFailedStudents: totalStudents - totalPassedStudents,
                    passRate,
                },
                students: analytics,
            },
        });
    } catch (error) {
        console.error("Analytics Error:", error);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};

export const updateExam = async (req, res) => {
    try {
        const { courseId } = req.params;
        const { title, description, questions, settings } = req.body;

        // 1. Validation
        if (!questions || questions.length === 0) {
            return res.status(400).json({ success: false, message: "At least one question is required." });
        }

        // 2. Find and Update
        const updatedExam = await Exam.findOneAndUpdate(
            { course: courseId }, // Find by Course ID
            {
                title,
                description,
                questions,
                settings,
            },
            { new: true }, // Return the updated document
        );

        if (!updatedExam) {
            return res.status(404).json({ success: false, message: "Exam not found." });
        }

        return res.status(200).json({
            success: true,
            message: "Exam updated successfully!",
        });
    } catch (error) {
        console.error("Error updating exam:", error);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};
