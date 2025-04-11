import { ReactNode, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Loading from '@/components/ui/loading';
import { toast } from 'react-hot-toast';

interface ProtectedRouteProps {
  children: ReactNode;
  requireAuth?: boolean;
  allowedRoles?: string[];
  redirectPath?: string;
}

/**
 * A wrapper component for routes that need authentication protection
 * @param children - The component to render if conditions are met
 * @param requireAuth - If true, user must be logged in to access the route
 * @param allowedRoles - Array of roles allowed to access the route
 * @param redirectPath - Path to redirect to if conditions aren't met
 */
export const ProtectedRoute = ({
  children,
  requireAuth = true,
  allowedRoles = [],
  redirectPath = '/',
}: ProtectedRouteProps) => {
  const { user, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // If route requires specific roles and user doesn't have them, show toast message
    if (!loading && isAuthenticated && allowedRoles.length > 0 && user && !allowedRoles.includes(user.role)) {
      toast.error(`Access denied. This page is only for ${allowedRoles.join(' or ')} accounts.`);
    }
  }, [loading, isAuthenticated, user, allowedRoles]);

  // Show loading state if still checking authentication
  if (loading) {
    return <Loading size="lg" text="Checking authentication..." fullScreen />;
  }

  // If route requires authentication and user is not authenticated
  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If route requires specific roles and user doesn't have them
  if (allowedRoles.length > 0 && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // If route should not be accessible when logged in (like login/signup pages)
  if (!requireAuth && isAuthenticated) {
    return <Navigate to={redirectPath} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
