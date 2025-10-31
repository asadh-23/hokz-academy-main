import express from "express";
import { handleRefreshToken, logoutUser } from "../controllers/authController.js"

const authRouter = express.Router();

authRouter.post("/refresh", handleRefreshToken);
authRouter.post("/logout", logoutUser);

export default authRouter;
