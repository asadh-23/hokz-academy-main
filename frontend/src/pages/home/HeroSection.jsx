import React from "react";
import heroImage from "../../assets/images/heroImage.avif";

export const HeroSection = () => {
    return (
        <section className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-[#FDFDFD] pt-24 pb-16 lg:pt-32 lg:pb-24">
            {/* Background Decor - Extends to the very top to show through the translucent header */}
            <div className="absolute top-0 right-0 w-1/2 h-full bg-[#1E2EDE]/[0.02] -skew-x-12 transform origin-top-right pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Text Content */}
                    <div className="space-y-8 animate-fadeIn">
                        <div className="inline-flex items-center space-x-2 bg-[#14C4E7]/10 border border-[#14C4E7]/20 px-4 py-2 rounded-full">
                            <span className="text-[#1E2EDE] text-xs font-black tracking-widest uppercase italic">
                                The Future of Learning
                            </span>
                        </div>

                        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-[#1E2EDE] leading-[1.1] tracking-tight">
                            Unlock Your <br />
                            <span className="text-[#14C4E7]">Potential</span> with <br />
                            <span className="relative inline-block">
                                Hokz Academy
                                <span className="absolute -bottom-2 left-0 w-full h-2 bg-[#E6D929] rounded-full"></span>
                            </span>
                        </h1>

                        <p className="text-xl text-slate-600 max-w-xl leading-relaxed font-medium">
                            "Education is not the learning of facts, but the training of the mind to think." Join a
                            community where excellence meets innovation. Your journey to mastery begins here.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            <button className="px-10 py-5 bg-[#1E2EDE] hover:bg-[#14C4E7] text-[#FDFDFD] font-black rounded-2xl transition-all shadow-xl shadow-[#1E2EDE]/20 flex items-center justify-center gap-3 transform hover:-translate-y-1 active:scale-95 group">
                                Register Now
                                <svg
                                    className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2.5"
                                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                                    />
                                </svg>
                            </button>
                            <button className="px-10 py-5 bg-[#FDFDFD] hover:bg-slate-50 text-[#1E2EDE] border-2 border-[#1E2EDE]/10 font-black rounded-2xl transition-all flex items-center justify-center transform hover:-translate-y-1 active:scale-95">
                                Login
                            </button>
                        </div>

                        <div className="flex items-center gap-6 pt-6 grayscale opacity-60">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Trusted by</p>
                            <div className="flex gap-4">
                                <span className="font-black text-xl text-slate-300 tracking-tighter">GLOBAL</span>
                                <span className="font-black text-xl text-slate-300 tracking-tighter">ELITE</span>
                                <span className="font-black text-xl text-slate-300 tracking-tighter">INSPIRE</span>
                            </div>
                        </div>
                    </div>

                    {/* Visual Content */}
                    <div className="relative lg:h-[600px] flex items-center justify-center">
                        {/* Abstract Shapes */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-br from-[#14C4E7]/10 via-transparent to-[#E6D929]/10 rounded-full blur-3xl -z-10 animate-pulse"></div>

                        <div className="relative w-full max-w-md lg:max-w-none">
                            {/* Main Image Container */}
                            <div className="relative rounded-[3rem] overflow-hidden border-8 border-[#FDFDFD] shadow-2xl transform rotate-2 hover:rotate-0 transition-all duration-700 aspect-[4/5] group">
                                <img
                                    src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1000"
                                    alt="Students Learning"
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#1E2EDE]/40 to-transparent"></div>
                            </div>

                            {/* Floating Stat Card 1 */}
                            <div
                                className="absolute -left-8 top-1/4 bg-[#FDFDFD] p-5 rounded-3xl shadow-2xl border border-slate-100 animate-bounce transition-all duration-1000"
                                style={{ animationDuration: "4s" }}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-[#E6D929] rounded-2xl flex items-center justify-center">
                                        <svg className="w-6 h-6 text-[#1E2EDE]" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M10.394 2.82c.082-.164.224-.26.406-.26.223 0 .33.155.406.26l1.24 2.512 2.772.403c.184.027.3.113.348.259.049.146.012.3-.082.424l-2.006 1.956.474 2.762c.032.184-.04.354-.183.456-.143.102-.32.102-.464.032l-2.48-1.303-2.48 1.303c-.144.07-.321.07-.464-.032-.143-.102-.215-.272-.183-.456l.474-2.762-2.006-1.956c-.094-.124-.13-.278-.082-.424.048-.146.164-.232.348-.259l2.772-.403 1.24-2.512z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-[#1E2EDE] font-black text-xl">4.9/5</p>
                                        <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">
                                            Student Rating
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Floating Stat Card 2 */}
                            <div
                                className="absolute -right-8 bottom-1/4 bg-[#1E2EDE] p-5 rounded-3xl shadow-2xl border border-[#1E2EDE] animate-bounce transition-all duration-1000"
                                style={{ animationDuration: "5s" }}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-[#14C4E7] rounded-2xl flex items-center justify-center">
                                        <svg
                                            className="w-6 h-6 text-[#1E2EDE]"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2.5"
                                                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                                            />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-[#FDFDFD] font-black text-xl">50k+</p>
                                        <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest">
                                            Active Learners
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Scroll Down Indicator */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-30">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#1E2EDE]">Scroll</span>
                <div className="w-px h-12 bg-gradient-to-b from-[#1E2EDE] to-transparent"></div>
            </div>
        </section>
    );
};

export default HeroSection;
