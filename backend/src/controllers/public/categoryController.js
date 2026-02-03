import Category from "../../models/category/Category.js";

export const getListedCategories = async (req, res) => {
  try {
    const categories = await Category
      .find({ isListed: true })
      .sort({ name: 1 })
      .lean();

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
