import React, { useState, useEffect } from "react";
import { ButtonLoader } from "../common/LoadingSpinner";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { validatePassword } from "../../utils/validation";
import { useDispatch, useSelector } from "react-redux";
// Redux thunks and selectors
import {
    requestPasswordChange,
    selectRequestPasswordChangeLoading,
} from "../../store/features/auth/passwordSlice";


const ChangePasswordModal = ({ isOpen, onClose, role }) => {
    const [formData, setFormData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });
    const [errors, setErrors] = useState({});

    const navigate = useNavigate();
    const dispatch = useDispatch();

    // Redux selectors
    const isLoading = useSelector(selectRequestPasswordChangeLoading);

    useEffect(() => {
        if (isOpen) {
            const originalStyle = window.getComputedStyle(document.body).overflow;

            document.body.style.overflow = "hidden";

            const handleEscape = (event) => {
                if (event.key === "Escape") {
                    handleClose();
                }
            };

            document.addEventListener("keydown", handleEscape);

            return () => {
                document.body.style.overflow = originalStyle;
                document.removeEventListener("keydown", handleEscape);
            };
        }
    }, [isOpen]);

    const handleInputChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: "" }));
        }
    };

    const handleSendOTP = async () => {
        setErrors({});

        const passwordValidation = validatePassword(formData.newPassword);
        if (!passwordValidation.isValid) {
            return setErrors({ newPassword: passwordValidation.message || "Enter a valid new password" });
        }
        const trimmedNewPassword = passwordValidation.password;
        const trimmedCurrentPassword = formData.currentPassword.trim();

        if (formData.newPassword !== formData.confirmPassword) {
            return setErrors({ confirmPassword: "Passwords do not match" });
        }

        if (trimmedCurrentPassword === trimmedNewPassword) {
            return setErrors({ newPassword: "New password must be different from the current password." });
        }

        try {
         
          
            const result = await dispatch(
                requestPasswordChange({
                    currentPassword: trimmedCurrentPassword,
                    newPassword: trimmedNewPassword,
                    role,
                })
            ).unwrap();

            toast.success(result.message || "OTP sent to your email. Please check your inbox.");
            onClose();
            navigate(`/${role}/verify-password-change`, {
                state: { role, newPassword: trimmedNewPassword },
                replace: true,
            });
        } catch (error) {
            console.error("Password change request failed:", error);
            setErrors({ general: error || "Failed to send OTP. Please try again." });
        }
    };

    const handleClose = () => {
        setFormData({ currentPassword: "", newPassword: "", confirmPassword: "" });
        setErrors({});
        onClose();
    };

    if (!isOpen) return null;

    const isFormValid =
        formData.currentPassword.trim().length > 0 &&
        formData.newPassword.length >= 8 &&
        formData.confirmPassword.length >= 8 &&
        formData.newPassword === formData.confirmPassword;

    return (
        <div
            className="fixed inset-0 backdrop-blur-sm bg-gradient-to-br from-white/30 to-gray-100/30 flex items-center justify-center z-50 p-4"
            onClick={handleClose}
        >
            <div
                className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 max-w-md w-full mx-4 transform transition-all animate-in fade-in-0 zoom-in-95 duration-300 relative"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Loading Overlay */}
                {isLoading && (
                    <div className="absolute inset-0 bg-white/70 backdrop-blur-sm rounded-2xl flex items-center justify-center z-10">
                        <div className="bg-white rounded-lg p-4 shadow-lg border border-gray-200">
                            <div className="flex items-center gap-3">
                                <ButtonLoader />
                                <span className="text-gray-700 font-medium">Processing...</span>
                            </div>
                        </div>
                    </div>
                )}
                {/* Modal Header */}
                <div className="bg-gradient-to-r from-cyan-400 to-emerald-500 text-white rounded-t-2xl relative flex items-center justify-center p-6">
                    <h2 className="text-xl font-semibold text-center flex-1">Change Password</h2>

                    <button
                        onClick={handleClose}
                        className="absolute right-6 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center text-xl font-bold text-gray-700 bg-white bg-opacity-90 rounded-full hover:bg-opacity-100 transition"
                    >
                        ×
                    </button>
                </div>

                {/* Modal Content */}
                <div className="p-6">
                    {/* Current Password */}
                    <div className="mb-6">
                        <label htmlFor="currentPassword" className="block text-lg font-semibold text-gray-800 mb-3">
                            Current Password
                        </label>
                        <input
                            id="currentPassword"
                            type="password"
                            value={formData.currentPassword}
                            onChange={(e) => handleInputChange("currentPassword", e.target.value)}
                            placeholder="Enter your current password"
                            className={`w-full py-3 px-4 border-2 rounded-xl outline-none transition-colors ${errors.currentPassword
                                ? "border-red-300 focus:border-red-500"
                                : "border-gray-300 focus:border-cyan-500"
                                } bg-white text-gray-800 placeholder-gray-400`}
                            disabled={isLoading}
                        />
                        {errors.currentPassword && (
                            <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                                <span>⚠️</span>
                                {errors.currentPassword}
                            </p>
                        )}
                    </div>

                    {/* New Password */}
                    <div className="mb-6">
                        <label htmlFor="newPassword" className="block text-lg font-semibold text-gray-800 mb-3">
                            New Password
                        </label>
                        <input
                            id="newPassword"
                            type="password"
                            value={formData.newPassword}
                            onChange={(e) => handleInputChange("newPassword", e.target.value)}
                            placeholder="Enter your new password"
                            className={`w-full py-3 px-4 border-2 rounded-xl outline-none transition-colors ${errors.newPassword
                                ? "border-red-300 focus:border-red-500"
                                : "border-gray-300 focus:border-cyan-500"
                                } bg-white text-gray-800 placeholder-gray-400`}
                            disabled={isLoading}
                        />
                        {errors.newPassword && (
                            <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                                <span>⚠️</span>
                                {errors.newPassword}
                            </p>
                        )}
                    </div>

                    {/* Confirm Password */}
                    <div className="mb-6">
                        <label htmlFor="confirmPassword" className="block text-lg font-semibold text-gray-800 mb-3">
                            Confirm New Password
                        </label>
                        <input
                            id="confirmPassword"
                            type="password"
                            value={formData.confirmPassword}
                            onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                            placeholder="Confirm your new password"
                            className={`w-full py-3 px-4 border-2 rounded-xl outline-none transition-colors ${errors.confirmPassword
                                ? "border-red-300 focus:border-red-500"
                                : formData.confirmPassword && formData.newPassword === formData.confirmPassword
                                    ? "border-green-300 focus:border-green-500"
                                    : "border-gray-300 focus:border-cyan-500"
                                } bg-white text-gray-800 placeholder-gray-400`}
                            disabled={isLoading}
                        />
                        {formData.confirmPassword && (
                            <p
                                className={`text-sm mt-2 flex items-center gap-1 ${formData.newPassword === formData.confirmPassword ? "text-green-500" : "text-red-500"
                                    }`}
                            >
                                {formData.newPassword === formData.confirmPassword
                                    ? "✅ Passwords match"
                                    : "❌ Passwords do not match"}
                            </p>
                        )}
                        {errors.confirmPassword && (
                            <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                                <span>⚠️</span>
                                {errors.confirmPassword}
                            </p>
                        )}
                    </div>

                    {/* General Error */}
                    {errors.general && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-red-600 text-sm flex items-center gap-2">
                                <span>❌</span>
                                {errors.general}
                            </p>
                        </div>
                    )}

                    {/* Buttons */}
                    <div className="flex gap-3">
                        <button
                            onClick={handleClose}
                            className="flex-1 py-3 px-6 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 hover:border-gray-400 transition-colors"
                            disabled={isLoading}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSendOTP}
                            disabled={!isFormValid || isLoading}
                            className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all transform ${!isFormValid || isLoading
                                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                : "bg-gradient-to-r from-cyan-500 to-emerald-500 text-white hover:from-cyan-600 hover:to-emerald-600 hover:-translate-y-0.5 hover:shadow-lg"
                                }`}
                        >
                            {isLoading ? (
                                <div className="flex items-center justify-center gap-2">
                                    <ButtonLoader text="Sending..." />
                                </div>
                            ) : (
                                "Send OTP"
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChangePasswordModal;
