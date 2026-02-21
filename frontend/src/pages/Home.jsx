import React from "react";
// Global Components
import PublicHeader from "../components/common/Header";
import PublicFooter from "../components/common/Footer";

// Landing Page-Only Sections
import HeroSection from "./home/HeroSection";
import StatsSection from "./home/StatsSection";

import { useEffect } from "react";
import { TutorLoginSection } from "./home/TutorLoginSection";
import HokzInfo from "./home/HokzInfo";
import BestSellerSection from "../components/user/dashboard/BestSellerSection";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { publicAxios } from "../api/publicAxios";

export default function Home() {

    const dispatch = useDispatch();
    const [bestSellers, setBestSellers] = useState([]);
    const [isBsLoading, setIsBsLoading] = useState(false);

    useEffect(() => {
        fetchBestSellers();
    }, [dispatch]);
    const fetchBestSellers = async () => {
        try {
            setIsBsLoading(true);
            const res = await publicAxios.get("/user/dashboard/courses/best-sellers");
            setBestSellers(res.data.data);
        } catch (error) {
            console.error("Error fetching best sellers:", error);
        } finally {
            setIsBsLoading(false);
        }
    };

    return (
        <>
            <PublicHeader />
            <main>
                <HeroSection />
                <TutorLoginSection />
                <BestSellerSection courses={bestSellers} />
                <StatsSection />
                <HokzInfo />
            </main>
            <PublicFooter />
        </>
    );
}
