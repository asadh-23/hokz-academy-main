import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { PageLoader } from '../../components/common/LoadingSpinner';

const UserPublicRoute = () => {
  const { isAuthenticated, token, loading } = useSelector((state) => state.userAuth);

  // Loading state-il blank screen-inu pakaram spinner kodukkuka
  if (loading) return <PageLoader text='Authenticating'/>

  // If authenticated with valid token, redirect to dashboard
  if (isAuthenticated && token) {
    return <Navigate to="/user/dashboard" replace />;
  }
  
  return <Outlet />;
};

export default UserPublicRoute;