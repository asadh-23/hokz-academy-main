import Course from "../../models/course/Course.js";
import Category from "../../models/category/Category.js";

export const getAllCourses = async (req, res) => {
    try {
        const { search, category, minPrice, maxPrice, sort, page, limit } = req.query;

        const query = {
            isListed: true,
            isActive: true,
            isDeleted: false,
        };

        // SEARCH
        if (search.trim()) {
            query.title = { $regex: search.trim(), $options: "i" };
        }

        // CATEGORY
        if (category && category !== "all") {
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
        const skip = (page - 1) * limit;

        const totalItems = await Course.countDocuments(query);

        const courses = await Course.find(query)
            .populate("category", "name")
            .sort(sortQuery)
            .skip(skip)
            .limit(Number(limit))
            .lean();

        return res.status(200).json({
            success: true,
            courses,
            totalItems,
            totalPages: Math.ceil(totalItems / limit),
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
