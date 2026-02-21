import React, { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, ShieldCheck } from "lucide-react";
import AdminSidebar from "../components/admin/AdminSidebar";
import AdminHeader from "../components/admin/AdminHeader";
import AdminFooter from "../components/admin/AdminFooter";

const AdminLayout = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const location = useLocation();

    // Generate dynamic page title based on URL
    const pathSegments = location.pathname.split("/").filter(Boolean);
    const pageTitle = pathSegments[pathSegments.length - 1] || "Dashboard";

    return (
        <div className="min-h-screen bg-[#FDFDFD] flex flex-col">
            <AdminHeader />

            <div className="flex flex-1 relative">
                {/* --- MOBILE TOGGLE --- */}
                <button
                    onClick={() => setIsMobileOpen(!isMobileOpen)}
                    className="lg:hidden fixed bottom-6 right-6 z-[60] bg-[#1E2EDE] text-[#E6D929] p-4 rounded-full shadow-2xl active:scale-95 transition-transform"
                >
                    {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
                </button>

                {/* --- SIDEBAR --- */}
                <AdminSidebar
                    isCollapsed={isCollapsed}
                    setIsCollapsed={setIsCollapsed}
                    isMobileOpen={isMobileOpen}
                    setIsMobileOpen={setIsMobileOpen}
                />

                {/* --- MAIN CONTENT --- */}
                <main className="flex-1 flex flex-col min-w-0 bg-[#FDFDFD]">
                    <div className="p-4 md:p-8 lg:p-10 w-full max-w-7xl mx-auto">
                        {/* Title Bar Section */}

                        {/* Content Card Container */}
                        <div className="bg-white rounded-[3rem] shadow-[0_20px_60px_rgba(30,46,222,0.06)] border border-slate-100 min-h-[75vh] relative overflow-hidden">
                            {/* Decorative Background Accents */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#14C4E7]/5 to-transparent rounded-bl-full pointer-events-none"></div>
                            <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-[#E6D929]/5 to-transparent rounded-tr-full pointer-events-none"></div>

                            {/* The Injected Page Content */}
                            <div className="p-6 md:p-10 lg:p-12 relative z-10">
                                <Outlet />
                            </div>
                        </div>
                    </div>

                    {/* Integrated Footer */}
                    <div className="mt-auto">
                        <AdminFooter />
                    </div>
                </main>

                {/* Mobile Backdrop */}
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

export default AdminLayout;
