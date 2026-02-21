import express from "express";
import {
    addToWishlist,
    getUserWishlist,
    removeFromWishlist,
    clearWishlist,
} from "../../controllers/user/wishlistController.js";
import { isUser, verifyToken } from "../../middlewares/authMiddleware.js";

const userRouter = express.Router();

userRouter.use(verifyToken, isUser);

userRouter.post("/", addToWishlist);
userRouter.get("/", getUserWishlist);
userRouter.delete("/:wishlistId", removeFromWishlist);
userRouter.delete("/",clearWishlist)

export default userRouter;
