import React, { useState } from "react";
import AuthLayout from "../../../components/auth/AuthLayout";
import { toast } from "sonner";
import { validateEmail, validatePassword } from "../../../utils/validation";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { adminLogin } from "../../../store/features/auth/adminAuthSlice";

export default function AdminLogin() {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleSubmit = async (e) => {
        e.preventDefault();

        // ---------------------------
        // Validate email
        // ---------------------------
        const emailValidation = validateEmail(formData.email);
        if (!emailValidation.isValid) {
            return toast.error(emailValidation.message || "Invalid email address");
        }

        // ---------------------------
        // Validate password
        // ---------------------------
        const passwordValidation = validatePassword(formData.password);
        if (!passwordValidation.isValid) {
            return toast.error(passwordValidation.message || "Invalid password");
        }

        const credentials = {
            email: emailValidation.email,
            password: passwordValidation.password,
        };

        try {
            // Dispatch Redux Thunk
            const result = await dispatch(adminLogin(credentials)).unwrap();

            toast.success(result.message || "Login successful");

            navigate("/admin/dashboard", { replace: true });
        } catch (error) {
            toast.error(error || "Admin login failed");
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <AuthLayout subtitle="Log In" role="admin">
            <h2 className="text-3xl font-bold mb-4 text-gray-900 drop-shadow-md">Welcome back, Admin</h2>

            <form className="w-full space-y-6" onSubmit={handleSubmit}>
                {/* Email */}
                <div className="relative">
                    <input
                        type="email"
                        required
                        name="email"
                        placeholder="Email"
                        className="w-full rounded-full border border-gray-300 px-6 py-3 focus:outline-none focus:ring-4 focus:ring-teal-300 transition"
                        value={formData.email}
                        onChange={handleChange}
                    />
                    <span className="absolute left-6 top-3.5 text-gray-400">
                        <i className="fas fa-envelope" />
                    </span>
                </div>

                {/* Password */}
                <div className="relative">
                    <input
                        type="password"
                        required
                        name="password"
                        placeholder="Password"
                        className="w-full rounded-full border border-gray-300 px-6 py-3 pr-12 focus:outline-none focus:ring-4 focus:ring-teal-300 transition"
                        value={formData.password}
                        onChange={handleChange}
                    />
                    <span className="absolute left-6 top-3.5 text-gray-400">
                        <i className="fas fa-lock" />
                    </span>
                    <span className="absolute right-4 top-3.5 text-gray-400 cursor-pointer">
                        <i className="fas fa-eye-slash" />
                    </span>
                </div>

                {/* Login Button */}
                <button
                    type="submit"
                    className="w-full bg-teal-400 text-white font-bold text-lg py-3 rounded-full shadow-lg hover:bg-teal-500 transition-all"
                >
                    Login
                </button>
            </form>
        </AuthLayout>
    );
}
