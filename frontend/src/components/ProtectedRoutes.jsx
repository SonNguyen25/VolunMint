import React from 'react';
import Router from 'next/router';
import { useAuth } from '../contexts/AuthContexts';

const ProtectedRoute = ({ children }) => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <Router to="/login" />;
  }

  return children;
};

export default ProtectedRoute;