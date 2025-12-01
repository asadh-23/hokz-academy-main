import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const UserPublicRoute = () => {
  const { isAuthenticated, token, loading } = useSelector((state) => state.userAuth);

  // Wait for auth state to be determined
  if (loading) {
    return null;
  }

  // If authenticated with valid token, redirect to dashboard
  if (isAuthenticated && token) {
    return <Navigate to="/user/dashboard" replace />;
  }
  
  return <Outlet />;
};

export default UserPublicRoute;