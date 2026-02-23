import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";

import { verifyOtp, resendOtp, selectOtpVerifying, selectOtpResending } from "../../store/features/auth/otpSlice";

// Auth Slices
import { userLoginSuccess } from "../../store/features/auth/userAuthSlice";
import { tutorLoginSuccess } from "../../store/features/auth/tutorAuthSlice";
import { adminLoginSuccess } from "../../store/features/auth/adminAuthSlice";

const RESEND_INTERVAL = 60;

export default function OtpVerify() {
    const location = useLocation();
    const email = location.state?.email;
    const role = location.state?.role;

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const isVerifying = useSelector(selectOtpVerifying);
    const isResending = useSelector(selectOtpResending);

    const [otp, setOtp] = useState(Array(6).fill(""));
    const inputRefs = useRef([]);

    const [timer, setTimer] = useState(RESEND_INTERVAL);
    const [resendDisabled, setResendDisabled] = useState(true);

    // ==========================================================
    // TIMER LOGIC
    // ==========================================================
    useEffect(() => {
        const saved = localStorage.getItem("otpTimestamp");

        if (saved) {
            const elapsed = Math.floor((Date.now() - Number(saved)) / 1000);

            if (elapsed < RESEND_INTERVAL) {
                setTimer(RESEND_INTERVAL - elapsed);
                setResendDisabled(true);
            } else {
                setTimer(0);
                setResendDisabled(false);
                localStorage.removeItem("otpTimestamp");
            }
        } else {
            localStorage.setItem("otpTimestamp", Date.now().toString());
            setTimer(RESEND_INTERVAL);
            setResendDisabled(true);
        }
    }, []);

    useEffect(() => {
        if (resendDisabled && timer > 0) {
            const interval = setInterval(() => {
                setTimer((prev) => {
                    if (prev <= 1) {
                        clearInterval(interval);
                        setResendDisabled(false);
                        localStorage.removeItem("otpTimestamp");
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);

            return () => clearInterval(interval);
        }
    }, [resendDisabled, timer]);

    // ==========================================================
    // OTP INPUT
    // ==========================================================
    const handleChange = (i, e) => {
        if (/^\d?$/.test(e.target.value)) {
            const updated = [...otp];
            updated[i] = e.target.value;
            setOtp(updated);
            if (e.target.value && i < 5) inputRefs.current[i + 1].focus();
        }
    };

    const handleKeyDown = (i, e) => {
        if (e.key === "Backspace" && !otp[i] && i > 0) {
            inputRefs.current[i - 1].focus();
        }
    };

    // ==========================================================
    // VERIFY OTP
    // ==========================================================
    const handleVerify = async () => {
        const otpCode = otp.join("");

        if (otpCode.length !== 6) return toast.error("Enter a valid 6-digit OTP");

        try {
            const result = await dispatch(verifyOtp({ email, otp: otpCode, role })).unwrap();

            toast.success(result.message || "OTP Verified Successfully");

            localStorage.removeItem("otpTimestamp");

            const payload = {
                user: result.user,
                accessToken: result.accessToken,
            };

            // ROLE-BASED LOGIN STORE UPDATE
            if (role === "user") dispatch(userLoginSuccess(payload));
            if (role === "tutor") dispatch(tutorLoginSuccess(payload));
            if (role === "admin") dispatch(adminLoginSuccess(payload));

            navigate(`/${role}/dashboard`, { replace: true });
        } catch (error) {
            console.log(error || "Otp verification failed");
            toast.error(error || "Otp verification failed ");
        }
    };

    // ==========================================================
    // RESEND OTP
    // ==========================================================
    const handleResend = async () => {
        try {
            const result = await dispatch(resendOtp({ email, role })).unwrap();

            toast.success(result.message || "OTP resent successfully");

            setOtp(Array(6).fill(""));
            setTimer(RESEND_INTERVAL);
            setResendDisabled(true);
            localStorage.setItem("otpTimestamp", Date.now().toString());
        } catch (error) {
            toast.error(error || "Otp resending failed");
            setTimer(0);
            setResendDisabled(false);
        }
    };

    // ==========================================================
    // UI
    // ==========================================================
    if (!email) {
        return (
            /* White screen thavirkkan same background gradient ivideyum use cheyyuka */
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-4">
                <div className="bg-white rounded-3xl px-8 py-10 shadow-2xl max-w-md w-full text-center border border-gray-100 flex flex-col items-center justify-center min-h-[400px]">
                    <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="text-gray-600 font-bold animate-pulse">Initializing Verification...</p>
                </div>
            </div>
        );
    }
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-4">
            <div className="bg-white rounded-3xl px-8 py-10 shadow-2xl max-w-md w-full text-center relative border border-gray-100">
                {/* Close Button */}
                <button
                    className="absolute right-6 top-6 w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all"
                    onClick={() => navigate(`/${role}/register`)}
                    title="Close"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                {/* Email Icon */}
                <div className="mb-6">
                    <div className="w-20 h-20 mx-auto bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                            />
                        </svg>
                    </div>
                </div>

                <h2 className="text-3xl font-bold mb-3 text-gray-900">Verify Your Email</h2>
                <p className="text-sm text-gray-600 mb-8 max-w-sm mx-auto">
                    We've sent a 6-digit verification code to
                    <br />
                    <span className="font-semibold text-gray-900">{email}</span>
                </p>

                {/* OTP Input Boxes */}
                <div className="flex gap-3 justify-center mb-8">
                    {otp.map((val, i) => (
                        <input
                            key={i}
                            ref={(el) => (inputRefs.current[i] = el)}
                            maxLength={1}
                            value={val}
                            onChange={(e) => handleChange(i, e)}
                            onKeyDown={(e) => handleKeyDown(i, e)}
                            className={`w-12 h-14 text-center font-bold text-2xl rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${
                                val ? "border-indigo-500 bg-indigo-50" : "border-gray-300 bg-white hover:border-gray-400"
                            }`}
                        />
                    ))}
                </div>

                {/* Change Email Link */}
                <div className="mb-6 text-sm text-gray-600">
                    Wrong email?{" "}
                    <Link
                        to={`/${role}/register`}
                        className="font-semibold text-indigo-600 hover:text-indigo-700 underline"
                    >
                        Change here
                    </Link>
                </div>

                {/* Verify Button */}
                <button
                    onClick={handleVerify}
                    disabled={isVerifying || otp.join("").length !== 6}
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-3.5 rounded-xl mb-4 shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-lg"
                >
                    {isVerifying ? (
                        <span className="flex items-center justify-center gap-2">
                            <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                ></circle>
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                            </svg>
                            Verifying...
                        </span>
                    ) : (
                        "Verify Email"
                    )}
                </button>

                {/* Resend Button */}
                <button
                    onClick={handleResend}
                    disabled={resendDisabled || isResending}
                    className={`w-full py-3 rounded-xl font-semibold transition-all ${
                        resendDisabled || isResending
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : "bg-white border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50"
                    }`}
                >
                    {resendDisabled
                        ? `Resend code in ${Math.floor(timer / 60)}:${String(timer % 60).padStart(2, "0")}`
                        : isResending
                          ? "Sending..."
                          : "Resend Code"}
                </button>

                {/* Security Note */}
                <p className="text-xs text-gray-500 mt-6">🔒 Your information is secure and encrypted</p>
            </div>
        </div>
    );
}
