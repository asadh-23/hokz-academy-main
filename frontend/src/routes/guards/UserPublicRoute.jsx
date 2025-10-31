import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const UserPublicRoute = () => {
  const { isAuthenticated, role } = useSelector((state) => state.auth);

  if (isAuthenticated && role === 'user') {
    return <Navigate to= "/user/dashboard" replace />;
  } else {
    return <Outlet />;
  }
};

export default UserPublicRoute;