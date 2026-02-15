import Course from "../../models/course/Course.js";
import Category from "../../models/category/Category.js";
import mongoose from "mongoose";
import Lesson from "../../models/course/Lesson.js";
import Enrollment from "../../models/course/Enrollment.js";
import { sendNotification } from "../../utils/notificationSender.js";

export const getAllCourses = async (req, res) => {
    try {
        const { page = 1, limit = 9, search = "", minPrice, maxPrice, status, categoryId } = req.query;

        // 1. Build Query Object
        const query = {};

        // A. Search by Title (Case Insensitive)
        if (search) {
            query.title = { $regex: search, $options: "i" };
        }

        // B. Filter by Price Range
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }

        // C. Filter by Status (Listed / Unlisted)
        if (status) {
            if (status === "listed") query.isListed = true;
            if (status === "unlisted") query.isListed = false;
        }

        // D. Filter by Category
        if (categoryId) {
            query.category = categoryId;
        }

        // 2. Pagination Logic
        const pageNumber = Number(page);
        const limitNumber = Number(limit);
        const skip = (pageNumber - 1) * limitNumber;

        // 3. Fetch Data with Population
        const courses = await Course.find(query)
            .populate("tutor", "fullName profileImage email")
            .populate("category", "name")
            .select("title thumbnailUrl description price offerPercentage isListed enrolledCount createdAt")
            .sort({ createdAt: -1 }) // Newest First
            .skip(skip)
            .limit(limitNumber);

        // 4. Get Total Count (For Pagination UI)
        const totalCourses = await Course.countDocuments(query);

        res.status(200).json({
            success: true,
            message: "All courses fetched successfully",
            data: {
                courses,
                pagination: {
                    totalCourses,
                    totalPages: Math.ceil(totalCourses / limitNumber),
                },
            },
        });
    } catch (error) {
        console.error("Get All Courses Error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch courses",
            error: error.message,
        });
    }
};

export const getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find().sort({ name: 1 }).lean();

        return res.status(200).json({
            success: true,
            categories,
        });
    } catch (error) {
        console.error("Failed to fetch categories:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch categories",
        });
    }
};

export const getCourseDetails = async (req, res) => {
    try {
        const { courseId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(courseId)) {
            return res.status(400).json({ success: false, message: "Invalid Course ID" });
        }

        // Fetch Data in Parallel (Course, Lessons, Students, Financials)
        const [courseData, lessons, enrollments] = await Promise.all([
            Course.findById(courseId)
                .populate({
                    path: "tutor",
                    select: "fullName email profileImage phone",
                })
                .populate("category", "name")
                .lean(),

            Lesson.find({ course: courseId })
                .select("title description videoUrl pdfUrl duration isPublished order createdAt")
                .sort({ order: 1, createdAt: 1 }),

            Enrollment.find({ course: courseId })
                .populate("user", "fullName email profileImage phone isBlocked createdAt")
                .sort({ createdAt: -1 }),
        ]);

        if (!courseData) {
            return res.status(404).json({ success: false, message: "Course not found" });
        }

        let totalRevenue = 0;
        let totalAdminProfit = 0;
        let totalTutorEarnings = 0;
        const adminCommissionRate = 10; // 10%

        enrollments.forEach((enroll) => {
            const pricePaid = enroll.pricePaid || 0;

            const adminShare = Math.round((pricePaid * adminCommissionRate) / 100);
            const tutorShare = pricePaid - adminShare;

            // Add to totals
            totalRevenue += pricePaid;
            totalAdminProfit += adminShare;
            totalTutorEarnings += tutorShare;
        });

        const studentsList = enrollments
            .map((enroll) => ({
                studentId: enroll.user?._id,
                fullName: enroll.user?.fullName,
                email: enroll.user?.email,
                profileImage: enroll.user?.profileImage,
                phone: enroll.user?.phone,
                enrolledAt: enroll.createdAt,
                pricePaid: enroll.pricePaid,
            }))
            .filter((student) => student.studentId);

        // Extract Financials (Default to 0 if no sales)
        const stats = {
            totalLessons: lessons.length,
            publishedLessons: lessons.filter((l) => l.isPublished).length,
            totalDuration: lessons.reduce((acc, curr) => acc + (curr.duration || 0), 0),
            totalStudents: studentsList.length,

            // 👇 Corrected Financials
            totalRevenue: totalRevenue,
            adminProfit: totalAdminProfit,
            tutorEarnings: totalTutorEarnings,
        };

        res.status(200).json({
            success: true,
            data: {
                course: courseData,
                tutor: courseData.tutor,
                lessons: lessons,
                students: studentsList,
                stats: stats,
            },
        });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};
// 2. Toggle Course Listing (List / Unlist Course)
export const toggleBlockCourse = async (req, res) => {
    try {
        const { courseId } = req.params;
        const adminId = req.user ? req.user._id : null;
        if (!mongoose.Types.ObjectId.isValid(courseId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Course ID",
            });
        }

        // 1️⃣ Get current course
        const course = await Course.findById(courseId).select("isListed title tutor");

        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found",
            });
        }

        // 2️⃣ Toggle isListed
        course.isListed = !course.isListed;
        await course.save();

        try {
            const message = course.isListed
                ? `Good news! Your course "${course.title}" has been Unblocked By the Admin and is now live.`
                : `Important: Your course "${course.title}" has been Blocked by the Admin. Please contact support.`;

            await sendNotification({
                recipientId: course.tutor,
                senderId: adminId,
                type: "system",
                message: message,
                relatedId: course._id,
            });
        } catch (notifError) {
            console.error("Failed to send block/unblock notification to tutor:", notifError);
        }
        // 3️⃣ Response
        res.status(200).json({
            success: true,
            message: `Course has been ${course.isListed ? "Listed" : "Unlisted"} successfully`,
        });
    } catch (error) {
        console.error("Toggle Course Status Error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to update course status",
            error: error.message,
        });
    }
};

// Get Single Lesson Details
export const getLessonDetails = async (req, res) => {
    try {
        const { lessonId } = req.params;
        const lesson = await Lesson.findById(lessonId);

        if (!lesson) {
            return res.status(404).json({ success: false, message: "Lesson not found" });
        }

        res.status(200).json({ success: true, data: lesson });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 3. Toggle Lesson Status (Publish / Unpublish Lesson)
export const toggleBlockLesson = async (req, res) => {
    try {
        const { lessonId } = req.params;
        const adminId = req.user ? req.user._id : null;

        if (!mongoose.Types.ObjectId.isValid(lessonId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Lesson ID",
            });
        }

        // 1️⃣ Get current publish status
        const lesson = await Lesson.findById(lessonId).select("isPublished title course").populate({
            path: "course",
            select: "title tutor",
        });

        if (!lesson) {
            return res.status(404).json({
                success: false,
                message: "Lesson not found",
            });
        }

        // 2️⃣ Toggle and update
        const updatedLesson = await Lesson.findByIdAndUpdate(
            lessonId,
            { isPublished: !lesson.isPublished },
            { new: true },
        ).select("title description videoUrl pdfUrl duration isPublished order createdAt");
        try {
            const tutorId = lesson.course?.tutor;

            if (tutorId) {
                const actionText = updatedLesson.isPublished ? "Published (Unblocked)" : "Unpublished (Blocked)";
                const message = `Admin has ${actionText} your lesson "${lesson.title}" in the course "${lesson.course?.title}".`;

                await sendNotification({
                    recipientId: tutorId,
                    senderId: adminId,
                    type: "system",
                    message: message,
                    relatedId: lesson._id,
                });
            }
        } catch (notifError) {
            console.error("Failed to send lesson block notification to tutor:", notifError);
        }
        // 3️⃣ Response
        res.status(200).json({
            success: true,
            message: `Lesson has been ${updatedLesson.isPublished ? "Published" : "Unpublished"} successfully`,
            data: updatedLesson,
        });
    } catch (error) {
        console.error("Toggle Lesson Status Error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to update lesson status",
            error: error.message,
        });
    }
};
