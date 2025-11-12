import Tutor from "../../models/tutorModel.js";
import OTP from "../../models/otpModel.js";
import User from "../../models/userModel.js";
import Admin from "../../models/adminModel.js";
import { sendOtpEmail } from "../../services/emailService.js";
import crypto from "crypto";
import mongoose from "mongoose";
import multer from "multer";
import cloudinary from "../../config/cloudinary.js";
import {
    isNullOrWhitespace,
    validatePhone,
    validateEmail,
    validatePassword,
} from "../../../../frontend/src/utils/validation.js";

export const getTutorProfile = async (req, res) => {
    try {
        const tutor = req.user;

        if (!tutor) {
            return res.status(404).json({ success: false, message: "Tutor profile not found." });
        }

        res.status(200).json({
            success: true,
            tutor: {
                _id: tutor._id,
                fullName: tutor.fullName,
                email: tutor.email,
                phone: tutor.phone || "",
                profileImage: tutor.profileImage || null,
                headline: tutor.headline || "",
                expertiseArea: tutor.expertiseArea || "",
                bio: tutor.bio || "",
                yearsOfExperience: tutor.yearsOfExperience || "",
                skills: tutor.skills || [],
                languages: tutor.languages || [],
                qualifications: tutor.qualifications || [],
            },
        });
    } catch (error) {
        console.error("Error fetching tutor profile:", error);
        res.status(500).json({ success: false, message: "Server error fetching tutor profile." });
    }
};

export const updateTutorProfile = async (req, res) => {
    try {
        const tutorId = req.user?._id;

        if (!tutorId || !mongoose.Types.ObjectId.isValid(tutorId)) {
            return res.status(401).json({ success: false, message: "Unauthorized: Valid Tutor ID not found in request." });
        }

        const { fullName, phone, headline, expertiseArea, bio, yearsOfExperience, skills, languages, qualifications } =
            req.body;

        const updateData = {};
        const errors = {};

        if (fullName !== undefined) {
            if (isNullOrWhitespace(fullName)) {
                errors.fullName = "Invalid full name format.";
            } else {
                updateData.fullName = fullName.trim();
            }
        }

        if (phone !== undefined) {
            const phoneValidation = validatePhone(phone);
            if (!phoneValidation.isValid) {
                errors.phone = "Invalid phone number format.";
            } else {
                updateData.phone = phone.trim();
            }
        }

        if (headline !== undefined) {
            if (typeof headline !== "string") {
                errors.headline = "Invalid headline format.";
            } else {
                updateData.headline = headline.trim();
            }
        }

        if (expertiseArea !== undefined) {
            if (typeof expertiseArea !== "string") {
                errors.expertiseArea = "Invalid headline format.";
            } else {
                updateData.expertiseArea = expertiseArea.trim();
            }
        }

        if (bio !== undefined) {
            if (typeof bio !== "string") {
                errors.bio = "Invalid bio format.";
            } else {
                updateData.bio = bio.trim();
            }
        }

        if (yearsOfExperience !== undefined) {
            if (typeof yearsOfExperience !== "string") {
                errors.yearsOfExperience = "Invalid yearsOfExperience format.";
            } else {
                updateData.yearsOfExperience = yearsOfExperience.trim();
            }
        }

        if (skills !== undefined) {
            if (!Array.isArray(skills) || !skills.every((s) => typeof s === "string")) {
                errors.skills = "Invalid input: skills must be an array of strings.";
            } else {
                updateData.skills = skills.map((s) => s.trim()).filter(Boolean);
            }
        }

        if (languages !== undefined) {
            if (!Array.isArray(languages) || !languages.every((l) => typeof l === "string")) {
                errors.languages = "Invalid input: languages must be an array of strings.";
            } else {
                updateData.languages = languages.map((l) => l.trim()).filter(Boolean);
            }
        }

        if (qualifications !== undefined) {
            if (!Array.isArray(qualifications) || !qualifications.every((q) => typeof q === "string")) {
                errors.qualifications = "Invalid input: qualifications must be an array of strings.";
            } else {
                updateData.qualifications = qualifications.map((q) => q.trim()).filter(Boolean);
            }
        }

        if (Object.keys(errors).length > 0) {
            return res.status(400).json({ success: false, message: "Validation failed.", errors: errors });
        }

        if (Object.keys(updateData).length === 0) {
            const currentTutor = await Tutor.findById(tutorId).select("-password");
            if (!currentTutor) {
                return res.status(404).json({ success: false, message: "Tutor not found." });
            }
            return res.status(200).json({
                success: true,
                message: "No valid fields provided to update.",
                tutor: {
                    fullName: currentTutor.fullName,
                    phone: currentTutor.phone || "",
                    headline: currentTutor.headline || "",
                    expertiseArea: currentTutor.expertiseArea || "",
                    bio: currentTutor.bio || "",
                    yearsOfExperience: currentTutor.yearsOfExperience || "",
                    skills: currentTutor.skills || [],
                    languages: currentTutor.languages || [],
                    qualifications: currentTutor.qualifications || [],
                },
            });
        }

        const updatedTutor = await Tutor.findByIdAndUpdate(
            tutorId,
            { $set: updateData },
            { new: true, runValidators: true }
        ).select("-password");

        if (!updatedTutor) {
            return res.status(404).json({ success: false, message: "Tutor not found for update." });
        }

        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            tutor: {
                fullName: updatedTutor.fullName,
                phone: updatedTutor.phone || "",
                profileImage: updatedTutor.profileImage,
                headline: updatedTutor.headline || "",
                expertiseArea: updatedTutor.expertiseArea || "",
                bio: updatedTutor.bio || "",
                yearsOfExperience: updatedTutor.yearsOfExperience || "",
                skills: updatedTutor.skills || [],
                languages: updatedTutor.languages || [],
                qualifications: updatedTutor.qualifications || [],
            },
        });
    } catch (error) {
        console.error("Error updating tutor profile:", error);
        res.status(500).json({ success: false, message: "Server error updating profile." });
    }
};

export const updateTutorProfileImage = async (req, res) => {
    try {
        const tutorId = req.user?._id;

        if (!req.file) {
            return res.status(400).json({ success: false, message: "No image file provided." });
        }

        if (!tutorId || !mongoose.Types.ObjectId.isValid(tutorId)) {
            return res.status(401).json({ success: false, message: "Unauthorized: Valid Tutor ID not found." });
        }

        const currentTutor = await Tutor.findById(tutorId).select("profileImage -_id");

        if (currentTutor?.profileImage) {
            try {
                const publicIdMatch = currentTutor.profileImage.match(/\/v\d+\/(?:tutor_profiles\/)?([^\.]+)/);
                if (publicIdMatch && publicIdMatch[1]) {
                    const publicId = currentTutor.profileImage.includes("/tutor_profiles/")
                        ? `tutor_profiles/${publicIdMatch[1]}`
                        : publicIdMatch[1];
                    await cloudinary.uploader.destroy(publicId, { resource_type: "image" });
                    console.log(`Previous image deleted: ${publicId}`);
                }
            } catch (deleteError) {
                console.error("Failed to delete tutor previous image from Cloudinary:", deleteError.message);
            }
        }

        const uploadResult = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: "tutor_profiles",
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

        const updatedTutor = await Tutor.findByIdAndUpdate(tutorId, { profileImage: newImageUrl }, { new: true });

        if (!updatedTutor) {
            return res.status(404).json({ success: false, message: "Tutor not found after image upload." });
        }

        res.status(200).json({
            success: true,
            message: "Profile image updated successfully",
            imageUrl: newImageUrl,
        });
    } catch (error) {
        console.error("Error updating profile image:", error);
        if (error instanceof multer.MulterError) {
            return res.status(400).json({ success: false, message: `File upload error: ${error.message}` });
        }
        if (error.message && error.message.includes("Cloudinary")) {
            return res.status(500).json({ success: false, message: `Cloudinary error: ${error.message}` });
        }
        res.status(500).json({ success: false, message: "Server error updating profile image." });
    }
};


export const requestEmailChange = async (req, res) => {
    try {
        const tutorId = req.user?._id;
        const currentEmail = req.user?.email;
        const { newEmail } = req.body;

        if (!tutorId || !mongoose.Types.ObjectId.isValid(tutorId)) {
            return res.status(401).json({ success: false, message: "Unauthorized: Valid Tutor ID not found." });
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

        const RESEND_INTERVAL_MS = 60 * 1000;
        const lastOtp = await OTP.findOne({
            email: trimmedNewEmail,
            purpose: "email_change",
            role: "tutor",
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

        await OTP.deleteMany({ email: trimmedNewEmail, purpose: "email_change", role: "tutor" });

        const otpCode = crypto.randomInt(100000, 999999).toString();

        await OTP.create({
            email: trimmedNewEmail,
            otpHash: otpCode,
            role: "tutor",
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
            await OTP.deleteOne({ email: trimmedNewEmail, purpose: "email_change", userId: tutorId });
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
        const tutorId = req.user?._id;
        const { otpCode, email } = req.body;

        if (!tutorId || !mongoose.Types.ObjectId.isValid(tutorId)) {
            return res.status(401).json({ success: false, message: "Unauthorized: Valid Tutor ID not found." });
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
            role: "tutor",
        });

        if (!otpDoc) {
            return res.status(400).json({ success: false, message: "Invalid or expired OTP. Please request a new one." });
        }

        const isMatch = await otpDoc.compareOtp(otpCode);

        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Incorrect OTP entered." });
        }

        const updatedTutor = await Tutor.findByIdAndUpdate(tutorId, { email }, { new: true, runValidators: true });

        if (!updatedTutor) {
            await OTP.deleteOne({ _id: otpDoc._id });
            return res.status(404).json({ success: false, message: "Tutor account not found during update." });
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
        const tutorId = req.user?._id;
        const { email } = req.body;

        if (!tutorId || !mongoose.Types.ObjectId.isValid(tutorId)) {
            return res.status(401).json({ success: false, message: "Unauthorized: Valid Tutor ID not found." });
        }

        const emailValidation = validateEmail(email);
        if (!emailValidation.isValid) {
            return res.status(400).json({ message: "Email not found Please verify your email address" });
        }

        const trimmedNewEmail = emailValidation.email;

        const existingUser = await User.findOne({ email: trimmedNewEmail }).lean();
        const existingTutor = await Tutor.findOne({ email: trimmedNewEmail }).lean();
        const existingAdmin = await Admin.findOne({ email: trimmedNewEmail }).lean();

        if (existingUser || (existingTutor && existingTutor._id.toString() !== tutorId.toString()) || existingAdmin) {
            return res
                .status(400)
                .json({ success: false, message: "This email address is already in use by another account." });
        }

        const RESEND_INTERVAL_MS = 60 * 1000;
        const lastOtp = await OTP.findOne({
            email,
            purpose: "email_change",
            role: "tutor",
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

        await OTP.deleteMany({ email: trimmedNewEmail, purpose: "email_change", role: "tutor" });

        const otpCode = crypto.randomInt(100000, 999999).toString();

        await OTP.create({
            email: trimmedNewEmail,
            otpHash: otpCode,
            role: "tutor",
            purpose: "email_change",
        });

        try {
            await sendOtpEmail(trimmedNewEmail, otpCode, req.user.fullName);

            res.status(200).json({
                success: true,
                message: `OTP resent successfully to your new email address. It will expire in 5 minutes.`,
            });
        } catch (emailError) {
            console.error("Failed to resend OTP email:", emailError);
            await OTP.deleteOne({ email: trimmedNewEmail, purpose: "email_change", role: "tutor" });
            return res.status(500).json({ success: false, message: "Failed to send OTP email. Please try again later." });
        }
    } catch (error) {
        console.error("Error resending email change OTP:", error);
        res.status(500).json({ success: false, message: "Server error resending OTP." });
    }
};

export const requestPasswordChange = async (req, res) => {
    try {
        const tutor = req.user;
        const tutorId = req.user._id;
        const currentEmail = req.user.email;
        const { currentPassword, newPassword } = req.body;

        if (!tutorId || !mongoose.Types.ObjectId.isValid(tutorId)) {
            return res.status(401).json({ success: false, message: "Unauthorized: Valid Tutor ID not found." });
        }

        const passwordValidation = validatePassword(newPassword);
        if (!passwordValidation.isValid) {
            return res.status(400).json({ message: passwordValidation.message || "Enter a valid new password" });
        }
        const trimmedNewPassword = passwordValidation.password;

        const isCurrentPasswordValid = await tutor.matchTutorPassword(currentPassword);
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
            role: "tutor",
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

        await OTP.deleteMany({ email: currentEmail, purpose: "password_change", role: "tutor" });

        const otpCode = crypto.randomInt(100000, 999999).toString();

        await OTP.create({
            email: currentEmail,
            otpHash: otpCode,
            role: "tutor",
            purpose: "password_change",
        });

        try {
            await sendOtpEmail(currentEmail, otpCode, tutor.fullName);

            res.status(200).json({
                success: true,
                message: "OTP sent successfully to your email. It will expire in 5 minutes.",
            });
        } catch (emailError) {
            console.error("Failed to send OTP email:", emailError);
            await OTP.deleteOne({ email: currentEmail, purpose: "password_change", role: "tutor" });
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
        const tutor = req.user;
        const tutorId = req.user?._id;
        const tutorEmail = req.user?.email;
        const { otpCode, newPassword } = req.body;

        if (!tutorId || !mongoose.Types.ObjectId.isValid(tutorId)) {
            return res.status(401).json({ success: false, message: "Unauthorized: Valid Tutor ID not found." });
        }

        if (!otpCode || otpCode.length !== 6) {
            return res.status(400).json({ success: false, message: "Please provide a valid 6-digit OTP." });
        }

        const passwordValidation = validatePassword(newPassword);
        if (!passwordValidation.isValid) {
            return res.status(400).json({ success: false, message: passwordValidation.message });
        }
        const trimmedNewPassword = passwordValidation.password;

        const otpDoc = await OTP.findOne({
            email: tutorEmail,
            purpose: "password_change",
            role: "tutor",
        });

        if (!otpDoc) {
            return res.status(400).json({ success: false, message: "Invalid or expired OTP. Please request a new one." });
        }

        const isMatch = await otpDoc.compareOtp(otpCode);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Incorrect OTP entered." });
        }

        tutor.password = trimmedNewPassword;
        await tutor.save();

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
        const tutorId = req.user._id;
        const email = req.user.email;

        if (!tutorId || !mongoose.Types.ObjectId.isValid(tutorId)) {
            return res.status(401).json({ success: false, message: "Unauthorized: Valid Tutor ID not found." });
        }

        const RESEND_INTERVAL_MS = 60 * 1000;
        const lastOtp = await OTP.findOne({
            email,
            purpose: "password_change",
            role: "tutor",
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

        await OTP.deleteMany({ email, purpose: "password_change", role: "tutor" });

        const otpCode = crypto.randomInt(100000, 999999).toString();

        await OTP.create({
            email,
            otpHash: otpCode,
            role: "tutor",
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
            await OTP.deleteOne({ email, purpose: "password_change", role: "tutor" });
            return res.status(500).json({ success: false, message: "Failed to send OTP email. Please try again later." });
        }
    } catch (error) {
        console.error("Error resending password change OTP:", error);
        res.status(500).json({ success: false, message: "Server error resending OTP." });
    }
};