import { Outlet } from "react-router-dom";
import TutorSidebar from "../components/tutor/TutorSidebar";
import TutorHeader from "../components/tutor/TutorHeader";
import TutorFooter from "../components/tutor/TutorFooter";

const TutorLayout = () => {
    return (
        <>
            {/* Header at the top */}
            <TutorHeader />

            {/* Main layout wrapper with sidebar and content */}
            <div className="flex min-h-[calc(100vh-70px)]">
                {/* Sidebar (fixed width) */}
                <TutorSidebar />

                {/* Main content */}
                <main className="flex-1 p-6 md:p-8 overflow-y-auto bg-gray-50">
                    <Outlet />
                </main>
            </div>

            {/* Footer OUTSIDE layout so it spans full width */}
            <TutorFooter />
        </>
    );
};

export default TutorLayout;
