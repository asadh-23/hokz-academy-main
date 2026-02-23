import React, { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import TutorSidebar from "../components/tutor/TutorSidebar";
import TutorHeader from "../components/tutor/TutorHeader";
import TutorFooter from "../components/tutor/TutorFooter";

const TutorLayout = () => {
    const [isCollapsed, setIsCollapsed] = useState(true); // Default to collapsed for the gutter look
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const location = useLocation();

    // Generate breadcrumb text based on path
    const pathSegments = location.pathname.split("/").filter(Boolean);
    const currentPage = pathSegments[pathSegments.length - 1] || "Dashboard";

    return (
        <div className="min-h-screen bg-[#FDFDFD] flex flex-col">
            <TutorHeader />

            <div className="flex flex-1 relative">
                {/* --- SIDEBAR GUTTER CONTAINER --- */}
                {/* This div preserves the space on the left so content starts correctly at 0 distance */}
               <div className={`shrink-0 transition-all duration-300 ${isCollapsed ? "w-0 lg:w-20" : "w-0 lg:w-72"}`}>
                    <TutorSidebar
                        isCollapsed={isCollapsed}
                        setIsCollapsed={setIsCollapsed}
                    />
                </div>

                {/* --- MAIN CONTENT --- */}
                <main className="flex-1 flex flex-col min-w-0 bg-[#FDFDFD]">
                    <div className="p-0 md:p-8 lg:p-10 w-full lg:max-w-full mx-auto">
                        <div className="bg-white rounded-none md:rounded-[2.5rem] shadow-none md:shadow-xl border-none md:border border-slate-100 min-h-[calc(100vh-80px)] relative overflow-hidden">
                            
                            {/* Decorative Backgrounds */}
                            <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-[#14C4E7]/5 to-transparent rounded-bl-full pointer-events-none"></div>

                            {/* Injected Content - p-0 on mobile */}
                            <div
                                onClick={() => setIsCollapsed(true)}
                                className="p-0 md:p-8 lg:p-10 relative z-10 h-full">
                                <Outlet />
                            </div>
                        </div>
                    </div>

                    <div className="mt-auto">
                        <TutorFooter />
                    </div>
                </main>

                {/* Mobile Background Overlay - Only active when sidebar is expanded on mobile */}
                {!isCollapsed && (
                    <div
                        className="fixed inset-0 bg-[#1E2EDE]/10 backdrop-blur-[2px] z-40 lg:hidden"
                        onClick={() => setIsCollapsed(true)}
                    ></div>
                )}
            </div>
        </div>
    );
};

export default TutorLayout;