import React from "react";
import { Link, useLocation } from "react-router-dom";
import GoogleAuth from "./GoogleAuth";
import { GraduationCap } from "lucide-react";

export default function AuthLayout({ subtitle, role, children }) {
    const location = useLocation();
    const isRegister = location.pathname.includes("register");
    const isLogin = location.pathname.includes("login");

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#FDFDFD] px-4 py-12 relative overflow-hidden">
            {/* --- BRAND DECORATION --- */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#14C4E7] opacity-5 rounded-full -translate-y-20 translate-x-20"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#E6D929] opacity-5 rounded-full translate-y-10 -translate-x-10"></div>

            <div className="w-full max-w-xl relative z-10">
                {/* --- LOGO SECTION --- */}
                <div className="flex flex-col items-center mb-10">
                    <Link to="/" className="flex items-center gap-3 group">
                        <div className="w-12 h-12 bg-[#1E2EDE] rounded-2xl flex items-center justify-center transition-transform group-hover:rotate-12 shadow-xl shadow-blue-900/20">
                            <GraduationCap className="text-[#E6D929] w-7 h-7" />
                        </div>
                        <span className="text-3xl font-black tracking-tighter text-[#1E2EDE]">
                            HOKZ<span className="text-[#14C4E7]">ACADEMY</span>
                        </span>
                    </Link>
                </div>

                {/* --- MAIN CARD --- */}
                <div className="bg-white rounded-[3rem] shadow-[0_40px_100px_rgba(30,46,222,0.1)] border border-slate-50 overflow-hidden">
                    {/* --- TABS SECTION --- */}
                    {role !== "admin" && (
                        <div className="flex p-2 bg-slate-50 border-b border-slate-100">
                            <Link
                                to={`/${role}/register`}
                                className={`flex-1 py-4 text-center rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] transition-all ${
                                    isRegister
                                        ? "bg-[#1E2EDE] text-[#E6D929] shadow-lg shadow-blue-200"
                                        : "text-slate-400 hover:text-[#1E2EDE]"
                                }`}
                            >
                                Create Account
                            </Link>
                            <Link
                                to={`/${role}/login`}
                                className={`flex-1 py-4 text-center rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] transition-all ${
                                    isLogin
                                        ? "bg-[#1E2EDE] text-[#E6D929] shadow-lg shadow-blue-200"
                                        : "text-slate-400 hover:text-[#1E2EDE]"
                                }`}
                            >
                                Sign In
                            </Link>
                        </div>
                    )}

                    <div className="px-8 py-12 md:px-12">
                        {/* Subtitle */}
                        <div className="mb-10 text-center">
                            <p className="text-[10px] font-black text-[#14C4E7] uppercase tracking-[0.4em] mb-2">
                                {isLogin? "Welcome Back" : "" }
                            </p>
                            <h2 className="text-2xl font-black text-[#1E2EDE] uppercase tracking-tight">
                                {subtitle} to Profile
                            </h2>
                        </div>

                        {/* Form area */}
                        <div className="w-full">
                            {children}

                            {role !== "admin" && (
                                <div className="mt-8">
                                    <div className="relative flex items-center justify-center mb-8">
                                        <div className="absolute inset-0 flex items-center">
                                            <div className="w-full border-t border-slate-100"></div>
                                        </div>
                                        <span className="relative px-4 bg-white text-[10px] font-black text-slate-300 uppercase tracking-widest">
                                            Secure Connect
                                        </span>
                                    </div>
                                    <GoogleAuth role={role} />
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer Link */}
                <p className="mt-8 text-center text-slate-400 font-bold text-xs uppercase tracking-widest">
                    Protecting your future since {new Date().getFullYear()}
                </p>
            </div>
        </div>
    );
}
