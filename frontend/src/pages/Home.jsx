import React from "react";
// Global Components
import PublicHeader from "../components/common/PublicHeader";
import PublicFooter from "../components/common/PublicFooter";

// Landing Page-Only Sections
import HeroSection from "./home/HeroSection";
import StatsSection from "./home/StatsSection";


import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { TutorLoginSection } from "./home/TutorLoginSection";
import HokzInfo from "./home/HokzInfo";

export default function Home() {
    const userAuth = useSelector((state) => state.userAuth);
    const tutorAuth = useSelector((state) => state.tutorAuth);
    const adminAuth = useSelector((state) => state.adminAuth);
    const navigate = useNavigate();

    useEffect(() => {      
        if (userAuth.isAuthenticated) {
            navigate("/user/dashboard", { replace: true });
        } else if (tutorAuth.isAuthenticated) {
            navigate("/tutor/dashboard", { replace: true });
        } else if (adminAuth.isAuthenticated) {
            navigate("/admin/dashboard", { replace: true });
        }
    }, [userAuth.isAuthenticated, tutorAuth.isAuthenticated, adminAuth.isAuthenticated, navigate]);
    return (
        <>
            <PublicHeader />
            <main>
                <HeroSection />
                <TutorLoginSection/>
                <StatsSection />
                <HokzInfo />
            </main>
            <PublicFooter />
        </>
    );
}
