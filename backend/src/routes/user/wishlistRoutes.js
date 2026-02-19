import express from "express";
import {
    addToWishlist,
    getUserWishlist,
    removeFromWishlist,
    clearWishlist,
} from "../../controllers/user/wishlistController.js";

const userRouter = express.Router();

userRouter.post("/", addToWishlist);
userRouter.get("/", getUserWishlist);
userRouter.delete("/:wishlistId", removeFromWishlist);
userRouter.delete("/",clearWishlist)

export default userRouter;
