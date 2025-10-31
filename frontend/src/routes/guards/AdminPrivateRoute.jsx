import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const AdminPrivateRoute = () => {
  const { isAuthenticated, role } = useSelector((state) => state.auth);
  
  if (isAuthenticated && role === 'admin') {
    return <Outlet />; 
  } else {
    return <Navigate to= "/admin/login" replace />;
  }
};

export default AdminPrivateRoute;