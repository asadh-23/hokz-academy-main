import { Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import { userLoginSuccess } from "./store/features/auth/userAuthSlice";
import { adminLoginSuccess } from "./store/features/auth/adminAuthSlice";
import { tutorLoginSuccess } from "./store/features/auth/tutorAuthSlice";

import Home from "./pages/Home";
import UserRoute from "./routes/UserRoute";
import TutorRoute from "./routes/TutorRoute";
import AdminRoute from "./routes/AdminRoute";
import NotFound from "./pages/error/NotFound";
import { publicAxios } from "./api/publicAxios";
import NotificationListener from "./components/common/NotificationListener";
import { PageLoader } from "./components/common/LoadingSpinner";

function App() {
    const dispatch = useDispatch();
    const [isInitializing, setIsInitializing] = useState(true);

    useEffect(() => {
        const checkSession = async () => {
            try {
                // 1. Call Refresh Token API ONLY ONCE
                const { data } = await publicAxios.post("/auth/refresh");

                // 2. Check Role and Dispatch to Correct Slice
                if (data.user.role === "user") {
                    dispatch(userLoginSuccess({ user: data.user, accessToken: data.accessToken }));
                } else if (data.user.role === "tutor") {
                    dispatch(tutorLoginSuccess({ tutor: data.user, accessToken: data.accessToken }));
                } else if (data.user.role === "admin") {
                    dispatch(adminLoginSuccess({ admin: data.user, accessToken: data.accessToken }));
                }
            } catch (error) {
                console.log("No active session", error);
            } finally {
                setIsInitializing(false);
            }
        };

        checkSession();
    }, [dispatch]);

    if (isInitializing) {
        return (
            <PageLoader text="Loading Hokz Academy" />
        );
    }

    return (
        <>
            
            <NotificationListener />

            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/user/*" element={<UserRoute />} />
                <Route path="/tutor/*" element={<TutorRoute />} />
                <Route path="/admin/*" element={<AdminRoute />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </>
    );
}

export default App;
