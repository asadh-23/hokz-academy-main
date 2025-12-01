import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const TutorPrivateRoute = () => {
  const { isAuthenticated, token, loading } = useSelector((state) => state.tutorAuth);
  
  // Wait for auth state to be determined
  if (loading) {
    return null;
  }
  
  // Check both authentication flag and token existence
  if (isAuthenticated && token) {
    return <Outlet />; 
  }
  
  return <Navigate to="/tutor/login" replace />;
};

export default TutorPrivateRoute;