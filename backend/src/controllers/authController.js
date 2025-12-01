import { verifyRefreshToken } from "../utils/generateToken.js";
import { generateAccessToken } from "../utils/generateToken.js";
import User from "../models/user/User.js";
import Tutor from "../models/user/Tutor.js";
import Admin from "../models/user/Admin.js";

export const handleRefreshToken = async (req, res) => {
    try {
        const cookies = req.cookies;
        
        if (!cookies?.refreshToken) {
            console.log('❌ No refresh token in cookies');
            return res.status(401).json({
                success: false,
                message: "Unauthorized: No refresh token provided" 
            });
        }

        const refreshToken = cookies.refreshToken;

        // Verify refresh token
        const decoded = verifyRefreshToken(refreshToken);

        if (!decoded.id || !decoded.role) {
            console.log('❌ Invalid token payload');
            return res.status(401).json({ 
                success: false,
                message: "Unauthorized: Invalid token payload" 
            });
        }

        // Find user based on role
        let user;
        if (decoded.role === "user") {
            user = await User.findById(decoded.id);
        } else if (decoded.role === "tutor") {
            user = await Tutor.findById(decoded.id);
        } else if (decoded.role === "admin") {
            user = await Admin.findById(decoded.id);
        } else {
            console.log('❌ Invalid role in token:', decoded.role);
            return res.status(401).json({ 
                success: false,
                message: "Unauthorized: Invalid role" 
            });
        }

        if (!user) {
            console.log('❌ User not found for id:', decoded.id);
            return res.status(401).json({ 
                success: false,
                message: "Unauthorized: User not found" 
            });
        }

        if (user.isBlocked) {
            console.log('❌ User is blocked:', decoded.id);
            return res.status(403).json({ 
                success: false,
                message: "Forbidden: Account has been blocked" 
            });
        }

        // Generate new access token
        const newAccessToken = generateAccessToken(user._id, user.role);

        console.log('✅ Access token refreshed for user:', user._id);

        res.status(200).json({
            success: true,
            accessToken: newAccessToken,
            user: {
                _id: user._id,
                fullName: user.fullName,
                email: user.email,
                role: user.role,
                profileImage: user.profileImage,
                isVerified: user.isVerified,
            },
        });
    } catch (error) {
        console.error("❌ Refresh Token Error:", error.message);
        
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ 
                success: false,
                message: "Unauthorized: Refresh token has expired" 
            });
        }
        
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ 
                success: false,
                message: "Unauthorized: Invalid refresh token" 
            });
        }
        
        return res.status(401).json({ 
            success: false,
            message: "Unauthorized: Token verification failed" 
        });
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
