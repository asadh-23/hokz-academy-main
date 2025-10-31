import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const UserPrivateRoute = () => {
  const { isAuthenticated, role } = useSelector((state) => state.auth);
  
  if (isAuthenticated && role === 'user') {
    return <Outlet />;
  } else {
    return <Navigate to= "/user/login" replace />;
  }
};

export default UserPrivateRoute;