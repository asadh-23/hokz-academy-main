import { Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { authAxios } from "./api/authAxios.js";
import { loginSuccess, logoutSuccess } from "./store/features/auth/authSlice.js";

import UserRoute from "./routes/UserRoute";
import AdminRoute from "./routes/AdminRoute";
import TutorRoute from "./routes/TutorRoute";
import Home from "./pages/Home";
import NotFound from "./pages/error/NotFound";


function App() {
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    
    const verifyRefreshToken = async () => {
      try {
        
        const response = await authAxios.post('/refresh');
        if(response.data?.success){       
            const { accessToken, user } = response.data;
            dispatch(loginSuccess({ accessToken, user }));
        }
        
      } catch (error) {
        dispatch(logoutSuccess());
        console.log("❌ No refresh token found or token expired:", error.response?.data?.message || error.message);
      } finally {
        setIsLoading(false);
      }
    };

    verifyRefreshToken();

  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <h1 className="text-2xl font-semibold text-cyan-600">Loading Hokz Academy...</h1>
        {/* loading component*/}
      </div>
    );
  }

  return (
    <>
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