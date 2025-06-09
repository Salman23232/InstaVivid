import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectRoutes = () => {
  const user = useSelector((state) => state.auth.user);

  if (!user) {
    // Not authenticated, redirect to login page
    return <Navigate to="/login" replace />;
  }

  // Authenticated, render the child route(s)
  return <Outlet />;
};

export default ProtectRoutes;
