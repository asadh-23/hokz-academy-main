import { verifyRefreshToken } from "../utils/generateToken.js";
import { generateAccessToken } from "../utils/generateToken.js";
import User from "../models/userModel.js";
import Tutor from "../models/tutorModel.js";
import Admin from "../models/adminModel.js";

export const handleRefreshToken = async (req, res) => {
    try {

        const cookies = req.cookies;
        if (!cookies?.refreshToken) {
            console.log('❌ No refresh token in cookies:');
            return res.status(401).json({ message: "Unauthorized: No token provided" });
        }

        const refreshToken = cookies.refreshToken;

        const decoded = verifyRefreshToken(refreshToken);

        if (!decoded.id || !decoded.role) {
            return res.status(401).json({ message: "Unauthorized: Invalid token payload" });
        }

        let user;

        if (decoded.role === "user") {
            user = await User.findById(decoded.id);
        } else if (decoded.role === "tutor") {
            user = await Tutor.findById(decoded.id);
        } else if (decoded.role === "admin") {
            user = await Admin.findById(decoded.id);
        }

        if (!user || user.isBlocked) {
            return res.status(401).json({ message: "Unauthorized: User not found or is blocked" });
        }

        const newAccessToken = generateAccessToken(user._id, user.role);

        res.status(200).json({
            success: true,
            accessToken: newAccessToken,
            user: {
                _id: user._id,
                name: user.fullName,
                email: user.email,
                role: user.role,
                profileImage: user.profileImage,
                isVerified: user.isVerified,
            },
        });
    } catch (error) {
        console.error("Refresh Token Error:", error.message);
        return res.status(401).json({ message: "Unauthorized: Invalid or expired token" });
    }
};

export const logoutUser = (req, res) => {
    try {
        res.cookie("refreshToken", "", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            expires: new Date(0),
            path: "/",
            ...(process.env.NODE_ENV === 'production' && { domain: '.hokzacademy.com' })
        });
        res.status(200).json({ success: true, message: "Logged out successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server Error during logout" });
    }
};
