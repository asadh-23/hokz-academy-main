import React from "react";
import { useSelector } from "react-redux"
import { Navigate, Outlet } from "react-router-dom";

const AdminPublicRoute = () => {
    const { isAuthenticated, role } = useSelector((state) => state.auth);

    if(isAuthenticated && role === "admin"){
        return <Navigate to= "/admin/dashboard" replace />
    }else {
        return <Outlet/>
    }
};

export default AdminPublicRoute;