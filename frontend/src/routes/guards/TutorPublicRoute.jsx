import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const TutorPublicRoute = () => {
  const { isAuthenticated, role } = useSelector((state) => state.auth);

  if (isAuthenticated && role === 'tutor') {
    return <Navigate to= "/tutor/dashboard" replace />;
  } else {
    return <Outlet />;
  }
};

export default TutorPublicRoute;