import Wishlist from "../../models/interaction/Wishlist.js";
import Course from "../../models/course/Course.js";

export const addToWishlist = async (req, res) => {
    try {
        const userId = req.user._id;
        const { courseId } = req.body;
        if (!courseId) return res.status(400).json({ success: false, message: "courseId required" });

        const course = await Course.findById(courseId).select("_id");
        if (!course) return res.status(404).json({ success: false, message: "Course not found" });

        const item = await Wishlist.addToWishlist(userId, courseId, { source: "course_page" });
        const populatedItem = await item.populate({
            path: "course",
            select: "title slug thumbnailUrl price offerPercentage tutor category averageRating totalReviews lessonsCount totalDurationSeconds isListed",
            populate: [
                {
                    path: "tutor",
                    select: "fullName profileImage email",
                },
                {
                    path: "category",
                    select: "name slug isListed",
                },
            ],
        });

    
        return res.status(201).json({ success: true, item: populatedItem });
    } catch (err) {
        const status = err.status || 500;
        return res.status(status).json({ success: false, message: err.message || "Failed to add to wishlist" });
    }
};

export const getUserWishlist = async (req, res) => {
    try {
        const userId = req.user._id;

        const wishlistItems = await Wishlist.find({
            user: userId,
            isDeleted: false,
        })
            .populate({
                path: "course",
                select: "title slug thumbnailUrl price offerPercentage tutor category averageRating totalReviews lessonsCount totalDurationSeconds isListed",
                populate: [
                    {
                        path: "tutor",
                        select: "fullName profileImage",
                    },
                    {
                        path: "category",
                        select: "name slug isListed",
                    },
                ],
            })
            .sort({ createdAt: -1 })
            .lean();

        // Filter out items whose courses are deleted/unlisted
        const validItems = wishlistItems.filter((item) => item.course);

        return res.status(200).json({
            success: true,
            wishlist: validItems,
        });
    } catch (error) {
        console.error("Get wishlist error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch wishlist",
        });
    }
};

export const removeFromWishlist = async (req, res) => {
    try {
        const userId = req.user._id;
        const { wishlistId } = req.params;
        const updated = await Wishlist.removeFromWishlist(userId, wishlistId);
        if (!updated) return res.status(404).json({ success: false, message: "Wishlist item not found" });

        return res.status(200).json({ success: true, message: "Removed from wishlist" });
    } catch (err) {
        console.error("Remove from wishlist error : ", err);
        return res.status(500).json({ success: false, message: "Failed to remove wishlist item" });
    }
};

export const clearWishlist = async (req, res) => {
    try {
        const userId = req.user._id;

        await Wishlist.updateMany(
            { user: userId, isDeleted: false },
            { $set: { isDeleted: true, deletedAt: new Date() } }
        );

        return res.status(200).json({ success: true, message: "Wishlist cleared successfully" });
    } catch (err) {
        return res.status(500).json({ success: false, message: "Failed to clear wishlist" });
    }
};


// export const isInWishlist = async (req, res) => {
//     try {
//         const userId = req.user._id;
//         const { courseId } = req.params;

//         const item = await Wishlist.findOne({
//             user: userId,
//             course: courseId,
//             isDeleted: false,
//         });

//         return res.status(200).json({
//             success: true,
//             inWishlist: !!item,
//         });
//     } catch (error) {
//         console.error("Check wishlist error:", error);
//         return res.status(500).json({
//             success: false,
//             message: "Failed to check wishlist state",
//         });
//     }
// };
