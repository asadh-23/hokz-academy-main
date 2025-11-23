import User from "../../models/user/User.js";
import OTP from "../../models/common/Otp.js";
import Tutor from "../../models/user/Tutor.js";
import Admin from "../../models/user/Admin.js";
import { sendOtpEmail } from "../../services/emailService.js";
import crypto from "crypto";
import mongoose from "mongoose";
import { uploadToCloudinary } from "../../services/cloudinaryService.js";
import cloudinary from "../../config/cloudinary.js";
import {
    isNullOrWhitespace,
    validatePhone,
    validateEmail,
    validatePassword,
} from "../../../../frontend/src/utils/validation.js";

export const getUserProfile = async (req, res) => {
    try {
        const user = req.user;
        if (!user) {
            res.status(404).json({ success: false, message: "User profile not found." });
        }

        res.status(200).json({
            success: true,
            user: {
                _id: user._id,
                fullName: user.fullName,
                email: user.email,
                phone: user.phone || "",
                profileImage: user.profileImage || null,
            },
        });
    } catch (error) {
        console.error("Error fetching user profile:", error);
        res.status(500).json({ success: false, message: "Server error fetching user profile." });
    }
};

export const updateUserProfile = async (req, res) => {
    try {
        const userId = req.user?._id;

        if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(401).json({ success: false, message: "Unauthorized: Valid User ID not found in request." });
        }

        const { fullName, phone } = req.body;

        if (isNullOrWhitespace(fullName)) {
            return res.status(400).json({ message: "Full name is required" });
        }

        const phoneValidation = validatePhone(phone);
        if (!phoneValidation.isValid) {
            return res.status(400).json({ message: phoneValidation.message || "Enter valid phone number" });
        }
        const updateData = {
            fullName: fullName.trim(),
            phone: phone.trim(),
        };

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $set: updateData },
            { new: true, runValidators: true }
        ).select("-password");

        if (!updatedUser) {
            return res.status(404).json({ success: false, message: "User not found for update." });
        }

        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user: {
                fullName: updatedUser.fullName,
                phone: updatedUser.phone || "",
            },
        });
    } catch (error) {
        console.error("Error updating user profile:", error);
        res.status(500).json({ success: false, message: "Server error updating profile." });
    }
};

export const updateUserProfileImage = async (req, res) => {
    try {
        const userId = req.user?._id;

        if (!req.file) {
            return res.status(400).json({ message: "No image file provided" });
        }

        if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(401).json({ message: "Unauthorized : Valid user ID not found" });
        }

        const currentUser = await User.findById(userId).select("profileImage -_id");

        // Delete old image from Cloudinary
        if (currentUser?.profileImage) {
            try {
                const match = currentUser.profileImage.match(/\/v\d+\/(?:user_profiles\/)?([^\.]+)/);
                if (match && match[1]) {
                    const publicId = currentUser.profileImage.includes("/user_profiles/")
                        ? `user_profiles/${match[1]}`
                        : match[1];

                    await cloudinary.uploader.destroy(publicId, { resource_type: "image" });
                }
            } catch (err) {
                console.error("Failed to delete previous user image:", err.message);
            }
        }

        // Upload new image using helper method
        const uploadResult = await uploadToCloudinary(req.file.buffer, "user_profiles");

        if (!uploadResult?.secure_url) {
            throw new Error("Cloudinary upload failed");
        }

        const updatedUser = await User.findByIdAndUpdate(userId, { profileImage: uploadResult.secure_url }, { new: true });

        if (!updatedUser) {
            return res.status(404).json({ success: false, message: "User not found after image upload." });
        }

        res.status(200).json({
            success: true,
            message: "Profile image updated successfully",
            imageUrl: uploadResult.secure_url,
        });
    } catch (error) {
        console.error("Error updating profile image:", error);

        if (error.message.includes("Cloudinary")) {
            return res.status(500).json({ message: `Cloudinary error: ${error.message}` });
        }

        return res.status(500).json({ message: "Server error updating profile image" });
    }
};

export const requestEmailChange = async (req, res) => {
    try {
        const userId = req.user?._id;
        const currentEmail = req.user?.email;
        const { newEmail } = req.body;

        if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(401).json({ success: false, message: "Unauthorized: Valid User ID not found." });
        }

        const emailValidation = validateEmail(newEmail);
        if (!emailValidation.isValid) {
            return res.status(400).json({ message: emailValidation.message || "Enter a valid email address" });
        }
        const trimmedNewEmail = emailValidation.email;

        if (trimmedNewEmail === currentEmail) {
            return res.status(400).json({ success: false, message: "New email must be different from the current email." });
        }

        const existingUser = await User.findOne({ email: trimmedNewEmail }).lean();
        const existingTutor = await Tutor.findOne({ email: trimmedNewEmail }).lean();
        const existingAdmin = await Admin.findOne({ email: trimmedNewEmail }).lean();

        if (existingUser || existingTutor || existingAdmin) {
            return res
                .status(400)
                .json({ success: false, message: "This email address is already in use by another account." });
        }

        await OTP.deleteMany({ email: trimmedNewEmail, purpose: "email_change", role: "user" });

        const otpCode = crypto.randomInt(100000, 999999).toString();

        await OTP.create({
            email: trimmedNewEmail,
            otpHash: otpCode,
            role: "user",
            purpose: "email_change",
        });

        try {
            await sendOtpEmail(trimmedNewEmail, otpCode, req.user?.fullName);

            res.status(200).json({
                success: true,
                message: "OTP sent successfully to your new email. It will expire in 5 minutes.",
            });
        } catch (emailError) {
            console.error("Failed to send OTP email:", emailError);
            await OTP.deleteOne({ email: trimmedNewEmail, purpose: "email_change", role: "user" });
            return res.status(500).json({
                success: false,
                message: "Failed to send OTP email. Please ensure the email address is correct and try again.",
            });
        }
    } catch (error) {
        console.error("Error requesting email change:", error);
        if (error.name === "ValidationError") {
            const messages = Object.values(error.errors).map((val) => val.message);
            return res.status(400).json({ success: false, message: messages.join(", ") || "Validation failed." });
        }
        res.status(500).json({ success: false, message: "Server error initiating email change." });
    }
};

export const verifyEmailChangeOtp = async (req, res) => {
    try {
        const userId = req.user?._id;
        const { otpCode, email } = req.body;

        if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(401).json({ success: false, message: "Unauthorized: Valid User ID not found." });
        }

        if (!otpCode || otpCode.length !== 6) {
            return res.status(400).json({ success: false, message: "Please provide a valid 6-digit OTP." });
        }
        const emailValidation = validateEmail(email);
        if (!emailValidation.isValid) {
            return res.status(400).json({ success: false, message: "New email address is required for verification." });
        }

        const otpDoc = await OTP.findOne({
            email,
            purpose: "email_change",
            role: "user",
        });

        if (!otpDoc) {
            return res.status(400).json({ success: false, message: "Invalid or expired OTP. Please request a new one." });
        }

        const isMatch = await otpDoc.compareOtp(otpCode);

        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Incorrect OTP entered." });
        }

        const updatedUser = await User.findByIdAndUpdate(userId, { email }, { new: true, runValidators: true }).lean();

        if (!updatedUser) {
            await OTP.deleteOne({ _id: otpDoc._id });
            return res.status(404).json({ success: false, message: "User account not found during update." });
        }

        await OTP.deleteOne({ _id: otpDoc._id });

        res.status(200).json({
            success: true,
            message: "Email address updated successfully!",
        });
    } catch (error) {
        console.error("Error verifying email change OTP:", error);
        if (error.name === "ValidationError") {
            const messages = Object.values(error.errors).map((val) => val.message);
            return res
                .status(400)
                .json({ success: false, message: messages.join(", ") || "Validation failed during email update." });
        }
        res.status(500).json({ success: false, message: "Server error during OTP verification." });
    }
};

export const resendEmailChangeOtp = async (req, res) => {
    try {
        const userId = req.user?._id;
        const { email } = req.body;

        if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(401).json({ success: false, message: "Unauthorized: Valid User ID not found." });
        }

        const emailValidation = validateEmail(email);
        if (!emailValidation.isValid) {
            return res.status(400).json({ message: "Email not found Please verify your email address" });
        }

        const trimmedNewEmail = emailValidation.email;

        const existingUser = await User.findOne({ email: trimmedNewEmail }).lean();
        const existingTutor = await Tutor.findOne({ email: trimmedNewEmail }).lean();
        const existingAdmin = await Admin.findOne({ email: trimmedNewEmail }).lean();

        if (existingTutor || (existingUser && existingUser._id.toString() !== userId.toString()) || existingAdmin) {
            return res
                .status(400)
                .json({ success: false, message: "This email address is already in use by another account." });
        }

        const RESEND_INTERVAL_MS = 60 * 1000;
        const lastOtp = await OTP.findOne({
            email: trimmedNewEmail,
            purpose: "email_change",
            role: "user",
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

        await OTP.deleteMany({ email: trimmedNewEmail, purpose: "email_change", role: "user" });

        const otpCode = crypto.randomInt(100000, 999999).toString();

        await OTP.create({
            email: trimmedNewEmail,
            otpHash: otpCode,
            role: "user",
            purpose: "email_change",
        });

        try {
            await sendOtpEmail(trimmedNewEmail, otpCode, req.user.fullName);

            res.status(200).json({
                success: true,
                message: "OTP resent successfully to your new email address. It will expire in 5 minutes.",
            });
        } catch (emailError) {
            console.error("Failed to resend OTP email:", emailError);
            await OTP.deleteOne({ email: trimmedNewEmail, purpose: "email_change", role: "user" });
            return res.status(500).json({ success: false, message: "Failed to send OTP email. Please try again later." });
        }
    } catch (error) {
        console.error("Error resending email change OTP:", error);
        res.status(500).json({ success: false, message: "Server error resending OTP." });
    }
};

export const requestPasswordChange = async (req, res) => {
    try {
        const user = req.user;
        const userId = req.user._id;
        const currentEmail = req.user.email;
        const { currentPassword, newPassword } = req.body;

        if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(401).json({ success: false, message: "Unauthorized: Valid User ID not found." });
        }

        const passwordValidation = validatePassword(newPassword);
        if (!passwordValidation.isValid) {
            return res.status(400).json({ message: passwordValidation.message || "Enter a valid new password" });
        }
        const trimmedNewPassword = passwordValidation.password;

        const isCurrentPasswordValid = await user.matchUserPassword(currentPassword);
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
            role: "user",
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

        await OTP.deleteMany({ email: currentEmail, purpose: "password_change", role: "user" });

        const otpCode = crypto.randomInt(100000, 999999).toString();

        await OTP.create({
            email: currentEmail,
            otpHash: otpCode,
            role: "user",
            purpose: "password_change",
        });

        try {
            await sendOtpEmail(currentEmail, otpCode, user.fullName);

            res.status(200).json({
                success: true,
                message: "OTP sent successfully to your email. It will expire in 5 minutes.",
            });
        } catch (emailError) {
            console.error("Failed to send OTP email:", emailError);
            await OTP.deleteOne({ email: currentEmail, purpose: "password_change", role: "user" });
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
        const user = req.user;
        const userId = req.user?._id;
        const userEmail = req.user?.email;
        const { otpCode, newPassword } = req.body;

        if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(401).json({ success: false, message: "Unauthorized: Valid User ID not found." });
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
            email: userEmail,
            purpose: "password_change",
            role: "user",
        });

        if (!otpDoc) {
            return res.status(400).json({ success: false, message: "Invalid or expired OTP. Please request a new one." });
        }

        const isMatch = await otpDoc.compareOtp(otpCode);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Incorrect OTP entered." });
        }

        user.password = trimmedNewPassword;
        await user.save();

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
        const userId = req.user._id;
        const email = req.user.email;

        if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(401).json({ success: false, message: "Unauthorized: Valid User ID not found." });
        }

        const RESEND_INTERVAL_MS = 60 * 1000;
        const lastOtp = await OTP.findOne({
            email,
            purpose: "password_change",
            role: "user",
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

        await OTP.deleteMany({ email, purpose: "password_change", role: "user" });

        const otpCode = crypto.randomInt(100000, 999999).toString();

        await OTP.create({
            email,
            otpHash: otpCode,
            role: "user",
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
            await OTP.deleteOne({ email, purpose: "password_change", role: "user" });
            return res.status(500).json({ success: false, message: "Failed to send OTP. Please try again later." });
        }
    } catch (error) {
        console.error("Error resending password change OTP:", error);
        res.status(500).json({ success: false, message: "Server error resending OTP." });
    }
};
