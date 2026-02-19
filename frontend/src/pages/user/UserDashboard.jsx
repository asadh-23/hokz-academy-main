import React from "react";

import {
    Search,
    PlayCircle,
    Users,
    Award,
    BookOpen,
    ArrowRight,
    Star,
    CheckCircle2,
    TrendingUp,
    Globe,
} from "lucide-react";

export default function UserDashboard() {
    return (
        <div>
            <main className="dashboard-content">
                <div className="min-h-screen bg-white">
                    {/* --- NAVIGATION --- */}
                    <nav className="flex items-center justify-between px-8 py-5 border-b border-gray-100 sticky top-0 bg-white/80 backdrop-blur-md z-50">
                        <div className="flex items-center gap-2">
                            <div className="bg-indigo-600 p-2 rounded-lg">
                                <BookOpen className="text-white h-6 w-6" />
                            </div>
                            <span className="text-2xl font-bold tracking-tight text-gray-900">
                                Edu<span className="text-indigo-600">Stream</span>
                            </span>
                        </div>

                        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
                            <a href="#" className="hover:text-indigo-600 transition-colors">
                                Courses
                            </a>
                            <a href="#" className="hover:text-indigo-600 transition-colors">
                                Tutors
                            </a>
                            <a href="#" className="hover:text-indigo-600 transition-colors">
                                Resources
                            </a>
                            <a href="#" className="hover:text-indigo-600 transition-colors">
                                Enterprise
                            </a>
                        </div>

                        <div className="flex items-center gap-4">
                            <button className="text-sm font-semibold text-gray-700 hover:text-indigo-600">Log in</button>
                            <button className="bg-indigo-600 text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">
                                Join for Free
                            </button>
                        </div>
                    </nav>

                    {/* --- HERO SECTION --- */}
                    <section className="relative pt-16 pb-20 lg:pt-24 lg:pb-32 overflow-hidden">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="lg:grid lg:grid-cols-12 lg:gap-8">
                                <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">
                                    <span className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-medium bg-indigo-50 text-indigo-700 mb-6">
                                        <TrendingUp className="w-4 h-4 mr-2" />
                                        Over 5,000+ new courses added this month
                                    </span>
                                    <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 sm:text-6xl lg:text-7xl">
                                        Master New Skills <br />
                                        <span className="text-indigo-600 underline decoration-indigo-200 underline-offset-8">
                                            From Anywhere.
                                        </span>
                                    </h1>
                                    <p className="mt-6 text-xl text-gray-500 leading-relaxed">
                                        Join 10 million learners worldwide. Access high-quality courses from Ivy League
                                        universities and industry leaders like Google, Meta, and Microsoft.
                                    </p>

                                    <div className="mt-10 flex flex-col sm:flex-row gap-4 sm:justify-center lg:justify-start">
                                        <div className="relative flex-grow max-w-md">
                                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                                            <input
                                                type="text"
                                                placeholder="What do you want to learn?"
                                                className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none shadow-sm"
                                            />
                                        </div>
                                        <button className="px-8 py-4 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition-all">
                                            Search
                                        </button>
                                    </div>

                                    <div className="mt-8 flex items-center gap-4 text-sm text-gray-600">
                                        <div className="flex -space-x-2">
                                            {[1, 2, 3, 4].map((i) => (
                                                <img
                                                    key={i}
                                                    className="inline-block h-8 w-8 rounded-full ring-2 ring-white"
                                                    src={`https://i.pravatar.cc/100?img=${i + 10}`}
                                                    alt=""
                                                />
                                            ))}
                                        </div>
                                        <p>
                                            <b>4.9/5</b> rating from 200k+ students
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-12 relative sm:max-w-lg sm:mx-auto lg:mt-0 lg:max-w-none lg:mx-0 lg:col-span-6 lg:flex lg:items-center">
                                    <div className="relative mx-auto w-full rounded-3xl shadow-2xl overflow-hidden aspect-video bg-indigo-100 border-8 border-white group cursor-pointer">
                                        <img
                                            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200"
                                            alt="Learning"
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-indigo-900/20 group-hover:bg-indigo-900/10 transition-colors flex items-center justify-center">
                                            <div className="bg-white p-5 rounded-full shadow-2xl">
                                                <PlayCircle className="w-12 h-12 text-indigo-600" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* --- STATS SECTION --- */}
                    <section className="bg-indigo-600 py-12">
                        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                            {[
                                { label: "Active Students", value: "10M+" },
                                { label: "Total Courses", value: "45,000+" },
                                { label: "Expert Tutors", value: "2,500+" },
                                { label: "Success Rate", value: "94%" },
                            ].map((stat, idx) => (
                                <div key={idx}>
                                    <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                                    <div className="text-indigo-100 text-sm font-medium">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* --- TOP CATEGORIES --- */}
                    <section className="py-24 bg-gray-50">
                        <div className="max-w-7xl mx-auto px-4">
                            <div className="flex justify-between items-end mb-12">
                                <div>
                                    <h2 className="text-3xl font-bold text-gray-900">Explore Top Categories</h2>
                                    <p className="text-gray-600 mt-2">
                                        Pick a category and start your learning journey today.
                                    </p>
                                </div>
                                <button className="flex items-center gap-2 text-indigo-600 font-bold hover:gap-3 transition-all">
                                    View All <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                                {[
                                    { name: "Development", icon: <Globe />, color: "bg-blue-500", count: "1,200+ Courses" },
                                    {
                                        name: "Business",
                                        icon: <TrendingUp />,
                                        color: "bg-emerald-500",
                                        count: "800+ Courses",
                                    },
                                    { name: "Design", icon: <Award />, color: "bg-purple-500", count: "600+ Courses" },
                                    { name: "Marketing", icon: <Users />, color: "bg-orange-500", count: "400+ Courses" },
                                ].map((cat, i) => (
                                    <div
                                        key={i}
                                        className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer group"
                                    >
                                        <div
                                            className={`${cat.color} w-12 h-12 rounded-xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform`}
                                        >
                                            {cat.icon}
                                        </div>
                                        <h3 className="font-bold text-xl text-gray-900 mb-1">{cat.name}</h3>
                                        <p className="text-gray-500 text-sm">{cat.count}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* --- WHY US SECTION --- */}
                    <section className="py-24">
                        <div className="max-w-7xl mx-auto px-4 lg:flex lg:items-center lg:gap-16">
                            <div className="lg:w-1/2">
                                <img
                                    src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800"
                                    className="rounded-3xl shadow-xl"
                                    alt="Features"
                                />
                            </div>
                            <div className="lg:w-1/2 mt-12 lg:mt-0">
                                <h2 className="text-4xl font-bold text-gray-900 mb-8">
                                    Why Students Choose <br />
                                    Our Platform?
                                </h2>
                                <div className="space-y-6">
                                    {[
                                        {
                                            title: "Learn from Experts",
                                            desc: "Courses designed by industry veterans and academic leaders.",
                                        },
                                        {
                                            title: "Flexible Schedule",
                                            desc: "Study at your own pace with lifetime access to materials.",
                                        },
                                        {
                                            title: "Official Certification",
                                            desc: "Receive globally recognized certificates upon completion.",
                                        },
                                        {
                                            title: "Community Support",
                                            desc: "Interact with millions of fellow students in active forums.",
                                        },
                                    ].map((feature, i) => (
                                        <div key={i} className="flex gap-4">
                                            <CheckCircle2 className="h-6 w-6 text-indigo-600 shrink-0" />
                                            <div>
                                                <h4 className="font-bold text-gray-900">{feature.title}</h4>
                                                <p className="text-gray-600">{feature.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* --- NEWSLETTER --- */}
                    <section className="max-w-7xl mx-auto px-4 mb-24">
                        <div className="bg-gray-900 rounded-[3rem] p-12 lg:p-20 text-center relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/20 blur-[100px] rounded-full -mr-20 -mt-20"></div>
                            <h2 className="text-3xl lg:text-5xl font-bold text-white mb-6">Ready to start your journey?</h2>
                            <p className="text-gray-400 text-lg mb-10 max-w-xl mx-auto">
                                Subscribe to our newsletter and get 20% off your first course enrollment.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="flex-grow px-6 py-4 rounded-xl bg-white/10 border border-white/20 text-white outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                                <button className="bg-indigo-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-indigo-700 transition-all">
                                    Subscribe
                                </button>
                            </div>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
}
