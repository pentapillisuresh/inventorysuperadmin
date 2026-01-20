import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const AuthCheck = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkAuth = () => {
      const isLoggedIn = localStorage.getItem('superAdminLoggedIn') === 'true';
      
      if (location.pathname === '/login' && isLoggedIn) {
        navigate('/dashboard', { replace: true });
      } else if (location.pathname !== '/login' && !isLoggedIn) {
        navigate('/login', { replace: true });
      }
    };

    checkAuth();
  }, [location, navigate]);

  return children;
};

export default AuthCheck;