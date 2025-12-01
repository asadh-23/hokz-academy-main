import Category from "../../models/category/Category.js";
import Course from "../../models/course/Course.js";
import { uploadToS3 } from "../../services/s3UploadService.js";

export const getTutorCategories = async (req, res) => {
    try {
        const categories = await Category.find({ isListed: true }).sort({ name: 1 });

        return res.status(200).json({
            success: true,
            categories,
        });
    } catch (error) {
        console.log("Failed to fetch categories : ", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch categories",
        });
    }
};

export const uploadCourseThumbnail = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No file received",
            });
        }

        // Upload to S3 (folder: course-thumbnails)
        const { key, url } = await uploadToS3(req.file, "course-thumbnails");

        return res.status(200).json({
            success: true,
            message: "Thumbnail uploaded successfully",
            fileUrl: url,
            fileKey: key,
        });
    } catch (error) {
        console.error("Course thumbnail upload error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to upload thumbnail",
        });
    }
};

export const createCourse = async (req, res) => {
    try {
        const tutorId = req.user._id;

        const { title, category, regularPrice, offerPercentage, description, thumbnailUrl, thumbnailKey } = req.body;

        if (!title || !category || !regularPrice || !description) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields",
            });
        }

        const offer = Number(offerPercentage) || 0;
        if (offer < 0 || offer > 100) {
            return res.status(400).json({
                success: false,
                message: "Offer percentage must be between 0 and 100",
            });
        }

        if (!thumbnailUrl || !thumbnailKey) {
            return res.status(400).json({
                success: false,
                message: "Course thumbnail missing. Please upload again.",
            });
        }

        const categoryExists = await Category.findById(category).select("_id");
        if (!categoryExists) {
            return res.status(400).json({
                success: false,
                message: "Invalid category selected.",
            });
        }

        // Create course
        const course = await Course.create({
            tutor: tutorId,
            title: title.trim(),
            category,
            price: regularPrice,
            offerPercentage: offer,
            description: description.trim(),
            thumbnailUrl,
            thumbnailKey,
        });

        return res.status(201).json({
            success: true,
            message: "Course created successfully",
            courseId: course._id,
        });
    } catch (error) {
        console.error("Create Course Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to create course",
        });
    }
};

export const getTutorCourses = async (req, res) => {
    try {
        const tutorId = req.user._id;

        // Query Params
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 6;
        const search = req.query.search?.trim() || "";
        const status = req.query.status || "all";

        const skip = (page - 1) * limit;

        const totalCourses = await Course.countDocuments({
            tutor: tutorId,
            isDeleted: false,
        });

        const listedCount = await Course.countDocuments({
            tutor: tutorId,
            isDeleted: false,
            isListed: true,
        });

        const unlistedCount = totalCourses - listedCount;

        const filter = {
            tutor: tutorId,
            isDeleted: false,
        };

        if (search) {
            filter.title = { $regex: search, $options: "i" };
        }

        if (status === "listed") filter.isListed = true;
        if (status === "unlisted") filter.isListed = false;

        // ----------------------------
        // PAGINATION QUERY
        // ----------------------------
        const courses = await Course.find(filter)
            .select("title shortSummary description price offerPercentage thumbnailUrl isListed enrolledCount createdAt")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean();

        const totalFilteredCourses = await Course.countDocuments(filter);

        return res.status(200).json({
            success: true,
            message: "Tutor courses fetched successfully",
            courses,
            stats: {
                total: totalCourses,
                listed: listedCount,
                unlisted: unlistedCount,
            },
            pagination: {
                totalCourses: totalFilteredCourses,
                totalPages: Math.ceil(totalFilteredCourses / limit),
                currentPage: page,
            }
        });
    } catch (error) {
        console.error("Error fetching tutor courses:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch tutor courses",
        });
    }
};

export const getCourseById = async (req, res) => {
    try {
        const tutorId = req.user._id;
        const { courseId } = req.params;

        // 1. Basic validation
        if (!courseId) {
            return res.status(400).json({
                success: false,
                message: "Course ID is required",
            });
        }

        // 2. Fetch course owned by tutor
        const course = await Course.findOne({
            _id: courseId,
            tutor: tutorId,
            isDeleted: false,
        }).select("-_id title category description price offerPercentage thumbnailUrl thumbnailKey");

        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found or access denied",
            });
        }

        // 3. Fetch all categories for dropdown
        const categories = await Category.find({ isListed: true }).select("_id name").sort({ name: 1 });

        return res.status(200).json({
            success: true,
            course,
            categories,
        });
    } catch (error) {
        console.error("Get Course By ID Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch course details",
        });
    }
};

export const updateCourse = async (req, res) => {
    try {
        const tutorId = req.user._id;
        const { courseId } = req.params;

        const { title, category, price, offerPercentage, description, thumbnailUrl, thumbnailKey } = req.body;
        if (!title || !category || !price || !description) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields",
            });
        }

        const offer = Number(offerPercentage) || 0;
        if (offer < 0 || offer > 100) {
            return res.status(400).json({
                success: false,
                message: "Offer percentage must be between 0 and 100",
            });
        }

        if (!thumbnailUrl || !thumbnailKey) {
            return res.status(400).json({
                success: false,
                message: "Course thumbnail missing. Please upload again.",
            });
        }

        const updated = await Course.findOneAndUpdate(
            { _id: courseId, tutor: tutorId },
            {
                title,
                category,
                price: Number(price),
                offerPercentage: offer,
                description,
                thumbnailUrl,
                thumbnailKey,
            },
            { new: true }
        );

        if (!updated) {
            return res.status(404).json({
                success: false,
                message: "Course not found or unauthorized",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Course updated successfully",
            course: updated,
        });
    } catch (err) {
        console.error("Update course error:", err);
        return res.status(500).json({
            success: false,
            message: "Failed to update course",
        });
    }
};

export const toggleListCourse = async (req, res) => {
    try {
        const tutorId = req.user._id;
        const { courseId } = req.params;

        const course = await Course.findOne({ _id: courseId, tutor: tutorId, isDeleted: false });
        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found or unauthorized",
            });
        }

        course.isListed = !course.isListed;
        await course.save();

        return res.status(200).json({
            success: true,
            message: course.isListed ? `${course.title} listed` : `${course.title} unlisted`,
        });
    } catch (error) {
        console.error("Toggle list error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to update listing state",
        });
    }
};
