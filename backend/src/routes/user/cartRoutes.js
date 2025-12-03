import express from "express";
import { verifyToken, isUser } from "../../middlewares/authMiddleware.js";
import { addToUserCart, getUserCart, removeFromCart, clearCart } from "../../controllers/user/cartController.js"

const userRouter = express.Router();

userRouter.use(verifyToken, isUser)

userRouter.post("/cart", addToUserCart);
userRouter.get("/cart", getUserCart);
userRouter.delete("/cart/:itemId", removeFromCart);
userRouter.delete("/cart", clearCart)

export default userRouter;