import React from "react";
import StatsSection from "./StatsSection";
import { Rocket, Target, Users, BookOpen, ShieldCheck, Zap } from "lucide-react";
import martinProfile from "../../assets/images/profile_martin.png";
import elanaProfile from "../../assets/images/elana_profile.avif";
import alisonProfile from "../../assets/images/profile_alison.png";
import aboutSectionImage from "../../assets/images/about_sectionImage.avif";
import { useSelector } from "react-redux";
import { selectUserIsAuthenticated } from "../../store/features/auth/userAuthSlice";
import { useNavigate } from "react-router-dom";

export const About = () => {
    const isAuthenticated = useSelector(selectUserIsAuthenticated);
    const navigate = useNavigate();
    
    const approaches = [
        {
            title: "Active Learning Pedagogy",
            description:
                "We move beyond passive consumption. Our curriculum is built on hands-on projects and real-time problem solving.",
            icon: <Zap className="w-6 h-6 text-[#1E2EDE]" />,
            color: "bg-blue-50",
        },
        {
            title: "Mentor-First Ecosystem",
            description:
                "Every student is paired with industry practitioners, not just academics, ensuring practical knowledge transfer.",
            icon: <Users className="w-6 h-6 text-[#14C4E7]" />,
            color: "bg-cyan-50",
        },
        {
            title: "Adaptive Curriculum",
            description:
                "Our content evolves weekly based on industry shifts and technology trends to keep you ahead of the curve.",
            icon: <BookOpen className="w-6 h-6 text-[#E6D929]" />,
            color: "bg-yellow-50",
        },
    ];

    const faculty = [
        {
            name: "Dr. Elena Vance",
            role: "Head of AI Research",
            image: elanaProfile,
            bio: "Ex-Google Scientist with 15+ years in Deep Learning.",
        },
        {
            name: "Marcus Thorne",
            role: "Lead Systems Architect",
            image: martinProfile,
            bio: "Specialist in Distributed Systems and Cloud Infrastructure.",
        },
        {
            name: "Sarah Jenkins",
            role: "Director of Product Design",
            image: alisonProfile,
            bio: "Award-winning UX designer focused on human-centric tech.",
        },
    ];

    return (
        <div className="animate-fadeIn">
            {/* Hero Section */}
            <section className="relative py-20 lg:py-32 bg-[#FDFDFD] overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-[#1E2EDE]/[0.02] -skew-y-3 origin-top-left"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div className="space-y-8">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#1E2EDE]/5 border border-[#1E2EDE]/10">
                                <ShieldCheck size={16} className="text-[#1E2EDE]" />
                                <span className="text-[#1E2EDE] text-xs font-black uppercase tracking-widest">
                                    The Hokz Standard
                                </span>
                            </div>
                            <h1 className="text-5xl lg:text-7xl font-black text-[#1E2EDE] leading-tight">
                                Crafting the <br />
                                <span className="text-[#14C4E7]">Masters</span> of <br />
                                Tomorrow.
                            </h1>
                            <p className="text-xl text-slate-600 leading-relaxed max-w-xl">
                                Hokz Academy was born from a simple realization: Traditional education is too slow for the
                                digital age. We've built an elite ecosystem where the distance between learning and doing is
                                zero.
                            </p>
                        </div>
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-tr from-[#1E2EDE]/20 to-transparent rounded-[3rem] blur-2xl"></div>
                            <img
                                src={aboutSectionImage}
                                alt="Educational Excellence"
                                className="relative rounded-[3rem] shadow-2xl border-8 border-white object-cover aspect-[4/3]"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Mission & Vision Section */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="bg-[#1E2EDE] p-12 lg:p-20 rounded-[4rem] text-white space-y-8 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-[#14C4E7]/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
                            <Rocket className="w-12 h-12 text-[#E6D929]" />
                            <h2 className="text-4xl font-black">Our Mission</h2>
                            <p className="text-lg text-white/70 leading-relaxed">
                                To democratize access to high-tier expertise by creating a platform that is as rigorous as a
                                university and as fast as a startup. We believe education should be an investment, not an
                                expense.
                            </p>
                            <div className="pt-4">
                                <div className="h-1 w-20 bg-[#E6D929] rounded-full transition-all group-hover:w-full"></div>
                            </div>
                        </div>
                        <div className="space-y-12 pl-4 lg:pl-12">
                            <div className="space-y-4">
                                <h2 className="text-[#14C4E7] font-black uppercase tracking-[0.3em] text-sm">
                                    Strategic Vision
                                </h2>
                                <h3 className="text-3xl font-black text-[#1E2EDE]">Building a Global Meritocracy</h3>
                                <p className="text-slate-500 leading-relaxed">
                                    We envision a world where your location, background, or economic status doesn't limit
                                    your potential. Through Hokz Academy, your talent is the only currency that matters.
                                </p>
                            </div>
                            <div className="grid grid-cols-2 gap-8 pt-8">
                                <div>
                                    <h4 className="text-4xl font-black text-[#1E2EDE] mb-2 tracking-tighter">100+</h4>
                                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">
                                        Industry Partnerships
                                    </p>
                                </div>
                                <div>
                                    <h4 className="text-4xl font-black text-[#1E2EDE] mb-2 tracking-tighter">12k</h4>
                                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">
                                        Global Alumni
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Integration */}
            <div className="bg-[#FDFDFD] border-y border-slate-100">
                <div className="text-center pt-20">
                    <h2 className="text-[#1E2EDE] text-3xl font-black">Platform at a Glance</h2>
                </div>
                <StatsSection />
            </div>

            {/* Our Approach Section */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-20 space-y-4">
                        <h2 className="text-[#14C4E7] font-black uppercase tracking-[0.3em] text-xs">How We Teach</h2>
                        <h3 className="text-4xl font-black text-[#1E2EDE]">The Hokz Methodology</h3>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        {approaches.map((item, idx) => (
                            <div
                                key={idx}
                                className="p-10 rounded-[2.5rem] bg-[#FDFDFD] border border-slate-50 hover:shadow-2xl hover:border-white transition-all duration-500 group"
                            >
                                <div
                                    className={`${item.color} w-16 h-16 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform`}
                                >
                                    {item.icon}
                                </div>
                                <h4 className="text-xl font-black text-[#1E2EDE] mb-4">{item.title}</h4>
                                <p className="text-slate-500 leading-relaxed">{item.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Tutors Section */}
            <section className="py-24 bg-[#FDFDFD]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
                        <div className="space-y-4">
                            <h2 className="text-[#14C4E7] font-black uppercase tracking-[0.3em] text-xs">Our Faculty</h2>
                            <h3 className="text-4xl font-black text-[#1E2EDE]">Guided by Masters</h3>
                        </div>
                        <p className="text-slate-500 max-w-sm">
                            Our instructors aren't just teachers; they are builders who have defined their industries.
                        </p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-12">
                        {faculty.map((tutor, idx) => (
                            <div key={idx} className="group">
                                <div className="relative overflow-hidden rounded-[2.5rem] aspect-[4/5] mb-6">
                                    <img
                                        src={tutor.image}
                                        alt={tutor.name}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#1E2EDE]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                </div>
                                <h4 className="text-xl font-black text-[#1E2EDE]">{tutor.name}</h4>
                                <p className="text-[#14C4E7] text-xs font-bold uppercase tracking-widest mb-2">
                                    {tutor.role}
                                </p>
                                <p className="text-slate-400 text-sm leading-relaxed">{tutor.bio}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Motivational CTA Section */}
            <section className="py-32 relative overflow-hidden">
                <div className="absolute inset-0 bg-[#1E2EDE]"></div>
                <div className="absolute top-0 right-0 w-1/2 h-full bg-[#14C4E7]/5 -skew-x-12 translate-x-32"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-12">
                    <div className="inline-flex items-center gap-4 text-[#E6D929]">
                        <div className="h-px w-12 bg-[#E6D929]"></div>
                        <span className="font-black text-xs uppercase tracking-[0.5em]">Your Era Begins Now</span>
                        <div className="h-px w-12 bg-[#E6D929]"></div>
                    </div>
                    <h2 className="text-5xl lg:text-7xl font-black text-white leading-tight">
                        Stop Dreaming. <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#14C4E7] to-[#E6D929]">
                            Start Dominating.
                        </span>
                    </h2>
                    <p className="text-white/60 text-xl max-w-2xl mx-auto leading-relaxed">
                        The world doesn't wait for those who are ready; it rewards those who take the leap. Join the Hokz
                        elite and rewrite your narrative today.
                    </p>
                    <div className="pt-8">
                        <button
                            onClick={() => {
                                isAuthenticated ? navigate("/user/courses") : navigate("/user/register");
                            }}
                            className="px-16 py-6 bg-[#E6D929] hover:bg-[#14C4E7] text-[#1E2EDE] font-black rounded-[2rem] text-xl transition-all shadow-2xl shadow-black/20 transform hover:-translate-y-2 active:scale-95 group"
                        >
                            {isAuthenticated ? "Browse Courses" : "Join to the Academy"}
                            <Rocket
                                className="inline-block ml-3 group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform"
                                size={24}
                            />
                        </button>
                    </div>
                    <p className="text-white/30 text-xs font-bold uppercase tracking-[0.2em]">
                        Limited Cohorts Available for Q2 2024
                    </p>
                </div>
            </section>
        </div>
    );
};

export default About;
