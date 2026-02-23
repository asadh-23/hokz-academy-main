import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { PageLoader } from '../../components/common/LoadingSpinner';

const TutorPrivateRoute = () => {
  const { isAuthenticated, token, loading } = useSelector((state) => state.tutorAuth);
  
  // Wait for auth state to be determined
  if (loading) {
    return <PageLoader text='Authenticating'/>
  }
  
  // Check both authentication flag and token existence
  if (isAuthenticated && token) {
    return <Outlet />; 
  }
  
  return <Navigate to="/tutor/login" replace />;
};

export default TutorPrivateRoute;