import Tutor from "../../models/user/Tutor.js";
import OTP from "../../models/common/Otp.js";
import User from "../../models/user/User.js";
import Admin from "../../models/user/Admin.js";
import { sendOtpEmail, sendPasswordResetEmail } from "../../services/emailService.js";
import { setAuthTokens } from "../../utils/responseHandler.js";
import crypto from "crypto";
import {
    isNullOrWhitespace,
    validatePhone,
    validateEmail,
    validatePassword,
} from "../../../../frontend/src/utils/validation.js";

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

        const trimmedEmail = emailValidation.email;

        const existingUser = await User.findOne({ email: trimmedEmail }).lean();
        const existingTutor = await Tutor.findOne({ email: trimmedEmail }).lean();
        const existingAdmin = await Admin.findOne({ email: trimmedEmail }).lean();

        if ((existingTutor && existingTutor.isVerified) || existingUser || existingAdmin) {
            return res
                .status(400)
                .json({ success: false, message: "This email address is already in use by another account." });
        }

        const RESEND_INTERVAL_MS = 60 * 1000;
        const lastOtp = await OTP.findOne({
            email: trimmedEmail,
            purpose: "registration",
            role: "tutor"
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

        await OTP.deleteMany({ email: trimmedEmail, purpose: "registration", role: "tutor" });

        const otpCode = crypto.randomInt(100000, 999999).toString();

        await OTP.create({
            email: trimmedEmail,
            otpHash: otpCode,
            role: "tutor",
            purpose: "registration",
        });

        if (!existingTutor) {
            await Tutor.create({
                fullName,
                email: trimmedEmail,
                phone,
                password,
            });
        }

        await sendOtpEmail(trimmedEmail, otpCode, fullName);

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
                fullName: savedTutor.fullName,
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

        const RESEND_INTERVAL_MS = 60 * 1000;
        const lastOtp = await OTP.findOne({
            email,
            purpose: "registration",
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
                fullName: savedTutor.fullName,
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