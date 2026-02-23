import AuthLayout from "../../../components/auth/AuthLayout";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { User, Phone, Mail, Lock, ShieldCheck, ArrowRight, Eye, EyeOff } from "lucide-react";
import { userRegister } from "../../../store/features/auth/userAuthSlice";

import { validateEmail, validatePassword, validatePhone, validateText } from "../../../utils/validation";

export default function UserRegister() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);

    const [loading, setLoading] = useState(false);

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
        const nameValidation = validateText(formData.fullName, 2, 50, "Name");
        if (!nameValidation.isValid) {
            return toast.error(nameValidation.message || "Enter a valid Name");
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

        // Clean data
        const cleanData = {
            fullName: nameValidation.value,
            phone: phoneValidation.value,
            email: emailValidation.value,
            password: passwordValidation.value,
        };
        setLoading(true);
        try {
            const result = await dispatch(userRegister(cleanData)).unwrap();

            if (result.success) {
                toast.success(result.message || "Registration successful! Verify your email.");
                navigate("/user/verify-otp", { state: { email: cleanData.email, role: "user" }, replace: true });
            }
        } catch (error) {
            toast.error(error || "Registration failed");
            console.log(error || "User registration failed");
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <AuthLayout subtitle="Sign Up" role="user">
            {loading && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
                    <div className="flex flex-col items-center gap-3">
                        <div className="w-12 h-12 border-4 border-[#1E2EDE] border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-[#1E2EDE] font-bold animate-pulse">Sending OTP...</p>
                    </div>
                </div>
            )}
            <form className="w-full space-y-5" onSubmit={handleSubmit}>
                {/* 1. Full Name Input */}
                <div className="group">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 mb-2 block">
                        Student Name
                    </label>
                    <div className="relative">
                        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-[#14C4E7] group-focus-within:text-[#1E2EDE] transition-colors">
                            <User size={18} />
                        </div>
                        <input
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            required
                            placeholder="John Doe"
                            className="w-full bg-slate-50 rounded-2xl border-2 border-transparent px-14 py-4 focus:outline-none focus:border-[#1E2EDE] focus:bg-white transition-all font-bold text-[#1E2EDE] placeholder-slate-300 shadow-sm"
                        />
                    </div>
                </div>

                {/* 2. Phone Input */}
                <div className="group">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 mb-2 block">
                        Contact Number
                    </label>
                    <div className="relative">
                        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-[#14C4E7] group-focus-within:text-[#1E2EDE] transition-colors">
                            <Phone size={18} />
                        </div>
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                            placeholder="e.g- 6234567890"
                            className="w-full bg-slate-50 rounded-2xl border-2 border-transparent px-14 py-4 focus:outline-none focus:border-[#1E2EDE] focus:bg-white transition-all font-bold text-[#1E2EDE] placeholder-slate-300 shadow-sm"
                        />
                    </div>
                </div>

                {/* 3. Email Input */}
                <div className="group">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 mb-2 block">
                        Academy Email
                    </label>
                    <div className="relative">
                        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-[#14C4E7] group-focus-within:text-[#1E2EDE] transition-colors">
                            <Mail size={18} />
                        </div>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            placeholder="your@email.com"
                            className="w-full bg-slate-50 rounded-2xl border-2 border-transparent px-14 py-4 focus:outline-none focus:border-[#1E2EDE] focus:bg-white transition-all font-bold text-[#1E2EDE] placeholder-slate-300 shadow-sm"
                        />
                    </div>
                </div>

                {/* 4. Password Input */}
                <div className="group">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 mb-2 block">
                        Secret Password
                    </label>
                    <div className="relative">
                        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-[#14C4E7] group-focus-within:text-[#1E2EDE] transition-colors">
                            <Lock size={18} />
                        </div>
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            placeholder="••••••••"
                            className="w-full bg-slate-50 rounded-2xl border-2 border-transparent px-14 pr-16 py-4 focus:outline-none focus:border-[#1E2EDE] focus:bg-white transition-all font-bold text-[#1E2EDE] placeholder-slate-300 shadow-sm"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 hover:text-[#1E2EDE] transition-colors focus:outline-none p-1"
                        >
                            {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                        </button>
                    </div>
                </div>

                {/* 5. Confirm Password Input */}
                <div className="group">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 mb-2 block">
                        Confirm Password
                    </label>
                    <div className="relative">
                        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-[#14C4E7] group-focus-within:text-[#1E2EDE] transition-colors">
                            <ShieldCheck size={18} />
                        </div>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                            placeholder="••••••••"
                            className="w-full bg-slate-50 rounded-2xl border-2 border-transparent px-14 py-4 focus:outline-none focus:border-[#1E2EDE] focus:bg-white transition-all font-bold text-[#1E2EDE] placeholder-slate-300 shadow-sm"
                        />
                    </div>
                </div>

                {/* Register Button */}
                <div className="pt-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="group w-full bg-[#1E2EDE] text-[#E6D929] font-black text-xs uppercase tracking-[0.2em] py-5 rounded-2xl shadow-xl shadow-blue-200 hover:bg-[#14C4E7] hover:text-white transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                    >
                        {loading ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        ) : (
                            <>
                                Start My Journey{" "}
                                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </button>
                </div>

                {/* User Agreement Note */}
                <p className="text-[10px] text-center text-slate-400 font-bold px-6 leading-relaxed">
                    By clicking "Start My Journey", you agree to our{" "}
                    <span className="text-[#14C4E7] underline cursor-pointer">Academic Terms</span> and{" "}
                    <span className="text-[#14C4E7] underline cursor-pointer">Privacy Policy</span>.
                </p>
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
