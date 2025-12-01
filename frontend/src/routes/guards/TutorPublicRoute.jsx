import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const TutorPublicRoute = () => {
  const { isAuthenticated, token, loading } = useSelector((state) => state.tutorAuth);

  // Wait for auth state to be determined
  if (loading) {
    return null;
  }

  // If authenticated with valid token, redirect to dashboard
  if (isAuthenticated && token) {
    return <Navigate to="/tutor/dashboard" replace />;
  }
  
  return <Outlet />;
};

export default TutorPublicRoute;