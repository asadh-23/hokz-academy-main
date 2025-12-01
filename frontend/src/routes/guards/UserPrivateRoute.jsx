import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const UserPrivateRoute = () => {
  const { isAuthenticated, token, loading } = useSelector((state) => state.userAuth);
  
  // Wait for auth state to be determined
  if (loading) {
    return null;
  }
  
  // Check both authentication flag and token existence
  if (isAuthenticated && token) {
    return <Outlet />;
  }
  
  return <Navigate to="/user/login" replace />;
};

export default UserPrivateRoute;