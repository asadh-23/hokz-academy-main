import { useState } from "react";
import AuthLayout from "../../../components/auth/AuthLayout";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Mail, Lock, EyeOff, ArrowRight, ShieldCheck } from "lucide-react";

import { tutorLogin } from "../../../store/features/auth/tutorAuthSlice";
import { selectTutorAuthLoading } from "../../../store/features/auth/tutorAuthSlice";
import { validateEmail, validatePassword } from "../../../utils/validation";

export default function TutorLogin() {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const isLoading = useSelector(selectTutorAuthLoading);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const emailValidation = validateEmail(formData.email);
        if (!emailValidation.isValid) {
            return toast.error(emailValidation.message || "Enter a valid email address");
        }

        const passwordValidation = validatePassword(formData.password);
        if (!passwordValidation.isValid) {
            return toast.error(passwordValidation.message || "Enter a valid Password");
        }
        const payload = {
            email: emailValidation.value,
            password: passwordValidation.value,
        };
        try {
            const result = await dispatch(tutorLogin(payload)).unwrap();

            toast.success(result.message || "Login successful");

            navigate("/tutor/dashboard", { replace: true });
        } catch (error) {
            console.log(error || "Admin login failed");
            toast.error(error || "Login failed");
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <AuthLayout subtitle="Log In" role="tutor">
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
                            type="password"
                            required
                            name="password"
                            placeholder="••••••••"
                            className="w-full bg-slate-50 rounded-2xl border-2 border-transparent px-14 py-4 focus:outline-none focus:border-[#1E2EDE] focus:bg-white transition-all font-bold text-[#1E2EDE] placeholder-slate-300 shadow-sm"
                            value={formData.password}
                            onChange={handleChange}
                        />
                        {/* Visual Eye Icon (Matches the Register style) */}
                        <div className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 cursor-pointer hover:text-[#1E2EDE] transition-colors">
                            <EyeOff size={18} />
                        </div>
                    </div>
                </div>

                {/* 3. Forgot Password Link */}
                <div className="flex justify-end px-2">
                    <Link
                        to="/tutor/forgot-password"
                        className="text-[#14C4E7] hover:text-[#1E2EDE] text-[10px] font-black uppercase tracking-widest transition-colors flex items-center gap-1.5"
                    >
                        <ShieldCheck size={12} />
                        forgot password
                    </Link>
                </div>

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
        </AuthLayout>
    );
}
