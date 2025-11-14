import Admin from "../../models/adminModel.js";
import { setAuthTokens } from "../../utils/responseHandler.js";

export const loginAdmin = async (req, res) => {
    try {
        
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const isPasswordValid = await admin.matchAdminPassword(password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const accessToken = setAuthTokens(res, admin);
        admin.lastLogin = new Date();
        const savedAdmin = await admin.save();

        res.status(200).json({
            success: true,
            message: "Login successful",
            accessToken,
            admin: {
                role: savedAdmin.role,
                _id: savedAdmin._id,
                fullName: savedAdmin.fullName,
                email: savedAdmin.email,
                profileImage: savedAdmin.profileImage,
                isVerified: true,
            },
        });
    } catch (error) {
        console.error("❌ Admin login error:", error);
        res.status(500).json({ message: "Login failed" });
    }
};