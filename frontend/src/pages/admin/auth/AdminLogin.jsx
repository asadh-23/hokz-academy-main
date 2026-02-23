import React, { useState } from "react";
import AuthLayout from "../../../components/auth/AuthLayout";
import { toast } from "sonner";
import { validateEmail, validatePassword } from "../../../utils/validation";
import { Mail, Lock, EyeOff, ArrowRight, ShieldCheck, Eye } from "lucide-react";
import { Link } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { adminLogin, selectAdminAuthLoading } from "../../../store/features/auth/adminAuthSlice";

export default function AdminLogin() {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const isLoading = useSelector(selectAdminAuthLoading);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // ---------------------------
        // Validate email
        // ---------------------------
        // const emailValidation = validateEmail(formData.email);
        // if (!emailValidation.isValid) {
        //     return toast.error(emailValidation.message || "Invalid email address");
        // }

        // // ---------------------------
        // // Validate password
        // // ---------------------------
        // const passwordValidation = validatePassword(formData.password);
        // if (!passwordValidation.isValid) {
        //     return toast.error(passwordValidation.message || "Invalid password");
        // }

        const credentials = {
            email: formData.email,
            password: formData.password,
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
            <form className="w-full space-y-5" onSubmit={handleSubmit}>
                {/* 1. Email Input Group */}
                <div className="group">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 mb-2 block">
                        Email
                    </label>
                    <div className="relative">
                        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-[#14C4E7] group-focus-within:text-[#1E2EDE] transition-colors">
                            <Mail size={18} />
                        </div>
                        <input
                            type="email"
                            required
                            name="email"
                            placeholder="your@email.com"
                            className="w-full bg-slate-50 rounded-2xl border-2 border-transparent px-14 py-4 focus:outline-none focus:border-[#1E2EDE] focus:bg-white transition-all font-bold text-[#1E2EDE] placeholder-slate-300 shadow-sm"
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                {/* 2. Password Input Group */}
                <div className="group">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 mb-2 block">
                        Password
                    </label>
                    <div className="relative">
                        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-[#14C4E7] group-focus-within:text-[#1E2EDE] transition-colors">
                            <Lock size={18} />
                        </div>
                        <input
                            type={showPassword ? "text" : "password"}
                            required
                            name="password"
                            placeholder="••••••••"
                            className="w-full bg-slate-50 rounded-2xl border-2 border-transparent px-14 pr-16 py-4 focus:outline-none focus:border-[#1E2EDE] focus:bg-white transition-all font-bold text-[#1E2EDE] placeholder-slate-300 shadow-sm"
                            value={formData.password}
                            onChange={handleChange}
                        />
                        {/* Visual Eye Icon (Matches the Register style) */}
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 hover:text-[#1E2EDE] transition-colors focus:outline-none p-1"
                        >
                            {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                        </button>
                    </div>
                </div>

                {/* 3. Forgot Password Link */}

                {/* 4. Login Button */}
                <div className="pt-4">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="group w-full bg-[#1E2EDE] text-[#E6D929] font-black text-xs uppercase tracking-[0.2em] py-5 rounded-2xl shadow-xl shadow-blue-900/20 hover:bg-[#14C4E7] hover:text-white transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                    >
                        {isLoading ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        ) : (
                            <>
                                Enter Academy{" "}
                                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </button>
                </div>

                {/* 5. Security Note */}
                <div className="mt-8 flex items-center justify-center gap-2 text-slate-300">
                    <div className="h-px w-8 bg-slate-100"></div>
                    <p className="text-[9px] font-black uppercase tracking-widest">SSL Encrypted Session</p>
                    <div className="h-px w-8 bg-slate-100"></div>
                </div>
            </form>
            <style jsx="true">{`
                input::-ms-reveal,
                input::-ms-clear {
                    display: none;
                }
            `}</style>
        </AuthLayout>
    );
}
