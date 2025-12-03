import express from "express";
import { verifyToken, isUser } from "../../middlewares/authMiddleware.js";
import {
    addToWishlist,
    getUserWishlist,
    removeFromWishlist,
    clearWishlist,
    // isInWishlist,
} from "../../controllers/user/wishlistController.js";

const userRouter = express.Router();

userRouter.use(verifyToken, isUser);

userRouter.post("/wishlist", addToWishlist);
userRouter.get("/wishlist", getUserWishlist);
userRouter.delete("/wishlist/:wishlistId", removeFromWishlist);
userRouter.delete("/wishlist",clearWishlist)
// userRouter.get("/check/:courseId", isInWishlist);

export default userRouter;
