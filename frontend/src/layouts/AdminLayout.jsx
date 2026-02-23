import React, { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Menu, X, ShieldCheck } from "lucide-react";
import AdminSidebar from "../components/admin/AdminSidebar";
import AdminHeader from "../components/admin/AdminHeader";
import AdminFooter from "../components/admin/AdminFooter";

const AdminLayout = () => {
    const [isCollapsed, setIsCollapsed] = useState(true); // Default to true to match the gutter behavior
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const location = useLocation();

    // Generate dynamic page title based on URL
    const pathSegments = location.pathname.split("/").filter(Boolean);
    const pageTitle = pathSegments[pathSegments.length - 1] || "Dashboard";

    return (
        <div className="min-h-screen bg-[#FDFDFD] flex flex-col">
            <AdminHeader />

            <div className="flex flex-1 relative">
                {/* --- SIDEBAR GUTTER CONTAINER --- */}
                {/* This preserves the space on the left so content starts at 0 distance and never shrinks */}
                <div className={`shrink-0 transition-all duration-300 w-[64px] lg:w-20`}>
                    <AdminSidebar
                        isCollapsed={isCollapsed}
                        setIsCollapsed={setIsCollapsed}
                        isMobileOpen={isMobileOpen}
                        setIsMobileOpen={setIsMobileOpen}
                    />
                </div>

                {/* --- MAIN CONTENT --- */}
                <main className="flex-1 flex flex-col min-w-0 bg-[#FDFDFD]">
                    <div className="p-4 md:p-8 lg:p-10 w-full max-w-7xl mx-auto">
                        {/* Content Card Container */}
                        <div className="bg-white rounded-[3rem] shadow-[0_20px_60px_rgba(30,46,222,0.06)] border border-slate-100 min-h-[75vh] relative overflow-hidden">
                            {/* Decorative Background Accents */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#14C4E7]/5 to-transparent rounded-bl-full pointer-events-none"></div>
                            <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-[#E6D929]/5 to-transparent rounded-tr-full pointer-events-none"></div>

                            {/* The Injected Page Content */}
                            <div
                            onClick={()=> setIsCollapsed(true)}
                            className="p-6 md:p-10 lg:p-12 relative z-10">
                                <Outlet />
                            </div>
                        </div>
                    </div>

                    {/* Integrated Footer */}
                    <div className="mt-auto">
                        <AdminFooter />
                    </div>
                </main>

                {/* Mobile Backdrop - Only visible when sidebar is expanded on mobile */}
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

export default AdminLayout;