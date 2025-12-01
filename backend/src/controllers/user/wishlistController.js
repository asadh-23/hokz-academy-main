// import Wishlist from "../../models/interaction/Wishlist.js";
// import Course from "../../models/course/Course.js";

// export const addToWishlist = async (req, res) => {
//     try {
//         const userId = req.user._id;
//         const { courseId } = req.body;

//         if (!courseId) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Course ID is required",
//             });
//         }

//         const course = await Course.findById(courseId)
//             .select("title slug thumbnailUrl price offerPercentage")
//             .populate("tutor", "fullName");

//         if (!course) {
//             return res.status(404).json({
//                 success: false,
//                 message: "Course not found",
//             });
//         }

//         // Prepare snapshot for faster UI
//         const snapshot = {
//             title: course.title,
//             slug: course.slug,
//             thumbnailUrl: course.thumbnailUrl,
//             price: course.price,
//             offerPercentage: course.offerPercentage,
//             tutorName: course.tutor?.fullName || "Unknown Tutor",
//         };

//         // Use static helper for clean logic
//         const wishlistItem = await Wishlist.addToWishlist(userId, courseId, snapshot, { upsertSnapshot: true });

//         return res.status(201).json({
//             success: true,
//             message: "Added to wishlist",
//             item: wishlistItem,
//         });
//     } catch (error) {
//         console.error("Add to wishlist error:", error);
//         return res.status(500).json({
//             success: false,
//             message: "Failed to add to wishlist",
//         });
//     }
// };

// export const removeFromWishlist = async (req, res) => {
//     try {
//         const userId = req.user._id;
//         const { wishlistItemId } = req.params;

//         const item = await Wishlist.findOne({
//             _id: wishlistItemId,
//             user: userId,
//         });

//         if (!item) {
//             return res.status(404).json({
//                 success: false,
//                 message: "Wishlist item not found",
//             });
//         }

//         // Soft delete (recommended)
//         item.isDeleted = true;
//         item.deletedAt = new Date();
//         await item.save();

//         return res.status(200).json({
//             success: true,
//             message: "Removed from wishlist",
//         });
//     } catch (error) {
//         console.error("Remove wishlist error:", error);
//         return res.status(500).json({
//             success: false,
//             message: "Failed to remove wishlist item",
//         });
//     }
// };

// export const getUserWishlist = async (req, res) => {
//     try {
//         const userId = req.user._id;

//         const items = await Wishlist.find({
//             user: userId,
//             isDeleted: false,
//         })
//             .populate("course", "title thumbnailUrl price offerPercentage tutor")
//             .sort({ createdAt: -1 });

//         return res.status(200).json({
//             success: true,
//             items,
//         });
//     } catch (error) {
//         console.error("Get wishlist error:", error);
//         return res.status(500).json({
//             success: false,
//             message: "Failed to fetch wishlist",
//         });
//     }
// };

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
