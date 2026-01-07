import Course from "../../models/course/Course.js";
import Category from "../../models/category/Category.js";
import CourseProgress from "../../models/course/CourseProgress.js";

export const getAllCourses = async (req, res) => {
    try {
        const { search = "", category = "", minPrice = "", maxPrice = "", sort = "", page = 1, limit = 10 } = req.query;

        const query = {
            isListed: true,
            isActive: true,
            isDeleted: false,
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
        
        const userId = req.user?._id;

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
        })
            .populate("tutor", "fullName email profileImage")
            .populate("category", "name");

        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found",
            });
        }

       
        let isEnrolled = false;
        if (userId) {
           
            const enrollment = await CourseProgress.exists({
                user: userId,
                course: courseId,
            });
            isEnrolled = !!enrollment;
        }

        
        const originalPrice = course.price || 0;
        const offerPercentage = course.offerPercentage || 0;

        let subTotal = originalPrice;
        let discountAmount = 0;

        if (offerPercentage > 0) {
            discountAmount = (originalPrice * offerPercentage) / 100;
            subTotal = Math.round(originalPrice - discountAmount);
        }

        const taxAmount = Math.round(subTotal * 0.03); // 3% Tax logic
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
