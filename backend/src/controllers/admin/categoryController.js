import Category from "../../models/category/Category.js";
import { isNullOrWhitespace } from "../../utils/validation.js";

export const getAllCategories = async (req, res) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const searchTerm = req.query.search || "";
        const statusFilter = req.query.status || "";

        const filter = {};

        // Search filter
        if (searchTerm) {
            filter.name = { $regex: searchTerm, $options: "i" };
        }

        // Listing status filter
        if (statusFilter === "Listed") {
            filter.isListed = true;
        } else if (statusFilter === "Unlisted") {
            filter.isListed = false;
        }

        const [total, listed, unlisted, totalFiltered, categories] = await Promise.all([
            Category.countDocuments(), // total
            Category.countDocuments({ isListed: true }), // listed
            Category.countDocuments({ isListed: false }), // unlisted
            Category.countDocuments(filter), // filtered count
            Category.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
        ]);

        return res.status(200).json({
            success: true,
            categories,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(totalFiltered / limit),
                totalFilteredCategories: totalFiltered,
            },
            stats: {
                total,
                listed,
                unlisted,
            },
        });
    } catch (error) {
        console.error("Error fetching categories:", error);
        return res.status(500).json({
            success: false,
            message: "Error fetching categories",
        });
    }
};

export const createCategory = async (req, res) => {
    try {
        const { name, description } = req.body;

        // Validate BEFORE trimming because the helper already trims
        if (isNullOrWhitespace(name)) {
            return res.status(400).json({
                success: false,
                message: "Category name is required",
            });
        }

        if (isNullOrWhitespace(description)) {
            return res.status(400).json({
                success: false,
                message: "Description is required",
            });
        }

        // Trim for storing clean values
        const trimmedName = name.trim();
        const trimmedDescription = description.trim();

        // Duplicate check
        const existing = await Category.findOne({ name: trimmedName });
        if (existing) {
            return res.status(400).json({
                success: false,
                message: "Another category with this name already exists",
            });
        }

        await Category.create({
            name: trimmedName,
            description: trimmedDescription,
        });

        return res.status(201).json({
            success: true,
            message: "New category added successfully",
        });
    } catch (error) {
        console.error("Error creating category:", error);
        return res.status(500).json({
            success: false,
            message: "Error creating category",
        });
    }
};

export const updateCategory = async (req, res) => {
    try {
        const categoryId = req.params.id;
        const { name, description } = req.body;

        if (isNullOrWhitespace(name)) {
            return res.status(400).json({
                success: false,
                message: "Category name is required",
            });
        }

        if (isNullOrWhitespace(description)) {
            return res.status(400).json({
                success: false,
                message: "Description is required",
            });
        }

        const trimmedName = name.trim();
        const trimmedDescription = description.trim();

        // Duplicate check (excluding current category)
        const existing = await Category.findOne({
            _id: { $ne: categoryId },
            name: trimmedName,
        });

        if (existing) {
            return res.status(400).json({
                success: false,
                message: "Another category with this name already exists",
            });
        }

        // Build update data
        const updateData = { name: trimmedName, description: trimmedDescription };

        // Update category
        await Category.findByIdAndUpdate(categoryId, updateData, {
            new: true,
            runValidators: true,
        });

        return res.status(200).json({
            success: true,
            message: "Category updated successfully",
        });
    } catch (error) {
        console.error("Error updating category:", error);
        return res.status(500).json({
            success: false,
            message: "Error updating category",
        });
    }
};

export const toggleListCategory = async (req, res) => {
    try {
        const categoryId = req.params.id;

        // Find category
        const category = await Category.findById(categoryId);

        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found",
            });
        }

        // Toggle the value
        category.isListed = !category.isListed;
        await category.save();

        return res.status(200).json({
            success: true,
        });
    } catch (error) {
        console.error("Error toggling category:", error);
        return res.status(500).json({
            success: false,
            message: "Error toggling category",
        });
    }
};
