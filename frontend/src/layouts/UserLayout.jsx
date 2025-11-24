import { useState } from "react";
import { Outlet } from "react-router-dom";
import UserHeader from "../components/user/UserHeader";
import UserSidebar from "../components/user/UserSidebar";
import UserFooter from "../components/user/UserFooter";

export const UserLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            {/* Header */}
            <UserHeader onMenuClick={toggleSidebar} />

            <div className="flex flex-1 relative">
                {/* Overlay */}
                {isSidebarOpen && (
                    <div
                        className="fixed top-16 left-0 right-0 bottom-0 bg-black/50 z-30"
                        onClick={toggleSidebar}
                    />
                )}

                {/* Sidebar */}
                <UserSidebar isOpen={isSidebarOpen} onClose={toggleSidebar} />

                {/* Main Content */}
                <main className="flex-1 overflow-auto">
                    <Outlet />
                </main>
            </div>

            {/* Footer */}
            <UserFooter />
        </div>
    );
};
