import React, { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import TutorSidebar from "../components/tutor/TutorSidebar";
import TutorHeader from "../components/tutor/TutorHeader";
import TutorFooter from "../components/tutor/TutorFooter";

const TutorLayout = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const location = useLocation();

    // Generate breadcrumb text based on path
    const pathSegments = location.pathname.split("/").filter(Boolean);
    const currentPage = pathSegments[pathSegments.length - 1] || "Dashboard";

    return (
        <div className="min-h-screen bg-[#FDFDFD] flex flex-col">
            <TutorHeader />

            <div className="flex flex-1 relative">
                {/* --- MOBILE TOGGLE BUTTON --- */}
                <button
                    onClick={() => setIsMobileOpen(!isMobileOpen)}
                    className="lg:hidden fixed bottom-6 right-6 z-[60] bg-[#1E2EDE] text-[#E6D929] p-4 rounded-full shadow-2xl active:scale-95 transition-transform"
                >
                    {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
                </button>

                {/* --- SIDEBAR --- */}
                <TutorSidebar
                    isCollapsed={isCollapsed}
                    setIsCollapsed={setIsCollapsed}
                    isMobileOpen={isMobileOpen}
                    setIsMobileOpen={setIsMobileOpen}
                />

                {/* --- MAIN CONTENT --- */}
                <main className="flex-1 flex flex-col min-w-0 bg-[#FDFDFD]">
                    <div className="p-4 md:p-8 lg:p-10 w-full max-w-7xl mx-auto">
                        {/* Content Card Container */}
                        <div className="bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(30,46,222,0.05)] border border-slate-100 min-h-[70vh] relative overflow-hidden">
                            {/* Decorative Background Flare */}
                            <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-[#14C4E7]/5 to-transparent rounded-bl-full pointer-events-none"></div>
                            <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-[#E6D929]/5 to-transparent rounded-tr-full pointer-events-none"></div>

                            {/* Injected Content */}
                            <div className="p-5 md:p-8 lg:p-10 relative z-10">
                                <Outlet />
                            </div>
                        </div>
                    </div>

                    {/* Inner Footer spacing helper */}
                    <div className="mt-auto">
                        <TutorFooter />
                    </div>
                </main>

                {/* Mobile Background Overlay */}
                {isMobileOpen && (
                    <div
                        className="fixed inset-0 bg-[#1E2EDE]/20 backdrop-blur-sm z-40 lg:hidden"
                        onClick={() => setIsMobileOpen(false)}
                    ></div>
                )}
            </div>
        </div>
    );
};

export default TutorLayout;
