import Course from "../../models/course/Course.js";
import CourseProgress from "../../models/course/CourseProgress.js";
import Lesson from "../../models/course/Lesson.js";
import Enrollment from "../../models/course/Enrollment.js";
import ExamAttempt from "../../models/course/ExamAttempt.js";

export const getCourseContent = async (req, res) => {
    try {
        const { courseId } = req.params;
        const userId = req.user._id;

        // 1. Enrollment Check
        const isEnrolled = await Enrollment.findOne({
            user: userId,
            course: courseId,
            status: "active",
        });

        if (!isEnrolled) {
            return res.status(403).json({
                success: false,
                message: "Access denied. You are not enrolled in this course.",
            });
        }

        // 2. Fetch Course Basic Details
        const course = await Course.findById(courseId)
            .select("title description tutor averageRating lessonsCount exam")
            .populate("tutor", "fullName profileImage");

        if (!course) {
            return res.status(404).json({ success: false, message: "Course not found" });
        }

        // 3. Fetch Lessons
        const lessons = await Lesson.find({ course: courseId, isPublished: true })
            .sort({ order: 1 })
            .select("title description duration videoUrl order isFreePreview pdfUrl");

        // 4. Fetch or Create User Progress
        let progress = await CourseProgress.findOne({ user: userId, course: courseId });

        if (!progress) {
            progress = await CourseProgress.create({
                user: userId,
                course: courseId,
                completedLessons: [],
                completionPercentage: 0,
            });
        }
        const passedAttempt = await ExamAttempt.findOne({
            user: userId,
            course: courseId,
            isPassed: true,
        }).select("completedAt score");

        res.status(200).json({
            success: true,
            data: {
                course,
                lessons,
                progress: {
                    completedLessons: progress.completedLessons,
                    completionPercentage: progress.completionPercentage,
                    lastPlayedLesson: progress.lastPlayedLesson,
                    isCompleted: progress.isCompleted,
                    isExamPassed: !!passedAttempt,
                },
                certificateData: passedAttempt
                    ? {
                          completedAt: passedAttempt.completedAt,
                          score: passedAttempt.score,
                      }
                    : null,
            },
        });
    } catch (error) {
        console.error("Error in getCourseContent:", error);
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};

export const updateLessonProgress = async (req, res) => {
    try {
        const userId = req.user._id;
        const { courseId, lessonId } = req.body;

        if (!courseId || !lessonId) {
            return res.status(400).json({ success: false, message: "Course ID and Lesson ID are required" });
        }

        let progress = await CourseProgress.findOne({ user: userId, course: courseId });

        if (!progress) {
            progress = new CourseProgress({
                user: userId,
                course: courseId,
                completedLessons: [],
                completionPercentage: 0,
            });
        }

        // 2. Check if lesson is already completed
        const isAlreadyCompleted = progress.completedLessons.includes(lessonId);

        if (!isAlreadyCompleted) {
            progress.completedLessons.push(lessonId);
        }

        // 3. Update 'lastPlayedLesson'
        progress.lastPlayedLesson = lessonId;

        const totalLessons = await Lesson.countDocuments({ course: courseId, isPublished: true });

        if (totalLessons > 0) {
            const completedCount = progress.completedLessons.length;
            progress.completionPercentage = Math.round((completedCount / totalLessons) * 100);

            // Cap at 100% (Safety check)
            if (progress.completionPercentage > 100) progress.completionPercentage = 100;
        }

        // 5. Check if Course is Fully Completed
        if (progress.completionPercentage === 100) {
            progress.isCompleted = true;
        }

        await progress.save();

        return res.status(200).json({
            success: true,
            message: "Progress updated successfully",
            data: progress,
        });
    } catch (error) {
        console.error("Error updating progress:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

