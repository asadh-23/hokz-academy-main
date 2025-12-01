import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";

import {
    verifyOtp,
    resendOtp,
    selectOtpVerifying,
    selectOtpResending,
} from "../../store/features/auth/otpSlice";

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
            const result = await dispatch(
                verifyOtp({ email, otp: otpCode, role })
            ).unwrap();

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
            console.log(error || "Otp verification failed")
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
    return (
        <div className="min-h-screen flex items-center justify-center bg-[#eddfc3]">
            <div className="bg-white rounded-3xl px-8 py-10 shadow-2xl max-w-md w-full text-center relative">
                {/* X BUTTON */}
                <button
                    className="absolute right-8 top-7 text-xl text-gray-400 hover:text-gray-700"
                    onClick={() => navigate(`/${role}/register`)}
                >
                    &times;
                </button>

                {/* ICON */}
                <div className="mb-6">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="#D94D22"
                        className="w-16 h-16 mx-auto"
                    >
                        <rect x="3" y="6" width="18" height="12" rx="3" fill="#FFB347" />
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            stroke="#D94D22"
                            strokeWidth={1.5}
                            d="M3 8l9 6 9-6"
                        />
                    </svg>
                </div>

                <h2 className="text-2xl font-bold mb-2 text-gray-900">
                    Verify Your Email Address
                </h2>
                <p className="text-xs text-gray-500 mb-7 max-w-xs mx-auto">
                    We have sent a 6-digit OTP to your email: <b>{email}</b>
                </p>

                {/* OTP BOXES */}
                <div className="flex gap-5 mb-7">
                    {otp.map((val, i) => (
                        <input
                            key={i}
                            ref={(el) => (inputRefs.current[i] = el)}
                            maxLength={1}
                            value={val}
                            onChange={(e) => handleChange(i, e)}
                            onKeyDown={(e) => handleKeyDown(i, e)}
                            className={`w-14 h-16 text-center font-bold text-2xl rounded-xl border focus:ring-2 transition ${
                                val ? "border-orange-400" : "border-gray-300"
                            }`}
                        />
                    ))}
                </div>

                <div className="mb-6 text-sm">
                    Want to change your email?
                    <Link
                        to={`/${role}/register`}
                        className="underline font-semibold ml-1 text-gray-800 hover:text-orange-500"
                    >
                        Change Here
                    </Link>
                </div>

                {/* VERIFY BUTTON */}
                <button
                    onClick={handleVerify}
                    disabled={isVerifying}
                    className="bg-orange-400 hover:bg-orange-500 transition font-bold text-white px-14 py-3 rounded-full mb-3 shadow disabled:opacity-50"
                >
                    {isVerifying ? "Verifying..." : "Verify Email"}
                </button>

                {/* RESEND BUTTON */}
                <button
                    onClick={handleResend}
                    disabled={resendDisabled || isResending}
                    className={`px-4 py-2 rounded-md font-semibold transition ${
                        resendDisabled || isResending
                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                            : "bg-orange-400 text-white hover:bg-orange-500"
                    }`}
                >
                    {resendDisabled
                        ? `Resend OTP in ${Math.floor(timer / 60)}:${String(
                              timer % 60
                          ).padStart(2, "0")}`
                        : isResending
                        ? "Sending..."
                        : "Resend OTP"}
                </button>
            </div>
        </div>
    );
}
