import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { PageLoader } from '../../components/common/LoadingSpinner';

const AdminPrivateRoute = () => {
  const { isAuthenticated, token, loading } = useSelector((state) => state.adminAuth);
  
  // Wait for auth state to be determined
  if (loading) {
    return <PageLoader text='Authenticating'/>
  }
  
  // Check both authentication flag and token existence
  if (isAuthenticated && token) {
    return <Outlet />; 
  }
  
  return <Navigate to="/admin/login" replace />;
};

export default AdminPrivateRoute;