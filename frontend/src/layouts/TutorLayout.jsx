import { Outlet } from "react-router-dom";
import TutorSidebar from "../components/tutor/TutorSidebar";
import TutorHeader from "../components/tutor/TutorHeader";
import TutorFooter from "../components/tutor/TutorFooter";

const TutorLayout = () => {
    return (
        <>
            {/* Main layout wrapper */}
            <div className="flex min-h-screen">
                {/* Sidebar (fixed width) */}
                <TutorSidebar />

                {/* Right side (content + header) */}
                <div className="flex flex-col flex-1 bg-gray-50">
                    <TutorHeader />
                    <main className="flex-1 p-6 md:p-8 overflow-y-auto">
                        <Outlet />
                    </main>
                </div>
            </div>

            {/* Footer OUTSIDE layout so it spans full width */}
            <TutorFooter />
        </>
    );
};

export default TutorLayout;
