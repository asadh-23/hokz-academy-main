import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyCourses, selectMyCourses, selectMyCoursesLoading } from "../../store/features/user/userCoursesSlice";
import {
    fetchUserCertificates,
    selectAllCertificates,
    selectCertificatesLoading,
} from "../../store/features/user/certificatesSlice";

import HeroSection from "../home/HeroSection";
import StatsCard from "../../components/user/dashboard/StatsCard";
import { PageLoader } from "../../components/common/LoadingSpinner";
import CourseListSection from "../../components/user/dashboard/CourseListSection";
import { publicAxios } from "../../api/publicAxios";
import BestSellerSection from "../../components/user/dashboard/BestSellerSection";
import { useState } from "react";

export default function UserDashboard() {
    const dispatch = useDispatch();

    // Redux State Access
    const certificates = useSelector(selectAllCertificates);
    const certLoading = useSelector(selectCertificatesLoading);
    const [bestSellers, setBestSellers] = useState([]);
    const courses = useSelector(selectMyCourses);
    const courseLoading = useSelector(selectMyCoursesLoading);

    const [isBsLoading, setIsBsLoading] = useState(false)
    useEffect(() => {
        dispatch(fetchMyCourses());
        dispatch(fetchUserCertificates());
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

    if (courseLoading || certLoading || isBsLoading) {
        return <PageLoader text="Syncing your progress..." />;
    }

    return (
        <div className="min-h-screen bg-[#FDFDFD]">
            <main className="max-w-7xl mx-auto px-6 pb-24">
                <HeroSection />

                {/* Performance Stats */}
                <div className="mt-12">
                    <div className="flex items-center gap-3 mb-8 border-l-4 border-[#1E2EDE] pl-5">
                        <h2 className="text-2xl font-black text-[#1E2EDE] uppercase tracking-tight">Your Performance</h2>
                    </div>
                    <StatsCard courses={courses} certificates={certificates} />
                </div>

                {/* Course Listings (Ongoing & Completed) */}
                <CourseListSection courses={courses} />
                <BestSellerSection courses={bestSellers} />
            </main>
        </div>
    );
}
