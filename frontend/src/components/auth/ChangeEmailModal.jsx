import React, { useState, useEffect } from "react";
import { ButtonLoader } from "../common/LoadingSpinner";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { validateEmail } from "../../utils/validation";
import { useDispatch, useSelector } from "react-redux";
// Redux thunks and selectors
import {
    requestEmailChange,
    selectEmailChangeRequestLoading,
} from "../../store/features/auth/emailChangeSlice";


const ChangeEmailModal = ({ isOpen, onClose, currentEmail, role }) => {
    const [newEmail, setNewEmail] = useState("");
    const [errors, setErrors] = useState({});

    const navigate = useNavigate();
    const dispatch = useDispatch();

    // Redux selectors
    const isLoading = useSelector(selectEmailChangeRequestLoading);
   

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

    const handleSendOTP = async () => {
        setErrors({});

        const emailValidation = validateEmail(newEmail);
        if (!emailValidation.isValid) {
            setErrors({ email: emailValidation.message || "Please enter a valid email address" });
            return;
        }
        const trimmedNewEmail = emailValidation.email;

        if (trimmedNewEmail === currentEmail) {
            setErrors({ email: "New email must be different from current email" });
            return;
        }

        try {
         
            const result = await dispatch(
                requestEmailChange({
                    newEmail: trimmedNewEmail,
                    role,
                })
            ).unwrap();

            toast.success(result.message || "OTP sent to your new email. Please check your inbox.");
            onClose();
            navigate(`/${role}/verify-email-change`, {
                state: { email: trimmedNewEmail, role },
                replace: true,
            });
        } catch (error) {
            console.error("Failed to send OTP:", error);
            setErrors({ general: error || "Failed to send OTP." });
        }
    };

    const handleClose = () => {
        setNewEmail("");
        setErrors({});
        onClose();
    };

    if (!isOpen) return null;

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
                            </div>
                        </div>
                    </div>
                )}
                {/* Modal Header */}
                <div className="bg-gradient-to-r from-cyan-400 to-emerald-500 text-white p-6 rounded-t-2xl">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-semibold">Change Email Address</h2>
                        <button
                            onClick={handleClose}
                            className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-gray-700 font-bold text-lg shadow-sm hover:bg-gray-100 transition-all"
                        >
                            ×
                        </button>
                    </div>
                </div>

                {/* Modal Content */}
                <div className="p-6">
                    {/* Current Email Display */}
                    <div className="mb-6">
                        <p className="text-sm text-gray-600 mb-2">Current Email:</p>
                        <div className="bg-gray-100 rounded-lg p-3 text-gray-800 font-medium">
                            {currentEmail || "user@example.com"}
                        </div>
                    </div>

                    {/* New Email Input Section */}
                    <div className="mb-6">
                        <label htmlFor="newEmail" className="block text-lg font-semibold text-gray-800 mb-3">
                            Enter New Email Address
                        </label>
                        <div className="relative">
                            <input
                                id="newEmail"
                                type="email"
                                value={newEmail}
                                onChange={(e) => setNewEmail(e.target.value)}
                                placeholder="Enter your new email address"
                                className={`w-full py-3 px-4 border-2 rounded-xl outline-none transition-colors ${
                                    errors.email
                                        ? "border-red-300 focus:border-red-500"
                                        : "border-gray-300 focus:border-cyan-500"
                                } bg-white text-gray-800 placeholder-gray-400`}
                                disabled={isLoading}
                            />
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                <span className="text-gray-400">📧</span>
                            </div>
                        </div>
                        {errors.email && (
                            <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                                <span>⚠️</span>
                                {errors.email}
                            </p>
                        )}
                    </div>

                    {/* General Error Message */}
                    {errors.general && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-red-600 text-sm flex items-center gap-2">
                                <span>❌</span>
                                {errors.general}
                            </p>
                        </div>
                    )}

                    {/* Action Buttons */}
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
                            disabled={isLoading || !newEmail.trim()}
                            className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all transform ${
                                isLoading || !newEmail.trim()
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

                    {/* Info Text */}
                    <div className="mt-4 p-3 bg-cyan-50 border border-cyan-200 rounded-lg">
                        <p className="text-cyan-700 text-sm flex items-start gap-2">
                            <span className="text-base">ℹ️</span>
                            <span>
                                An OTP will be sent to your new email address for verification. Please check your inbox and
                                spam folder.
                            </span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChangeEmailModal;
