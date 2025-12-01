import AuthLayout from "../../../components/auth/AuthLayout";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { userRegister, selectUserAuthLoading } from "../../../store/features/auth/userAuthSlice";

import { validateEmail, validatePassword, validatePhone, isNullOrWhitespace } from "../../../utils/validation";

export default function UserRegister() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const loading = useSelector(selectUserAuthLoading);

    const [formData, setFormData] = useState({
        fullName: "",
        phone: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        // ----------------------------
        // VALIDATIONS
        // ----------------------------
        if (isNullOrWhitespace(formData.fullName)) {
            return toast.error("Full Name is required");
        }

        const phoneValidation = validatePhone(formData.phone);
        if (!phoneValidation.isValid) {
            return toast.error(phoneValidation.message);
        }

        const emailValidation = validateEmail(formData.email);
        if (!emailValidation.isValid) {
            return toast.error(emailValidation.message);
        }

        const passwordValidation = validatePassword(formData.password);
        if (!passwordValidation.isValid) {
            return toast.error(passwordValidation.message);
        }

        if (formData.password.trim() !== formData.confirmPassword.trim()) {
            return toast.error("Passwords do not match");
        }

        // Clean data
        const cleanData = {
            fullName: formData.fullName.trim(),
            phone: phoneValidation.phone,
            email: emailValidation.email,
            password: passwordValidation.password,
        };
        try {
            const result = await dispatch(userRegister(cleanData)).unwrap();

            toast.success(result.message || "Registration successful! Verify your email.");
            navigate("/user/verify-otp", { state: { email: cleanData.email, role: "user" }, replace: true });
        } catch (error) {
            toast.error(error || "Registration failed");
            console.log(error || "User registration failed");
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <AuthLayout subtitle="Sign Up" role="user">
            <h2 className="text-3xl font-bold mb-4 text-gray-900 drop-shadow-md">Create your account</h2>

            <form className="w-full space-y-6" onSubmit={handleSubmit}>
                {/* Full Name */}
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Full Name"
                        className="w-full rounded-full border border-gray-300 px-6 py-3 focus:outline-none focus:ring-4 focus:ring-teal-300 transition"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        required
                    />
                </div>

                {/* Phone */}
                <div className="relative">
                    <input
                        type="tel"
                        placeholder="Phone Number"
                        className="w-full rounded-full border border-gray-300 px-6 py-3 focus:outline-none focus:ring-4 focus:ring-teal-300 transition"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                    />
                </div>

                {/* Email */}
                <div className="relative">
                    <input
                        type="email"
                        placeholder="Email"
                        className="w-full rounded-full border border-gray-300 px-6 py-3 focus:outline-none focus:ring-4 focus:ring-teal-300 transition"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>

                {/* Password */}
                <div className="relative">
                    <input
                        type="password"
                        placeholder="Password"
                        className="w-full rounded-full border border-gray-300 px-6 py-3 pr-12 focus:outline-none focus:ring-4 focus:ring-teal-300 transition"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>

                {/* Confirm Password */}
                <div className="relative">
                    <input
                        type="password"
                        placeholder="Confirm Password"
                        className="w-full rounded-full border border-gray-300 px-6 py-3 pr-12 focus:outline-none focus:ring-4 focus:ring-teal-300 transition"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                    />
                </div>

                {/* Register Button */}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-teal-400 text-white font-bold text-lg py-3 rounded-full shadow-lg hover:bg-teal-500 transition-all disabled:opacity-50"
                >
                    {loading ? "Registering..." : "Register"}
                </button>
            </form>
        </AuthLayout>
    );
}
