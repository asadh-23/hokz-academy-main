import Course from "../../models/course/Course.js";
import Category from "../../models/category/Category.js";
import Enrollment from "../../models/course/Enrollment.js";
import CourseProgress from "../../models/course/CourseProgress.js";
import ExamAttempt from "../../models/course/ExamAttempt.js";

export const getAllCourses = async (req, res) => {
    try {
        const { search = "", category = "", minPrice = "", maxPrice = "", sort = "", page = 1, limit = 10 } = req.query;

        const query = {
            isListed: true,
            isActive: true,
            isDeleted: false,
            isBanned: false,
        };

        // SEARCH
        if (search && search.trim()) {
            query.title = { $regex: search.trim(), $options: "i" };
        }

        // CATEGORY
        if (category) {
            query.category = category;
        }

        if (minPrice !== "" || maxPrice !== "") {
            query.price = {};

            if (minPrice !== "") {
                query.price.$gte = Number(minPrice);
            }

            if (maxPrice !== "") {
                query.price.$lte = Number(maxPrice);
            }
        }

        // SORTING
        let sortQuery = {};
        switch (sort) {
            case "newest":
                sortQuery = { createdAt: -1 };
                break;
            case "oldest":
                sortQuery = { createdAt: 1 };
                break;
            case "low-high":
                sortQuery = { price: 1 };
                break;
            case "high-low":
                sortQuery = { price: -1 };
                break;
            default:
                sortQuery = { createdAt: -1 };
        }

        // PAGINATION
        const pageNum = Number(page) || 1;
        const limitNum = Number(limit) || 10;
        const skip = (pageNum - 1) * limitNum;

        const totalItems = await Course.countDocuments(query);

        const courses = await Course.find(query)
            .populate("category", "name")
            .populate("tutor", "fullName")
            .sort(sortQuery)
            .skip(skip)
            .limit(limitNum)
            .lean();

        return res.status(200).json({
            success: true,
            courses,
            totalItems,
            totalPages: Math.ceil(totalItems / limitNum),
            currentPage: pageNum,
        });
    } catch (error) {
        console.error("Get all courses error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch courses",
        });
    }
};

export const getListedCategories = async (req, res) => {
    try {
        const categories = await Category.find({ isListed: true }).select("_id name").sort({ name: 1 });
        if (!categories) {
            return res.status(400).json({ success: false, message: "Failed to fetch categories" });
        }

        return res.status(200).json({
            success: true,
            categories,
        });
    } catch (error) {
        console.error("Get Listed Categories Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch categories",
        });
    }
};

export const getCourseDetails = async (req, res) => {
    try {
        const { courseId } = req.params;
        const { userId } = req.query;

        if (!courseId) {
            return res.status(400).json({
                success: false,
                message: "Invalid course ID",
            });
        }

        // 1. Fetch course details
        const course = await Course.findOne({
            _id: courseId,
            isListed: true,
            isActive: true,
            isDeleted: false,
            isBanned: false,
        })
            .populate("tutor", "fullName email profileImage")
            .populate("category", "name")
            .populate({
                path: "lessons",
                select: "title duration isFreePreview order thumbnailUrl",
                options: { sort: { order: 1 } },
            });

        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found",
            });
        }

        // 2. CHECK ENROLLMENT (Corrected Logic)
        let isEnrolled = false;
       
        if (userId && userId !== "undefined" && userId !== "null") {
            const enrollment = await Enrollment.exists({
                user: userId,
                course: courseId,
                status: "active",
            });
            isEnrolled = !!enrollment;
        }

        // 3. Price Calculation (Keep your existing logic, it's fine)
        const originalPrice = course.price || 0;
        const offerPercentage = course.offerPercentage || 0;

        let subTotal = originalPrice;
        let discountAmount = 0;

        if (offerPercentage > 0) {
            discountAmount = (originalPrice * offerPercentage) / 100;
            subTotal = Math.round(originalPrice - discountAmount);
        }

        const taxAmount = Math.round(subTotal * 0.03);
        const totalAmount = subTotal + taxAmount;

        // 4. Return Response
        return res.status(200).json({
            success: true,
            message: "Course details fetched successfully",
            courseData: {
                course,
                totalMrp: originalPrice,
                discountAmount,
                subTotal,
                taxAmount,
                totalAmount,
                isEnrolled: isEnrolled,
            },
        });
    } catch (err) {
        console.error("Get course details error:", err.message);
        return res.status(500).json({
            success: false,
            message: "Something went wrong while fetching course details",
        });
    }
};

export const getMyCourses = async (req, res) => {
    try {
        const userId = req.user._id;
        // 1. Find all active enrollments for this user
        const enrollments = await Enrollment.find({
            user: userId,
            status: "active",
        })
            .populate({
                path: "course",
                match: { isBanned: false, isDeleted: false },
                select: "title thumbnailUrl category description totalDurationSeconds lessonsCount tutor exam isBanned",
                populate: [
                    {
                        path: "tutor",
                        select: "fullName profileImage",
                    },
                    {
                        path: "category",
                        select: "name",
                    },
                ],
            })
            .sort({ createdAt: -1 });

        // 2. Fetch Progress for each course
        const coursesWithProgress = await Promise.all(
            enrollments.map(async (enrollment) => {
                if (!enrollment.course) return null;

                const progressDoc = await CourseProgress.findOne({
                    user: userId,
                    course: enrollment.course._id,
                });

                let examStatus = {
                    isAttempted: false,
                    isPassed: false,
                    score: 0,
                    earnedPoints: 0,
                };
                if (enrollment.course?.exam) {
                    const lastAttempt = await ExamAttempt.findOne({
                        user: userId,
                        exam: enrollment.course.exam,
                        course: enrollment.course._id,
                    }).sort({ createdAt: -1 });

                    if (lastAttempt) {
                        examStatus = {
                            isAttempted: true,
                            isPassed: lastAttempt.isPassed,
                            score: lastAttempt.score,
                            earnedPoints: lastAttempt.earnedPoints,
                        };
                    }
                }

                return {
                    ...enrollment.course.toObject(),
                    progress: progressDoc ? progressDoc.completionPercentage : 0,
                    enrollmentId: enrollment._id,
                    examStatus: examStatus,
                };
            }),
        );

        const validCourses = coursesWithProgress.filter((course) => course !== null);

        res.status(200).json({
            success: true,
            data: validCourses,
        });
    } catch (error) {
        console.error("Get My Courses Error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch enrolled courses",
            error: error.message,
        });
    }
};

export const getMyCertificates = async (req, res) => {
    try {
        const userId = req.user._id;

        const passedAttempts = await ExamAttempt.find({
            user: userId,
            isPassed: true,
        })
            .populate({
                path: "course",
                select: "title thumbnailUrl",
                populate: {
                    path: "tutor",
                    select: "fullName profileImage",
                },
            })
            .sort({ completedAt: -1 });

        const certificates = passedAttempts
            .map((attempt) => {
                if (!attempt.course) return null;

                return {
                    certificateId: `CRT-${attempt._id.toString().slice(-8).toUpperCase()}`,
                    courseName: attempt.course.title,
                    courseThumbnail: attempt.course.thumbnailUrl,
                    tutorName: attempt.course.tutor?.fullName || "Hokz Academy Instructor",
                    tutorProfileImage: attempt.course.tutor?.profileImage || null,
                    score: attempt.score,
                    totalPoints: attempt.totalPoints,
                    completedDate: attempt.completedAt,
                    studentName: req.user.fullName,
                };
            })
            .filter((item) => item !== null);

        res.status(200).json({
            success: true,
            data: certificates,
        });
    } catch (error) {
        console.error("Certificate Error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch certificates",
            error: error.message,
        });
    }
};
