import React from "react";
import elanaProfile from "../../assets/images/elana_profile.avif";
import { useSelector } from "react-redux";
import { selectUserIsAuthenticated } from "../../store/features/auth/userAuthSlice";
import { useNavigate } from "react-router-dom";

export const HokzInfo = () => {
    const isAuthenticated = useSelector(selectUserIsAuthenticated);
    const navigate = useNavigate();
    const benefits = [
        {
            title: "Premium Course Catalog",
            description:
                "Access a curated selection of high-tier courses designed by industry leaders to give you a competitive edge.",
            icon: (
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                </svg>
            ),
            accent: "#1E2EDE",
        },
        {
            title: "Elite Mentorship",
            description:
                "Learn directly from world-class faculty and professionals who have navigated the paths you aim to follow.",
            icon: (
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                </svg>
            ),
            accent: "#14C4E7",
        },
        {
            title: "24/7 Doubt Clearing",
            description:
                "Never stay stuck. Our round-the-clock support system ensures your questions are answered precisely when they arise.",
            icon: (
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                </svg>
            ),
            accent: "#E6D929",
        },
    ];

    const features = [
        {
            name: "Immersive Live Classes",
            description: "Participate in real-time sessions with interactive whiteboards and global peer groups.",
            tag: "Live Now",
            color: "bg-red-500",
        },
        {
            name: "Smart Tutor Chat",
            description: "A seamless, persistent chat system to discuss concepts and receive instant feedback.",
            tag: "Popular",
            color: "bg-[#1E2EDE]",
        },
        {
            name: "Personalized Video Calls",
            description: "Book 1-on-1 sessions for tailored guidance and deep-dive technical reviews.",
            tag: "Premium",
            color: "bg-[#14C4E7]",
        },
    ];

    return (
        <section id="about-us" className="pb-24 bg-[#FDFDFD] overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Top Header Section */}
                <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
                    <h2 className="text-[#14C4E7] font-black uppercase tracking-[0.3em] text-sm">Beyond Education</h2>
                    <h3 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#1E2EDE] leading-tight">
                        Why Choose <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1E2EDE] to-[#14C4E7]">
                            Hokz Academy?
                        </span>
                    </h3>
                    <p className="text-slate-500 text-lg font-medium leading-relaxed">
                        We don't just provide courses; we build careers. Our platform is a synergy of cutting-edge
                        technology and human expertise.
                    </p>
                </div>

                {/* Core Benefits Grid */}
                <div className="grid md:grid-cols-3 gap-8 mb-24">
                    {benefits.map((benefit, idx) => (
                        <div
                            key={idx}
                            className="group p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500 relative overflow-hidden"
                        >
                            <div
                                className="absolute top-0 left-0 w-2 h-full opacity-0 group-hover:opacity-100 transition-opacity"
                                style={{ backgroundColor: benefit.accent }}
                            ></div>
                            <div
                                className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 duration-500"
                                style={{ backgroundColor: `${benefit.accent}10`, color: benefit.accent }}
                            >
                                {benefit.icon}
                            </div>
                            <h4 className="text-xl font-black text-[#1E2EDE] mb-4">{benefit.title}</h4>
                            <p className="text-slate-500 leading-relaxed font-medium">{benefit.description}</p>
                        </div>
                    ))}
                </div>

                {/* Interactive Features Display */}
                <div className="bg-[#1E2EDE] rounded-[3rem] p-8 lg:p-16 relative overflow-hidden shadow-2xl">
                    <div className="absolute top-0 right-0 w-1/2 h-full bg-[#14C4E7]/10 -skew-x-12 translate-x-20"></div>

                    <div className="grid lg:grid-cols-2 gap-16 items-center relative z-10">
                        <div className="space-y-8">
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/10 backdrop-blur-md">
                                <div className="w-2 h-2 rounded-full bg-[#E6D929] animate-ping"></div>
                                <span className="text-white text-xs font-bold uppercase tracking-widest">
                                    Interactive Learning
                                </span>
                            </div>

                            <h3 className="text-4xl lg:text-5xl font-black text-white leading-tight">
                                Connect Directly with <br />
                                <span className="text-[#E6D929]">Modern Technology</span>
                            </h3>

                            <div className="space-y-6">
                                {features.map((feature, idx) => (
                                    <div
                                        key={idx}
                                        className="flex items-start gap-4 p-4 rounded-2xl hover:bg-white/5 transition-colors group"
                                    >
                                        <div className="mt-1 w-6 h-6 rounded-full border-2 border-[#14C4E7] flex items-center justify-center shrink-0 group-hover:bg-[#14C4E7] transition-all">
                                            <svg
                                                className="w-3 h-3 text-white"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="3"
                                                    d="M5 13l4 4L19 7"
                                                />
                                            </svg>
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-3 mb-1">
                                                <h5 className="text-white font-bold text-lg">{feature.name}</h5>
                                                <span
                                                    className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${feature.color} text-white`}
                                                >
                                                    {feature.tag}
                                                </span>
                                            </div>
                                            <p className="text-white/60 text-sm leading-relaxed">{feature.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="relative">
                            {/* Visual Mockup representation */}
                            <div className="relative bg-[#FDFDFD] rounded-[2rem] shadow-2xl overflow-hidden border-8 border-white/10 transform lg:rotate-3">
                                <div className="bg-slate-50 p-4 border-b border-slate-100 flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                                    <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                                    <div className="mx-auto bg-slate-200 h-2 w-32 rounded-full"></div>
                                </div>
                                <div className="p-6 h-[400px] flex items-center justify-center bg-slate-100/50">
                                    <div className="text-center space-y-4">
                                        <div className="w-24 h-24 bg-[#1E2EDE]/10 rounded-full flex items-center justify-center mx-auto relative">
                                            <img
                                                src={elanaProfile}
                                                alt="Tutor"
                                                className="w-20 h-20 rounded-full object-cover"
                                            />
                                            <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 border-4 border-white rounded-full"></div>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[#1E2EDE] font-black">Video Session Active</p>
                                            <p className="text-slate-400 text-xs">Direct Mentor Feedback Protocol</p>
                                        </div>
                                        <div className="flex gap-2 justify-center pt-4">
                                            <div className="w-10 h-10 rounded-xl bg-red-500 flex items-center justify-center text-white shadow-lg">
                                                <svg
                                                    className="w-5 h-5"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="2"
                                                        d="M16 8l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M5 3a2 2 0 00-2 2v1c0 8.284 6.716 15 15 15h1a2 2 0 002-2v-3.28a1 1 0 00-.684-.948l-4.493-1.498a1 1 0 00-1.209.388l-2.235 2.235a13.177 13.177 0 01-5.474-5.474l2.235-2.235a1 1 0 00.388-1.209L10.33 5.684a1 1 0 00-.948-.684H5z"
                                                    />
                                                </svg>
                                            </div>
                                            <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-white shadow-lg">
                                                <svg
                                                    className="w-5 h-5"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="2"
                                                        d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                                                    />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Floating Badge */}
                            <div
                                className="absolute -bottom-8 -left-8 bg-[#E6D929] p-6 rounded-3xl shadow-2xl animate-bounce"
                                style={{ animationDuration: "6s" }}
                            >
                                <p className="text-[#1E2EDE] font-black text-2xl">99%</p>
                                <p className="text-[#1E2EDE] text-[10px] font-black uppercase tracking-widest opacity-60">
                                    Satisfaction
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Motivational Quote Section */}
                <div className="mt-32 text-center">
                    <div className="relative inline-block">
                        <span className="text-8xl text-[#1E2EDE]/5 absolute -top-10 -left-10 font-black">"</span>
                        <h4 className="text-2xl sm:text-3xl font-bold text-[#1E2EDE] italic leading-relaxed max-w-4xl mx-auto relative z-10">
                            "The path to excellence is paved with persistence, and the right guidance makes that path a
                            highway to your dreams."
                        </h4>
                        <span className="text-8xl text-[#1E2EDE]/5 absolute -bottom-10 -right-10 font-black">"</span>
                    </div>
                    <div className="mt-12">
                        <button
                            onClick={() => {
                                isAuthenticated ? navigate("/user/courses") : navigate("/user/register");
                            }}
                            className="px-12 py-5 bg-[#1E2EDE] hover:bg-[#14C4E7] text-white font-black rounded-2xl transition-all shadow-xl shadow-[#1E2EDE]/20 transform hover:-translate-y-1 active:scale-95"
                        >
                            { isAuthenticated ? "Explore Courses" : "Start Your Journey Today"}
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HokzInfo;
