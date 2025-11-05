import User from "../models/userModel.js";
import OTP from "../models/otpModel.js";
import { sendOtpEmail, sendPasswordResetEmail } from "../services/emailService.js";
import { setAuthTokens } from "../utils/responseHandler.js";
import crypto from "crypto";
import {
    isNullOrWhitespace,
    validatePhone,
    validateEmail,
    validatePassword,
} from "../../../frontend/src/utils/validation.js";
import mongoose from "mongoose";
import cloudinary from "../config/cloudinary.js";
import multer from "multer";
import Tutor from "../models/tutorModel.js";
import Admin from "../models/adminModel.js";

export const registerUser = async (req, res) => {
    try {
        const { fullName, phone, email, password } = req.body;

        if (isNullOrWhitespace(fullName)) {
            return res.status(400).json({ message: "Full Name is required" });
        }

        const phoneValidation = validatePhone(phone);
        if (!phoneValidation.isValid) {
            return res.status(400).json({ message: phoneValidation.message || "Enter a valid phone number" });
        }

        const emailValidation = validateEmail(email);
        if (!emailValidation.isValid) {
            return res.status(400).json({ message: emailValidation.message || "Enter a valid email address" });
        }

        const passwordValidation = validatePassword(password);
        if (!passwordValidation.isValid) {
            return res.status(400).json({ message: passwordValidation.message || "Enter a valid password" });
        }
        const trimmedEmail = emailValidation.email;

        const existingUser = await User.findOne({ email: trimmedEmail }).lean();
        const existingTutor = await Tutor.findOne({ email: trimmedEmail }).lean();
        const existingAdmin = await Admin.findOne({ email: trimmedEmail }).lean();

        if ((existingUser && existingUser.isVerified) || existingTutor || existingAdmin) {
            return res
                .status(400)
                .json({ success: false, message: "This email address is already in use by another account." });
        }

        const RESEND_INTERVAL_MS = 60 * 1000;
        const lastOtp = await OTP.findOne({
            email: trimmedEmail,
            purpose: "registration",
            role: "user",
        }).sort({ createdAt: -1 }); // Get the most recent one

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

        await OTP.deleteMany({ email: trimmedEmail, purpose: "registration", role: "user" });

        const otpCode = crypto.randomInt(100000, 999999).toString();

        await OTP.create({
            email: trimmedEmail,
            otpHash: otpCode,
            role: "user",
            purpose: "registration",
        });

        if (!existingUser) {
            await User.create({
                fullName,
                phone,
                email: trimmedEmail,
                password,
            });
        }

        await sendOtpEmail(trimmedEmail, otpCode, fullName);

        return res.status(200).json({
            success: true,
            message: "OTP sent successfully to your email. Please verify to complete registration.",
        });
    } catch (error) {
        console.error("❌User Registration error:", error);
        res.status(500).json({ message: "Registration failed" });
    }
};

export const verifyOtp = async (req, res) => {
    try {
        const { email, otpCode } = req.body;

        const otpDoc = await OTP.findOne({ email, role: "user", purpose: "registration" });
        if (!otpDoc) return res.status(400).json({ message: "Invalid or expired OTP" });

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "User not found" });

        const isMatch = await otpDoc.compareOtp(otpCode);

        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Incorrect OTP entered." });
        }

        const accessToken = setAuthTokens(res, user);

        user.isVerified = true;
        const savedUser = await user.save();

        await OTP.deleteOne({ _id: otpDoc._id });

        return res.status(200).json({
            success: true,
            message: "Email verified successfully",
            accessToken,
            user: {
                role: savedUser.role,
                _id: savedUser._id,
                fullName: savedUser.fullName,
                email: savedUser.email,
                profileImage: savedUser.profileImage,
                phone: savedUser.phone,
                isVerified: true,
            },
        });
    } catch (error) {
        console.error("❌ OTP verification error:", error);
        res.status(500).json({ message: "OTP verification error" });
    }
};

export const resendOtp = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Cannot resend OTP to this email" });

        const RESEND_INTERVAL_MS = 60 * 1000;
        const lastOtp = await OTP.findOne({
            email: email,
            purpose: "registration",
            role: "user",
        }).sort({ createdAt: -1 }); // Get the most recent one

        if (lastOtp) {
            const timeElapsed = Date.now() - lastOtp.createdAt.getTime();
            if (timeElapsed < RESEND_INTERVAL_MS) {
                const timeLeft = Math.ceil((RESEND_INTERVAL_MS - timeElapsed) / 1000);
                // 429 = Too Many Requests. This stops spamming.
                return res.status(429).json({
                    success: false,
                    message: `Please wait ${timeLeft} more seconds before resending.`,
                });
            }
        }

        await OTP.deleteMany({ email, purpose: "registration", role: user.role });

        const otpCode = crypto.randomInt(100000, 999999).toString();

        await OTP.create({
            email,
            otpHash: otpCode,
            role: "user",
            purpose: "registration",
        });

        await sendOtpEmail(email, otpCode, user.fullName);

        res.status(200).json({
            success: true,
            message: "A new OTP has been sent to your email.",
        });
    } catch (error) {
        console.error("❌ Resend OTP error:", error);
        res.status(500).json({ message: "Server error during OTP resend." });
    }
};

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        if (!user.isVerified) {
            return res.status(400).json({ message: "Please verify your email first" });
        }

        if (user.isBlocked) {
            return res
                .status(403)
                .json({ message: "Your account has been blocked by the administrator. Please contact support." });
        }

        const isPasswordValid = await user.matchUserPassword(password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const accessToken = setAuthTokens(res, user);
        user.lastLogin = new Date();
        const savedUser = await user.save();

        res.status(200).json({
            success: true,
            message: "Login successful",
            accessToken,
            user: {
                role: savedUser.role,
                _id: savedUser._id,
                fullName: savedUser.fullName,
                email: savedUser.email,
                phone: savedUser.phone,
                profileImage: savedUser.profileImage,
                isVerified: true,
            },
        });
    } catch (error) {
        console.error("❌ User login error:", error);
        res.status(500).json({ message: "Login failed" });
    }
};

export const googleAuth = async (req, res) => {
    try {
        const { name, email, googleId, profileImage } = req.body;
        if (!email || !googleId) {
            return res.status(400).json({
                message: "Invalid Google data",
            });
        }

        let user = (await User.findOne({ googleId })) || (await User.findOne({ email }));

        if (user && user.isBlocked) {
            return res
                .status(403)
                .json({ message: "Your account has been blocked by the administrator. Please contact support." });
        }

        if (!user) {
            user = await User.create({
                fullName: name,
                email,
                googleId,
                profileImage,
                isVerified: true,
            });
        } else {
            if (!user.googleId) {
                user.googleId = googleId;
                user.profileImage = profileImage;
                user.isVerified = true;
                user.lastLogin = new Date();
            }
        }

        const accessToken = setAuthTokens(res, user);

        const savedUser = await user.save();

        return res.status(200).json({
            success: true,
            message: "Google login successful",
            accessToken,
            user: {
                role: "user",
                _id: savedUser._id,
                fullName: savedUser.fullName,
                email: savedUser.email,
                phone: savedUser.phone,
                profileImage: savedUser.profileImage,
                isVerified: true,
            },
        });
    } catch (error) {
        console.log("Google auth error : ", error);
        return res.status(500).json({ message: "Google login failed" });
    }
};

export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ message: "Please provide a valid email address" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User with this email not found" });
        }

        if (user.isBlocked) {
            return res
                .status(403)
                .json({ message: "Your account has been blocked by the administrator. Please contact support." });
        }

        const passwordResetToken = crypto.randomBytes(32).toString("hex");
        const hashedPasswordResetToken = crypto.createHash("sha256").update(passwordResetToken).digest("hex");

        user.passwordResetToken = hashedPasswordResetToken;
        user.passwordResetExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes
        await user.save();

        await sendPasswordResetEmail(user.email, passwordResetToken, "user");

        return res.status(200).json({
            success: true,
            message: "Check your email for the password reset link",
        });
    } catch (error) {
        console.log("forgot password error", error);
        return res
            .status(500)
            .json({ message: "Something went wrong while sending the reset email. Please try again later." });
    }
};

export const resetPassword = async (req, res) => {
    try {
        const { password } = req.body;
        const passwordResetToken = req.params.token;

        const hashedPasswordResetToken = crypto.createHash("sha256").update(passwordResetToken).digest("hex");

        const user = await User.findOne({
            passwordResetToken: hashedPasswordResetToken,
            passwordResetExpiry: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({ message: "Token is invalid or Expired" });
        }
        user.password = password;
        user.passwordResetToken = undefined;
        user.passwordResetExpiry = undefined;
        await user.save();

        return res.status(200).json({
            success: true,
            message: "Password reset successful",
        });
    } catch (error) {
        console.log("Reset password error ", error);
        return res.status(500).json({ message: "Failed to send password rest email" });
    }
};

// PRIVATE CONTROLLER

export const updateUserProfileImage = async (req, res) => {
    try {
        const userId = req.user?._id;

        if (!req.file) return res.status(400).json({ message: "No image file provided" });

        if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(401).json({ message: "Unauthorized : Valid user ID not found" });
        }

        const currentUser = await User.findById(userId).select("profileImage -_id");
        if (currentUser?.profileImage) {
            try {
                const publicIdMatch = currentUser.profileImage.match(/\/v\d+\/(?:user_profiles\/)?([^\.]+)/);
                if (publicIdMatch && publicIdMatch[1]) {
                    const publicId = currentUser.profileImage.includes("/user_profiles/")
                        ? `user_profiles/${publicIdMatch[1]}`
                        : publicIdMatch[1];
                    await cloudinary.uploader.destroy(publicId, { resource_type: "image" });
                    console.log(`Previous image deleted: ${publicId}`);
                }
            } catch (deleteError) {
                console.error("Failed to delete user previous image from Cloudinary:", deleteError.message);
            }
        }

        const uploadResult = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: "user_profiles",
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

        const updatedUser = await User.findByIdAndUpdate(userId, { profileImage: newImageUrl }, { new: true });

        if (!updatedUser) {
            return res.status(404).json({ success: false, message: "User not found after image upload." });
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

        // 3. Send success response
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
        }).sort({ createdAt: -1 }); // Get the most recent one

        if (lastOtp) {
            const timeElapsed = Date.now() - lastOtp.createdAt.getTime();
            if (timeElapsed < RESEND_INTERVAL_MS) {
                const timeLeft = Math.ceil((RESEND_INTERVAL_MS - timeElapsed) / 1000);
                // 429 = Too Many Requests. This stops spamming.
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
            currentEmail,
            purpose: "password_change",
            role: "user",
        }).sort({ createdAt: -1 }); // Get the most recent one

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

        // ✅ 7. Delete the used OTP
        await OTP.deleteOne({ _id: otpDoc._id });

        // ✅ 8. Send success response
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
        }).sort({ createdAt: -1 }); // Get the most recent one

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
