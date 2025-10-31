import React from "react";
// Global Components
import PublicHeader from "../components/common/PublicHeader";
import PublicFooter from "../components/common/PublicFooter";

// Landing Page-Only Sections
import HeroSection from "./home/HeroSection";
import AboutSection from "./home/AboutSection";
import JoinUsSection from "./home/JoinUsSection";
import StatsSection from "./home/StatsSection";
import TestimonialsSection from "./home/TestimonialsSection";

// Reusable Shared Components
import CategoryList from "../components/course/CategoryList";
import CourseList from "../components/course/CourseList";

import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function Home() {
    const { isAuthenticated, role } = useSelector((state) => state.auth);
    const navigate = useNavigate();
    console.log(role);
    

    useEffect(() => {      
        if (isAuthenticated) {             
            if (role === "user") {
                navigate("/user/dashboard", { replace: true });
            } else if (role === "tutor") {
                navigate("/tutor/dashboard", { replace: true });
            } else if (role === "admin") {
                navigate("/admin/dashboard", { replace: true });
            }
        }
        
    }, [isAuthenticated, role, navigate]);
    return (
        <>
            <PublicHeader />
            <main>
                <HeroSection />
                <StatsSection />
                <CategoryList />
                <CourseList />
                <TestimonialsSection />
                <AboutSection />
                <JoinUsSection />
            </main>
            <PublicFooter />
        </>
    );
}
