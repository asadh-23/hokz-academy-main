import AuthLayout from "../../../components/auth/AuthLayout";
import { toast } from "sonner";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { isNullOrWhitespace, validateEmail, validatePassword, validatePhone } from "../../../utils/validation";

import { tutorRegister, selectTutorAuthLoading } from "../../../store/features/auth/tutorAuthSlice";

export default function TutorRegister() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const loading = useSelector(selectTutorAuthLoading);

    const [formData, setFormData] = useState({
        fullName: "",
        phone: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        // --- VALIDATION ---

        if (isNullOrWhitespace(formData.fullName)) {
            return toast.error("Full Name is required");
        }

        const phoneValidation = validatePhone(formData.phone);
        if (!phoneValidation.isValid) {
            return toast.error(phoneValidation.message || "Enter a valid phone number");
        }

        const emailValidation = validateEmail(formData.email);
        if (!emailValidation.isValid) {
            return toast.error(emailValidation.message || "Enter a valid email address");
        }

        const passwordValidation = validatePassword(formData.password);
        if (!passwordValidation.isValid) {
            return toast.error(passwordValidation.message || "Enter a valid password");
        }

        if (formData.password.trim() !== formData.confirmPassword.trim()) {
            return toast.error("Passwords do not match");
        }

        const cleanData = {
            fullName: formData.fullName.trim(),
            phone: phoneValidation.phone,
            email: emailValidation.email,
            password: passwordValidation.password,
        };
        try {
            const result = await dispatch(tutorRegister(cleanData));

            toast.success(result.message || "Registration successful! Verify your email.");
            navigate("/tutor/verify-otp", { state: { email: cleanData.email, role: "tutor" }, replace: true });
        } catch (error) {
            toast.error(error || "Registration failed");
            console.log("Registration failed ", error);
        }

        // --- API CALL THROUGH REDUX THUNK ---
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <AuthLayout subtitle="Sign Up" role="tutor">
            <h2 className="text-3xl font-bold mb-4 text-gray-900 drop-shadow-md">Register as a Tutor</h2>

            <form className="w-full space-y-6" onSubmit={handleSubmit}>
                {/* Full Name */}
                <input
                    type="text"
                    placeholder="Full Name"
                    className="w-full rounded-full border border-gray-300 px-6 py-3 
                    focus:outline-none focus:ring-4 focus:ring-teal-300 transition"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                />

                {/* Phone */}
                <input
                    type="tel"
                    placeholder="Phone Number"
                    className="w-full rounded-full border border-gray-300 px-6 py-3 
                    focus:outline-none focus:ring-4 focus:ring-teal-300 transition"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                />

                {/* Email */}
                <input
                    type="email"
                    placeholder="Email"
                    className="w-full rounded-full border border-gray-300 px-6 py-3 
                    focus:outline-none focus:ring-4 focus:ring-teal-300 transition"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />

                {/* Password */}
                <div className="relative">
                    <input
                        type="password"
                        placeholder="Password"
                        className="w-full rounded-full border border-gray-300 px-6 py-3 pr-12 
                        focus:outline-none focus:ring-4 focus:ring-teal-300 transition"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                    <span className="absolute right-4 top-3.5 text-gray-400 cursor-pointer">
                        <i className="fas fa-eye-slash"></i>
                    </span>
                </div>

                {/* Confirm Password */}
                <div className="relative">
                    <input
                        type="password"
                        placeholder="Confirm Password"
                        className="w-full rounded-full border border-gray-300 px-6 py-3 pr-12 
                        focus:outline-none focus:ring-4 focus:ring-teal-300 transition"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                    />
                    <span className="absolute right-4 top-3.5 text-gray-400 cursor-pointer">
                        <i className="fas fa-eye-slash"></i>
                    </span>
                </div>

                {/* Register Button */}
                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full bg-teal-400 text-white font-bold text-lg py-3 rounded-full shadow-lg 
                    transition-all ${loading ? "opacity-50 cursor-not-allowed" : "hover:bg-teal-500"}`}
                >
                    {loading ? "Registering..." : "Register"}
                </button>
            </form>
        </AuthLayout>
    );
}
