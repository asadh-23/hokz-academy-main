import User from "../../models/user/User.js";
import OTP from "../../models/common/Otp.js";
import Tutor from "../../models/user/Tutor.js";
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
        user.passwordResetExpiry = Date.now() + 10 * 60 * 1000;
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