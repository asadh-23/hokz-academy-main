import express from "express";
import { verifyToken, isUser } from "../../middlewares/authMiddleware.js";
import { addToUserCart, getUserCart, removeFromCart, clearCart } from "../../controllers/user/cartController.js"

const userRouter = express.Router();

userRouter.use(verifyToken, isUser)

userRouter.post("/", addToUserCart);
userRouter.get("/", getUserCart);
userRouter.delete("/:itemId", removeFromCart);
userRouter.delete("/", clearCart)

export default userRouter;