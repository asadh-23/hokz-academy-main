import Tutor from "../models/tutorModel.js";
import OTP from "../models/otpModel.js";
import { sendOtpEmail, sendPasswordResetEmail } from "../services/emailService.js";
import { setAuthTokens } from "../utils/responseHandler.js";
import crypto from "crypto";
import mongoose from "mongoose";
import multer from "multer";
import cloudinary from "../config/cloudinary.js";
import User from "../models/userModel.js";
import Admin from "../models/adminModel.js";
import {
    isNullOrWhitespace,
    validatePhone,
    validateEmail,
    validatePassword,
} from "../../../frontend/src/utils/validation.js";

export const registerTutor = async (req, res) => {
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

        const tutor = await Tutor.findOne({ email });
        if (tutor && tutor.isVerified) {
            return res.status(400).json({ message: "Tutor already registered" });
        }

        await OTP.deleteMany({ email, purpose: "registration", role: "tutor" });

        const otpCode = crypto.randomInt(100000, 999999).toString();

        await OTP.create({
            email: email,
            otpHash: otpCode,
            role: "tutor",
            purpose: "registration",
        });

        if (!tutor) {
            await Tutor.create({
                fullName,
                phone,
                email,
                password,
            });
        }

        await sendOtpEmail(email, otpCode, fullName);

        return res.status(200).json({
            success: true,
            message: "OTP sent successfully to your email. Please verify to complete registration.",
        });
    } catch (error) {
        console.log("Tutor registration failed", error);
        res.status(500).json({ message: "Tutor registration failed" });
    }
};

export const verifyOtp = async (req, res) => {
    try {
        const { email, otpCode } = req.body;

        const tutor = await Tutor.findOne({ email });
        if (!tutor) return res.status(400).json({ message: "User not found" });

        const otpDoc = await OTP.findOne({ email, role: "tutor", purpose: "registration" });
        if (!otpDoc) return res.status(400).json({ message: "Invalid or expired OTP" });

        const isMatch = await otpDoc.compareOtp(otpCode);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Incorrect OTP entered." });
        }

        const accessToken = setAuthTokens(res, tutor);

        tutor.isVerified = true;
        const savedTutor = await tutor.save();

        await OTP.deleteOne({ _id: otpDoc._id });

        return res.status(200).json({
            success: true,
            message: "Email verified successfully",
            accessToken,
            user: {
                role: "tutor",
                _id: savedTutor._id,
                name: savedTutor.fullName,
                email: savedTutor.email,
                profileImage: savedTutor.profileImage,
                phone: savedTutor.phone,
                isVerified: true,
            },
        });
    } catch (error) {
        console.error("OTP verification error:", error);
        return res.status(500).json({ message: "OTP verification failed" });
    }
};

export const resendOtp = async (req, res) => {
    try {
        const { email } = req.body;
        const tutor = await Tutor.findOne({ email });
        if (!tutor) return res.status(400).json({ message: "Cannot resend otp to this email" });

        await OTP.deleteMany({ email, purpose: "registration", role: "tutor" });

        const otpCode = crypto.randomInt(100000, 999999).toString();

        await OTP.create({
            email,
            otpHash: otpCode,
            role: "tutor",
            purpose: "registration",
        });

        await sendOtpEmail(email, otpCode, tutor.fullName);

        return res.status(200).json({
            success: true,
            message: "A new OTP has been sent to your email.",
        });
    } catch (error) {
        console.error("❌ Resend OTP error:", error);
        return res.status(500).json({ message: "Server error during OTP resend." });
    }
};

export const loginTutor = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) return res.status(400).json({ message: "All fields are required." });

        const tutor = await Tutor.findOne({ email });
        if (!tutor) return res.status(400).json({ message: "Invalid email or password." });

        if (!tutor.isVerified) return res.status(400).json({ message: "Please verify your email first." });

        if (tutor.isBlocked)
            return res
                .status(400)
                .json({ message: "Your account has been blocked by the administrator. Please contact support." });

        const isPasswordValid = await tutor.matchTutorPassword(password);
        if (!isPasswordValid) return res.status(400).json({ message: "Invalid email or password." });

        const accessToken = setAuthTokens(res, tutor);
        tutor.lastLogin = new Date();
        const savedTutor = await tutor.save();

        return res.status(200).json({
            success: true,
            message: "Login successful",
            accessToken,
            user: {
                role: "tutor",
                _id: savedTutor._id,
                name: savedTutor.fullName,
                email: savedTutor.email,
                profileImage: savedTutor.profileImage,
                phone: savedTutor.phone,
                isVerified: true,
            },
        });
    } catch (error) {
        console.log("Tutor Login failed");
        return res.status(500).json({ message: "Tutor login failed" });
    }
};

export const googleAuth = async (req, res) => {
    try {
        const { name, email, googleId, profileImage } = req.body;

        if (!email || !googleId) return res.status(400).json({ message: "Invalid Google data" });

        let tutor = (await Tutor.findOne({ googleId })) || (await Tutor.findOne({ email }));

        if (tutor && tutor.isBlocked) {
            return res.status(403).json({
                message: "Your account has been blocked by the administrator. Please contact support.",
            });
        }

        if (!tutor) {
            tutor = await Tutor.create({
                fullName: name,
                email,
                profileImage,
                googleId,
                isVerified: true,
            });
        } else {
            if (!tutor.googleId) {
                tutor.googleId = googleId;
                tutor.profileImage = profileImage;
                tutor.isVerified = true;
                tutor.lastLogin = new Date();
            }
        }
        const accessToken = setAuthTokens(res, tutor);

        const savedTutor = await tutor.save();

        return res.status(200).json({
            success: true,
            message: "Google login successful",
            accessToken,
            user: {
                role: "tutor",
                _id: savedTutor._id,
                name: savedTutor.fullName,
                email: savedTutor.email,
                profileImage: savedTutor.profileImage,
                phone: savedTutor.phone,
                isVerified: true,
            },
        });
    } catch (error) {
        console.log("Tutor google Login failed");
        return res.status(500).json({ message: "Google login failed" });
    }
};

export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ message: "Please provide a valid email address" });

        const tutor = await Tutor.findOne({ email });
        if (!tutor) return res.status(400).json({ message: "Tutor with this email not found" });

        if (tutor.isBlocked)
            return res
                .status(400)
                .json({ message: "Your account has been blocked by the administrator. Please contact support." });

        const passwordResetToken = crypto.randomBytes(32).toString("hex");
        const hashedPasswordResetToken = crypto.createHash("sha256").update(passwordResetToken).digest("hex");

        tutor.passwordResetToken = hashedPasswordResetToken;
        tutor.passwordResetExpiry = Date.now() + 10 * 60 * 1000;
        await tutor.save();

        await sendPasswordResetEmail(tutor.email, passwordResetToken, "tutor");

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

        const tutor = await Tutor.findOne({
            passwordResetToken: hashedPasswordResetToken,
            passwordResetExpiry: { $gt: Date.now() },
        });
        if (!tutor) return res.status(400).json({ message: "Token is invalid or Expired" });

        tutor.password = password;
        tutor.passwordResetToken = undefined;
        tutor.passwordResetExpiry = undefined;
        await tutor.save();

        return res.status(200).json({
            success: true,
            message: "Password reset successful",
        });
    } catch (error) {
        console.log("Reset password error", error);
        return res.status(500).json({ message: "Tutor reset password error" });
    }
};

// PRIVATE

export const getTutorProfile = async (req, res) => {
    try {
        // ✅ 1. Middleware attached tutor data is in req.user
        const tutor = req.user;

        // Safety check
        if (!tutor) {
            return res.status(404).json({ success: false, message: "Tutor profile not found." });
        }

        // ✅ 2. Construct the response object with ALL required fields
        res.status(200).json({
            success: true,
            tutor: {
                _id: tutor._id,
                fullName: tutor.fullName,
                email: tutor.email, // Keep email (frontend might use it for modals, NOT display)
                phone: tutor.phone || "", // Keep phone (frontend might use it, NOT display)

                // --- Profile Fields ---
                profileImage: tutor.profileImage || null, // Send null if empty, let frontend handle placeholder
                headline: tutor.headline || "",
                expertiseArea: tutor.expertiseArea || "", // Use expertiseArea instead of stack
                bio: tutor.bio || "",
                yearsOfExperience: tutor.yearsOfExperience || "",
                skills: tutor.skills || [], // Default to empty array
                languages: tutor.languages || [], // Default to empty array
                qualifications: tutor.qualifications || [], // Default to empty array

                // --- Meta Fields ---
                isVerified: tutor.isVerified, // Good to send verification status
                role: tutor.role,
            },
        });
    } catch (error) {
        console.error("Error fetching tutor profile:", error);
        res.status(500).json({ success: false, message: "Server error fetching profile." });
    }
};

export const updateTutorProfile = async (req, res) => {
    try {
        const tutorId = req.user?._id;

        if (!tutorId || !mongoose.Types.ObjectId.isValid(tutorId)) {
            console.log("hei");

            return res.status(401).json({ success: false, message: "Unauthorized: Valid Tutor ID not found in request." });
        }
        console.log(2);

        const { fullName, phone, headline, expertiseArea, bio, yearsOfExperience, skills, languages, qualifications } =
            req.body;

        const updateData = {};

        if (fullName !== undefined) {
            if (typeof fullName !== "string")
                return res.status(400).json({ success: false, message: "Invalid input: fullName must be a string." });
            updateData.fullName = fullName.trim();
        }
        if (phone !== undefined) {
            if (typeof phone !== "string")
                return res.status(400).json({ success: false, message: "Invalid input: phone must be a string." });
            updateData.phone = phone.trim();
        }
        if (headline !== undefined) {
            if (typeof headline !== "string")
                return res.status(400).json({ success: false, message: "Invalid input: headline must be a string." });
            updateData.headline = headline.trim();
        }
        if (expertiseArea !== undefined) {
            if (typeof expertiseArea !== "string")
                return res.status(400).json({ success: false, message: "Invalid input: expertiseArea must be a string." });
            updateData.expertiseArea = expertiseArea.trim();
        }
        if (bio !== undefined) {
            if (typeof bio !== "string")
                return res.status(400).json({ success: false, message: "Invalid input: bio must be a string." });
            updateData.bio = bio.trim();
        }
        if (yearsOfExperience !== undefined) {
            if (typeof yearsOfExperience !== "string" && typeof yearsOfExperience !== "number") {
                return res
                    .status(400)
                    .json({ success: false, message: "Invalid input: yearsOfExperience must be a string or number." });
            }
            updateData.yearsOfExperience = String(yearsOfExperience).trim();
        }
        if (skills !== undefined) {
            if (!Array.isArray(skills) || !skills.every((s) => typeof s === "string")) {
                return res
                    .status(400)
                    .json({ success: false, message: "Invalid input: skills must be an array of strings." });
            }
            updateData.skills = skills.map((s) => s.trim()).filter(Boolean);
        }
        if (languages !== undefined) {
            if (!Array.isArray(languages) || !languages.every((l) => typeof l === "string")) {
                return res
                    .status(400)
                    .json({ success: false, message: "Invalid input: languages must be an array of strings." });
            }
            updateData.languages = languages.map((l) => l.trim()).filter(Boolean);
        }
        if (qualifications !== undefined) {
            if (!Array.isArray(qualifications) || !qualifications.every((q) => typeof q === "string")) {
                return res
                    .status(400)
                    .json({ success: false, message: "Invalid input: qualifications must be an array of strings." });
            }
            updateData.qualifications = qualifications.map((q) => q.trim()).filter(Boolean);
        }

        if (Object.keys(updateData).length === 0) {
            const currentTutor = await Tutor.findById(tutorId).select("-password -refreshToken");
            if (!currentTutor) {
                return res.status(404).json({ success: false, message: "Tutor not found." });
            }
            return res.status(200).json({
                success: true,
                message: "No changes provided.",
                tutor: {
                    _id: currentTutor._id,
                    fullName: currentTutor.fullName,
                    email: currentTutor.email,
                    phone: currentTutor.phone || "",
                    profileImage: currentTutor.profileImage,
                    headline: currentTutor.headline || "",
                    expertiseArea: currentTutor.expertiseArea || "",
                    bio: currentTutor.bio || "",
                    yearsOfExperience: currentTutor.yearsOfExperience || "",
                    skills: currentTutor.skills || [],
                    languages: currentTutor.languages || [],
                    qualifications: currentTutor.qualifications || [],
                    isVerified: currentTutor.isVerified,
                    role: currentTutor.role,
                },
            });
        }

        const updatedTutor = await Tutor.findByIdAndUpdate(
            tutorId,
            { $set: updateData },
            { new: true, runValidators: true, context: "query" }
        ).select("-password -refreshToken");

        if (!updatedTutor) {
            return res.status(404).json({ success: false, message: "Tutor not found for update." });
        }

        res.status(200).json({
            success: true,
            message: "Profile updated successfully!",
            tutor: {
                _id: updatedTutor._id,
                fullName: updatedTutor.fullName,
                email: updatedTutor.email,
                phone: updatedTutor.phone || "",
                profileImage: updatedTutor.profileImage,
                headline: updatedTutor.headline || "",
                expertiseArea: updatedTutor.expertiseArea || "",
                bio: updatedTutor.bio || "",
                yearsOfExperience: updatedTutor.yearsOfExperience || "",
                skills: updatedTutor.skills || [],
                languages: updatedTutor.languages || [],
                qualifications: updatedTutor.qualifications || [],
                isVerified: updatedTutor.isVerified,
                role: updatedTutor.role,
            },
        });
    } catch (error) {
        console.error("Error updating tutor profile:", error);
        if (error.name === "ValidationError") {
            const messages = Object.values(error.errors).map((val) => val.message);
            return res.status(400).json({ success: false, message: messages.join(", ") || "Validation failed." });
        }
        if (error.name === "CastError") {
            return res.status(400).json({ success: false, message: `Invalid data format for field: ${error.path}` });
        }
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

        const currentTutor = await Tutor.findById(tutorId).select("profileImage");
        if (currentTutor?.profileImage) {
            try {
                const publicIdMatch = currentTutor.profileImage.match(/\/v\d+\/(?:tutor_profiles\/)?([^\.]+)/); // Adjusted regex to optionally include folder
                if (publicIdMatch && publicIdMatch[1]) {
                    // Include folder in public_id if it exists
                    const publicId = currentTutor.profileImage.includes("/tutor_profiles/")
                        ? `tutor_profiles/${publicIdMatch[1]}`
                        : publicIdMatch[1];
                    await cloudinary.uploader.destroy(publicId, { resource_type: "image" });
                    console.log(`Previous image deleted: ${publicId}`);
                }
            } catch (deleteError) {
                console.error("Failed to delete previous image from Cloudinary:", deleteError.message);
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

        const updatedTutor = await Tutor.findByIdAndUpdate(tutorId, { profileImage: newImageUrl }, { new: true }).select(
            "profileImage"
        );

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

        if (!newEmail) {
            return res.status(400).json({ success: false, message: "New email address is required." });
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
console.log(1);

        const isCurrentPasswordValid = await tutor.matchTutorPassword(currentPassword);
        if (!isCurrentPasswordValid) {
            return res.status(400).json({ message: "Invalid current password. Please try again" });
        }
        console.log(2);
        

        if (currentPassword === trimmedNewPassword) {
            return res.status(400).json({ message: "New password must be different from the current password" });
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
        console.log("1111111111111111111");

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

        // ✅ 3. Find the correct OTP document
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
