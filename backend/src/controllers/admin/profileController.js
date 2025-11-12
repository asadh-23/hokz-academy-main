import Admin from "../../models/adminModel.js";
import OTP from "../../models/otpModel.js";
import { sendOtpEmail } from "../../services/emailService.js";
import crypto from "crypto";
import mongoose from "mongoose";
import multer from "multer";
import cloudinary from "../../config/cloudinary.js";
import { validatePassword } from "../../../../frontend/src/utils/validation.js";

export const getAdminProfile = async (req, res) => {
    try {
        const admin = req.user;
        if (!admin) {
            res.status(404).json({ success: false, message: "Admin profile not found." });
        }

        res.status(200).json({
            success: true,
            admin: {
                fullName: admin.fullName,
                email: admin.email,
                profileImage: admin.profileImage || null,
            },
        });
    } catch (error) {
        console.error("Error fetching admin profile:", error);
        res.status(500).json({ success: false, message: "Server error while fetching profile." });
    }
};

export const updateAdminProfileImage = async (req, res) => {
    try {
        const adminId = req.user?._id;

        if (!req.file) return res.status(400).json({ message: "No image file provided" });

        if (!adminId || !mongoose.Types.ObjectId.isValid(adminId)) {
            return res.status(401).json({ message: "Unauthorized : Valid Admin ID not found" });
        }

        const admin = await Admin.findById(adminId).select("profileImage -_id");
        if (admin?.profileImage) {
            try {
                const publicIdMatch = admin.profileImage.match(/\/v\d+\/(?:admin_profiles\/)?([^\.]+)/);
                if (publicIdMatch && publicIdMatch[1]) {
                    const publicId = admin.profileImage.includes("/admin_profiles/")
                        ? `admin_profiles/${publicIdMatch[1]}`
                        : publicIdMatch[1];
                    await cloudinary.uploader.destroy(publicId, { resource_type: "image" });
                    console.log(`Previous image deleted: ${publicId}`);
                }
            } catch (deleteError) {
                console.error("Failed to delete admin previous image from Cloudinary:", deleteError.message);
            }
        }

        const uploadResult = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: "admin_profiles",
                    resource_type: "image",
                },
                (error, result) => {
                    if (error) return reject(error);
                    resolve(result);
                }
            );
            uploadStream.end(req.file.buffer);
        });

        if (!uploadResult || !uploadResult.secure_url) {
            throw new Error("Cloudinary upload failed to return a secure URL.");
        }

        const newImageUrl = uploadResult.secure_url;

        const updatedAdmin = await Admin.findByIdAndUpdate(adminId, { profileImage: newImageUrl }, { new: true });

        if (!updatedAdmin) {
            return res.status(404).json({ success: false, message: "Admin not found after image upload." });
        }

        res.status(200).json({
            success: true,
            message: "Profile image updated successfully",
            imageUrl: newImageUrl,
        });
    } catch (error) {
        console.log("Error updating profile image : ", error);
        if (error instanceof multer.MulterError) {
            return res.status(400).json({ message: `File upload error : ${error.message}` });
        }

        if (error.message && error.message.includes("Cloudinary")) {
            return res.status(500).json({ message: `Cloudinary error : ${error.message}` });
        }

        return res.status(500).json({ message: "Server error updatating profile image" });
    }
};

export const requestPasswordChange = async (req, res) => {
    try {
        const admin = req.user;
        const adminId = req.user._id;
        const currentEmail = req.user.email;
        const { currentPassword, newPassword } = req.body;

        if (!adminId || !mongoose.Types.ObjectId.isValid(adminId)) {
            return res.status(401).json({ success: false, message: "Unauthorized: Valid Admin ID not found." });
        }

        const passwordValidation = validatePassword(newPassword);
        if (!passwordValidation.isValid) {
            return res.status(400).json({ message: passwordValidation.message || "Enter a valid new password" });
        }
        const trimmedNewPassword = passwordValidation.password;

        const isCurrentPasswordValid = await admin.matchAdminPassword(currentPassword);
        if (!isCurrentPasswordValid) {
            return res.status(400).json({ message: "Invalid current password. Please try again" });
        }

        if (currentPassword === trimmedNewPassword) {
            return res.status(400).json({ message: "New password must be different from the current password" });
        }

        const RESEND_INTERVAL_MS = 60 * 1000;
        const lastOtp = await OTP.findOne({
            email: currentEmail,
            purpose: "password_change",
            role: "admin",
        }).sort({ createdAt: -1 });

        if (lastOtp) {
            const timeElapsed = Date.now() - lastOtp.createdAt.getTime();
            if (timeElapsed < RESEND_INTERVAL_MS) {
                const timeLeft = Math.ceil((RESEND_INTERVAL_MS - timeElapsed) / 1000);
                return res.status(429).json({
                    success: false,
                    message: `Please wait ${timeLeft} more seconds before resending.`,
                });
            }
        }

        await OTP.deleteMany({ email: currentEmail, purpose: "password_change", role: "admin" });

        const otpCode = crypto.randomInt(100000, 999999).toString();

        await OTP.create({
            email: currentEmail,
            otpHash: otpCode,
            role: "admin",
            purpose: "password_change",
        });

        try {
            await sendOtpEmail(currentEmail, otpCode, admin.fullName);

            res.status(200).json({
                success: true,
                message: "OTP sent successfully to your email. It will expire in 5 minutes.",
            });
        } catch (emailError) {
            console.error("Failed to send OTP email:", emailError);
            await OTP.deleteOne({ email: currentEmail, purpose: "password_change", role: "admin" });
            return res.status(500).json({
                success: false,
                message: "Failed to send OTP email. Please ensure your email address is correct and try again.",
            });
        }
    } catch (error) {
        console.error("Error requesting password change:", error);
        if (error.name === "ValidationError") {
            const messages = Object.values(error.errors).map((val) => val.message);
            return res.status(400).json({ success: false, message: messages.join(", ") || "Validation failed." });
        }
        res.status(500).json({ success: false, message: "Server error initiating password change." });
    }
};

export const verifyPasswordChange = async (req, res) => {
    try {
        const admin = req.user;
        const adminId = req.user?._id;
        const adminEmail = req.user?.email;
        const { otpCode, newPassword } = req.body;

        if (!adminId || !mongoose.Types.ObjectId.isValid(adminId)) {
            return res.status(401).json({ success: false, message: "Unauthorized: Valid Admin ID not found." });
        }

        if (!otpCode || otpCode.length !== 6) {
            return res.status(400).json({ success: false, message: "Please provide a valid 6-digit OTP." });
        }

        const passwordValidation = validatePassword(newPassword);
        if (!passwordValidation.isValid) {
            return res
                .status(400)
                .json({ success: false, message: passwordValidation.message || "Enter a valid new password" });
        }
        const trimmedNewPassword = passwordValidation.password;

        const otpDoc = await OTP.findOne({
            email: adminEmail,
            purpose: "password_change",
            role: "admin",
        });

        if (!otpDoc) {
            return res.status(400).json({ success: false, message: "Invalid or expired OTP. Please request a new one." });
        }

        const isMatch = await otpDoc.compareOtp(otpCode);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Incorrect OTP entered." });
        }

        admin.password = trimmedNewPassword;
        await admin.save();

        await OTP.deleteOne({ _id: otpDoc._id });

        res.status(200).json({
            success: true,
            message: "Password changed successfully",
        });
    } catch (error) {
        console.error("Error verifying password change OTP:", error);
        res.status(500).json({ success: false, message: "Server error during OTP verification." });
    }
};

export const resendPasswordChangeOtp = async (req, res) => {
    try {
        const adminId = req.user._id;
        const email = req.user.email;

        if (!adminId || !mongoose.Types.ObjectId.isValid(adminId)) {
            return res.status(401).json({ success: false, message: "Unauthorized: Valid Admin ID not found." });
        }

        const RESEND_INTERVAL_MS = 60 * 1000;
        const lastOtp = await OTP.findOne({
            email,
            purpose: "password_change",
            role: "admin",
        }).sort({ createdAt: -1 });

        if (lastOtp) {
            const timeElapsed = Date.now() - lastOtp.createdAt.getTime();
            if (timeElapsed < RESEND_INTERVAL_MS) {
                const timeLeft = Math.ceil((RESEND_INTERVAL_MS - timeElapsed) / 1000);
                return res.status(429).json({
                    success: false,
                    message: `Please wait ${timeLeft} more seconds before resending.`,
                });
            }
        }

        await OTP.deleteMany({ email, purpose: "password_change", role: "admin" });

        const otpCode = crypto.randomInt(100000, 999999).toString();

        await OTP.create({
            email,
            otpHash: otpCode,
            role: "admin",
            purpose: "password_change",
        });

        try {
            await sendOtpEmail(email, otpCode, req.user.fullName);

            res.status(200).json({
                success: true,
                message: `OTP resent successfully to your email address. It will expire in 5 minutes.`,
            });
        } catch (passwordError) {
            console.error("Failed to resend OTP email:", passwordError);
            await OTP.deleteOne({ email, purpose: "password_change", role: "admin" });
            return res.status(500).json({ success: false, message: "Failed to send OTP. Please try again later." });
        }
    } catch (error) {
        console.error("Error resending password change OTP:", error);
        res.status(500).json({ success: false, message: "Server error resending OTP." });
    }
};