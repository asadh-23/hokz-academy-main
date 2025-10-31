import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const TutorPrivateRoute = () => {
  const { isAuthenticated, role } = useSelector((state) => state.auth);
  
  if (isAuthenticated && role === 'tutor') {
    return <Outlet />; 
  } else {
    return <Navigate to= "/tutor/login" replace />;
  }
};

export default TutorPrivateRoute;