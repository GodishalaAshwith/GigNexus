import { useState, useEffect } from 'react';
import { authService } from '@/services/api';

interface User {
  id: string;
  email: string;
  role: 'freelancer' | 'business' | 'admin';
  profile?: {
    name?: string;
    avatar?: string;
    companyName?: string;
  };
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCurrentUser = async () => {
    try {
      setLoading(true);
      const userData = await authService.getCurrentUser();
      setUser(userData);
      setError(null);
    } catch (err) {
      setUser(null);
      setError('Failed to fetch user data');
      console.error('Error fetching current user:', err);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const isAuthenticated = !!localStorage.getItem('token');

  useEffect(() => {
    if (isAuthenticated) {
      fetchCurrentUser();
    } else {
      setLoading(false);
      setUser(null);
    }
  }, []);

  return {
    user,
    loading,
    error,
    isAuthenticated,
    logout,
    refreshUser: fetchCurrentUser
  };
};
