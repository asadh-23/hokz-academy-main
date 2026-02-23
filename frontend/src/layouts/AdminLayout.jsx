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
               <div className={`shrink-0 transition-all duration-300 ${isCollapsed ? "w-0 lg:w-20" : "w-0 lg:w-72"}`}>
                    <AdminSidebar
                        isCollapsed={isCollapsed}
                        setIsCollapsed={setIsCollapsed}
                        isMobileOpen={isMobileOpen}
                        setIsMobileOpen={setIsMobileOpen}
                    />
                </div>

                {/* --- MAIN CONTENT --- */}
                <main className="flex-1 flex flex-col min-w-0 bg-[#FDFDFD]">
                    <div className="p-0 md:p-8 lg:p-10 w-full lg:max-w-full mx-auto">
                        <div className="bg-white rounded-none md:rounded-[2.5rem] shadow-none md:shadow-xl border-none md:border border-slate-100 min-h-[calc(100vh-80px)] relative overflow-hidden">
                            
                            {/* Decorative Backgrounds */}
                            <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-[#14C4E7]/5 to-transparent rounded-bl-full pointer-events-none"></div>

                            {/* Injected Content */}
                            <div
                                onClick={() => setIsCollapsed(true)}
                                className="p-0 md:p-8 lg:p-10 relative z-10 h-full">
                                <Outlet />
                            </div>
                        </div>
                    </div>

                    
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