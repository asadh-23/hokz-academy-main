import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const AdminPublicRoute = () => {
    const { isAuthenticated, token, loading } = useSelector((state) => state.adminAuth);

    // Wait for auth state to be determined
    if (loading) {
        return null;
    }

    // If authenticated with valid token, redirect to dashboard
    if (isAuthenticated && token) {
        return <Navigate to="/admin/dashboard" replace />;
    }
    
    return <Outlet />;
};

export default AdminPublicRoute;